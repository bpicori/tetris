import { Move } from "../tetris";
import { Vector2 } from "../utils";

export interface Board {
  width: number;
  height: number;
}

export interface Tetromino {
  shape: Vector2[];
  rotate(current: Vector2[], board: Board): Vector2[];
  move(current: Vector2[], move: Move, board: Board): Vector2[];
}
