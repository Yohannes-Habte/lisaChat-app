import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';
import SingleChat from './singleChat/SingleChat';
import { UserChatContext } from '../../../context/ChatProvider';

const ChatBox = ( {fetchAgain,  setFetchAgain} ) => {
  // Global state variables
  const {selectedChat} = useContext(UserChatContext)
  
  return (
    <Box
    d={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
    alignItems={'center'}
    flexDir={'column'}
    p={3}
    bg={"white"}
    w={{base: "100%", md: "68%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;