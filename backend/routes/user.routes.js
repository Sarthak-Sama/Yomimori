const express = require("express");
const { requireAuth } = require("@clerk/express");
const userControllers = require("../controllers/user.controller");
const router = express.Router();

router.get("/fetchUser", requireAuth(), userControllers.getUser);

module.exports = router;
