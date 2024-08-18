// src/components/Footer.jsx
import React from 'react';
import { Box, Flex, Link, Text, IconButton } from '@chakra-ui/react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
        id="footer"

      as="footer"
      bg="teal.500"
      color="white"
      p={4}
      position="relative"
      bottom="0"
      width="100%"
    >
      <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" wrap="wrap">
        <Box textAlign={{ base: 'center', md: 'left' }}>
          <Text fontSize="sm">© {new Date().getFullYear()} ShareBite. All rights reserved.</Text>
          <Text fontSize="sm">1234 Street Name, City, Country</Text>
        </Box>

        <Flex mt={{ base: 4, md: 0 }} align="center">
          <Link href="https://facebook.com" isExternal>
            <IconButton
              icon={<FaFacebookF />}
              aria-label="Facebook"
              variant="outline"
              colorScheme="teal"
              mx={1}
            />
          </Link>
          <Link href="https://twitter.com" isExternal>
            <IconButton
              icon={<FaTwitter />}
              aria-label="Twitter"
              variant="outline"
              colorScheme="teal"
              mx={1}
            />
          </Link>
          <Link href="https://instagram.com" isExternal>
            <IconButton
              icon={<FaInstagram />}
              aria-label="Instagram"
              variant="outline"
              colorScheme="teal"
              mx={1}
            />
          </Link>
          <Link href="https://linkedin.com" isExternal>
            <IconButton
              icon={<FaLinkedinIn />}
              aria-label="LinkedIn"
              variant="outline"
              colorScheme="teal"
              mx={1}
            />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
