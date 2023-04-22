import { Row } from "src/component/interfaces/Row";

export interface Board {
  rows: Row[];
  currPlayer: number;
  getEmptyColumns: () => number[];
  clone: () => Board;
  placeToken: (col: number, player: number) => boolean;
  isFull: () => boolean;
  hasWinner: () => boolean;
  dropDisc: (column: number, player: number) => void;
  checkForWinner: () => boolean;
}
