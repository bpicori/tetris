import { Board, Move } from "../tetris";
import { Vector2 } from "../utils";

export interface BoardSize {
  width: number;
  height: number;
}

export interface Tetromino {
  initialShape(boardSize: BoardSize): Vector2[];
  rotate(
    current: Vector2[],
    boardSize: BoardSize,
    board: Board,
    emptyCell: string
  ): Vector2[];
  move(
    current: Vector2[],
    move: Move,
    boardSize: BoardSize,
    board: Board,
    emptyCell: string
  ): Vector2[];
}
