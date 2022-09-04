import express from "express";
import { connectUsers, sendMessage } from "../controllers/chat.js";
import { protect } from "../middleware/auth.js";

const chatRouter = express.Router();

chatRouter.get("/connect", protect, connectUsers);
chatRouter.post("/sendMessage", protect, sendMessage);

export default chatRouter;
