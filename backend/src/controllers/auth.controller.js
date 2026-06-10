import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/genJWT.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Credantials are required!" });
    }

    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    generateToken(user._id, res);
    const { password: _, ...userData } = user.toObject();
    return res.json(userData);
  } catch (error) {
    console.error("Register Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Credantials are required!" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(422).json({ message: "Incorrect password!" });
    }

    generateToken(user._id, res);
    const { password: _, ...userData } = user.toObject();
    return res.json(userData);
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
    });
    return res.json({ message: "Logout successfull" });
  } catch (error) {
    console.error("Logout Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Refresh Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
