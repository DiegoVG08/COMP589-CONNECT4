import React, { useState } from "react";
import { Column } from "src/component/interfaces/Column";
import '../App.css';

interface Props {
  columnIndex: number;
  column: Column;
  updateBoard: (columnIndex: number) => void;
  currentPlayer: number;
  hoverTile: number | null;
  setHoverTile: (hoverTile: number | null) => void;
}

const Tile: React.FunctionComponent<Props> = ({
  columnIndex,
  updateBoard,
  column,
  currentPlayer,
  hoverTile,
  setHoverTile,
}: Props): JSX.Element => {
  const [isHovering, setIsHovering] = useState(false);
  let tileStatus = "open";
  let coinShadowClass = "";

  if (column.player === 1) {
    tileStatus = "player1";
    coinShadowClass = "coin-shadow-red";
  } else if (column.player === 2) {
    tileStatus = "player2";
    coinShadowClass = "coin-shadow-yellow";
  }

  const handleMouseEnter = () => {
    setHoverTile(getBottomEmptyTileIndex());
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setHoverTile(null);
    setIsHovering(false);
  };

  const getBottomEmptyTileIndex = () => {
    for (let i = column.tiles.length - 1; i >= 0; i--) {
      if (column.tiles[i] === 0) {
        return i;
      }
    }
    return -1;
  };

  return (
    <td>
      <div
        className="tile"
        onClick={() => updateBoard(columnIndex)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hoverTile === getBottomEmptyTileIndex() && isHovering && (
          <div className={`coin-shadow ${coinShadowClass}`} />
        )}
        <div className={[tileStatus, "circle"].join(" ")}></div>
      </div>
    </td>
  );
};

export default Tile;
