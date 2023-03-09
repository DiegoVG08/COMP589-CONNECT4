import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import GameBoard from './components/GameBoard';
import Leaderboard from './components/pages/Leaderboard';

const App: React.FunctionComponent = (): JSX.Element => {
  return (
    <Router>
      <NavBar title="Connect 4" />
      <Routes>
        <Route path="/" element={<GameBoard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;
