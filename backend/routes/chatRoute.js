import express from 'express';
import {
  addToGroupChat,
  conductChat,
  createGroupChat,
  getAllChats,
  leaveGroupChat,
  renameroupChat,
} from '../controllers/chatController.js';
import { authUser } from '../middleware/generateToken.js';

const chatRouter = express.Router();

chatRouter.post('/', authUser, conductChat); 
chatRouter.get('/', authUser, getAllChats);
chatRouter.post('/createGroup', authUser, createGroupChat);
chatRouter.put('/renameGroup', authUser, renameroupChat);
chatRouter.put('/addToGroup', authUser, addToGroupChat); // To add someone into the group
chatRouter.put('/leaveGroup', authUser, leaveGroupChat); // Remove someone from the group or leave someone from the group

export default chatRouter;
