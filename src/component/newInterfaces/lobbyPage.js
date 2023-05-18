import { getDatabase, onValue, ref, push, child, set, once, get} from "firebase/database";
import React, { useState } from 'react';
import { db, realtime } from '../Firebase';
import "bootstrap/dist/css/bootstrap.min.css";


const LobbyPage = () => {
  const [lobbyId, setLobbyId] = useState('');
  const [joined, setJoined] = useState(false);
  const [generatedLobbyId, setGeneratedLobbyId] = useState('');

  const playerId = 'player1'; // Replace with actual player ID logic

  const generateLobbyId = () => {
    const lobbiesRef = ref(realtime, "lobbies");
    const newLobbyRef = push(lobbiesRef);
    const newLobbyId = newLobbyRef.key;
    // Use the new lobby ID for further operations
    console.log("Generated lobby ID:", newLobbyId);
    setGeneratedLobbyId(newLobbyId);
    writeLobbyData(newLobbyId);
  };

  const initialGameState = {
    board: Array(42).fill(null), // Array of 42 tiles initialized with null values
    isGameDone: false,
    playerTurn: 1,
    turnNumber: 1,
  };

  const [gameState, setGameState] = useState(initialGameState);

const writeLobbyData = (lobbyId) => {
    const lobbyRef =ref(realtime, `lobbies/${lobbyId}`);

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
    const lobbyRef = ref(realtime, `lobbies/${lobbyId}`);
  
    // Check if the lobby exists
    get(lobbyRef).then((snapshot) => {
      if (snapshot.exists()) {
        // Lobby exists, join the lobby
        joinLobby(lobbyId);
        setJoined(true);
      } else {
        // Lobby does not exist, show an error message or handle it appropriately
        console.log("Lobby not found");
      }
    }).catch((error) => {
      // Handle any errors that occurred during the read operation
      console.error("Error reading lobby data:", error);
    });
  };
  

  const joinLobby = (lobbyId) => {
    const lobbyRef = ref(realtime, `lobbies/${lobbyId}`);
  
    onValue(lobbyRef, (snapshot) => {
      const lobbyData = snapshot.val();
     
      if (lobbyData) {
        // Update the game state based on the lobby data
        const updatedGameState = {
          board: lobbyData.gameData.board,
          isGameDone: lobbyData.gameData.isGameDone,
          playerTurn: lobbyData.gameData.playerTurn,
          turnNumber: lobbyData.gameData.turnNumber,
        };
        console.log(`Joining lobby with ID: ${lobbyId}`);
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
      ref(realtime, `lobbies/${lobbyId}/gameData`).update(updatedGameState);
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

  const copyToClipboard = () => {
    const textField = document.createElement('textarea');
    textField.innerText = generatedLobbyId;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  return (
    <div className="container">
      <h1 className="text-center">Connect4 Lobby</h1>
      {joined ? (
        <p className="text-center">You have joined Lobby ID: {lobbyId}</p>
      ) : (
        <div>
          <p className="text-center mt-3 mb-3">Create Game</p>
          <div className="text-center mb-3">
            <button className="btn btn-primary" onClick={generateLobbyId}>
              Generate Lobby ID
            </button>
          </div>
          {generatedLobbyId && (
            <div className="text-center mb-3">
              <label>
                Generated Lobby ID:
                <input type="text" className="form-control" value={generatedLobbyId} readOnly />
              </label>
              <button className="btn btn-secondary" onClick={copyToClipboard}>
                Copy
              </button>
            </div>
          )}
          <p className="text-center mt-3 mb-3">OR</p>
          <p className="text-center mt-3 mb-3">Join Lobby</p>
          <div className="d-flex justify-content-center mt-3">
            <form onSubmit={handleJoinLobby}>
              <input type="text" className="form-control" value={lobbyId} onChange={(e) => setLobbyId(e.target.value)} />
              <button type="submit" className="btn btn-primary m-5">Join Lobby</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
          }
  
export default LobbyPage;
