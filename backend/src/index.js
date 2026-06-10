import express from "express";
const app = express();
import { config } from "dotenv";
config({ quiet: true });
import cors from "cors";
import { connectDB } from "./config/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";
import chatRoutes from "./routes/chat.route.js";

import cookieParser from "cookie-parser";
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const whiteList = [process.env.FRONTEND_ORIGIN, process.env.BACKEND_ORIGIN];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whiteList.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(), false);
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    corsOptionsSuccessStatus: 200,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.json("Hello World!");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
