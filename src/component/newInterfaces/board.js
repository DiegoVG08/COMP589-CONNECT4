import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, set, off } from 'firebase/database';
import { realtime } from '../Firebase';
import { Block, Container, Row, BoardContainer } from './styling';
import './board.css'

const Connect4Board = ({ board: initialBoard = []}) => {
  const [board, setBoard] = useState(() =>
  initialBoard.length ? initialBoard : Array.from({ length: 6 }, () => Array(7).fill(null)));
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


  const gameData = {
    board: [], // Array of 42 tiles initialized with null values
    isGameDone: false,
    playerTurn: 1,
    turnNumber: 1,
  };

  const handleColumnClick = ( colIndex, gameData) => {
    if (isGameDone) return;
  
    const updatedBoard = [...board];
    let isMoveMade = false;
    let row;
  
    for (let r = 5; r >= 0; r--) {
      if (updatedBoard[r][colIndex] === null) {
        updatedBoard[r][colIndex] = currentPlayer;
        row = r; // Keep track of the row index
        isMoveMade = true;
        break;
      }
    }
  
    if (!isMoveMade) return;
  
    setBoard(updatedBoard);
  

    const newMove = {
      player: currentPlayer,
      block: row * 7 + colIndex,
    };

    const gameDataRef = ref(realtime, `lobbies/${lobbyId}/gamedata`);
    set(gameDataRef, newMove);
  

  
    if (checkForDraw(updatedBoard)) {
      setIsGameDone(true);
      return;
    }

    const clickedBlock = document.getElementById(`block-${row}-${colIndex}`);
  if (clickedBlock && clickedBlock.classList) {
    clickedBlock.classList.add(`block`, `player-${currentPlayer}`);
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
      setCurrentPlayer(1);
    }
  }, [isOpponentJoined, currentPlayer]);

  useEffect(() => {
    if (currentPlayer === 1 && isOpponentJoined) {
      setIsGameDone(false);
    }
  }, [currentPlayer, isOpponentJoined]);

  return (
    <>
    <h1>Lobby ID: {lobbyId}</h1>
    <div className="status-container">
  {!isOpponentJoined ? (
    <h2 className="status-message">Waiting for opponent...</h2>
  ) : (
    <h2 className="status-message">Player {currentPlayer}'s turn</h2>
  )}
</div>

<BoardContainer>
        <Container>
          {[...Array(6)].map((_, row) => (
            <Row key={row}>
              {[...Array(7)].map((_, col) => {
                const index = row * 7 + col;
                return (
                  <Block
                    key={index}
                    currentPlayer={currentPlayer}
                    onClick={() => handleColumnClick(col)}
                    className={`player-${board[row][col]}`}
                  ></Block>
                );
              })}
            </Row>
          ))}
        </Container>
      </BoardContainer>
      
      {isGameDone && (
        <p>{checkForDraw(board) ? 'The game is a draw!' : `Player ${currentPlayer} wins!`}</p>
      )}
    </>
  );
  
  
};

export default Connect4Board;
