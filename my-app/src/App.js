import './App.css';
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import ListProperty from './components/ListProperty';
import BuyProperty from './components/BuyProperty';
import ChangePrice from './components/ChangePrice';
import Auction from './components/Auction';
import Bid from './components/Bidding';
import BuyPage from './pages/BuyPage';
import SellPage from './pages/SellPage';
import LoginPage from './pages/LoginPage';
import PropertiesList from './components/PropertyList';


function App() {
  useEffect(() => {
    document.title = "Easy Property Deals";
  });
  return (
    <>
    <div className="App">
    <head>
      <title>Easy Property Deals</title>
    </head>
        <BrowserRouter>
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/properties' element={<PropertiesList />} />
            <Route path='/listproperty' element={<ListProperty />} />
            <Route path='/buyproperty' element={<BuyProperty />} />
            <Route path='/changePrice' element={<ChangePrice />} />
            <Route path='/auction' element={<Auction />} />
            <Route path='/bid' element={<Bid />} />
            <Route path='/buy' element={<BuyPage />} />
            <Route path='/sell' element={<SellPage />} />
            <Route path='/login' element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </div></>
  );
}

export default App;
