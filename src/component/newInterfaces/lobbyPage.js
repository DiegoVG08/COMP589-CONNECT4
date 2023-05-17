import { getDatabase, ref, push, child, set} from "firebase/database";
import React, { useState } from 'react';
import { db, realtime } from '../Firebase';

const LobbyPage = () => {
  const [lobbyId, setLobbyId] = useState('');
  const [joined, setJoined] = useState(false);
  const playerId = 'player1'; // Replace with actual player ID logic

  const generateLobbyId = () => {
    const lobbiesRef = ref(realtime, "lobbies");
    const newLobbyRef = push(lobbiesRef);
    const newLobbyId = newLobbyRef.key;
    // Use the new lobby ID for further operations
    console.log("Generated lobby ID:", newLobbyId);
  };

  const initialGameState = {
    board: Array(42).fill(null), // Array of 42 tiles initialized with null values
    isGameDone: false,
    playerTurn: 1,
    turnNumber: 1,
  };

  const [gameState, setGameState] = useState(initialGameState);

const writeLobbyData = (lobbyId) => {
  const lobbyRef = realtime.ref(`lobbies/${lobbyId}`);

    // Define the game data
    const gameData = {
      board: Array(42).fill(null), // Array of 42 tiles initialized with null values
      isGameDone: false,
      playerTurn: 1,
      turnNumber: 1,
    };

    // Define the lobby data
    const lobbyData = {
      lobbyId: lobbyId,
      gameData: gameData,
      // Include any other lobby-related properties
    };

    set(lobbyRef, lobbyData)
      .then(() => {
        // Lobby data has been successfully written
        console.log("Lobby data has been written successfully.");
      })
      .catch((error) => {
        // Handle any errors that occurred during the write operation
        console.error("Error writing lobby data:", error);
      });
  };

  const handleJoinLobby = (event) => {
    event.preventDefault();
  
    // Join the lobby using the provided lobby ID
    const lobbyRef = realtime.ref(`lobbies/${lobbyId}`);
  
    // Check if the lobby exists
    lobbyRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
        // Lobby exists, join the lobby
        joinLobby(lobbyId);
        setJoined(true);
      } else {
        // Lobby does not exist, show an error message or handle it appropriately
        console.log("Lobby not found");
      }
    });
  };
  

  const joinLobby = (lobbyId) => {
    const lobbyRef = realtime.ref(`lobbies/${lobbyId}`);

    lobbyRef.on('value', (snapshot) => {
      const lobbyData = snapshot.val();

      if (lobbyData) {
        // Update the game state based on the lobby data
        const updatedGameState = {
          board: lobbyData.gameData.board,
          isGameDone: lobbyData.gameData.isGameDone,
          playerTurn: lobbyData.gameData.playerTurn,
          turnNumber: lobbyData.gameData.turnNumber,
        };

        // Perform additional game logic as needed

        // Set the updated game state
        setGameState(updatedGameState);
      }
    });
  };

  const handleClick = (tileIndex) => {
    if (!gameState.isGameDone && gameState.board[tileIndex] === null && gameState.playerTurn === playerId) {
      // Update the board with the player's move
      const updatedBoard = [...gameState.board];
      updatedBoard[tileIndex] = playerId;

      // Check if the game is done
      const isGameDone = checkForWin(updatedBoard) || checkForDraw(updatedBoard);

      // Determine the next player's turn
      const updatedPlayerTurn = gameState.playerTurn === 'player1' ? 'player2' : 'player1';

      // Update the turn number
      const updatedTurnNumber = gameState.turnNumber + 1;

      // Update the game state
      const updatedGameState = {
        board: updatedBoard,
        isGameDone: isGameDone,
        playerTurn: updatedPlayerTurn,
        turnNumber: updatedTurnNumber,
      };

      // Set the updated game state
      setGameState(updatedGameState);

      // Update the lobby data in Firebase
      db.ref(`lobbies/${lobbyId}/gameData`).update(updatedGameState);
    }
  };

  const checkForWin = (board) => {
    // Check for win conditions
    // ...

    return false; // Replace with the actual win condition check
  };

  const checkForDraw = (board) => {
    // Check for draw condition
    // ...

    return false; // Replace with the actual draw condition check
  };

  return (
    <div>
      <h1>Connect4 Lobby</h1>
      {joined ? (
        <p>You have joined Lobby ID: {lobbyId}</p>
      ) : (
        <div>
          <button onClick={generateLobbyId}>Generate Lobby ID</button>
          <form onSubmit={handleJoinLobby}>
            <input type="text" value={lobbyId} onChange={(e) => setLobbyId(e.target.value)} />
            <button type="submit">Join Lobby</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LobbyPage;
