import { getDatabase, onValue, ref, push, child, set, once, get, runTransaction, collection } from "firebase/database";
import React, { useState, useEffect } from 'react';
import { db, realtime, auth } from '../Firebase';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import { fetchUsername  } from '../../reducers/userActions';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';




const LobbyPage = () => {
  const [lobbyId, setLobbyId] = useState('');
  const [joined, setJoined] = useState(false);
  const [generatedLobbyId, setGeneratedLobbyId] = useState('');
  const [playerCount, setPlayerCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const playerId = 'player1'; // Replace with actual player ID logic
  const [username, setUsername] = useState('');
  const [playerRole, setPlayerRole] = useState(null);


  const navigate = useNavigate();
  const dispatch = useDispatch();


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

  
  const handleJoinLobby = async (event) => {
    event.preventDefault();
    const lobbyRef = ref(realtime, `lobbies/${lobbyId}`);
    get(lobbyRef)
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const lobbyData = snapshot.val();
          const playerCount = lobbyData.playerCount || 0;
  
          if (playerCount < 2) {
            const assignedPlayer = playerCount === 0 ? 'player1' : 'player2';
            const playerUsername = playerCount === 0 ? username : ` ${username}`;
  
            lobbyData.playerCount += 1;
            lobbyData[assignedPlayer] = {
              username: playerUsername,
            };
  
            set(lobbyRef, lobbyData)
              .then(() => {
                navigate(`/Game/${lobbyId}`);
              })
              .catch((error) => {
                console.error("Error joining lobby:", error);
              });
          }
        }
      })
      .catch((error) => {
        console.log("Error checking lobby existence:", error);
      });
  };
  

  const joinLobby = (lobbyId) => {
    const lobbyRef = ref(realtime, `lobbies/${lobbyId}`);
    lobbyRef.child("playerCount").transaction(
      (currentCount) => {
        return (currentCount || 0) + 1;
      },
      (error, committed, snapshot) => {
        if (error) {
          console.error("Error updating player count:", error);
        } else if (committed) {
          const updatedCount = snapshot.val();
          setPlayerCount(updatedCount);
        }
      }
    );
    onValue(child(lobbyRef, "playerCount"), (snapshot) => {
      const playerCount = snapshot.val();
      setPlayerCount(playerCount);
      if (playerCount === 2) {
        setGameStarted(true);
      }
    });
    onValue(child(lobbyRef, "player1"), (snapshot) => {
      const player1Data = snapshot.val();
      if (player1Data && player1Data.username) {
        setPlayerRole(player1Data.username === username ? 'player1' : 'player2');
      }
    });
    onValue(child(lobbyRef, "player2"), (snapshot) => {
      const player2Data = snapshot.val();
      if (player2Data && player2Data.username) {
        setPlayerRole(player2Data.username === username ? 'player2' : 'player1');
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
            <div className="text-center mb-3">
              <label>
                Temporary Username:
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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