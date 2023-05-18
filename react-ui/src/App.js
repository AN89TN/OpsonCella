import React/* , { useEffect, useCallback } */ from 'react';
import { BrowserRouter, Routes, Route/* , Link */ } from "react-router-dom";
import Home from "./pages/Home";
import Content from "./pages/Content";
import Footer from "./pages/Footer";
import CellaPL from "./pages/CellaPL";
import Listalotti from "./pages/Listalotti";
import Fuoricella from "./pages/Fuoricella";
import './App.css';

// Import Parse minified version
import Parse from 'parse/dist/parse.min.js';


function App() {

// Your Parse initialization configuration goes here
const PARSE_APPLICATION_ID = 'E2fTcnwVQ6Ow85Q7dWsRVAMsyO4dzZNGt5UEgVw3';
const PARSE_HOST_URL = 'https://parseapi.back4app.com/';
const PARSE_JAVASCRIPT_KEY = 'ClT0x6wydTTOMI67BE2eECOg09vlaL6Z7dNRlQBF';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;


  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
          <Route path="/content" element={<Content />} />
            <Route path="/cellaPL" element={<CellaPL />} />
              <Route path="/Listalotti" element={<Listalotti />} />
                <Route path="/Fuoricella" element={<Fuoricella />} />
      </Routes>
        <Footer />
    </BrowserRouter>
    </div>
  );
}

export default App;
