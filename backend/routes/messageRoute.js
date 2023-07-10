import express from "express";
import { getAllMessages, postMessage } from "../controllers/messageController.js";
import { authUser } from "../middleware/generateToken.js";

const messageRouter = express.Router()

messageRouter.post("/", authUser, postMessage)
messageRouter.get("/:chatId", authUser, getAllMessages)


export default messageRouter;

