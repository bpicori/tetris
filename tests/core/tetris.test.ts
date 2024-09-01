import { beforeEach, describe, expect, test, vi } from "vitest";
import { IShape } from "../../src/core/shapes/Ishape";
import { BoardSize, Tetromino } from "../../src/core/shapes/tetromino";
import {
  Board,
  Color,
  createEmptyBoard,
  GameState,
  init,
  Move,
  update,
} from "../../src/core/tetris";
import { Vector2 } from "../../src/core/utils";
import { Oshape } from "../../src/core/shapes/Oshape";

describe("Tetris", () => {
  describe("#createEmptyBoard", () => {
    test("creates an empty board", () => {
      const board: BoardSize = { width: 3, height: 6 };
      expect(createEmptyBoard(board).length).toEqual(board.height);
      expect(createEmptyBoard(board)[0].length).toEqual(board.width);
    });
  });

  describe("#update", () => {
    test('when move is "rotate", should rotate the tetromino', () => {
      const move = Move.Rotate;

      const state = init({ width: 3, height: 6 });
      const moveSpy = vi.spyOn(state.tetromino, "rotate");

      update(state, 0, { width: 3, height: 6 }, 0, move);

      expect(moveSpy).toHaveBeenCalled();
    });

    test('when move is "down", should move the tetromino down', () => {
      const move = Move.Down;

      const state = init({ width: 3, height: 6 });
      const moveSpy = vi.spyOn(state.tetromino, "move");

      update(state, 0, { width: 3, height: 6 }, 0, move);

      expect(moveSpy).toHaveBeenCalled();

      moveSpy.mockRestore();
    });

    test("when time is 0, should set the current time", () => {
      const state = init({ width: 3, height: 6 });

      update(state, 0, { width: 3, height: 6 }, 0);

      expect(state.time).toEqual(0);
    });

    test("when current time - state time > speed, should move the tetromino down", () => {
      const state = {
        ...init({ width: 3, height: 6 }),
        time: 100,
      };

      const moveSpy = vi.spyOn(state.tetromino, "move");

      update(state, 200, { width: 3, height: 6 }, 10);

      expect(moveSpy).toHaveBeenCalled();
    });

    test("when current time - state time < speed, should not move the tetromino down", () => {
      const state = {
        ...init({ width: 3, height: 6 }),
        time: 100,
      };

      const moveSpy = vi.spyOn(state.tetromino, "move");

      update(state, 105, { width: 3, height: 6 }, 10);

      expect(moveSpy).not.toHaveBeenCalled();
    });

    describe("when tetromino reaches the bottom", () => {
      const boardSize = { width: 3, height: 6 };
      let state: GameState;
      let tetrominoCells: Vector2[];
      beforeEach(() => {
        tetrominoCells = [[1, 5]];
        state = {
          board: createEmptyBoard(boardSize),
          tetromino: IShape,
          tetrominoColor: Color.Red,
          tetrominoCells,
          score: 0,
          time: 0,
          gameOver: false,
        };
      });

      test("should add the tetromino to the board", () => {
        const newState = update(state, 0, boardSize, 0);

        expect(newState.board[5][1]).toEqual(Color.Red);
      });

      test("should reset the tetromino", () => {
        const newState = update(state, 0, boardSize, 0);

        expect(newState.tetrominoCells).not.toEqual(tetrominoCells);
      });

      test("should pick a new tetromino color", () => {
        const newState = update(state, 0, boardSize, 0);

        expect(newState.tetrominoColor).not.toEqual(Color.Red);
      });
    });

    describe("when tetromino touches the board", () => {
      test("should add the tetromino to the board", () => {
        const boardSize = { width: 3, height: 6 };
        const tetrominoCells: Vector2[] = [[1, 1]];
        const tetromino: Tetromino = IShape;
        const board: Board = [
          [Color.White, Color.White, Color.White],
          [Color.White, Color.White, Color.White],
          [Color.Red, Color.Red, Color.White],
          [Color.Red, Color.Red, Color.White],
          [Color.Red, Color.Red, Color.White],
          [Color.Red, Color.Red, Color.White],
        ];

        const state: GameState = {
          board,
          tetromino,
          tetrominoColor: Color.Blue,
          tetrominoCells,
          score: 0,
          time: 0,
          gameOver: false,
        };

        const newState = update(state, 0, boardSize, 0);

        expect(newState.board[1][1]).toEqual(Color.Blue);
      });

      describe("when tetromino touches the top of the board", () => {
        test("case 1: should set gameOver to true", () => {
          const boardSize = { width: 3, height: 6 };
          const tetrominoCells: Vector2[] = [[0, 0]];
          const board: Board = [
            [Color.White, Color.White, Color.White],
            [Color.Red, Color.Red, Color.White],
            [Color.Red, Color.Red, Color.White],
            [Color.Red, Color.Red, Color.White],
            [Color.Red, Color.Red, Color.White],
            [Color.Red, Color.Red, Color.White],
          ];

          const state: GameState = {
            board,
            tetromino: Oshape,
            tetrominoCells,
            tetrominoColor: Color.Blue,
            score: 0,
            time: 0,
            gameOver: false,
          };

          const newState = update(state, 0, boardSize, 0);

          expect(newState.gameOver).toEqual(true);
        });

        test("case 2: should set gameOver to true", () => {
          const boardSize = { width: 3, height: 6 };
          const tetrominoCells: Vector2[] = [
            [1, 0],
            [1, 1],
          ];

          const board: Board = [
            [Color.White, Color.White, Color.White],
            [Color.White, Color.White, Color.White],
            [Color.Red, Color.Red, Color.White],
            [Color.Red, Color.Red, Color.White],
            [Color.Red, Color.Red, Color.White],
            [Color.Red, Color.Red, Color.White],
          ];

          const state: GameState = {
            board,
            tetromino: IShape,
            tetrominoCells,
            tetrominoColor: Color.Blue,
            score: 0,
            time: 0,
            gameOver: false,
          };

          const newState = update(state, 0, boardSize, 0);

          expect(newState.gameOver).toEqual(true);
        });

        test("case 3: should set gameOver to true", () => {
          const boardSize = { width: 6, height: 6 };
          const board: Board = [
            [
              Color.White,
              Color.White,
              Color.White,
              Color.White,
              Color.White,
              Color.White,
            ],
            [Color.Red, Color.Red, Color.Red, Color.Red, Color.Red, Color.Red],
            [Color.Red, Color.Red, Color.Red, Color.Red, Color.Red, Color.Red],
            [Color.Red, Color.Red, Color.Red, Color.Red, Color.Red, Color.Red],
            [Color.Red, Color.Red, Color.Red, Color.Red, Color.Red, Color.Red],
            [Color.Red, Color.Red, Color.Red, Color.Red, Color.Red, Color.Red],
          ];

          const tetrominoCells: Vector2[] = [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
          ];

          const state: GameState = {
            board,
            tetromino: Oshape,
            tetrominoCells,
            tetrominoColor: Color.Blue,
            score: 0,
            time: 0,
            gameOver: false,
          };

          const newState = update(state, 0, boardSize, 0);

          expect(newState.gameOver).toEqual(true);
        });
      });
    });
  });
});
