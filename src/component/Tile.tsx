import React, { useState } from "react";
import { Column } from "src/component/interfaces/Column";

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
}: Props): JSX.Element => {
  const [hoverTile, setHoverTile] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const tileStatus = column.player === 1 ? "player1" : column.player === 2 ? "player2" : "open";

  const handleMouseEnter = () => {
    const bottomEmptyTileIndex = getBottomEmptyTileIndex();
    setHoverTile(bottomEmptyTileIndex);
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
          <div className={`coin-shadow${currentPlayer === 2 ? ' player2-shadow' : ''}`} />
        )}
        <div className={[tileStatus, "circle"].join(" ")}></div>
      </div>
    </td>
  );
};

export default Tile;
