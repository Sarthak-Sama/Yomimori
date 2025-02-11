const User = require("../models/user.model");
const { Webhook } = require("svix");

module.exports.handleUserWebhook = async (req, res) => {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    );
  }

  // Create a new Svix instance with the secret
  const wh = new Webhook(SIGNING_SECRET);
  // Get headers and the raw payload from the request.
  const headers = req.headers;
  const payload = req.body;

  let event;

  try {
    // Verify the webhook payload using Svix
    event = wh.verify(payload, headers);
  } catch (err) {
    console.error("Error verifying webhook:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const { type, data } = event;

  try {
    switch (type) {
      case "user.created": {
        // Destructure fields from the data object. Adjust based on Clerk's payload.
        const { id, email_addresses, first_name, last_name } = data;
        const email = email_addresses?.[0]?.email_address;
        const name = `${first_name || ""} ${last_name || ""}`.trim();

        // Avoid duplicate entries by checking if the user already exists.
        const existingUser = await User.findOne({ clerkId: id });
        if (!existingUser) {
          const newUser = new User({
            clerkId: id,
            email,
            name,
          });
          await newUser.save();
          console.log(`Created new user: ${id}`);
        }
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name } = data;
        const email = email_addresses?.[0]?.email_address;
        const name = `${first_name || ""} ${last_name || ""}`.trim();

        // Update the user information in your DB.
        await User.findOneAndUpdate(
          { clerkId: id },
          { email, name },
          { new: true } // returns the updated document (optional)
        );
        console.log(`Updated user: ${id}`);
        break;
      }

      case "user.deleted": {
        const { id } = data;
        // Remove the user from your DB.
        await User.findOneAndDelete({ clerkId: id });
        console.log(`Deleted user: ${id}`);
        break;
      }

      default:
        console.log("Unhandled event type:", type);
        break;
    }

    // Acknowledge receipt of the webhook event.
    res.status(200).send({ received: true });
  } catch (err) {
    console.error("Error handling Clerk webhook event:", err);
    res.status(500).send("Internal Server Error");
  }
};
