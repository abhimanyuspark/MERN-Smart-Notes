import express from "express";

import {
  createNoteWithFiles,
  getAllNotes,
  getSingleNote,
  deleteNote,
  addFilesToNote,
} from "../controllers/note.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  protectRoute,
  upload.array("files", 20),
  createNoteWithFiles,
);

router.post(
  "/upload/:noteId",
  protectRoute,
  upload.array("files", 20),
  addFilesToNote,
);

router.get("/", protectRoute, getAllNotes);

router.get("/:id", protectRoute, getSingleNote);

router.delete("/:id", protectRoute, deleteNote);

export default router;
