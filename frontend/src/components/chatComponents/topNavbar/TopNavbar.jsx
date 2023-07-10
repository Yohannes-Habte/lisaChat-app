import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../profileModal/ProfileModal';
import './TopNavbar.scss';
import axios from 'axios';
import ChatLoading from '../chatLoading/ChatLoading';
import UserListItem from '../userListItem/UserListItem';
import { ACTION, UserChatContext } from '../../../context/ChatProvider';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import RemoveCookie from '../../../hooks/RemoveCookie';

const TopNavbar = () => {
  const { user, setSelectedChat, chats, setChats, dispatch } =
    useContext(UserChatContext);
  const navigate = useNavigate();
  const toast = useToast();
  // State variables for the side drawer
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // State variables for the users' chat
  const [loadingChat, setLoadingChat] = useState(false);

  //==========================================================================================================
  // Drawer state variable form Chakra
  //==========================================================================================================
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  //==========================================================================================================
  // Access chat function for users
  //==========================================================================================================
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const settings = {
        headers: {
          'Content-Type': 'application/json',
          cookies: user.token,
        },
      };

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_URL + `/api/chats`,
        userId,
        settings
      );

      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onclose(); // to close the side drawer after you click
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error fetching the chat!',
        description: error.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  //==========================================================================================================
  // Search handler function
  //==========================================================================================================

  const searchHandle = async () => {
    if (!search) {
      toast({
        title: 'Please enter what you want to search!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);

      const settings = {
        headers: {
          'Content-Type': 'application/json',
          cookies: user.token,
        },
      };

      const { data } = await axios.get(
        process.env.REACT_APP_SERVER_URL + `/api/users?search=${search}`,
        settings
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error occured!',
        description: 'Failed to load the search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  //==========================================================================================================
  // Logout function
  //==========================================================================================================
  const signOut = () => {
    dispatch({ type: ACTION.USER_SIGNOUT });
    // localStorage.removeItem('userInfo');
    RemoveCookie('userInfo');
    navigate('/');
  };

  return (
    <section className="chat-header">
      {/* Top navbar contents */}
      <article className="search-users">
        <button onClick={onOpen}>
          <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
        </button>
        <h4>Search User</h4>
      </article>

      <h4 className="logo">LisaChatApp</h4>

      <div className="menu-container">
        <Menu>
          <MenuButton>
            <BellIcon />
          </MenuButton>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon className="icon" />}
          >
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.picture}
            />
          </MenuButton>

          <MenuList className="Menu">
            {/* Wrap with ProfileModal */}
            <ProfileModal user={user}>
              {/* this is children in the ProfileModel */}
              <MenuItem> My Profile </MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={signOut}> Logout </MenuItem>
          </MenuList>
        </Menu>
      </div>

      {/* ===================== Drower component when you click on Search User =============================================== */}

      {/* // Left side of the Top Navbar */}

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={'1px'}> Search Users </DrawerHeader>

          {/* Input for the drower */}
          <DrawerBody>
            <Box className="Box">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button onClick={searchHandle}>Search</Button>
            </Box>

            {/* Show here the search results */}
            {loading ? (
              // Loading display the skeleton from the ChatLoading component
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user.name}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default TopNavbar;
