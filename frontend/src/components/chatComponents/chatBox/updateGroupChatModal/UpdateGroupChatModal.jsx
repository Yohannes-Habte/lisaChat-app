import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import UserBadgeItem from '../../userBadgeItem/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../../userListItem/UserListItem';
import { UserChatContext } from '../../../../context/ChatProvider';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  // Global state variables
  const { user, selectedChat, setSelectedChat } = useContext(UserChatContext);
  // chakra modal state variables
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Local state variables
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renamLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  // To add user
  const handleAdduser = async (user1) => {
    if (selectedChat.users.find((user) => user._id === user1._id)) {
      toast({
        title: 'Error occured!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admins can add someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      return;
    }

    try {
      setLoading(true);
      const settings = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER_URL + `/api/chats/addToGroup`,
        {
          chatId: selectedChat._id,
          user: user1._id,
        },
        settings
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

  // To remove a user
  const handleRemove = async (user1) => {
    if (user._id !== user1._id && selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only admin can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }

    try {
      setLoading(true);
      const settings = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER_URL + `/api/chats/removeFrom`,
        {
          chatId: selectedChat._id,
          user: user1._id,
        },
        settings
      );

      // The user left the group should not be able to see the new message sent after leaving the group chat
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
    }
  };

  // To rename a group
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);

      const settings = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        process.env.REACT_APP_SERVER_URL + `/api/chats/renameGroup`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        settings
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setRenameLoading(false);
    }
    setGroupChatName('');
  };

  // Search user
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const settings = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        process.env.REACT_APP_SERVER_URL + `/api/users?search=${search}`,
        settings
      );
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      console.log(error);

      toast({
        title: 'Error occured!',
        description: 'Failed to load the searched users',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> {selectedChat.chatName} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>

            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={'solid'}
                ml={1}
                isLoading={renamLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={'lg'} />
            ) : (
              searchResults?.map(
                (user = (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAdduser(user)}
                  />
                ))
              )
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)}>Leave Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
