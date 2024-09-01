import { Move } from "../tetris";
import {
  hasLeftEdgeCollision,
  hasRightEdgeCollision,
  hasBottomEdgeCollision,
  Vector2,
  createVector,
} from "../utils";
import { Tetromino } from "./tetromino";

enum Positions {
  Zero,
  Right,
  Left,
  Two,
}

const detectPosition = (current: Vector2[]): Positions => {
  const [[x1, y1], [x2, y2], [x3, y3], [x4, y4]] = current.sort(
    (a, b) => a[0] - b[0]
  );

  if (x1 === x2 && y1 < y2 && x2 < x3) {
    return Positions.Zero;
  }

  if (x1 > x2 && y1 === y2 && y2 < y3) {
    return Positions.Right;
  }

  if (x1 === x2 && y1 > y2 && x2 < x3) {
    return Positions.Left;
  }

  if (x1 < x2 && y1 === y2 && y3 < y2) {
    return Positions.Two;
  }

  throw new Error("Invalid position on detection");
};

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
  rotate: (current, boardSize) => {
    const [centerX, centerY] = current[0]; // The center piece

    // Calculate the positions of other pieces relative to the center
    const relativePositions = current
      .slice(1)
      .map(([x, y]) => [x - centerX, y - centerY]);

    // Rotate the relative positions
    const rotatedRelativePositions = relativePositions.map(([x, y]) => [-y, x]);

    // Convert back to absolute positions
    return [
      createVector(centerX, centerY), // Center piece stays the same
      ...rotatedRelativePositions.map(([x, y]) =>
        createVector(x + centerX, y + centerY)
      ),
    ];
  },
  move: (current, move, board) => {
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
