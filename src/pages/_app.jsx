import React from 'react';
import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';

const CardGameApp = ({ Component }) => {
  return (
    <ThemeProvider>
      <CSSReset />
      <ColorModeProvider value="dark">
        <Component />
      </ColorModeProvider>
    </ThemeProvider>
  );
};

export default CardGameApp;
