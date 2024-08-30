import { Move } from "../tetris";
import { Vector2 } from "../utils";
import { Board, Tetromino } from "./tetromino";

export const IShape: Tetromino = {
  shape: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  rotate: (current: Vector2[], board: Board): Vector2[] => {
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
    board: Board
  ): Vector2[] => {
    switch (move) {
      case Move.Left:
        const isLeftEdge = current.some(([x]) => x === 0);
        return isLeftEdge ? current : current.map(([x, y]) => [x - 1, y]);
      case Move.Right:
        const isRightEdge = current.some(([x]) => x === board.width - 1);
        return isRightEdge ? current : current.map(([x, y]) => [x + 1, y]);
      case Move.Down:
        const isBottomEdge = current.some(([_, y]) => y === board.height - 1);
        return isBottomEdge ? current : current.map(([x, y]) => [x, y + 1]);
    }
  },
};
