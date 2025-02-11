const mongoose = require("mongoose");
const { Schema } = mongoose;

const contentSchema = new Schema(
  {
    // Title of the content
    title: {
      type: String,
      required: true,
    },
    // Title of the content in English
    englishTitle: { type: String, required: true },
    // Main body of the story or article
    body: {
      type: String,
      required: true,
    },
    tokens: [
      {
        surface: { type: String, required: true },
        reading: { type: String }, // Hiragana reading
      },
    ],
    // Indicates whether the content is prewritten or AI-generated
    type: {
      type: String,
      enum: ["prewritten", "AI-generated"],
      required: true,
    },
    // For prewritten content, you might want to tag with a JLPT level
    JLPTLevel: {
      type: String,
      enum: ["N5", "N4", "N3", "N2", "N1"],
    },
    // Additional metadata: genre and difficulty for AI-generated content
    genre: {
      type: String,
      enum: [
        "Fantasy",
        "Science Fiction",
        "Mystery",
        "Romance",
        "Horror",
        "Historical Fiction",
        "Thriller",
        "Adventure",
        "Comedy",
        "Slice of Life",
        "Drama",
        "Action",
        "Supernatural",
        "Mythology",
        "Detective",
        "Psychological",
        "Cyberpunk",
        "Steampunk",
        "Dystopian",
        "Utopian",
        "Sports",
        "Martial Arts",
        "Military",
        "Philosophical",
        "Political",
        "Tragedy",
        "Survival",
        "Crime",
        "Magical Realism",
        "Espionage",
        "Post-Apocalyptic",
        "Coming of Age",
      ],
    },
    contentType: {
      type: String,
      enum: ["fiction", "non-fiction"],
    },
    // Reference to the user who generated or saved the content (optional for prewritten content)
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
