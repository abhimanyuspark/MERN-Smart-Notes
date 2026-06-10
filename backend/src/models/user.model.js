import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      require: true,
    },

    email: {
      type: "String",
      require: true,
    },

    password: {
      type: "String",
      require: true,
    },

    role: {
      type: "String",
      default: "user",
    },

    avatar: {
      type: "String",
    },

    isBlocked: {
      type: "Boolean",
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", UserSchema);
