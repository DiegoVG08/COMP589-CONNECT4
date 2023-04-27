import React, { useState, Dispatch, SetStateAction } from "react";
import { Row } from "src/component/interfaces/Row";
import { Column } from "src/component/interfaces/Column";
import Tile from "src/component/Tile";

interface Props {
  row: Row;
  updateBoard: (columnIndex: number) => void;
  currentPlayer: number;
  hoverTile: number | null;
  setHoverTile: Dispatch<SetStateAction<number | null>>;
}

const GameRow: React.FunctionComponent<Props> = ({
  row,
  updateBoard,
  currentPlayer,
  hoverTile,
  setHoverTile,
}: Props): JSX.Element => {

  return (
    <tr>
      {row.columns.map(
        (column: Column, i: number): JSX.Element => (
          <Tile
            key={i}
            column={column}
            columnIndex={i}
            updateBoard={updateBoard}
            currentPlayer={currentPlayer}
            hoverTile={hoverTile}
            setHoverTile={setHoverTile}
          />
        )
      )}
    </tr>
  );
};

export default GameRow;
