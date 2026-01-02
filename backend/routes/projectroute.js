import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectcontroller.js";

import { upload } from "../middleware/uploadmiddleware.js";

const router = express.Router();

/* ======================
   CREATE PROJECT
====================== */
router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "completedImages", maxCount: 10 },
    { name: "inProgressImages", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  createProject
);

/* ======================
   UPDATE PROJECT
====================== */
router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "completedImages", maxCount: 10 },
    { name: "inProgressImages", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  updateProject
);

/* ======================
   READ
====================== */
router.get("/", getProjects);
router.get("/:id", getProject);

/* ======================
   DELETE
====================== */
router.delete("/:id", deleteProject);

export default router;
