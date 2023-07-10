import { Box, Stack } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../chatLoading/ChatLoading';
import GroupChatModal from '../groupChatModal/GroupChatModal';
import { useContext } from 'react';
import { UserChatContext } from '../../../context/ChatProvider';
import GetCookie from '../../../hooks/GetCookie';

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats, dispatch } =
    useContext(UserChatContext);
  // Local State variables for the chat
  const [loggeduser, setLoggedUser] = useState();

  const toast = useToast();

  // ===============================================
  // Fetch chats
  // ===============================================
  const fetchChats = async () => {
    try {
      const settings = {
        headers: {
          'Content-Type': 'application/json',
          cookies: user.token,
        },
      };

      const { data } = await axios.get(
        process.env.REACT_APP_SERVER_URL + `/api/chats`,
        settings
      );
      console.log('The chats are:', data);
      setChats(data);
    } catch (error) {
      console.log(error);

      toast({
        title: 'Error occured!',
        description: 'Failed to load the chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  // ===============================================
  // Display fetchChat in the frontend
  // ===============================================
  useEffect(() => {
    setLoggedUser(JSON.parse(GetCookie('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  // ===============================================
  // Get sender function
  // ===============================================
  const getSender = (loggeduser, users) => {
    return users[0]._id === loggeduser._id ? users[1].name : users[0].name;
  };

  return (
    <Box
      d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir={'column'}
      alignItems={'center'}
      p={3}
      bg={'white'}
      width={{ base: '100%', md: '31%' }}
      borderRadius={'lg'}
      borderWidth={'1px'}
      className="myChat-container "
    >
      <Box
        pb={3}
        px={1}
        fontSize={{ base: '28px', md: '30px' }}
        d="flex"
        w={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
        className="myChat-newGroup"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        d="flex"
        flexDir={'column'}
        p={3}
        bg={'#F8F8F8'}
        w={'100%'}
        h={'89%'}
        borderRadius={'lg'}
        overflow={'hidden'}
      >
        {chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => (
              <Box
                onClick={setSelectedChat(chat)}
                cursor={'pointer'}
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius={'lg'}
                key={chat._id}
              >
                {!chat.isGroupChat
                  ? getSender(loggeduser, chat.users)
                  : chat.chatName}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
