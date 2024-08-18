// src/components/Navbar.jsx
import React from 'react';
import { Box, Flex, Link, Button, Spacer } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <Box bg="teal.500" color="white" p={4} position="sticky" top="0" zIndex="1000">
      <Flex align="center">
        <Box fontWeight="bold" fontSize="xl">
          ShareBite
        </Box>
        <Spacer />
        <Link href="/" px={4} color="white" _hover={{ textDecoration: 'underline' }}>
          Home
        </Link>
        <Link href="/about" px={4} color="white" _hover={{ textDecoration: 'underline' }}>
          About Us
        </Link>
        <Link href="#footer" px={4} color="white" _hover={{ textDecoration: 'underline' }}>
          Contact Us
        </Link>
        <Link href="/donate" px={4} color="white" _hover={{ textDecoration: 'underline' }}>
          Donate
        </Link>
        <Button as="a" href="/restaurant-signup" ml={4} colorScheme="teal" variant="outline">
          Restaurant? Sign Up
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar;
