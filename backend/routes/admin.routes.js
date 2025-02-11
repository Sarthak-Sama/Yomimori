const express = require("express");
const { requireAuth } = require("@clerk/express");
const requireAdmin = require("../middleware/isAdmin.middleware");
const contentControllers = require("../controllers/content.controller");
const router = express.Router();

router.get("/check-admin", requireAuth(), requireAdmin, (req, res) => {
  res.json({ message: "Welcome, Admin!", isAdmin: true });
});
router.post(
  "/admin/createContent",
  requireAuth(),
  requireAdmin,
  contentControllers.createPrewrittenContent
);

module.exports = router;
