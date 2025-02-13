const DictionaryEntry = require("../models/DictionaryEntry.model");

// Fetch all dictionary entries
const getAllEntries = async (req, res) => {
  try {
    const entries = await DictionaryEntry.find();
    res.status(200).json(entries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dictionary entries", error });
  }
};

// Fetch a single dictionary entry by word
const getEntryByWord = async (req, res) => {
  const { word } = req.params;
  try {
    // Use $or to check if either 'word' or 'reading' matches the param's word
    let entry = await DictionaryEntry.findOne({
      $or: [{ word: word }, { reading: word }],
    });

    if (!entry) {
      entry = await DictionaryEntry.findOne({
        $or: [
          { word: { $regex: word, $options: "i" } },
          { reading: { $regex: word, $options: "i" } },
        ],
      });
    }

    if (!entry) {
      return res.status(404).json({ message: "Word not found" });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dictionary entry", error });
  }
};

// Fetch a single dictionary entry by ID
const getEntryById = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await DictionaryEntry.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dictionary entry", error });
  }
};

module.exports = {
  getAllEntries,
  getEntryByWord,
  getEntryById,
};
