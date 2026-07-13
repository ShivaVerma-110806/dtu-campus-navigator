import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      default: "FindMyWay",
    },
    logoUrl: {
      type: String,
      default: "",
    },
    defaultLat: {
      type: Number,
      default: 28.7501,
    },
    defaultLng: {
      type: Number,
      default: 77.1177,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    googleMapsKey: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Settings", settingsSchema);
