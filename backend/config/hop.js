import { Hop } from "@onehop/js";
import dotenv from "dotenv";
dotenv.config();

const myToken = process.env.PROJECT_TOKEN;

// Export the Hop SDK instance so you can use it throughout your codebase
export const hop = new Hop(myToken);
