import { Move } from "../tetris";
import {
  hasBottomEdgeCollision,
  hasLeftEdgeCollision,
  hasRightEdgeCollision,
  Vector2,
} from "../utils";
import { Board, Tetromino } from "./tetromino";

export const Oshape: Tetromino = {
  shape: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  rotate: (current: Vector2[], board: Board): Vector2[] => {
    return current;
  },
  move: (current: Vector2[], move: Move, board: Board): Vector2[] => {
    switch (move) {
      case Move.Left:
        return hasLeftEdgeCollision(current)
          ? current
          : current.map(([x, y]) => [x - 1, y]);
      case Move.Right:
        return hasRightEdgeCollision(current, board.width)
          ? current
          : current.map(([x, y]) => [x + 1, y]);
      case Move.Down:
        return hasBottomEdgeCollision(current, board.height)
          ? current
          : current.map(([x, y]) => [x, y + 1]);
    }

    return current;
  },
};
