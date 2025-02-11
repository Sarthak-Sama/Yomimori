const express = require("express");
const router = express.Router();

router.get("/heartbeat", (req, res) => {
  res.json({ message: "Server is Live." });
});

module.exports = router;
