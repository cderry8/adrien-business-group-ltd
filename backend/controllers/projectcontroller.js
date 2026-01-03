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

const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return value
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);
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
      architects,
      materials,
      sustainability,
    } = req.body;

    // 🔴 HARD VALIDATION
    const normalizedArchitects = normalizeArray(architects);
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    if (normalizedArchitects.length === 0) {
      return res.status(400).json({ message: "At least one architect is required" });
    }

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

      mainImage: req.files?.mainImage?.[0]?.path || null,
      completedImages: req.files?.completedImages?.map(f => f.path) || [],
      inProgressImages: req.files?.inProgressImages?.map(f => f.path) || [],
      videos:
        req.files?.videos?.map(f => ({
          url: f.path,
          caption: "",
        })) || [],

      architects: normalizedArchitects,
      materials: normalizeArray(materials),
      sustainability: normalizeArray(sustainability),
    });

    await project.save();
    res.status(201).json(project);

  } catch (error) {
    console.error("CREATE PROJECT ERROR MESSAGE:", error.message);
    console.error("CREATE PROJECT ERROR STACK:", error.stack);
    res.status(500).json({ message: error.message });
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
    console.error("GET PROJECTS ERROR:", error.message);
    res.status(500).json({ message: error.message });
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
    console.error("GET PROJECT ERROR:", error.message);
    res.status(500).json({ message: error.message });
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

    if (req.files?.mainImage?.[0]) {
      project.mainImage = req.files.mainImage[0].path;
    }

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

    if (req.body.architects) {
      const normalizedArchitects = normalizeArray(req.body.architects);
      if (normalizedArchitects.length === 0) {
        return res.status(400).json({ message: "Architects cannot be empty" });
      }
      project.architects = normalizedArchitects;
    }

    if (req.body.materials) {
      project.materials = normalizeArray(req.body.materials);
    }

    if (req.body.sustainability) {
      project.sustainability = normalizeArray(req.body.sustainability);
    }

    await project.save();
    res.status(200).json({ message: "Project updated", project });

  } catch (error) {
    console.error("UPDATE PROJECT ERROR MESSAGE:", error.message);
    console.error("UPDATE PROJECT ERROR STACK:", error.stack);
    res.status(500).json({ message: error.message });
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
    console.error("DELETE PROJECT ERROR MESSAGE:", error.message);
    console.error("DELETE PROJECT ERROR STACK:", error.stack);
    res.status(500).json({ message: error.message });
  }
};
