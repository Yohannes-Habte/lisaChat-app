import React, { useContext } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../getSenderInfo/GetSenderInfo';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { UserChatContext } from '../../../../context/ChatProvider';

const ScrolableChat = ({ messages }) => {
  // Global state variable
  const { user } = useContext(UserChatContext);
  return (
    <ScrollableFeed>
      {messages.map((chatMessage, index) => (
        <div key={index} className="scrollable-message">
          {isSameSender(messages, chatMessage, index, user._id) ||
            (isLastMessage(messages, index, user._id) && (
              <Tooltip
                label={chatMessage.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt={'7px'}
                  mr={1}
                  size={'ms'}
                  cursor={'pointer'}
                  name={chatMessage.sender.name}
                  src={chatMessage.sender.picture}
                />
              </Tooltip>
            ))}

          {/* differentiate sender  */}
          <span
            style={{
              backgroundColor: `${
                chatMessage.sender._id === user._id ? '#BEE3F8' : '#89F5D0'
              }`,
              borderRadius: '20px',
              padding: '5px 15px',
              maxWidth: '75%',
              marginLeft: isSameSenderMargin(
                messages,
                chatMessage,
                index,
                user._id
              ),
              marginTop: isSameUser(messages, chatMessage, index, user._id)
                ? 3
                : 10,
            }}
          >
            {chatMessage.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrolableChat;
