// models/News.js
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: [String], // Array of paragraphs for the article
      required: true,
    },
    featuredImage: {
      type: String, // URL from Cloudinary
      required: true,
    },
    galleryImages: {
      type: [String], 
      default: [],
    },
    videos: {
      type: [String], 
      default: [],
    },
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload
export default models.News || model("News", NewsSchema);
