import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
};
