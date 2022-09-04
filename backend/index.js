import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
dotenv.config();
import userRouter from "./routers/user.js";
import chatRouter from "./routers/chat.js";

const app = express();
ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.json({ msg: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
