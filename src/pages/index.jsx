import React from 'react';
import Head from 'next/head';
import { Box } from '@chakra-ui/core';
import { useMachine } from '@xstate/react';

import { duplicateArray, shuffleArray } from '../utils';
import { FlippableCard, WelcomeScreen, WonModal } from '../components';
import { flipCardGameMachine } from '../machines';

const HomePage = () => {
  const allImagesRef = React.useRef(shuffleArray(duplicateArray(images)));
  const timeoutRef = React.useRef(undefined);
  const [state, send] = useMachine(flipCardGameMachine, {
    devTools: true,
  });

  const handleFlip = React.useCallback(
    (flippingCardIndex) => {
      if (state.context.flippingCardIndexes.length === 2) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }

      send({ type: 'FLIP_CARD', index: flippingCardIndex });

      timeoutRef.current = setTimeout(() => {
        send({ type: 'CHECK_CARDS_CORRECT' });
      }, ANIMATION_TIMEOUT);
    },
    [send, state.context.flippingCardIndexes],
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
        <title>Flipping Cards game</title>
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
                <FlippableCard
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

        {state.value === 'standby' && <WelcomeScreen onStartButtonClick={handleStartGame} />}

        <WonModal isOpen={state.value === 'won'} onBackButtonClick={handleResetGame} />
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
