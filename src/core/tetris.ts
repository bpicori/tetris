type Vector2 = readonly [number, number];

export enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green",
  Yellow = "yellow",
  Purple = "purple",
  Orange = "orange",
  Cyan = "cyan",
  White = "white",
}

export enum Move {
  Left = "left",
  Right = "right",
  Down = "down",
  Rotate = "rotate",
}

interface Tetromino {
  shape: Vector2[];
  rotate(current: Vector2[]): Vector2[];
  move(current: Vector2[], move: Move): Vector2[];
}

const IShape: Tetromino = {
  shape: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  rotate: (current: Vector2[]): Vector2[] => {
    // detect if is is horizontal or vertical
    const isHorizontal = current[0][1] === current[1][1];

    const rotateHorizontal = (current: Vector2[]): Vector2[] => {
      const [x, y] = current[1];


      // check if possible to rotate
      if (x === 0 || x === BOARD_WIDTH - 1) {
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
      if (y === 0 || y === BOARD_HEIGHT - 1) {
        return current;
      }


      return [
        [x, y - 1],
        [x, y],
        [x, y + 1],
        [x, y + 2],
      ];
    };
    console.log(
      isHorizontal ? rotateVertical(current) : rotateHorizontal(current)
    );

    return isHorizontal ? rotateVertical(current) : rotateHorizontal(current);
  },

  move: (
    current: Vector2[],
    move: Move.Left | Move.Right | Move.Down
  ): Vector2[] => {
    switch (move) {
      case Move.Left:
        const isLeftEdge = current.some(([x]) => x === 0);
        return isLeftEdge ? current : current.map(([x, y]) => [x - 1, y]);
      case Move.Right:
        const isRightEdge = current.some(([x]) => x === BOARD_WIDTH - 1);
        return isRightEdge ? current : current.map(([x, y]) => [x + 1, y]);
      case Move.Down:
        const isBottomEdge = current.some(([_, y]) => y === BOARD_HEIGHT - 1);
        return isBottomEdge ? current : current.map(([x, y]) => [x, y + 1]);
    }
  },
};

export type GameState = {
  board: Color[][];
  tetromino: Vector2[];
  tetrominoColor: Color;
  score: number;
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const createEmptyBoard = (
  width = BOARD_WIDTH,
  height = BOARD_HEIGHT
): Color[][] =>
  Array(height)
    .fill(null)
    .map(() => Array(width).fill(Color.White));

export const init = (): GameState => {
  return {
    board: createEmptyBoard(),
    tetromino: IShape.shape,
    tetrominoColor: Color.Red,
    score: 0,
  };
};

export const update = (
  state: GameState,
  lastTime: number,
  currentTime: number,
  move?: Move
): GameState => {
  if (move) {
    if (move === Move.Rotate) {
      console.log("rotate");
      state.tetromino = IShape.rotate(state.tetromino);
    } else {
      state.tetromino = IShape.move(state.tetromino, move);
    }
  }

  return { ...state };
};
