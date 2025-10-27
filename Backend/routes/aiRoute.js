import express from "express";
import { requireAuth } from "@clerk/express";
import { auth } from "../middlewares/auth.js";
import { 
  generateArticle, 
  generateBlogTitle,  
  generateImage, 
  RemoveImageBackground, 
  RemoveImageObject, 
  ResumeReview,
  
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

// Protected routes with Clerk auth first, then custom auth
aiRouter.post("/generate-article", requireAuth(), auth, generateArticle);
aiRouter.post("/generate-blog-title", requireAuth(), auth, generateBlogTitle);
aiRouter.post("/generate-image", requireAuth(), auth, generateImage);
aiRouter.post("/remove-image-background", requireAuth(), upload.single('image'), auth, RemoveImageBackground);
aiRouter.post("/remove-image-object", requireAuth(), upload.single('image'), auth, RemoveImageObject);
aiRouter.post("/resume-review", requireAuth(), upload.single('image'), auth, ResumeReview);

export default aiRouter;
