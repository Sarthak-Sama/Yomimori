const { getAuth } = require("@clerk/express");
const User = require("../models/user.model");

/**
 * Middleware to verify that the authenticated user is an admin.
 */
const requireAdmin = async (req, res, next) => {
  try {
    // Extract the userId from the request's auth object
    const { userId } = getAuth(req);

    // If there's no userId, the user isn't authenticated
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    // Look up the user in your MongoDB using the clerkId field
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Check if the user is marked as an admin
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    // Attach the user document to the request for downstream use
    req.user = user;

    // If the user is an admin, proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error("Error in requireAdmin middleware:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = requireAdmin;
