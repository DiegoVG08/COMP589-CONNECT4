//import { Leaderboard } from "@mui/icons-material";
import React from "react";
import Navbar from './component/NavBar';
import Login from './pages/login';
import Home from './pages/userlogin';
import  Leaderboard  from "./pages/leaderboard";
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';

//you put the clases here and it will display on the website 
function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
    <Route path='/Home'  element={<Home />} />
    <Route path='/Account' element={<Login/>} />
    <Route path='/leaderboard' element={<Leaderboard/>} />
    </Routes>
    </Router>
  );
}

export default App;
