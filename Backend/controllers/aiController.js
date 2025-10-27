import OpenAI from "openai";
import sql from "../configs/db.js";
import { createClerkClient } from "@clerk/backend"; // ✅ Correct import
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import cloudinary from "../configs/cloudinary.js";


// Initialize AI
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// Initialize Clerk client
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const FREE_IMAGE_LIMIT = 5;
const FREE_BG_REMOVAL_LIMIT = 10;


export const generateArticle = async (req, res) => {
  try {
    // --- Authentication check ---
    const auth = req.auth?.(); // ✅ use as function
    if (!auth?.userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const userId = auth.userId;

    const { prompt, length } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt cannot be empty" });
    }

    // --- Fetch user & plan ---
    const user = await clerkClient.users.getUser(userId);
    const plan = user.privateMetadata?.plan || "free";
    const freeUsage = user.privateMetadata?.free_usage || 0;

    if (plan !== "premium" && freeUsage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to continue."
      });
    }

    // --- Generate AI content ---
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length || 800
    });

    console.log("AI raw response:", response);

    // --- Extract content ---
    const content =
      response?.choices?.[0]?.message?.content?.trim() ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!content) {
      return res.status(500).json({ success: false, message: "AI did not return any content" });
    }

    // --- Save to DB ---
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    // --- Update free usage for non-premium users ---
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          free_usage: freeUsage + 1,
        },
      });
    }

    return res.status(200).json({ success: true, content });

  } catch (error) {
    console.error("🔥 generateArticle error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating the article",
      error: error.message,
    });
  }
};





export const generateBlogTitle = async (req, res) => {
  try {
    // --- Authentication check ---
    const auth = req.auth?.(); // ✅ use as function
    if (!auth?.userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const userId = auth.userId;

    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt cannot be empty" });
    }

    // --- Fetch user & plan ---
    const user = await clerkClient.users.getUser(userId);
    const plan = user.privateMetadata?.plan || "free";
    const freeUsage = user.privateMetadata?.free_usage || 0;

    // Limit: 15 titles for free users
    if (plan !== "premium" && freeUsage >= 15) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to continue."
      });
    }

    // --- Generate blog title (short + catchy) ---
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: "You are a blog title generator. Create short, catchy, and SEO-friendly titles." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 60
    });

    const content = response?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res.status(500).json({ success: false, message: "AI did not return a title" });
    }

    // --- Save creation to DB ---
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    // --- Update free usage for non-premium users ---
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          free_usage: freeUsage + 1,
        },
      });
    }

    return res.status(200).json({ success: true, content });

  } catch (error) {
    console.error("generateBlogTitle error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while generating the blog title",
      error: error.message,
    });
  }
};




