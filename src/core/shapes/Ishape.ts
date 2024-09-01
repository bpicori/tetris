import { Move } from "../tetris";
import {
  hasBottomEdgeCollision,
  hasLeftEdgeCollision,
  hasRightEdgeCollision,
  Vector2,
} from "../utils";
import { BoardSize, Tetromino } from "./tetromino";

export const IShape: Tetromino = {
  initialShape: (boardSize: BoardSize) => {
    const x = Math.floor(boardSize.width / 2);
    return [
      [x - 1, 0],
      [x, 0],
      [x + 1, 0],
      [x + 2, 0],
    ];
  },

  rotate: (current, boardSize, board, emptyCell): Vector2[] => {
    // detect if is is horizontal or vertical
    const isHorizontal = current[0][1] === current[1][1];

    const rotateHorizontal = (current: Vector2[]): Vector2[] => {
      const [x, y] = current[1];

      // check if possible to rotate
      if (x === 0 || x === boardSize.width - 1) {
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
      if (y === 0 || y === boardSize.height - 1) {
        return current;
      }

      return [
        [x, y - 1],
        [x, y],
        [x, y + 1],
        [x, y + 2],
      ];
    };

    const newPosition = isHorizontal
      ? rotateVertical(current)
      : rotateHorizontal(current);

    // check if has collision
    if (newPosition.some(([x, y]) => board[y][x] !== emptyCell)) {
      return current;
    }

    return newPosition;
  },

  move: (
    current,
    move: Move.Left | Move.Right | Move.Down,
    boardSize,
    board,
    emptyCell
  ): Vector2[] => {
    switch (move) {
      case Move.Left:
        return hasLeftEdgeCollision(current, board, emptyCell)
          ? current
          : current.map(([x, y]) => [x - 1, y]);
      case Move.Right:
        return hasRightEdgeCollision(current, boardSize.width, board, emptyCell)
          ? current
          : current.map(([x, y]) => [x + 1, y]);
      case Move.Down:
        return hasBottomEdgeCollision(
          current,
          boardSize.height,
          board,
          emptyCell
        )
          ? current
          : current.map(([x, y]) => [x, y + 1]);
    }
  },
};
