import express from "express";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controllers/newscontroller.js";

import { upload } from "../middleware/uploadmiddleware.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  createNews
);

router.put(
  "/:id",
  upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  updateNews
);

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.delete("/:id", deleteNews);

export default router;
