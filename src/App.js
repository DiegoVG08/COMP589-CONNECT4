import React, { useState } from "react";
import Navbar from './component/NavBar';
import Login from './pages/login';
import Home from './pages/userlogin';
import Leaderboard from "./pages/leaderboard";
import Game from './pages/Game';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route path='/Home' element={<Home />} />
        <Route path='/Account' element={<Login handleLogin={handleLogin} />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/game' element={isLoggedIn ? <Game /> : <Navigate to='/Game' />} />
      </Routes>
    </Router>
  );
}

export default App;
