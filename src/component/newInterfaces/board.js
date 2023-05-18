import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, set, off } from 'firebase/database';
import { realtime } from '../Firebase';
import { Block, Container, Row, BoardContainer } from './styling';
import './board.css'


const Tile = ({ value, onClick }) => {
  const tileClass = `connect4-tile player-${value}`;
  return (
    <div className="connect4-tile" onClick={onClick}>
      {value !== null && <div className={`player-${value}`} />}
    </div>
  );
};


const Connect4Board = ({ board: initialBoard = [], onColumnClick, gamedata }) => {
  const [board, setBoard] = useState(() =>
  Array.from({ length: 6 }, () => Array(7).fill(null))
);
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
  
    const gameDataRef = ref(realtime, `lobbies/${lobbyId}/gamedata`);
    const newMove = {
      player: currentPlayer,
      block: row * 7 + colIndex, // Calculate the specific block index
    };
  
    const updatedGameData = {
      ...gamedata,
      board: [...gamedata.board, newMove],
    };
  
    set(gameDataRef, updatedGameData); // Update game data on Firebase
  
    if (checkForWin(currentPlayer)) {
      setIsGameDone(true);
      return;
    }
  
    if (checkForDraw(updatedBoard)) {
      setIsGameDone(true);
      return;
    }

    const clickedBlock = document.getElementById(`block-${row}-${colIndex}`);
    clickedBlock.classList.toggle(`player-${currentPlayer}`);
  
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
    <Row>
    <Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(0)} className={`player-${board[0]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(1)} className={`player-${board[1]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(2)} className={`player-${board[2]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(3)} className={`player-${board[3]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(4)} className={`player-${board[4]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(5)} className={`player-${board[5]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(6)} className={`player-${board[6]}`}></Block>
      </Row>
      <Row>
      <Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(7)} className={`player-${board[7]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(8)} className={`player-${board[8]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(9)} className={`player-${board[9]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(10)} className={`player-${board[10]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(11)} className={`player-${board[11]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(12)} className={`player-${board[12]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(13)} className={`player-${board[13]}`}></Block>
      </Row>
      <Row>
      <Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(14)} className={`player-${board[14]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(15)} className={`player-${board[15]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(16)} className={`player-${board[16]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(17)} className={`player-${board[17]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(18)} className={`player-${board[18]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(19)} className={`player-${board[19]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(20)} className={`player-${board[20]}`}></Block>
      </Row>
      <Row>
      <Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(21)} className={`player-${board[21]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(22)} className={`player-${board[22]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(23)} className={`player-${board[23]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(24)} className={`player-${board[24]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(25)} className={`player-${board[25]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(26)} className={`player-${board[26]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(27)} className={`player-${board[27]}`}></Block>
      </Row>
      <Row>
      <Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(28)} className={`player-${board[28]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(29)} className={`player-${board[29]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(30)} className={`player-${board[30]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(31)} className={`player-${board[31]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(32)} className={`player-${board[32]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(33)} className={`player-${board[33]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(34)} className={`player-${board[34]}`}></Block>

      </Row>
      <Row>
      <Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(35)} className={`player-${board[35]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(36)} className={`player-${board[36]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(37)} className={`player-${board[37]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(38)} className={`player-${board[38]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(39)} className={`player-${board[39]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(40)} className={`player-${board[40]}`}></Block>
<Block currentPlayer={currentPlayer} onClick={() => handleColumnClick(41)} className={`player-${board[41]}`}></Block>
      </Row>
      </Container>
      </BoardContainer>
      {isGameDone && (
        <p>{checkForDraw(board) ? 'The game is a draw!' : `Player ${currentPlayer} wins!`}</p>
      )}
    </>
  );
  
  
};

export default Connect4Board;
