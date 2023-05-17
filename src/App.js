import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/NavBar';
import Login from './pages/login';
import Home from './pages/userlogin';
import Leaderboard from "./pages/leaderboard";
import AccountPage from "./pages/Account";
import Game from "./component/new/src/components/Game";
import GameBoard from 'src/component/GameBoard';
import { AuthContext } from './component/authContext';  // Import the AuthContextProvider
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
      <AuthContext isLoggedIn={isLoggedIn} user={user} handleLogin={handleLogin} handleLogout={handleLogout}>
        <Navbar />
        <Routes>
          <Route path='/Home' element={<Home />} />
          <Route path='/Register' element={<Login />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/Game' element={<GameBoard />} />
          <Route path='/Account' element={<AccountPage />} />
        </Routes>
      </AuthContext>
    </Router>
  );
}

export default App;
