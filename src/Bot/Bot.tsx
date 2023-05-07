import React, { useState, useEffect } from "react";
import { Board } from "../component/interfaces/Board";

interface BotProps {
  board: Board;
  onColumnSelect: (columnIndex: number) => void;
  difficulty: "easy" | "hard";
}

export const Bot: React.FC<BotProps> = ({
  board,
  onColumnSelect,
  difficulty,
}) => {
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    
    if (thinking) {
      const botMove = difficulty === "easy" ? easyBotMove : hardBotMove;
      const columnIndex = botMove(board);
      setTimeout(() => {
        onColumnSelect(columnIndex);
        setThinking(false);
      }, 500);
    }
  }, [board, onColumnSelect, difficulty, thinking]);

  const easyBotMove = (board: Board): number => {
    
    const emptyColumns = board.getEmptyColumns();
    return emptyColumns[Math.floor(Math.random() * emptyColumns.length)];
  };

  const hardBotMove = (board: Board): number => {
    const emptyColumns = board.getEmptyColumns();

    let bestColumn = emptyColumns[0];
    let bestScore = -Infinity;

    emptyColumns.forEach((column) => {
      const score = getScoreForColumn(board, column);

      if (score > bestScore) {
        bestColumn = column;
        bestScore = score;
      }
    });

    return bestColumn;
  };

  const getScoreForColumn = (board: Board, columnIndex: number): number => {
    const nextBoard = board.clone();
    nextBoard.dropDisc(columnIndex, board.currPlayer);
  
    if (nextBoard.checkForWinner()) {
      return 1;
    }
  
    if (nextBoard.checkForWinner() === false) {
      return -1;
    }
  
    let totalScore = 0;
    const emptyColumns = nextBoard.getEmptyColumns();
  
    if (emptyColumns.length === 0) {
      return 0;
    }
  
    emptyColumns.forEach((column) => {
      const score = getScoreForColumn(nextBoard, column);
      totalScore += score;
    });
  
    return totalScore / emptyColumns.length;
  };

  return null;
};
