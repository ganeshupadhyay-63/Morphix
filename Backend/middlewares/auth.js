import { requireAuth } from "@clerk/express";
import { createClerkClient } from "@clerk/backend";
import dotenv from "dotenv";

dotenv.config();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const auth = [
  requireAuth(), // ensures user is authenticated
  async (req, res, next) => {
    try {
      const { userId } = req.auth(); // get userId from Clerk auth
      const user = await clerkClient.users.getUser(userId);

      // Determine plan and free usage
      const plan = user.privateMetadata?.plan === "premium" ? "premium" : "free";
      let freeUsage = user.privateMetadata?.free_usage || 0;

      // Reset free usage for premium users if needed
      if (plan === "premium" && freeUsage > 0) {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { ...user.privateMetadata, free_usage: 0 },
        });
        freeUsage = 0;
      }

      // Attach user info to request
      req.userId = userId;
      req.plan = plan;
      req.free_usage = freeUsage;

      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  },
];
