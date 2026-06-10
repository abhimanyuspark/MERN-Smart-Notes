import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);
route.post("/logout", logout);

route.post("/refresh", protectRoute, refreshToken);

export default route;
