import News from "../models/newsmodel.js";
import cloudinary from "../config/cloudinary.js";

const getPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.substring(0, filename.lastIndexOf("."));
};

/* ======================
   CREATE NEWS
====================== */
export const createNews = async (req, res) => {
  try {
    // Text fields come directly from req.body
    const { title, date, author, shortDescription, content } = req.body;

    // content will be an array if multiple content paragraphs were sent
    const contentArray = Array.isArray(content) ? content : [content];

    // Files (uploaded via multer) are in req.files
    const featuredImage = req.files?.featuredImage?.[0]?.path || "";
    const galleryImages = req.files?.galleryImages?.map((f) => f.path) || [];
    const videos = req.files?.videos?.map((f) => f.path) || [];

    const news = new News({
      title,
      date,
      author,
      shortDescription,
      content: contentArray,
      featuredImage,
      galleryImages,
      videos,
    });

    await news.save();

    res.status(201).json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create news" });
  }
};

/* ======================
   READ
====================== */
export const getAllNews = async (_, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   UPDATE
====================== */
export const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });

    if (req.files?.featuredImage) {
      const oldId = getPublicId(news.featuredImage);
      if (oldId) {
        await cloudinary.uploader.destroy(`news/images/${oldId}`);
      }
      news.featuredImage = req.files.featuredImage[0].path;
    }

    if (req.files?.galleryImages) {
      for (const url of news.galleryImages) {
        const id = getPublicId(url);
        if (id) await cloudinary.uploader.destroy(`news/images/${id}`);
      }
      news.galleryImages = req.files.galleryImages.map(f => f.path);
    }

    if (req.files?.videos) {
      for (const url of news.videos) {
        const id = getPublicId(url);
        if (id) {
          await cloudinary.uploader.destroy(`news/videos/${id}`, {
            resource_type: "video",
          });
        }
      }
      news.videos = req.files.videos.map(f => f.path);
    }

    const fields = ["title", "date", "shortDescription", "author"];
    fields.forEach(f => {
      if (req.body[f] !== undefined) news[f] = req.body[f];
    });

    if (req.body.content) {
      news.content = JSON.parse(req.body.content);
    }

    await news.save();
    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   DELETE
====================== */
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Not found" });

    if (news.featuredImage) {
      const id = getPublicId(news.featuredImage);
      if (id) await cloudinary.uploader.destroy(`news/images/${id}`);
    }

    for (const url of news.galleryImages) {
      const id = getPublicId(url);
      if (id) await cloudinary.uploader.destroy(`news/images/${id}`);
    }

    for (const url of news.videos) {
      const id = getPublicId(url);
      if (id) {
        await cloudinary.uploader.destroy(`news/videos/${id}`, {
          resource_type: "video",
        });
      }
    }

    await news.deleteOne();
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
