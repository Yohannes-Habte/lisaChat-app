import Chat from '../model/chatModel.js';
import Message from '../model/messageModel.js';
import User from '../model/userModel.js';
import createError from 'http-errors';

//========================================================
// Send message
//========================================================
export const postMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  try {
    // New message  
    let newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    // Populate sender and chat. In such case we cannot use direct populate
    message = await message.populate('sender', 'name picture');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name, picture, email',
    });

    // Latest message from the Chat model
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    next(createError(400, 'Message is not created!'));
  }
};

//========================================================
// get all chat messages
//========================================================
export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name picture email')
      .populate('chat');

      return res.status(200).json(messages)
  } catch (error) {
    console.log(error);
    next(createError(400, "Could not get all the chat messages!"))
  }
};
