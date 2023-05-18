import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, set, off } from 'firebase/database';
import { realtime } from '../Firebase';

const Tile = ({ value, onClick }) => {
  const tileClass = `connect4-tile player-${value}`;
  return (
    <div className="connect4-tile" onClick={onClick}>
      {value !== null && <div className={`player-${value}`} />}
    </div>
  );
};

const Connect4Board = () => {
  const [board, setBoard] = useState(() => Array(6).fill(Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isGameDone, setIsGameDone] = useState(false);
  const [isOpponentJoined, setIsOpponentJoined] = useState(false);
  const { lobbyId } = useParams();

  useEffect(() => {
    const lobbyRef = ref(realtime, `lobbies/${lobbyId}`);
    const unsubscribe = onValue(lobbyRef, (snapshot) => {
      const lobbyData = snapshot.val();
      if (lobbyData && lobbyData.playerCount === 2) {
        setIsOpponentJoined(true);
        off(lobbyRef, 'value'); // Unsubscribe from further changes
      }
    });

    return () => {
      off(lobbyRef, 'value'); // Cleanup: Unsubscribe from the listener when the component unmounts
    };
  }, [lobbyId]);

  const handleColumnClick = (colIndex) => {
    if (isGameDone) return;

    const updatedBoard = [...board];
    let isMoveMade = false;

    for (let row = 5; row >= 0; row--) {
      if (updatedBoard[row][colIndex] === null) {
        updatedBoard[row][colIndex] = currentPlayer;
        isMoveMade = true;
        break;
      }
    }

    if (!isMoveMade) return;

    setBoard(updatedBoard);

    if (checkForWin(currentPlayer)) {
      setIsGameDone(true);
      return;
    }

    if (checkForDraw(updatedBoard)) {
      setIsGameDone(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const checkForWin = (player) => {
    // Check horizontal
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] === player &&
          board[row][col + 1] === player &&
          board[row][col + 2] === player &&
          board[row][col + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check vertical
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (
          board[row][col] === player &&
          board[row + 1][col] === player &&
          board[row + 2][col] === player &&
          board[row + 3][col] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] === player &&
          board[row + 1][col + 1] === player &&
          board[row + 2][col + 2] === player &&
          board[row + 3][col + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonal (top-right to bottom-left)
    for (let row = 0; row < 3; row++) {
      for (let col = 3; col < 7; col++) {
        if (
          board[row][col] === player &&
          board[row + 1][col - 1] === player &&
          board[row + 2][col - 2] === player &&
          board[row + 3][col - 3] === player
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const checkForDraw = (board) => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (board[row][col] === null) {
          return false; // If there's an empty tile, the game is not a draw
        }
      }
    }

    return true; // All tiles are filled, the game is a draw
  };

  useEffect(() => {
    if (isOpponentJoined && currentPlayer === 1) {
      setCurrentPlayer(2);
    }
  }, [isOpponentJoined, currentPlayer]);

  useEffect(() => {
    if (currentPlayer === 1 && isOpponentJoined) {
      setIsGameDone(false);
    }
  }, [currentPlayer, isOpponentJoined]);

  return (
    <div className="connect4-board">
      <h1>Lobby ID: {lobbyId}</h1>
      {!isOpponentJoined ? (
        <h2>Waiting for opponent...</h2>
      ) : (
        <h2>Player {currentPlayer}'s turn</h2>
      )}
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="connect4-row">
          {row.map((tile, colIndex) => (
            <Tile
              key={colIndex}
              value={tile}
              onClick={() => handleColumnClick(colIndex)}
            />
          ))}
        </div>
      ))}
      {isGameDone && (
        <p>{checkForDraw(board) ? 'The game is a draw!' : `Player ${currentPlayer} wins!`}</p>
      )}
    </div>
  );
};

export default Connect4Board;
