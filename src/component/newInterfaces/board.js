import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, set, off } from 'firebase/database';
import { realtime } from '../Firebase';
import { Block, Container, Row, BoardContainer } from './styling';


const Tile = ({ value, onClick }) => {
  const tileClass = `connect4-tile player-${value}`;
  return (
    <div className="connect4-tile" onClick={onClick}>
      {value !== null && <div className={`player-${value}`} />}
    </div>
  );
};


const Connect4Board = ({ board: initialBoard = [], onColumnClick }) => {
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
    {!isOpponentJoined ? (
      <h2>Waiting for opponent...</h2>
    ) : (
      <h2>Player {currentPlayer}'s turn</h2>
    )}
    <BoardContainer>
    <Container>
      <Row>
        <Block onClick={() => handleColumnClick(0)}>{board[0]}</Block>
        <Block onClick={() => handleColumnClick(1)}>{board[1]}</Block>
        <Block onClick={() => handleColumnClick(2)}>{board[2]}</Block>
        <Block onClick={() => handleColumnClick(3)}>{board[3]}</Block>
        <Block onClick={() => handleColumnClick(4)}>{board[4]}</Block>
        <Block onClick={() => handleColumnClick(5)}>{board[5]}</Block>
        <Block onClick={() => handleColumnClick(6)}>{board[6]}</Block>
      </Row>
      <Row>
        <Block onClick={() => handleColumnClick(7)}>{board[7]}</Block>
        <Block onClick={() => handleColumnClick(8)}>{board[8]}</Block>
        <Block onClick={() => handleColumnClick(9)}>{board[9]}</Block>
        <Block onClick={() => handleColumnClick(10)}>{board[10]}</Block>
        <Block onClick={() => handleColumnClick(11)}>{board[11]}</Block>
        <Block onClick={() => handleColumnClick(12)}>{board[12]}</Block>
        <Block onClick={() => handleColumnClick(13)}>{board[13]}</Block>
      </Row>
      <Row>
        <Block onClick={() => handleColumnClick(14)}>{board[14]}</Block>
        <Block onClick={() => handleColumnClick(15)}>{board[15]}</Block>
        <Block onClick={() => handleColumnClick(16)}>{board[16]}</Block>
        <Block onClick={() => handleColumnClick(17)}>{board[17]}</Block>
        <Block onClick={() => handleColumnClick(18)}>{board[18]}</Block>
        <Block onClick={() => handleColumnClick(19)}>{board[19]}</Block>
        <Block onClick={() => handleColumnClick(20)}>{board[20]}</Block>
      </Row>
      <Row>
        <Block onClick={() => handleColumnClick(21)}>{board[21]}</Block>
        <Block onClick={() => handleColumnClick(22)}>{board[22]}</Block>
        <Block onClick={() => handleColumnClick(23)}>{board[23]}</Block>
        <Block onClick={() => handleColumnClick(24)}>{board[24]}</Block>
        <Block onClick={() => handleColumnClick(25)}>{board[25]}</Block>
        <Block onClick={() => handleColumnClick(26)}>{board[26]}</Block>
        <Block onClick={() => handleColumnClick(27)}>{board[27]}</Block>
      </Row>
      <Row>
        <Block onClick={() => handleColumnClick(28)}>{board[28]}</Block>
        <Block onClick={() => handleColumnClick(29)}>{board[29]}</Block>
        <Block onClick={() => handleColumnClick(30)}>{board[30]}</Block>
        <Block onClick={() => handleColumnClick(31)}>{board[31]}</Block>
        <Block onClick={() => handleColumnClick(32)}>{board[32]}</Block>
        <Block onClick={() => handleColumnClick(33)}>{board[33]}</Block>
        <Block onClick={() => handleColumnClick(34)}>{board[34]}</Block>
      </Row>
      <Row>
        <Block onClick={() => handleColumnClick(35)}>{board[35]}</Block>
        <Block onClick={() => handleColumnClick(36)}>{board[36]}</Block>
        <Block onClick={() => handleColumnClick(37)}>{board[37]}</Block>
        <Block onClick={() => handleColumnClick(38)}>{board[38]}</Block>
        <Block onClick={() => handleColumnClick(39)}>{board[39]}</Block>
        <Block onClick={() => handleColumnClick(40)}>{board[40]}</Block>
        <Block onClick={() => handleColumnClick(41)}>{board[41]}</Block>
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
