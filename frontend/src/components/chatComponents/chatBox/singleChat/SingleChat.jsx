import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import UpdateGroupChatModal from '../updateGroupChatModal/UpdateGroupChatModal';
import ProfileModal from '../../profileModal/ProfileModal';
import { getSender, getSenderInfo } from '../getSenderInfo/GetSenderInfo';
import axios from 'axios';
import "./SingleChat.scss"
import ScrolableChat from '../scrolableChat/ScrolableChat';
import { UserChatContext } from '../../../../context/ChatProvider';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  // Global state variables
  const { user, selectedChat, setSelectedChat } = useContext(UserChatContext);

  // local state variables for all backend messages
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // chakra toast
  const toast = useToast();

  // Fetch all messages in the frontend
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      // Configration
      const settings = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        process.env.REACT_APP_SERVER_URL +
          `/api/messages/${selectedChat._id}`,
        settings
      );

      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error occured!',
        description: 'Failed to load the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // Send message when you press enter key
  const sendMessage = async (e) => {
    if (e.key === 'Enter' && message) {
      try {
        // New message
        const newMessage = {
          content: message,
          chatId: selectedChat._id,
        };
        // Configration
        const settings = {
          headers: {
            'Application-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        setMessage('');

        const { data } = await axios.post(
          process.env.REACT_APP_SERVER_URL + `/api/messages`,
          newMessage,
          settings
        );

        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error occured!',
          description: 'Failed to send the message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom-left',
        });
      }
    }
  };

  // Updating texting message
  const typingHandler = (e) => {
    setMessage(e.target.value);

    // Typing indicator logic
  };

  return (
    <React.Fragment>
      {selectedChat ? (
        <React.Fragment>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w={'100%'}
            d="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems={'center'}
          >
            <IconButton
              d={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
           {/* If the chat is a group chat, you need to do ... Otherwise, you need to do ... */}
            {!selectedChat.isGroupChat ? (
              <React.Fragment>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderInfo(user, selectedChat.users)} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
              </React.Fragment>
            )}
          </Text>

          <Box
            d="flex"
            flexDir={'column'}
            justifyContent={'flex-end'}
            p={3}
            bg={'#E8E8E8'}
            w={'100%'}
            h={'100%'}
            borderRadius={'lg'}
            overflowY={'hidden'}
          >
            {/* Message here */}
            {loading ? (
              <Spinner
                size={'xl'}
                w={20}
                h={20}
                alignSelf={'center'}
                margin={'auto'}
              />
            ) : (
              <div className='messages'> <ScrolableChat messages={messages} /> </div>
            )}

            {/* Inpute for writting text message */}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={'filled'}
                bg={'#E0E0E0'}
                placeholder="Emter a message ..."
                onChange={typingHandler}
                value={message}
              />
            </FormControl>
          </Box>
        </React.Fragment>
      ) : (
        <Box
          d="flex"
          alignItems={'center'}
          justifyContent={'center'}
          h={'100%'}
        >
          <Text fontSize={'3xl'} pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </React.Fragment>
  );
};

export default SingleChat;
