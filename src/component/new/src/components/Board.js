import React, { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../WinningPatterns";

function Board({ result, setResult }) {
  // State for the game board, player, and turn
  const [board, setBoard] = useState(Array(42).fill(null));
  const [player, setPlayer] = useState("red");
  const [turn, setTurn] = useState("red");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [board]);

  // Function to choose a square on the board
  const chooseSquare = async (column) => {
    if (turn === player) {
      const rowIndex = getEmptyRowIndex(column);
      if (rowIndex !== -1) {
        setTurn(player === "red" ? "yellow" : "red");

        await channel.sendEvent({
          type: "game-move",
          data: { column, player },
        });

        const updatedBoard = [...board];
        updatedBoard[getIndex(column, rowIndex)] = player;
        setBoard(updatedBoard);
      }
    }
  };

  // Function to get the index of the first empty row in a column
  const getEmptyRowIndex = (column) => {
    for (let row = 5; row >= 0; row--) {
      const index = getIndex(column, row);
      if (board[index] === null) {
        return row;
      }
    }
    return -1;
  };

  // Function to get the linear index from column and row indices
  const getIndex = (column, row) => {
    return row * 7 + column;
  };

  // Function to check for winning patterns
  const checkWin = () => {
    Patterns.forEach((pattern) => {
      const [a, b, c, d] = pattern;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c] &&
        board[a] === board[d]
      ) {
        setResult({ winner: board[a], state: "won" });
      }
    });
  };

  // Function to check if the game is a tie
  const checkIfTie = () => {
    if (board.every((cell) => cell !== null)) {
      setResult({ winner: "none", state: "tie" });
    }
  };

  // Event listener for game moves received from the channel
  channel.onMessage((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player;
      setPlayer(currentPlayer);
      setTurn(currentPlayer);

      const column = event.data.column;
      const rowIndex = getEmptyRowIndex(column);

      if (rowIndex !== -1) {
        const updatedBoard = [...board];
        updatedBoard[getIndex(column, rowIndex)] = currentPlayer;
        setBoard(updatedBoard);
      }
    }
  });


  return (
    <div className="board">
      <div className="row">
        <Square
          val={board[0]}
          chooseSquare={() => {
            chooseSquare(0);
          }}
        />
        <Square
          val={board[1]}
          chooseSquare={() => {
            chooseSquare(1);
          }}
        />
        <Square
          val={board[2]}
          chooseSquare={() => {
            chooseSquare(2);
          }}
        />
        <Square
          val={board[3]}
          chooseSquare={() => {
            chooseSquare(3);
          }}
        />
        <Square
          val={board[4]}
          chooseSquare={() => {
            chooseSquare(4);
          }}
        />
        <Square
          val={board[5]}
          chooseSquare={() => {
            chooseSquare(5);
          }}
        />
        <Square
          val={board[6]}
          chooseSquare={() => {
            chooseSquare(6);
          }}
        />
      </div>
      <div className="row">
        <Square
          val={board[7]}
          chooseSquare={() => {
            chooseSquare(7);
          }}
        />
        <Square
          val={board[8]}
          chooseSquare={() => {
            chooseSquare(8);
          }}
        />
        <Square
          val={board[9]}
          chooseSquare={() => {
            chooseSquare(9);
          }}
        />
        <Square
          val={board[10]}
          chooseSquare={() => {
            chooseSquare(10);
          }}
        />
        <Square
          val={board[11]}
          chooseSquare={() => {
            chooseSquare(11);
          }}
        />
        <Square
          val={board[12]}
          chooseSquare={() => {
            chooseSquare(12);
          }}
        />
        <Square
          val={board[13]}
          chooseSquare={() => {
            chooseSquare(13);
          }}
        />

      </div>
      <div className="row">
        <Square
          val={board[14]}
          chooseSquare={() => {
            chooseSquare(14);
          }}
        />
        <Square
          val={board[15]}
          chooseSquare={() => {
            chooseSquare(15);
          }}
        />
        <Square
          val={board[16]}
          chooseSquare={() => {
            chooseSquare(16);
          }}
        />
        <Square
          val={board[17]}
          chooseSquare={() => {
            chooseSquare(17);
          }}
        />
        <Square
          val={board[18]}
          chooseSquare={() => {
            chooseSquare(18);
          }}
        />
        <Square
          val={board[19]}
          chooseSquare={() => {
            chooseSquare(19);
          }}
        />
        <Square
          val={board[20]}
          chooseSquare={() => {
            chooseSquare(20);
          }}
        />
      </div>
      <div className="row">
        <Square
          val={board[21]}
          chooseSquare={() => {
            chooseSquare(21);
          }}
        />
        <Square
          val={board[22]}
          chooseSquare={() => {
            chooseSquare(22);
          }}
        />
        <Square
          val={board[23]}
          chooseSquare={() => {
            chooseSquare(23);
          }}
        />
        <Square
          val={board[24]}
          chooseSquare={() => {
            chooseSquare(24);
          }}
        />
        <Square
          val={board[25]}
          chooseSquare={() => {
            chooseSquare(25);
          }}
        />
        <Square
          val={board[26]}
          chooseSquare={() => {
            chooseSquare(26);
          }}
        />
        <Square
          val={board[27]}
          chooseSquare={() => {
            chooseSquare(27);
          }}
        />
      </div>
      <div className="row">
        <Square
          val={board[28]}
          chooseSquare={() => {
            chooseSquare(28);
          }}
        />
        <Square
          val={board[29]}
          chooseSquare={() => {
            chooseSquare(29);
          }}
        />
        <Square
          val={board[30]}
          chooseSquare={() => {
            chooseSquare(30);
          }}
        />
        <Square
          val={board[31]}
          chooseSquare={() => {
            chooseSquare(31);
          }}
        />
        <Square
          val={board[32]}
          chooseSquare={() => {
            chooseSquare(32);
          }}
        />
        <Square
          val={board[33]}
          chooseSquare={() => {
            chooseSquare(33);
          }}
        />
        <Square
          val={board[34]}
          chooseSquare={() => {
            chooseSquare(34);
          }}
        />
      </div>
      <div className="row">
        <Square
          val={board[35]}
          chooseSquare={() => {
            chooseSquare(35);
          }}
        />
        <Square
          val={board[36]}
          chooseSquare={() => {
            chooseSquare(36);
          }}
        />
        <Square
          val={board[37]}
          chooseSquare={() => {
            chooseSquare(37);
          }}
        />
        <Square
          val={board[38]}
          chooseSquare={() => {
            chooseSquare(38);
          }}
        />
        <Square
          val={board[39]}
          chooseSquare={() => {
            chooseSquare(39);
          }}
        />
        <Square
          val={board[40]}
          chooseSquare={() => {
            chooseSquare(40);
          }}
        />
        <Square
          val={board[41]}
          chooseSquare={() => {
            chooseSquare(41);
          }}
        />

      </div>
    </div>
  );
}

export default Board;
