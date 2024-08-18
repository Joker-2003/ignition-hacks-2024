
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Map from './components/Map';
import { createGlobalState } from "react-hooks-global-state";
import RestaurantSignUp from './components/RestaurantSignUp';
import Navbar from './components/navbar';
import Home from './pages/home';
import Footer from './components/footer';
import Layout from './components/layout';
import AboutUs from './pages/aboutus';

const initialState = { user: null };
export const { useGlobalState } = createGlobalState(initialState);

function App() {
 


  return (
    <div className="App">
      <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/map" element={<Map />} />
        <Route path ="/add-restaurant" element={<RestaurantSignUp />} />
      </Routes>
      </Layout>
    </div>
  );
}

export default App;
