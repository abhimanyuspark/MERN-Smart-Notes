import express from "express";

import {
  createNoteWithFiles,
  getAllNotes,
  getSingleNote,
  deleteMultipleNotes,
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

router.delete("/delete-multiple", protectRoute, deleteMultipleNotes);

export default router;
