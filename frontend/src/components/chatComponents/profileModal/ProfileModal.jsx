import React from 'react';
import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Image, Modal, Text } from '@chakra-ui/react';
import { ModalBody, ModalCloseButton, ModalContent } from '@chakra-ui/react';
import { ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import './ProfileModal.scss';

// Children is used here in order to supply the profile model into many parts of this project
const ProfileModal = ({ user, children }) => {

  // Chakra Modal state variables
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <React.Fragment>
      {children ? (
        <span onClick={onOpen}> {children} </span>
      ) : (
        <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal isOpen={isOpen} onClose={onClose} className="modal">
        <ModalOverlay />
        <ModalContent h={"410px"}>
          <ModalHeader d="flex" justifyContent={'center'} fontSize={'40px'}>
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="250px"
              src={user.picture}
              alt={user.name}
            />
            <Text
              fontSize={{ base: '28px', md: '30px' }}
              fontFamily="Work sans"
            >
              Email: {user.email}
              
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default ProfileModal;
