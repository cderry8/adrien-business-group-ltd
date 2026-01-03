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

    mainImage: String,

    completedImages: [String],
    inProgressImages: [String],

    videos: [
      {
        url: String,
        caption: String,
      },
    ],

    architects: {
      type: [String],
      required: true,
      validate: v => v.length > 0,
    },

    materials: [String],
    sustainability: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
