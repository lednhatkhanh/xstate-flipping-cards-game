import React from 'react';
import { Modal, ModalOverlay, ModalFooter, ModalBody, ModalHeader, ModalContent, Button } from '@chakra-ui/core';

export const WonModal = ({ isOpen, onBackButtonClick }) => {
  return (
    <Modal isOpen={isOpen}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>You won</ModalHeader>

        <ModalBody>Do you want to go back?</ModalBody>

        <ModalFooter>
          <Button variantColor="blue" mr={3} onClick={onBackButtonClick}>
            Go back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
