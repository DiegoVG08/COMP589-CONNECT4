import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/NavBar';
import Login from './pages/login';
import Home from './pages/userlogin';
import Leaderboard from "./pages/leaderboard";
import AccountPage from "./pages/Account";
import GameBoard from 'src/component/GameBoard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const handleLogin = (loggedInUser) => {
    setIsLoggedIn(true);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({});
  };

  return (
    <Router>

        <Navbar />
        <Routes>
          <Route path='/Home' element={<Home />} />
          <Route path='/Register' element={<Login />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/Game' element={<GameBoard />} />
          <Route path='/Account' element={<AccountPage />} />
        </Routes>
      
    </Router>
  );
}

export default App;