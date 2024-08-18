// src/components/Layout.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './navbar';
import Footer from './footer';

const Layout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box flex="1">{children}</Box> {/* Content will expand to fill available space */}
      <Footer />
    </Box>
  );
};

export default Layout;
