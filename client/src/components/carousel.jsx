import React from 'react';
import Slider from 'react-slick';
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import leftover from '../pages/leftover.jpeg';
import packages from '../pages/packages.jpg';
import volunteers from '../pages/volunteering.png';

// Sample images for the carousel
const carouselItems = [
  {
    id: 1,
    src: leftover,
    alt: 'Slide 1',
  },
  {
    id: 2,
    src: packages,
    alt: 'Slide 2',
  },
  {
    id: 3,
    src: volunteers,
    alt: 'Slide 3',
  },
];

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Adjust speed as needed
  };

  return (
    <Box position="relative" width="100%" height="100vh">
      <Slider {...settings}>
        {carouselItems.map(item => (
          <Box key={item.id} position="relative">
            <img
              src={item.src}
              alt={item.alt}
              style={{
                width: '100%',
                height: '600px',
                objectFit: 'cover',  // Ensure the image covers the area
                opacity: 0.5,        // Reduce opacity
                transition: 'opacity 0.5s ease-in-out'  // Smooth transition for opacity
              }}
            />
          </Box>
        ))}
      </Slider>
      <Flex
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        color="white"
        textAlign="center"
        p={4}
      >
        <Text fontSize="4xl" fontWeight="bold">
          ShareBite
        </Text>
        <Text fontSize="xl" mt={4}>
          Nourishing Communities One Meal at a Time
        </Text>
        <Button
          mt={6} // Margin top to separate the button from the text
          colorScheme="teal"
          size="lg"
          onClick={() => window.location.href = '/map'} // Replace with your desired action
        >
          Find Food Near You
        </Button>
      </Flex>
    </Box>
  );
};

export default Carousel;
