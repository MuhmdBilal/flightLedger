import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './components/Pages/Home';
import Marketplace from './components/Pages/Marketplace';
import Dashboard from './components/Pages/Dashboard';
import BookTrip from './components/Pages/BookTrip';
import MyData from './components/Pages/MyData';
import Footer from './components/Layout/Footer';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/book-trip" element={<BookTrip />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-data-vault" element={<MyData />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
