import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, set, off, update, runTransaction, once, get } from 'firebase/database';
import { db, realtime } from '../Firebase';
import { Block, Container, Row, BoardContainer } from './styling';
import './board.css'
import { useDispatch } from 'react-redux';
import { fetchUsername  } from '../../reducers/userActions';


const Connect4Board = ({ board: initialBoard = []}) => {
  const [board, setBoard] = useState(() =>
  initialBoard.length ? initialBoard : Array.from({ length: 6 }, () => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [isGameDone, setIsGameDone] = useState(false);
  const [isOpponentJoined, setIsOpponentJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  const { lobbyId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const lobbyRef = ref(realtime, `lobbies/${lobbyId}`);
    const unsubscribe = onValue(lobbyRef, (snapshot) => {
      const lobbyData = snapshot.val();
      if (lobbyData && lobbyData.playerCount === 2) {
        setIsOpponentJoined(true);
        setCurrentPlayer(lobbyData.currentPlayer === 1 ? 2 : 1);// Assign player 2 to the second player who joins
        off(lobbyRef, 'value'); // Unsubscribe from further changes
      }
    });

    return () => {
      off(lobbyRef, 'value'); // Cleanup: Unsubscribe from the listener when the component unmounts
    };
  }, [lobbyId]);

  const handlePlayerJoin = async () => {
    const lobbyRef = ref(db, `lobbies/${lobbyId}`);
    const gameDataRef = ref(db, `lobbies/${lobbyId}/gameData`);
  
    try {
      const lobbyDataSnapshot = await get(lobbyRef);
      const lobbyData = lobbyDataSnapshot.val();
  
      if (!lobbyData) {
        return null;
      }
  
      if (lobbyData.playerCount < 2) {
        const currentUser = db.auth().currentUser;
        const uid = currentUser.uid;
        dispatch(fetchUsername(uid));
  
        const usernameSnapshot = await get(ref(db, 'users'));
        const username = usernameSnapshot.child(uid).val();
  
        lobbyData.playerCount += 1;
        lobbyData[`player${lobbyData.playerCount}`] = {
          uid,
          username,
        };
  
        if (lobbyData.playerCount === 1) {
          lobbyData.player1 = {
            uid,
            username,
          };
        } else if (lobbyData.playerCount === 2) {
          lobbyData.player2 = {
            uid,
            username,
          };
        }
  
        if (lobbyData.playerCount === 2) {
          lobbyData.gameData = {
            blocks: Array.from({ length: 6 }, () => Array(7).fill(null)),
            playerTurn: 1,
            isGameDone: false,
            turnNumber: 1,
          };
        }
  
        await update(lobbyRef, lobbyData);
      }
    } catch (error) {
      console.error('Error joining the game:', error);
    }
  };
  

  const gameData = {
    board: [], // Array of 42 tiles initialized with null values
    isGameDone: false,
    playerTurn: 1,
    turnNumber: 1,
  };


  const handleColumnClick = (colIndex) => {
    if (isGameDone || currentPlayer !== 1) return;
  
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
  
    const newMove = {
      player: currentPlayer,
      block: row * 7 + colIndex,
    };

    const updatedBlocks = {
      ...(gameData.blocks || {}),
      [row]: {
        ...(gameData.blocks?.[row] || {}),
        [colIndex]: currentPlayer,
      },
    };
  
    const gameDataRef = ref(realtime, `lobbies/${lobbyId}/gameData`);
    set(gameDataRef, {
      ...gameData,
      turnNumber: gameData.turnNumber + 1,
      playerTurn: currentPlayer === 1 ? 2 : 1,
      blocks: updatedBlocks,
    });
  
    if (checkForDraw(updatedBoard)) {
      setIsGameDone(true);
      return;
    }
  
    if (checkForWin(updatedBoard, currentPlayer)) {
      setIsGameDone(true);
      return;
    }

  

    setCurrentPlayer(2);
  };
  
  

  const checkForWin = (board, player) => {
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

  const handlePlayerTurn = (player) => {
    const gameDataRef = ref(realtime, `lobbies/${lobbyId}/gameData`);
    onValue(gameDataRef, (snapshot) => {
      const gameData = snapshot.val();
      const { isGameDone, playerTurn } = gameData;

      if (isGameDone) {
        // Game is already done
        return;
      }
     

      if (player === playerTurn) {
        // It's this player's turn, allow move
        setLoading(false); // Disable loading state
        handleColumnClick(player);
      } else {
        // It's not this player's turn yet, wait for update
        setLoading(true); // Enable loading state
      }

      setBoard(board);
      setIsGameDone(checkForWin(board, playerTurn) || checkForDraw(board));
      setLoading(playerTurn !== currentPlayer);
      setCurrentPlayer(playerTurn);

    });
  };

  

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
