import express from "express";

import {
  sendMessage,
  getChatMessages,
} from "../controllers/chat.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:chatId/message", protectRoute, sendMessage);
router.get("/:chatId/messages", protectRoute, getChatMessages);

export default router;
