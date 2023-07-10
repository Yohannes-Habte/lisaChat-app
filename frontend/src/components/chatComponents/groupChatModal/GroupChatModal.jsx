import { Box, Button, FormControl, Input, Modal } from '@chakra-ui/react';
import { ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { ModalContent, ModalFooter, ModalHeader } from '@chakra-ui/react';
import { ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import UserListItem from '../userListItem/UserListItem';
import UserBadgeItem from '../userBadgeItem/UserBadgeItem';
import { UserChatContext } from '../../../context/ChatProvider';

const GroupChatModal = ({ children }) => {
  // Global state variables
  const { user, chats, setChats } = useContext(UserChatContext);
  // Chakra Modal state variable
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Local state variables
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create useToast
  const toast = useToast();

  // ===============================================
  // Handle search for users
  // ===============================================
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

  // ===============================================
  // Add user/users to a group
  // ===============================================
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added to the group!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // ===============================================
  // Deleting/Remove a user from a group chat
  // ===============================================
  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id === userToDelete._id)
    );
  };

  // ==================================================
  // Creating group chat with the members of the group
  // ==================================================
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: `Please fill all the fields!`,
        status: 'worning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }

    try {
      setLoading(true);
      
      const newChatGroup = {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((user) => user._id)),
      };

      const settings = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_URL + `/api/chats/createGroup`,
        newChatGroup,
        settings
      );
      setLoading(false);
      setChats([data, ...chats]); // The reason data is place before chats is to show data on the top of chats.
      onClose();

      toast({
        title: 'New group chat successfuly created!!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'botton',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Fial to create group chat!',
        description: error.response.data,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'botton',
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}> {children} </span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='35px' d="flex" justifyContent={'center'}>
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* Render selected users in the group chat list  */}
            <Box width={'100%'} d="flex" flexWrap={'wrap'}>
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {/* Render searched users that display 10 users */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResults
                ?.slice(0, 10) // Question mark (?) is optional chaining
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button color="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
