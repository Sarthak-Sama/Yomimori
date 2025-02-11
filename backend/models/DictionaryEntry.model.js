const mongoose = require("mongoose");

const dictionaryEntrySchema = new mongoose.Schema({
  word: { type: String, required: true },
  reading: { type: String, required: true },
  englishMeaning: { type: String, required: true },
});

module.exports = mongoose.model("DictionaryEntry", dictionaryEntrySchema);
