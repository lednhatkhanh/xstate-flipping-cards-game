import React from 'react';
import Head from 'next/head';
import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/core';
import { useMachine } from '@xstate/react';

import { duplicateArray, shuffleArray } from '../utils';
import { FlipCard } from '../components';
import { flipCardGameMachine } from '../machines';

const HomePage = () => {
  const allImagesRef = React.useRef(shuffleArray(duplicateArray(images)));
  const timeoutRef = React.useRef(undefined);
  const [state, send] = useMachine(flipCardGameMachine, {
    devTools: true,
  });

  const handleFlip = React.useCallback(
    (flippingCardIndex) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }

      send({ type: 'FLIP_CARD', index: flippingCardIndex });

      timeoutRef.current = setTimeout(() => {
        send({ type: 'CHECK_CARDS_CORRECT' });
      }, ANIMATION_TIMEOUT);
    },
    [send],
  );

  const handleUnflip = React.useCallback(
    (unflippingCardIndex) => {
      send('UNFLIP_CARD', { index: unflippingCardIndex });
    },
    [send],
  );

  const handleStartGame = React.useCallback(() => {
    send('START_GAME', { allCards: allImagesRef.current });
  }, [send]);

  const handleResetGame = React.useCallback(() => {
    send('RESET_GAME');
  }, [send]);

  return (
    <>
      <Head>
        <title>Flip cards game</title>
        <link href="https://fonts.googleapis.com/css2?family=Lily+Script+One&display=swap" rel="stylesheet" />
      </Head>

      <Box as="main">
        {state.value === 'playing' && (
          <Box
            height="100vh"
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gridTemplateRows="repeat(3, 1fr)"
            alignItems="center"
            alignContent="center"
            gridGap={8}
            p={10}
          >
            {allImagesRef.current.map((image, index) => (
              <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" key={index}>
                <FlipCard
                  image={image}
                  flipped={
                    state.context.correctCardIndexes.includes(index) ||
                    state.context.flippingCardIndexes.includes(index)
                  }
                  timeout={ANIMATION_TIMEOUT}
                  onFlip={() => handleFlip(index)}
                  onUnflip={() => handleUnflip(index)}
                />
              </Box>
            ))}
          </Box>
        )}

        {state.value === 'standby' && (
          <Box height="100vh" width="100vw" display="flex" alignItems="center" justifyContent="center">
            <Button variant="solid" variantColor="blue" size="lg" onClick={handleStartGame}>
              Start Game
            </Button>
          </Box>
        )}

        <Modal isOpen={state.value === 'won'}>
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>You won</ModalHeader>

            <ModalBody>Do you want to go back?</ModalBody>

            <ModalFooter>
              <Button variantColor="blue" mr={3} onClick={handleResetGame}>
                Go back
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

const images = [
  'https://images.unsplash.com/photo-1443808709349-353c8b390400?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1558980664-1db506751c6c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
  'https://images.unsplash.com/photo-1520700008388-af1981de9835?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1511189622535-dc4e159cc877?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1478293888741-aee4356f71c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
];

const ANIMATION_TIMEOUT = 600;

export default HomePage;
