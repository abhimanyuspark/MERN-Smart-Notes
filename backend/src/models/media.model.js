import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "pdf"],
      required: true,
    },

    fileName: String,

    mediaUrl: String,

    mimeType: String,

    fileSize: Number,

    extractedText: {
      type: String,
      default: "",
    },

    metadata: {
      description: {
        type: String,
        default: "",
      },

      tags: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Media", mediaSchema);
