import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  updateUser,
} from "../controllers/user.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getMe);
userRouter.put("/me", protect, updateUser);

export default userRouter;
