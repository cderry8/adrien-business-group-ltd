import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const MAX_IMAGE_MB = Number(process.env.MAX_IMAGE_MB || 10);
const MAX_VIDEO_MB = Number(process.env.MAX_VIDEO_MB || 200);
const MAX_TOTAL_FILES = Number(process.env.MAX_TOTAL_FILES || 30);

const allowedImageMimes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const url = req.originalUrl || req.baseUrl || "";
    const isNews = url.includes("/adrien/news");
    const isWalkthrough = url.includes("/adrien/walkthrough");

    const baseFolder = isNews
      ? "news"
      : isWalkthrough
        ? "walkthroughs"
        : "projects";

    if (file.mimetype.startsWith("video")) {
      return {
        folder: `${baseFolder}/videos`,
        resource_type: "video",
        chunk_size: 6_000_000,
      };
    }
    return {
      folder: `${baseFolder}/images`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    files: MAX_TOTAL_FILES,
    fileSize: MAX_VIDEO_MB * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith("video");

    if (isVideo) {
      return cb(null, true);
    }

    if (!allowedImageMimes.has(file.mimetype)) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }

    return cb(null, true);
  },
});
