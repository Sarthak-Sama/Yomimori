const express = require("express");
const bodyParser = require("body-parser");
const clerkWebhookControllers = require("../controllers/clerkWebhook.controller");
const router = express.Router();

router.post(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhookControllers.handleUserWebhook
);

module.exports = router;
