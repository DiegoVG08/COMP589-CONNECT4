import { getDatabase, onValue, ref, push, child, set, once, get, runTransaction } from "firebase/database";
import React, { useState, useEffect } from 'react';
import { db, realtime } from '../Firebase';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';

const LobbyPage = () => {
  const [lobbyId, setLobbyId] = useState('');
  const [joined, setJoined] = useState(false);
  const [generatedLobbyId, setGeneratedLobbyId] = useState('');
  const [playerCount, setPlayerCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const playerId = 'player1'; // Replace with actual player ID logic


  const navigate = useNavigate();

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
    const lobbyRef = ref(realtime, `lobbies/${lobbyId}`);
  
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
      playerCount: 0, // Initialize player count to 1
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
    get(lobbyRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Lobby exists, join the lobby
          const playerCountRef = child(lobbyRef, "playerCount");
          runTransaction(playerCountRef, (currentCount) => {
            return (currentCount || 0) + 1;
          })
            .then((transactionResult) => {
              if (transactionResult.committed) {
                const updatedCount = transactionResult.snapshot.val();
                setPlayerCount(updatedCount);

                // Redirect to the game screen
                navigate(`/Game/${lobbyId}`);
              }
            })
            .catch((error) => {
              console.error("Error updating player count:", error);
            });
        } else {
          console.log("Lobby not found");
        }
      })
      .catch((error) => {
        console.error("Error reading lobby data:", error);
      });
  };
  
  

  const joinLobby = (lobbyId) => {
    const lobbyRef = ref(realtime, `lobbies/${lobbyId}`);
  
    // Increment the player count in the lobby data
    lobbyRef.child("playerCount").transaction((currentCount) => {
      // If currentCount is null or undefined, default it to 1
      return (currentCount || 0) + 1;
    }, (error, committed, snapshot) => {
      if (error) {
        // Handle the error
        console.error("Error updating player count:", error);
      } else if (committed) {
        // Player count was successfully updated
        const updatedCount = snapshot.val();
        setPlayerCount(updatedCount);
  
    
      }
    });
  
    // Listen for changes to the player count
    onValue(child(lobbyRef, "playerCount"), (snapshot) => {
      const playerCount = snapshot.val();
      setPlayerCount(playerCount);
  
      // Check the player count
      if (playerCount === 2) {
        // Two players have joined, start the game
        setGameStarted(true);
      }
    });
  };
  
  
  
  
  const handleClick = (tileIndex) => {
    if (
      !gameState.isGameDone &&
      gameState.board[tileIndex] === null &&
      gameState.playerTurn === playerId
    ) {
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

  useEffect(() => {
    if (playerCount >= 2) {
      // Both players have joined
      setGameStarted(true);
    }
  }, [playerCount]);

  return (
    <div className="container">
      <h1 className="text-center">Connect4 Lobby</h1>
      {joined ? (
        playerCount === 2 ? (
          <p>Redirecting to the game screen...</p>
        ) : (
          <p>Waiting for opponent...</p>
        )
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
                <input
                  type="text"
                  className="form-control"
                  value={generatedLobbyId}
                  readOnly
                />
              </label>
              <button
                className="btn btn-secondary"
                onClick={copyToClipboard}
              >
                Copy to Clipboard
              </button>
            </div>
          )}
          <p className="text-center mt-3 mb-3">Join Game</p>
          <form onSubmit={handleJoinLobby}>
            <div className="text-center mb-3">
              <label>
                Lobby ID:
                <input
                  type="text"
                  className="form-control"
                  value={lobbyId}
                  onChange={(e) => setLobbyId(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Join Lobby
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LobbyPage;