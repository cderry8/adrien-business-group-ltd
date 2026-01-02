import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: String,
    location: String,
    year: Number,
    area: String,
    client: String,

    status: {
      type: String,
      enum: ["In Progress", "Completed"],
      default: "In Progress",
    },

    style: String,
    overview: String,
    designConcept: String,

    // ✅ NEW: main image
    mainImage: { type: String },

    completedImages: [{ type: String }],
    inProgressImages: [{ type: String }],

    // ✅ videos now OPTIONAL
    videos: [
      {
        url: { type: String },
        caption: String,
      },
    ],

    architects: [{ type: String, required: true }],
    materials: [{ type: String }],
    sustainability: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
