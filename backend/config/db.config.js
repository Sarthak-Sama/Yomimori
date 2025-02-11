const mongoose = require("mongoose");

module.exports.connectDB = () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error(
        "MONGO_URI is undefined. Check your environment variables."
      );
    }

    mongoose.connect(uri).then(() => {
      console.log("MongoDB connected");
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
};
