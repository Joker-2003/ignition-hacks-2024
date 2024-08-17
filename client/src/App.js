
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Map from './components/Map';
import { createGlobalState } from "react-hooks-global-state";
import RestaurantSignUp from './components/RestaurantSignUp';

const initialState = { user: null };
export const { useGlobalState } = createGlobalState(initialState);

function App() {
 


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path ="/add-restaurant" element={<RestaurantSignUp />} />
      </Routes>
    </div>
  );
}

export default App;
