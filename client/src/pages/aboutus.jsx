import React from 'react';
import { Box, Heading, Text, VStack, Image, Divider } from '@chakra-ui/react';
import volunteeringImage from './volunteering.png';  // Corrected path

const AboutUs = () => {
  return (
    <Box p={8} bg="gray.100" minH="100vh">
      <VStack spacing={8} align="start" maxW="800px" mx="auto">
        <Heading as="h1" size="2xl" textAlign="center" mb={4}>
          About Us
        </Heading>
        <Text fontSize="lg" color="gray.700">
          Welcome to ShareBite, where we believe that everyone deserves access to basic life necessities. Our mission is to make food and water easily accessible to all by connecting communities with resources that often go unnoticed.
        </Text>
        <Divider />
        <Box textAlign="center">
          <Image 
            borderRadius="md" 
            src={volunteeringImage} 
            alt="Volunteering" 
            boxSize="800px 400px"  // Set the size of the image
            objectFit="cover"     // Ensure the image covers the area
            mx="auto"             // Center the image horizontally
          />
          <Text fontSize="lg" color="gray.600" mt={4}>
            Our team is dedicated to bridging the gap between surplus resources and those in need. We strive to foster a community where everyone can contribute to and benefit from the sharing of essential resources. Together, we can make a difference in people's lives.
          </Text>
        </Box>
        <Divider />
        <Text fontSize="lg" color="gray.700">
          Join us in our mission to bring accessibility and support to every corner of our community. At ShareBite, we are committed to ensuring that no one is left behind and that everyone has the opportunity to thrive.
        </Text>
      </VStack>
    </Box>
  );
};

export default AboutUs;
