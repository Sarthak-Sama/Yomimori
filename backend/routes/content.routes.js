const express = require("express");
const { requireAuth } = require("@clerk/express");
const contentControllers = require("../controllers/content.controller");
const router = express.Router();

router.get(
  "/fetchPreWrittenContent",
  contentControllers.fetchPrewrittenContent
);
router.get(
  "/fetchCreatedContent",
  requireAuth(),
  contentControllers.fetchUserContent
);

router.post(
  "/generateContent",
  requireAuth(),
  contentControllers.generateContent
);

module.exports = router;
