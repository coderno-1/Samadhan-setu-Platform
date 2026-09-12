import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },

    category: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    location: {
      address: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      latitude: Number,
      longitude: Number,
    },

    photos: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
        "rejected",
      ],
      default: "submitted",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    
    aiAnalysis: {
      category: {
        type: String,
        trim: true,
      },
      priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
      },
      isDuplicate: {
        type: Boolean,
        default: false,
      },
      duplicateOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        default: null,
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0,
      },
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Problem", problemSchema);
