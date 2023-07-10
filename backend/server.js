import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import colors from 'colors';

import userRouter from './routes/usersRoute.js';
import chatRouter from './routes/chatRoute.js';
import messageRouter from './routes/messageRoute.js';

// Error handler
import notFound from './middleware/notFound.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';


const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

dotenv.config(); 
const connectedToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('DB is connected'.cyan.underline);
  } catch (error) {
    console.log(error.message.red.bold);
  }
};


app.use(morgan('tiny'));

app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);
app.use(notFound);
app.use(globalErrorHandler);

const port = process.env.PORT || 8000;

// If you want to use, socket.io, assign a variable to app.listen
app.listen(port, () => {
  connectedToDatabase();
  console.log(`The server starts on port ${port}`.yellow.bold);
}); 
