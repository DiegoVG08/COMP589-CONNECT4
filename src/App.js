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
import { useDispatch, useSelector, Provider } from 'react-redux';
import { logIn, logOut, setUser, clearUser } from './reducers/actions';
import store from './store';
import { auth, db } from './component/Firebase';


function App() {
  const [lobbyId, setLobbyId] = useState(null); 
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const updateUser = (newUser) => {
    // Get the current user from Firebase authentication
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      // Update the user data in Firestore
      db.collection('users').doc(currentUser.uid).update(newUser)
        .then(() => {
          // Dispatch setUser action with the updated user data
          dispatch(setUser(newUser));
        })
        .catch((error) => {
          // Handle update error
        });
    }
  };

  const handleLogin = (email, password) => {
    // Implement Firebase login logic
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Dispatch LOG_IN action with the user data
        const user = userCredential.user;
        dispatch(logIn(user));
      })
      .catch((error) => {
        // Handle login error
      });
  };

  const handleLogout = () => {
    // Implement Firebase logout logic
    auth.signOut()
      .then(() => {
        // Dispatch LOG_OUT action
        dispatch(logOut());
      })
      .catch((error) => {
        // Handle logout error
        console.log('Logout error:', error);
      });
  };
  


  return (
    <Provider store={store}>
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
    </Provider>
  );
  
}

export default App;