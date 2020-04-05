/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { Box, Image } from '@chakra-ui/core';

export const FlippableCard = ({ image, flipped = false, onFlip, onUnflip, timeout = 500 }) => {
  const handleCardClick = React.useCallback(() => {
    const newFlippedState = !flipped;

    if (newFlippedState) {
      onFlip();
    } else {
      onUnflip();
    }
  }, [flipped, onFlip, onUnflip]);

  return (
    <Box
      w="80%"
      h="80%"
      css={css`
        perspective: 500px;
      `}
      onClick={handleCardClick}
    >
      <Box
        position="relative"
        className="card-inner"
        w="100%"
        h="100%"
        cursor="pointer"
        transition={`transform ${timeout}ms`}
        boxShadow="lg"
        transform={flipped ? 'rotateY(180deg)' : undefined}
        css={css`
          transform-style: preserve-3d;
        `}
      >
        <Box
          position="absolute"
          w="100%"
          h="100%"
          bg="blue.500"
          color="white"
          fontFamily="Lily Script One"
          textAlign="center"
          fontSize={40}
          borderRadius={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          css={css`
            backface-visibility: hidden;
          `}
        >
          Card
        </Box>

        <Image
          position="absolute"
          borderRadius={4}
          w="100%"
          h="100%"
          objectFit="cover"
          src={image}
          transform="rotateY(180deg)"
          css={css`
            backface-visibility: hidden;
          `}
        />
      </Box>
    </Box>
  );
};
