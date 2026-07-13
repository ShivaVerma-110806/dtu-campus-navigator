import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
    },
    mimeType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Media", mediaSchema);
