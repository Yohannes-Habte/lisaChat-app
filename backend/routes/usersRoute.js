import express from 'express';
import {
  allUsers,
  createUser,
  deleteUser,
  deleteUsers,
  loginUser,
  updateUser,
} from '../controllers/userController.js';
import { authUser } from '../middleware/generateToken.js';

const userRouter = express.Router();

userRouter.post('/register', createUser);
userRouter.post('/login', loginUser);
userRouter.put('/update/:id', authUser, updateUser);
userRouter.get('/', allUsers);
userRouter.delete('/:id', deleteUser);
userRouter.delete('/', deleteUsers);

export default userRouter;