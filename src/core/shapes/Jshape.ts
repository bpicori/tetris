import { Move } from "../tetris";
import {
  hasLeftEdgeCollision,
  hasRightEdgeCollision,
  hasBottomEdgeCollision,
  createVector,
} from "../utils";
import { Tetromino } from "./tetromino";

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
  rotate: (current) => {
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
  move: (current, move, boardSize, board) => {
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
