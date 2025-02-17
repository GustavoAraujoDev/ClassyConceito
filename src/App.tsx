// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import ProductDetailsPage from "../src/pages/ProductDetailsPage";
import "../src/styles.css";
import Carrinho from "../src/pages/Cart";
import infoPhone from "../src/pages/infoPhone";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/product/:id" Component={ProductDetailsPage} />
        <Route path="/Carrinho" Component={Carrinho} />
        <Route path="/infoPhone" Component={infoPhone} />
      </Routes>
    </Router>
  );
};

export default App;
