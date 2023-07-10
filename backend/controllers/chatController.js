import User from '../model/userModel.js';
import Chat from '../model/chatModel.js';
import createError from 'http-errors';

//=================================================================================================
// Allows to create & fetch one on one chat
//=================================================================================================
export const conductChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return next(createError(400, 'User not found!'));
    }

    /*
      To conduct chat, in the "Chat.find() two condistions must be met
        1. If the chat is one to one, then the isGroupChat must be false.
        2. the logged in user id and the userId must be the same
    If the chat exists, populate the "users" array in the database except the password. In addition, populate the "latestMessage"
    */
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    /*
    Populate the sender message from the Message model, 
      1. the path will be 'latestMessage.sender'
      2. the items that you will populate are name, email and picture
    */
    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name, email, picture',
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]); // It is one to one chat
    } else {
      // create chat
      let chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      // Store the chats in the database
      try {
        const createdChat = await Chat.create(chatData);

        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          'users',
          '-password'
        );

        res.status(200).send(fullChat);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
    next(createError(400, 'No chat access is permisible!'));
  }
};

//===================================================================================================
//Get all Chats for a single user
//===================================================================================================
export const getAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updateAt: -1 }); // Sort from new to old using the "updateAt"

    return res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    next(createError(400, 'No chat messages avaialble!')); 
  }
};

//=================================================================================================
// Create a chat group
//=================================================================================================
export const createGroupChat = async (req, res, next) => {
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send({ message: 'Please fill all the fields!' });
  }
  // the users array of JSON.stringify(users) form the frontend will be converted to JSON.parse(users) in the backend
  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send('At least two users are required to fomr a group chat!');
  }

  //The current user who is logged in. The current logged in user has to be part of the new group members
  users.push(req.user);

  try {
    const newGroupChat = await Chat.create({
      chatName: req.body.chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user, // The one who create the group will be the admin automatically
    });

    // Fetch the group chat from the database
    const groupChat = await Chat.findOne({ _id: newGroupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(groupChat);
  } catch (error) {
    console.log(error);
    next(createError(400, 'Cannot create group chat!'));
  }
};

//==================================================================================================                 
// Rename a chat group
//==================================================================================================
export const renameroupChat = async (req, res, next) => {
  // find the chat id and chatName that you want to rename
  const { chatId, chatName } = req.body;
  try {
    //Find the chat Id that you want to rename it
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true, runValidators: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!updatedChat) {
      res.status(400);
      throw new Error('Chat Group not found');
    } else {
      return res.status(200).json(updatedChat);
    }
  } catch (error) {
    console.log(error);
  }
};

//======================================================================================
// Add to a group chat
//======================================================================================
export const addToGroupChat = async (req, res, next) => {
  // First find the userId and ChatId
  const { userId, groupId } = req.body;
  try {
    const addUser = await Chat.findByIdAndUpdate(
      groupId,
      { $push: { users: userId } },
      { new: true, runValidators: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!addUser) {
      res.status(400);
      throw new Error('User does not exist');
    } else {
      return res.status(200).json(addUser);
    }
  } catch (error) {
    console.log(error);
  }
};

//=============================================================================================
// Leave a chat group either by someone or oneself
//=============================================================================================
export const leaveGroupChat = async (req, res, next) => {
  const { userId, groupId } = req.body;
  try {
    const removeUser = await Chat.findByIdAndUpdate(
      groupId,
      { $pull: { users: userId } },
      { new: true, runValidators: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!removeUser) {
      res.status(400);
      throw new Error('User does not exist');
    } else {
      return res.status(200).json(removeUser);
    }
  } catch (error) {
    console.log(error);
  }
};
