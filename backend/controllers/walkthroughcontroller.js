import Walkthrough from "../models/walkthrough.js";
import cloudinary from "../config/cloudinary.js";

const getPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.substring(0, filename.lastIndexOf("."));
};

/* ======================
   CREATE
====================== */
export const createWalkthrough = async (req, res) => {
  try {
    const { projectName, createdBy } = req.body;

    const videoUrl = req.files?.video?.[0]?.path || "";
    const coverImage = req.files?.coverImage?.[0]?.path || "";

    const walkthrough = new Walkthrough({
      projectName,
      videoUrl,
      coverImage,
      createdBy: createdBy || "Admin",
    });

    await walkthrough.save();
    res.status(201).json(walkthrough);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   READ
====================== */
export const getAllWalkthroughs = async (_, res) => {
  try {
    const walkthroughs = await Walkthrough.find().sort({ createdAt: -1 });
    res.json(walkthroughs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWalkthroughById = async (req, res) => {
  try {
    const walkthrough = await Walkthrough.findById(req.params.id);
    if (!walkthrough) {
      return res.status(404).json({ message: "Walkthrough not found" });
    }
    res.json(walkthrough);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   UPDATE
====================== */
export const updateWalkthrough = async (req, res) => {
  try {
    const walkthrough = await Walkthrough.findById(req.params.id);
    if (!walkthrough) {
      return res.status(404).json({ message: "Walkthrough not found" });
    }

    if (req.files?.video) {
      if (walkthrough.videoUrl) {
        const id = getPublicId(walkthrough.videoUrl);
        if (id) {
          await cloudinary.uploader.destroy(
            `walkthroughs/videos/${id}`,
            { resource_type: "video" }
          );
        }
      }
      walkthrough.videoUrl = req.files.video[0].path;
    }

    if (req.files?.coverImage) {
      if (walkthrough.coverImage) {
        const id = getPublicId(walkthrough.coverImage);
        if (id) {
          await cloudinary.uploader.destroy(`walkthroughs/images/${id}`);
        }
      }
      walkthrough.coverImage = req.files.coverImage[0].path;
    }

    const fields = ["projectName", "createdBy"];
    fields.forEach(f => {
      if (req.body[f] !== undefined) walkthrough[f] = req.body[f];
    });

    await walkthrough.save();
    res.json(walkthrough);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   DELETE
====================== */
export const deleteWalkthrough = async (req, res) => {
  try {
    const walkthrough = await Walkthrough.findById(req.params.id);
    if (!walkthrough) {
      return res.status(404).json({ message: "Walkthrough not found" });
    }

    if (walkthrough.videoUrl) {
      const id = getPublicId(walkthrough.videoUrl);
      if (id) {
        await cloudinary.uploader.destroy(
          `walkthroughs/videos/${id}`,
          { resource_type: "video" }
        );
      }
    }

    if (walkthrough.coverImage) {
      const id = getPublicId(walkthrough.coverImage);
      if (id) {
        await cloudinary.uploader.destroy(`walkthroughs/images/${id}`);
      }
    }

    await walkthrough.deleteOne();
    res.json({ message: "Walkthrough deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
