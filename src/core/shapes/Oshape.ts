import { Move } from "../tetris";
import {
  hasBottomEdgeCollision,
  hasLeftEdgeCollision,
  hasRightEdgeCollision,
  Vector2,
} from "../utils";
import { BoardSize, Tetromino } from "./tetromino";

export const Oshape: Tetromino = {
  initialShape: (board: BoardSize) => {
    const x = Math.floor(board.width / 2);
    return [
      [x, 0],
      [x + 1, 0],
      [x, 1],
      [x + 1, 1],
    ];
  },
  rotate: (current): Vector2[] => {
    return current;
  },
  move: (current, move, boardSize, board): Vector2[] => {
    switch (move) {
      case Move.Left:
        return hasLeftEdgeCollision(current, board)
          ? current
          : current.map(([x, y]) => [x - 1, y]);
      case Move.Right:
        return hasRightEdgeCollision(current, boardSize.width, board)
          ? current
          : current.map(([x, y]) => [x + 1, y]);
      case Move.Down:
        return hasBottomEdgeCollision(current, boardSize.height, board)
          ? current
          : current.map(([x, y]) => [x, y + 1]);
    }

    return current;
  },
};
