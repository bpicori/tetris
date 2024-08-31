import { Move } from "../tetris";
import {
  hasBottomEdgeCollision,
  hasLeftEdgeCollision,
  hasRightEdgeCollision,
  Vector2,
} from "../utils";
import { BoardSize, Tetromino } from "./tetromino";

export const Oshape: Tetromino = {
  shape: (board: BoardSize) => {
    const x = Math.floor(board.width / 2);
    return [
      [x, 0],
      [x + 1, 0],
      [x, 1],
      [x + 1, 1],
    ];
  },
  rotate: (current: Vector2[], _board: BoardSize): Vector2[] => {
    return current;
  },
  move: (current: Vector2[], move: Move, board: BoardSize): Vector2[] => {
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
