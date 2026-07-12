import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    // Category
    category: {
      type: String,
      enum: [
        "Academic",
        "Hostel",
        "Food",
        "Library",
        "Sports",
        "Medical",
        "Parking",
        "Administration",
        "Transport",
        "Auditorium",
        "Other",
      ],
      required: true,
    },

    location:{
      type:{
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },

    // Building Details
    building: {
      type: String,
      default: "",
    },

    floor: {
      type: String,
      default: "Ground",
    },

    roomNumber: {
      type: String,
      default: "",
    },

    // Images
    images: [
      {
        type: String,
      },
    ],

    // Search Keywords
    keywords: [
      {
        type: String,
      },
    ],

    // Contact (Optional)
    phone: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    // Timings
    openingHours: {
      open: {
        type: String,
        default: "",
      },

      close: {
        type: String,
        default: "",
      },
    },

    // Popular Location
    popular: {
      type: Boolean,
      default: false,
    },

    // Active / Hidden
    isActive: {
      type: Boolean,
      default: true,
    },

    // Added By
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    parentLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Location", locationSchema);