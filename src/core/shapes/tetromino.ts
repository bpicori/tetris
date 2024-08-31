import { Move } from "../tetris";
import { Vector2 } from "../utils";

export interface BoardSize {
  width: number;
  height: number;
}

export interface Tetromino {
  shape(board: BoardSize): Vector2[];
  rotate(current: Vector2[], board: BoardSize): Vector2[];
  move(current: Vector2[], move: Move, board: BoardSize): Vector2[];
}
