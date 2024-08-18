// src/pages/Home.jsx
import React from 'react';
import Carousel from '../components/carousel';
import { Container } from '@chakra-ui/react';
import Layout from '../components/layout';
import Map from '../components/Map';

const Home = () => {
  return (
 
    <Container maxW="container.xl" p={4}>
      <Carousel />
    </Container>

  );
};

export default Home;
