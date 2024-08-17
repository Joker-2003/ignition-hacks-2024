
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Map from './components/Map';
import { createGlobalState } from "react-hooks-global-state";



function App() {
  const initialState = { user: null };

  createGlobalState(initialState);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Map />} />

      </Routes>
    </div>
  );
}

export default App;
