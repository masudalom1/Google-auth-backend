import express from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../lib/middleware.js";

const router = express.Router();

// signin route
router.post("/", async (req, res) => {
  try {
    const { name, email, phoneNumber, avatar } = req.body;

    // check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        phoneNumber,
        avatar,
      });
      await user.save();
    }

    // sign JWT (better: only id + email)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // send response
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/get-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
