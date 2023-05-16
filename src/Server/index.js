import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import io from 'socket.io-client';

const firebaseConfig = {
  // Your Firebase config object here
};
firebase.initializeApp(firebaseConfig);

const socket = io(process.env.REACT_APP_SOCKET_URL);

function Lobby() {
    const [user, setUser] = useState(null);
    const [lobbyId, setLobbyId] = useState(null);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(null);
    const [game, setGame] = useState(null);
    const gameRef = useRef(null);
  
    useEffect(() => {
      // Check if user is logged in
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          // Redirect to login page
          window.location.href = '/login';
        }
      });
    }, []);
  
    function handleCreateLobby() {
      // Generate a new lobby ID
      const newLobbyId = Math.floor(Math.random() * 1000000);
      setLobbyId(newLobbyId);
  
      // Create a new lobby in Firebase
      firebase.firestore().collection('lobbies').doc(String(newLobbyId)).set({
        host: user.uid,
        players: [user.uid],
      })
        .then(() => {
          // Emit 'create-lobby' event to Socket.io server
          socket.emit('create-lobby', newLobbyId);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  
    function handleJoinLobby() {
      // Prompt user to enter a lobby ID
      const input = window.prompt('Enter the lobby ID:');
      const lobbyId = Number(input);
  
      if (isNaN(lobbyId)) {
        setError('Invalid lobby ID');
        return;
      }
  
      // Join the lobby in Firebase
      firebase.firestore().collection('lobbies').doc(String(lobbyId)).update({
        players: firebase.firestore.FieldValue.arrayUnion(user.uid),
      })
        .then(() => {
          // Emit 'join-lobby' event to Socket.io server
          socket.emit('join-lobby', { lobbyId, playerId: user.uid });
          setLobbyId(lobbyId);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  
    function handleLeaveLobby() {
      // Remove the player from the lobby in Firebase
      firebase.firestore().collection('lobbies').doc(String(lobbyId)).update({
        players: firebase.firestore.FieldValue.arrayRemove(user.uid),
      })
        .then(() => {
          // Emit 'leave-lobby' event to Socket.io server
          socket.emit('leave-lobby', { lobbyId, playerId: user.uid });
          setLobbyId(null);
          setPlayers([]);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  
    function handleStartGame() {
      // Initialize a new game in Firebase
      firebase.firestore().collection('games').doc(String(lobbyId)).set({
        players: players,
        turn: 0,
        board: [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ],
        })
        .then(() => {
            // Emit 'start-game' event to Socket.io server
            socket.emit('start-game', lobbyId);
            }
        )
        .catch((error) => {
            setError(error.message);
            }
        );
    }
}
    

