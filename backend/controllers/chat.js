import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { hop } from "../config/hop.js";
import userModel from "../models/user.js";

dotenv.config();

// connect 2 active users
const connectUsers = asyncHandler(async (req, res) => {
  //   const { token, interests } = req.user;

  const reqToken = req.user.token;
  const interests = req.user.interests;

  const users = await userModel.find({
    $and: [{ _id: { $ne: req.user._id } }, { interests: { $in: interests } }],
  });

  if (!users) {
    res.status(400).json({ msg: "No users found with your interest!!" });
  }

  //    find users who are online and not in any other channel
  const onlineUsers = users.filter(async (user) => {
    const { token } = user;

    const isOnline = await hop.channels.tokens.isOnline(token);
    const { state } = await hop.channels.tokens.get(token);

    return isOnline && state.channelId === "default";
  });

  if (!onlineUsers) {
    res.status(400).json({ msg: "No users found online!!" });
  }

  //   select a random user from the online users
  const randomUser =
    onlineUsers[Math.floor(Math.random() * onlineUsers.length)];

  const { token } = randomUser;

  const commonInterests = randomUser.interests.filter((interest) => {
    return interests.includes(interests);
  });

  //   create a new channel
  const channel = await hop.channels.create("private", null, {
    state: {
      name: `${req.user.username}-${randomUser.username}`,
      members: [reqToken, token],
      commonInterests,
    },
  });

  await channel.subscribeTokens([reqToken, token]);

  const { reqState } = await hop.channels.tokens.get(reqToken);
  const { randomState } = await hop.channels.tokens.get(token);
  await hop.channels.tokens.setState(reqToken, {
    ...reqState,
    channelId: channel.id,
  });
  await hop.channels.tokens.setState(token, {
    ...randomState,
    channelId: channel.id,
  });

  await hop.channels.tokens.publishDirectMessage(token, "JOIN_REQUEST", {
    channelId: channel.id,
    name: req.user.username,
  });

  res.status(200).json(channel.id);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { channelId, message } = req.body;
  const name = req.user.username;
  console.log(name);

  await hop.channels.publishMessage(
    channelId,
    // event name of your choosing
    "USER_MESSAGE",
    // event data, this can be any object you want it to be
    {
      content: message,
      author_name: name,
    }
  );

  res.status(200).json({ msg: "Message sent" });
});

export { connectUsers, sendMessage };
