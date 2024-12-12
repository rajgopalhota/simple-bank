import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Transaction from './pages/Transaction';
import History from './pages/History';
import "./index.css";

const App = () => (
  <AuthProvider>
    <div className="gradient"></div>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
