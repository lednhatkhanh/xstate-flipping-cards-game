import React from 'react';
import Head from 'next/head';
import { Box, Button } from '@chakra-ui/core';

import { duplicateArray, shuffleArray } from '../utils';
import { FlipCard } from '../components';

const images = [
  'https://images.unsplash.com/photo-1443808709349-353c8b390400?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1558980664-1db506751c6c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
  'https://images.unsplash.com/photo-1520700008388-af1981de9835?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1511189622535-dc4e159cc877?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1478293888741-aee4356f71c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
];

const ANIMATION_TIMEOUT = 700;

const HomePage = () => {
  const allImagesRef = React.useRef(shuffleArray(duplicateArray(images)));
  const timeoutRef = React.useRef(undefined);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleFlip = React.useCallback(
    (flippingCardIndex) => {
      // still in the middle of the animation
      // just stop the timeout and flip the card open
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;

        dispatch({ type: 'FLIP_CARD', cardIndex: flippingCardIndex });
        return;
      }

      // This is the first played card
      // just flip it open
      if (state.flippingCardIndexes.length === 0) {
        dispatch({ type: 'FLIP_CARD', cardIndex: flippingCardIndex });
        return;
      }

      const flippedImage = allImagesRef.current[flippingCardIndex];
      const lastPlayedIndex = state.flippingCardIndexes[0];
      const lastPlayedImage = allImagesRef.current[lastPlayedIndex];

      if (flippedImage === lastPlayedImage) {
        dispatch({ type: 'ADD_CARDS_TO_CORRECT_POOL', cardIndexes: [flippingCardIndex, lastPlayedIndex] });
      } else {
        dispatch({ type: 'FLIP_CARD', cardIndex: flippingCardIndex });

        // then reset it
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'UNFLIP_BOTH_CARDS' });
        }, ANIMATION_TIMEOUT);
      }
    },
    [state.flippingCardIndexes],
  );

  const handleUnFlip = React.useCallback(
    (unflippingCardIndex) => {
      if (state.correctCardIndexes.includes(unflippingCardIndex)) {
        return;
      }

      dispatch({ type: 'UNFLIP_CARD', cardIndex: unflippingCardIndex });
    },
    [state.correctCardIndexes],
  );

  const handleStartGame = React.useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Lily+Script+One&display=swap" rel="stylesheet" />
      </Head>

      <Box as="main">
        {state.gameStarted && (
          <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" justifyContent="space-between" gridGap={10} p={10}>
            {allImagesRef.current.map((image, index) => (
              <FlipCard
                key={index}
                image={image}
                flipped={state.correctCardIndexes.includes(index) || state.flippingCardIndexes.includes(index)}
                timeout={ANIMATION_TIMEOUT}
                onFlip={() => handleFlip(index)}
                onUnFlip={() => handleUnFlip(index)}
              />
            ))}
          </Box>
        )}

        {!state.gameStarted && (
          <Box
            height="100vh"
            width="100vw"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleStartGame}
          >
            <Button variant="solid" variantColor="blue" size="lg">
              Start Game
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

const initialState = {
  gameStarted: false,
  correctCardIndexes: [],
  flippingCardIndexes: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...state,
        gameStarted: true,
        correctCardIndexes: [],
        flippingCardIndexes: [],
      };
    }
    case 'ADD_CARDS_TO_CORRECT_POOL': {
      return {
        ...state,
        correctCardIndexes: [...state.correctCardIndexes, ...action.cardIndexes],
        flippingCardIndexes: [],
      };
    }
    case 'FLIP_CARD': {
      return {
        ...state,
        flippingCardIndexes: [...state.flippingCardIndexes, action.cardIndex],
      };
    }
    case 'UNFLIP_CARD': {
      return {
        ...state,
        flippingCardIndexes: state.flippingCardIndexes.filter((index) => index !== action.cardIndex),
      };
    }
    case 'UNFLIP_BOTH_CARDS': {
      return {
        ...state,
        flippingCardIndexes: [],
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default HomePage;
