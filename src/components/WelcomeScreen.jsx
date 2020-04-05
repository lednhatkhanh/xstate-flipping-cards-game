import React from 'react';
import { Box, Text, Button } from '@chakra-ui/core';

export const WelcomeScreen = ({ onStartButtonClick }) => {
  return (
    <Box height="100vh" width="100vw" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Text as="h1" fontSize="3xl" fontFamily="Lily Script One">
        Flipping Cards
      </Text>

      <Box w="100%" h={10} />

      <Button variant="solid" variantColor="blue" size="lg" display="block" onClick={onStartButtonClick}>
        Start Game
      </Button>
    </Box>
  );
};
