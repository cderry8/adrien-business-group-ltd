import Project from "../models/projectmodel.js";
import cloudinary from "../config/cloudinary.js";

/* ======================
   HELPERS
====================== */
const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.substring(0, filename.lastIndexOf("."));
};

/* ======================
   CREATE PROJECT
====================== */
export const createProject = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      year,
      area,
      client,
      status,
      overview,
      designConcept,
      style,
      materials,
      sustainability,
      architects,
    } = req.body;

    const project = new Project({
      name,
      type,
      location,
      year,
      area,
      client,
      status,
      overview,
      designConcept,
      style,

      // Files (all optional)
      mainImage: req.files?.mainImage?.[0]?.path || null,
      completedImages: req.files?.completedImages?.map(f => f.path) || [],
      inProgressImages: req.files?.inProgressImages?.map(f => f.path) || [],
      videos:
        req.files?.videos?.map(f => ({
          url: f.path,
          caption: "",
        })) || [],

      // Arrays
      architects: Array.isArray(architects) ? architects : [architects],
      materials: materials?.split(",").map(m => m.trim()) || [],
      sustainability: sustainability?.split(",").map(s => s.trim()) || [],
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

/* ======================
   GET ALL PROJECTS
====================== */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* ======================
   GET SINGLE PROJECT
====================== */
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

/* ======================
   UPDATE PROJECT
====================== */
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Replace main image if provided
    if (req.files?.mainImage?.[0]) {
      project.mainImage = req.files.mainImage[0].path;
    }

    // Append new uploads
    if (req.files?.completedImages) {
      project.completedImages.push(
        ...req.files.completedImages.map(f => f.path)
      );
    }

    if (req.files?.inProgressImages) {
      project.inProgressImages.push(
        ...req.files.inProgressImages.map(f => f.path)
      );
    }

    if (req.files?.videos) {
      project.videos.push(
        ...req.files.videos.map(f => ({
          url: f.path,
          caption: "",
        }))
      );
    }

    // Update scalar fields
    const fields = [
      "name",
      "type",
      "location",
      "year",
      "area",
      "client",
      "status",
      "overview",
      "designConcept",
      "style",
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // Update arrays
    if (req.body.materials) {
      project.materials = req.body.materials
        .split(",")
        .map(m => m.trim());
    }

    if (req.body.sustainability) {
      project.sustainability = req.body.sustainability
        .split(",")
        .map(s => s.trim());
    }

    if (req.body.architects) {
      project.architects = Array.isArray(req.body.architects)
        ? req.body.architects
        : [req.body.architects];
    }

    await project.save();
    res.status(200).json({ message: "Project updated", project });
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to update project" });
  }
};

/* ======================
   DELETE PROJECT
====================== */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete images
    const images = [
      project.mainImage,
      ...project.completedImages,
      ...project.inProgressImages,
    ].filter(Boolean);

    for (const url of images) {
      const publicId = extractPublicId(url);
      if (publicId) {
        await cloudinary.uploader.destroy(`projects/images/${publicId}`);
      }
    }

    // Delete videos
    for (const vid of project.videos) {
      const publicId = extractPublicId(vid.url);
      if (publicId) {
        await cloudinary.uploader.destroy(
          `projects/videos/${publicId}`,
          { resource_type: "video" }
        );
      }
    }

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
