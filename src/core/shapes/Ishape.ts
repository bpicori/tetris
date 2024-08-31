import { Move } from "../tetris";
import {
  hasBottomEdgeCollision,
  hasLeftEdgeCollision,
  hasRightEdgeCollision,
  Vector2,
} from "../utils";
import { BoardSize, Tetromino } from "./tetromino";

export const IShape: Tetromino = {
  shape: (board: BoardSize) => {
    const x = Math.floor(board.width / 2);
    return [
      [x - 1, 0],
      [x, 0],
      [x + 1, 0],
      [x + 2, 0],
    ];
  },

  rotate: (current: Vector2[], board: BoardSize): Vector2[] => {
    // detect if is is horizontal or vertical
    const isHorizontal = current[0][1] === current[1][1];

    const rotateHorizontal = (current: Vector2[]): Vector2[] => {
      const [x, y] = current[1];

      // check if possible to rotate
      if (x === 0 || x === board.width - 1) {
        return current;
      }

      return [
        [x - 1, y],
        [x, y],
        [x + 1, y],
        [x + 2, y],
      ];
    };

    const rotateVertical = (current: Vector2[]): Vector2[] => {
      const [x, y] = current[1];

      // check if possible to rotate
      if (y === 0 || y === board.height - 1) {
        return current;
      }

      return [
        [x, y - 1],
        [x, y],
        [x, y + 1],
        [x, y + 2],
      ];
    };

    return isHorizontal ? rotateVertical(current) : rotateHorizontal(current);
  },

  move: (
    current: Vector2[],
    move: Move.Left | Move.Right | Move.Down,
    board: BoardSize
  ): Vector2[] => {
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
  },
};
