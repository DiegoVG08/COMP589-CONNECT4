import React from "react";
import { Row } from "src/component/interfaces/Row";
import { Column } from "src/component/interfaces/Column";
import Tile from "src/component/Tile";

interface Props {
  row: Row;
  updateBoard: (columnIndex: number) => void;
}

const GameRow: React.FunctionComponent<Props> = ({
  row,
  updateBoard
}: Props): JSX.Element => {
  return (
    <tr>
      {row.columns.map(
        (column: Column, i: number): JSX.Element => (
          <Tile key={i} column={column} columnIndex={i} updateBoard={updateBoard}/>
        )
      )}
    </tr>
  );
};
export default GameRow;
