const { getAuth } = require("@clerk/express");
const User = require("../models/user.model");
const { toZonedTime } = require("date-fns-tz");

const getUser = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const now = new Date();
    const timeZone = "Asia/Kolkata"; // IST time zone

    // Use toZonedTime to convert now to the target time zone
    const zonedDate = toZonedTime(now, timeZone);
    const today = new Date(
      zonedDate.getFullYear(),
      zonedDate.getMonth(),
      zonedDate.getDate()
    ).setHours(0, 0, 0, 0);

    const lastGenerationDate = user.lastGenerationDate
      ? toZonedTime(user.lastGenerationDate, timeZone).setHours(0, 0, 0, 0)
      : null;

    if (lastGenerationDate !== today) {
      user.dailyGenerationCount = 0;
      user.lastGenerationDate = now;
      await user.save();
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getUser };
