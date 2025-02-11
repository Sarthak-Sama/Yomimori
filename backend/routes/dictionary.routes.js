const express = require("express");
const router = express.Router();
const dictionaryController = require("../controllers/dictionary.controller");

// Route to fetch all dictionary entries
router.get("/entries", dictionaryController.getAllEntries);

// Route to fetch a dictionary entry by word
router.get("/entries/word/:word", dictionaryController.getEntryByWord);

// Route to fetch a dictionary entry by ID
router.get("/entries/:id", dictionaryController.getEntryById);

module.exports = router;