export const generateImage = async (req, res) => {
  try {
    // --- Clerk auth ---
    const { userId } = await req.auth();
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { prompt, publish = false } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ success: false, message: "Prompt cannot be empty" });

    // --- Fetch user metadata ---
    const user = await clerkClient.users.getUser(userId);
    const plan = user.privateMetadata?.plan === "premium" ? "premium" : "free";
    const freeUsage = user.privateMetadata?.free_usage || 0;

    if (plan !== "premium" && freeUsage >= FREE_IMAGE_LIMIT) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to continue.",
        remainingFreeUsage: 0,
      });
    }

    // --- Generate image with Clipdrop ---
    let imageData;
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      const response = await axios.post(
        "https://clipdrop-api.co/text-to-image/v1",
        formData,
        {
          headers: {
            "x-api-key": process.env.CLIPDROP_API_KEY,
            ...formData.getHeaders(),
          },
          responseType: "arraybuffer",
        }
      );

      imageData = response.data;
    } catch (err) {
      console.error("Clipdrop API error:", err.message);
      const message =
        err.response?.status === 402
          ? "Clipdrop API: Insufficient credits. Please upgrade your subscription."
          : "Error generating image from Clipdrop API";
      return res.status(err.response?.status || 500).json({ success: false, message, error: err.message });
    }

    const base64Image = `data:image/png;base64,${Buffer.from(imageData, "binary").toString("base64")}`;

    // --- Upload to Cloudinary ---
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(base64Image, { folder: "creations" });
    } catch (err) {
      console.error("Cloudinary upload error:", err.message);
      return res.status(500).json({ success: false, message: "Error uploading image", error: err.message });
    }

    // --- Save to DB ---
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${uploadResult.secure_url}, 'image', ${publish})
    `;

    // --- Update free usage ---
    let updatedFreeUsage = freeUsage;
    if (plan !== "premium") {
      updatedFreeUsage = freeUsage + 1;
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { ...user.privateMetadata, free_usage: updatedFreeUsage },
      });
    }

    return res.status(200).json({
      success: true,
      content: uploadResult.secure_url,
      remainingFreeUsage: plan === "premium" ? null : FREE_IMAGE_LIMIT - updatedFreeUsage,
    });
  } catch (error) {
    console.error("generateImage error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


export const RemoveImageBackground = async (req, res) => {
  try {
    const { userId } = await req.auth();
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!req.file?.path) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    // --- Fetch user metadata ---
    const user = await clerkClient.users.getUser(userId);
    const plan = user.privateMetadata?.plan === "premium" ? "premium" : "free";
    const freeUsage = user.privateMetadata?.free_usage || 0;

    // --- Check free usage limit ---
    if (plan !== "premium" && freeUsage >= FREE_BG_REMOVAL_LIMIT) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to continue.",
      });
    }

    // --- Upload to Cloudinary with background removal ---
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "creations",
      format: "png", // ensure transparency
      eager: [{ effect: "background_removal" }], // use eager transformation
    });

    // Cloudinary eager transformations return URLs in the `eager` array
    const processedUrl = uploadResult.eager?.[0]?.secure_url || uploadResult.secure_url;

    // --- Save to DB ---
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${processedUrl}, 'image')
    `;

    // --- Update free usage count for non-premium users ---
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { ...user.privateMetadata, free_usage: freeUsage + 1 },
      });
    }

    return res.status(200).json({ success: true, content: processedUrl });
  } catch (error) {
    console.error("RemoveImageBackground error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};





export const RemoveImageObject = async (req, res) => {
  try {
    // --- Auth check ---
    const { userId } = await req.auth(); // ✅ use async auth
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const { object } = req.body;
    const image = req.file;

    if (!image || !image.path) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }
    if (!object || !object.trim()) {
      return res.status(400).json({ success: false, message: "Object to remove is required" });
    }

    // --- Sanitize object name for Cloudinary ---
    const sanitizedObject = object.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!sanitizedObject) {
      return res.status(400).json({ success: false, message: "Invalid object name after sanitization" });
    }

    // --- Fetch user metadata ---
    const user = await clerkClient.users.getUser(userId);
    const plan = user.privateMetadata?.plan || "free";
    const freeUsage = user.privateMetadata?.free_usage || 0;

    if (plan !== "premium" && freeUsage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to continue."
      });
    }

    // --- Upload original image to Cloudinary ---
    const uploadResult = await cloudinary.uploader.upload(image.path, {
      folder: "creations",
    });

    const publicId = uploadResult.public_id;

    // --- Generate new URL with object removal safely ---
    const imageUrl = cloudinary.url(publicId, {
      transformation: [{ effect: `gen_remove:${encodeURIComponent(sanitizedObject)}` }],
      resource_type: "image",
    });

    // --- Save to DB ---
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${sanitizedObject} from image`}, ${imageUrl}, 'image')
    `;

    // --- Update usage for free users ---
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          free_usage: freeUsage + 1,
        },
      });
    }

    return res.status(200).json({ success: true, content: imageUrl });

  } catch (error) {
    console.error("RemoveImageObject error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing object from image",
      error: error.message,
    });
  }
};





export const ResumeReview = async (req, res) => {
  try {
    // --- Auth check ---
    const { userId } = await req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const resume = req.file;
    if (!resume || !resume.path) {
      return res.status(400).json({ success: false, message: "No resume file uploaded" });
    }

    // --- File size check ---
    if (resume.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "Resume file exceeds 5 MB" });
    }

    // --- Fetch user metadata ---
    const user = await clerkClient.users.getUser(userId);
    const plan = user.privateMetadata?.plan || "free";
    const freeUsage = user.privateMetadata?.free_usage || 0;

    if (plan !== "premium" && freeUsage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Free usage limit reached. Upgrade to continue.",
      });
    }

    // --- Extract PDF text ---
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);
    const resumeText = pdfData.text;

    // --- AI prompt ---
    const prompt = `
      Review the following resume and provide constructive feedback.
      Focus on strengths, weaknesses, and areas for improvement.

      Resume Content:
      ${resumeText}
    `;

    // --- AI completion ---
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res.status(500).json({ success: false, message: "AI did not return feedback" });
    }

    // --- Save to DB ---
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'resume-review')
    `;

    // --- Update usage for free users ---
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          free_usage: freeUsage + 1,
        },
      });
    }

    return res.status(200).json({ success: true, content });

  } catch (error) {
    console.error("ResumeReview error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reviewing the resume",
      error: error.message,
    });
  }
};





