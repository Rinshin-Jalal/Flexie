import asyncHandler from "express-async-handler";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { hop } from "../config/hop.js";
dotenv.config();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ msg: "Please enter all fields" });
  }

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400).json({ msg: "User already exists" });
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);
  const token = await hop.channels.tokens.create({
    email,
    name,
    channelId: "default",
  });
  //   create a new user
  const user = await userModel.create({
    username: name,
    email,
    password: hashedPassword,
    token: token.id,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.username,
      email: user.email,
      token: user.token,
      JWT: generateToken(user.id),
    });
  } else {
    res.status(400).json({ msg: "Invalid user data" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "Please enter all fields" });
  }

  const user = await userModel.findOne({ email });

  if (user && bcryptjs.compareSync(password, user.password)) {
    res.json({
      _id: user.id,
      name: user.username,
      email: user.email,
      token: user.token,
      JWT: generateToken(user.id),
    });
  } else {
    res.status(400).json({ msg: "Invalid credentials" });
  }
});

// update user info
const updateUser = asyncHandler(async (req, res) => {
  const { name, interests } = req.body;
  const user = await userModel.findById(req.user._id);

  user.username = name || user.username;
  user.interests = interests || user.interests;

  const { state } = await hop.channels.tokens.get(user.token);

  await hop.channels.tokens.setState(user.token, {
    ...state,
    channelId: "default",
    ...(name && { name: name }),
    ...(interests && { interests: interests }),
  });

  const updatedUser = await user.save();

  if (updatedUser) {
    res.json({
      _id: updatedUser.id,
      name: updatedUser.username,
      interests: updatedUser.interests,
      email: updatedUser.email,
      token: updatedUser.token,
      JWT: generateToken(updatedUser.id),
    });
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { registerUser, loginUser, getMe, updateUser };
