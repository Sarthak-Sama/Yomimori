const express = require("express");
const { requireAuth } = require("@clerk/express");
const contentControllers = require("../controllers/content.controller");
const router = express.Router();

// Custom middleware wrapper that returns an empty array if not authenticated
function authOrEmpty(req, res, next) {
  requireAuth()(req, res, function (err) {
    if (err) {
      // Instead of sending an error, respond with an empty array
      return res.json([]);
    }
    next();
  });
}

router.get(
  "/fetchPreWrittenContent",
  contentControllers.fetchPrewrittenContent
);
router.get(
  "/fetchCreatedContent",
  authOrEmpty,
  contentControllers.fetchUserContent
);

router.post(
  "/generateContent",
  requireAuth(),
  contentControllers.generateContent
);

module.exports = router;
