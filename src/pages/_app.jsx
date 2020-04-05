import React from 'react';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';

const CardGameApp = ({ Component }) => {
  return (
    <ThemeProvider>
      <CSSReset />
      <Component />
    </ThemeProvider>
  );
};

export default CardGameApp;
