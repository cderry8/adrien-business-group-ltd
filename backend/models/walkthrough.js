// models/Walkthrough.js
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const WalkthroughSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true, // e.g., "Luxury Villa Kigali"
    },
    videoUrl: {
      type: String,
      required: true, // Cloudinary or any URL to the video
    },
    coverImage: {
      type: String, // optional thumbnail for listing
      default: "",
    },
    createdBy: {
      type: String,
      default: "Admin", // optional author/uploader
    },
  },
  { timestamps: true }
);

export default models.Walkthrough || model("Walkthrough", WalkthroughSchema);
