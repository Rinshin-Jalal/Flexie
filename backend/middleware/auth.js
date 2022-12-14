import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userModel from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await userModel.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ msg: "Not authorized" });
    }
  }
  if (!token) {
    res.status(401).json({ msg: "Not authorized, no token provided" });
  }
});

export { protect };
