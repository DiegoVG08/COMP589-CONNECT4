import React, { useState } from "react";
import Navbar from './component/NavBar';
import Login from './pages/login';
import Home from './pages/userlogin';
import Leaderboard from "./pages/leaderboard";
import AccountPage from "./pages/Account";
import GameBoard from 'src/component/GameBoard';
import Connect4Board from "./component/newInterfaces/board";
import LobbyPage from "./component/newInterfaces/lobbyPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';





function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({}); // Define user state variable
  console.log(user);
  const [lobbyId, setLobbyId] = useState(null); 

  const updateUser = (newUser) => setUser(newUser);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };



  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} user={user}/>
      <Routes>
        <Route path='/Home' element={<Home />} />
        <Route path='/Register' element={<Login handleLogin={handleLogin} />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route
          path="/Game/:lobbyId"
          element={<Connect4Board lobbyId={lobbyId} />} // Pass lobbyId as prop
        />
        <Route path="/Game" element={<LobbyPage setLobbyId={setLobbyId} />} />
        <Route path='/Account' element={<AccountPage user={user} updateUser={updateUser} />} />
      </Routes>
    </Router>
  );
  
}

export default App;