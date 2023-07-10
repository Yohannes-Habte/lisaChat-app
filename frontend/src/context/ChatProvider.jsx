import React, { createContext, useReducer, useState } from 'react';
import GetCookie from '../hooks/GetCookie';

// Create context
export const UserChatContext = createContext();
// Object
export const ACTION = {
  USER_LOGIN: 'USER_LOGIN',
  USER_SIGNOUT: 'USER_SIGNOUT',
};

// Initial state object
const inistialState = {
  user: GetCookie('userInfo') ? JSON.parse(GetCookie('userInfo')) : null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.USER_LOGIN:
      return { ...state, user: action.payload };
    case ACTION.USER_SIGNOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

const ChatProvider = ({ children }) => {
  // use Reducer
  const [state, dispatch] = useReducer(reducer, inistialState);
  // Global state variables
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  return (
    <UserChatContext.Provider
      value={{
        user: state.user,
        dispatch,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
      }}
    >
      {children}
    </UserChatContext.Provider>
  );
};

export default ChatProvider;
