const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const mongoose = require("mongoose");
const DictionaryEntry = require("../models/DictionaryEntry.model");
require("dotenv").config();

// Connect to MongoDB
const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is undefined. Check your environment variables.");
}
mongoose.connect(uri);

console.log("Current directory:", process.cwd());

const parser = new xml2js.Parser();
const filePath = "./config/JMdict_e";

// Function to remove entity definitions and references
function preprocessXML(data) {
  // Remove entity definitions
  data = data.replace(/<!ENTITY[^>]+>/g, "");
  // Remove entity references
  data = data.replace(/&[^;]+;/g, "");
  return data;
}

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading JMdict file:", err);
    return;
  }

  // Preprocess the data to remove entities
  const preprocessedData = preprocessXML(data);

  parser.parseString(preprocessedData, async (err, result) => {
    if (err) {
      console.error("Error parsing XML:", err);
      return;
    }

    // Log the result to inspect its structure
    console.log("Parsed XML result:", JSON.stringify(result, null, 2));

    // Dynamically find the root element
    const rootElement = Object.keys(result)[0];
    const jmdict = result[rootElement];

    if (!jmdict || !jmdict.entry) {
      console.error("Invalid XML structure: 'entry' not found.");
      return;
    }

    const entries = jmdict.entry;
    for (const entry of entries) {
      let word = null;
      // Look for a kanji element, if available.
      if (entry.k_ele) {
        word = entry.k_ele[0].keb ? entry.k_ele[0].keb[0] : null;
      }
      // Fallback to reading if no kanji is present.
      if (!word && entry.r_ele) {
        word = entry.r_ele[0].reb[0];
      }

      // Get reading (from the first reading element)
      let reading = "";
      if (entry.r_ele && entry.r_ele[0].reb) {
        reading = entry.r_ele[0].reb[0];
      }

      // Concatenate the first gloss from each sense as a rough definition.
      let definitions = [];
      if (entry.sense) {
        for (const sense of entry.sense) {
          if (sense.gloss) {
            definitions.push(sense.gloss[0]);
          }
        }
      }
      const englishMeaning = definitions.join("; ");

      // For example sentence, leave empty (or later you can try to match sentences).
      const exampleSentence = "";

      if (word && reading && englishMeaning) {
        const doc = new DictionaryEntry({
          word,
          reading,
          englishMeaning,
        });
        try {
          await doc.save();
          console.log(`Saved entry for ${word}`);
        } catch (e) {
          console.error(`Error saving entry for ${word}:`, e);
        }
      }
    }
    console.log("Done populating the database.");
    mongoose.disconnect();
  });
});
