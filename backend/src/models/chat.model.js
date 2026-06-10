import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mediaIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],

    title: String,

    extractedContext: String,

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
        },

        content: mongoose.Schema.Types.Mixed,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Chat", chatSchema);
