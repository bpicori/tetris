import { Move } from "../tetris";
import {
  hasLeftEdgeCollision,
  hasRightEdgeCollision,
  hasBottomEdgeCollision,
  Vector2,
} from "../utils";
import { Tetromino } from "./tetromino";

export enum JshapeRotation {
  Up,
  Right,
  Down,
  Left,
}

export const Jshape: Tetromino = {
  initialShape: (board) => {
    const x = Math.floor(board.width / 2);
    return [
      [x, 0],
      [x, 1],
      [x + 1, 1],
      [x + 2, 1],
    ];
  },
  rotate: (current, boardSize, board, emptyCell) => {
    const [centerX, centerY] = current[0];

    // Calculate the positions of other pieces relative to the center
    const relativePositions = current
      .slice(1)
      .map<Vector2>(([x, y]) => [x - centerX, y - centerY]);

    // Rotate the relative positions
    const rotatedRelativePositions = relativePositions.map<Vector2>(
      ([x, y]) => [-y, x]
    );

    // Convert back to absolute positions
    const newPosition = [
      [centerX, centerY] as Vector2, // Center piece stays the same
      ...rotatedRelativePositions.map<Vector2>(([x, y]) => [
        x + centerX,
        y + centerY,
      ]),
    ];

    const isOutOfBounds = newPosition.some(
      ([x, y]) => x < 0 || x >= boardSize.width || y >= boardSize.height
    );
    if (isOutOfBounds) return current;

    const isColliding = newPosition.some(([x, y]) => board[y][x] !== emptyCell);
    if (isColliding) return current;

    return newPosition;
  },
  move: (current, move, boardSize, board, emptyCell) => {
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

    return current;
  },
};
