import express from "express";
import {
  createWalkthrough,
  getAllWalkthroughs,
  getWalkthroughById,
  updateWalkthrough,
  deleteWalkthrough,
} from "../controllers/walkthroughcontroller.js";

import { upload } from "../middleware/uploadmiddleware.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createWalkthrough
);

router.put(
  "/:id",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateWalkthrough
);

router.get("/", getAllWalkthroughs);
router.get("/:id", getWalkthroughById);
router.delete("/:id", deleteWalkthrough);

export default router;
