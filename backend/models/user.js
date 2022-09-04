import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    token: {
      type: String,
      // required: [true, "Token is required"],
    },
    interests: [String],
    active: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
