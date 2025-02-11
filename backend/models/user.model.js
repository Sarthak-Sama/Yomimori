const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // Unique identifier provided by Clerk for authentication
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    // Basic user profile information (optional, you can extend this)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    userTier: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },
    dailyGenerationCount: {
      type: Number,
      default: 0,
    },
    lastGenerationDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

module.exports = mongoose.model("User", userSchema);
