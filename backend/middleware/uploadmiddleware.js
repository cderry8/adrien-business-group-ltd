import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("video")) {
      return {
        folder: "projects/videos",
        resource_type: "video",
      };
    }
    return {
      folder: "projects/images",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

export const upload = multer({ storage });
