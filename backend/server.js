const express = require("express");
const { connectDB } = require("./config/db.config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use("/webhooks/clerk", bodyParser.raw({ type: "application/json" }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://p652kfhs-3000.inc1.devtunnels.ms",
      "https://55lybk-ip-202-41-10-109.tunnelmole.net",
      "production-url",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true, // Allow cookies
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/webhooks", bodyParser.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

/**
 * ROUTES
 */
const heartbeatRoutes = require("./routes/heartbeat.routes");
const userRoutes = require("./routes/user.routes");
const contentRoutes = require("./routes/content.routes");
const adminRoutes = require("./routes/admin.routes");
const webhooksRoutes = require("./routes/webhooks.routes");
const dictionaryRoutes = require("./routes/dictionary.routes");

app.use("/api", heartbeatRoutes);
app.use("/api", userRoutes);
app.use("/api", contentRoutes);
app.use("/api", adminRoutes);
app.use("/api", dictionaryRoutes);
app.use("/api", webhooksRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
