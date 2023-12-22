import { Equal, Expect } from "type-testing";

type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTacToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTacToeBoard;
  state: TicTacToeState;
};

type Positions = {
  top: 0;
  middle: 1;
  bottom: 2;
  left: 0;
  center: 1;
  right: 2;
};

type EmptyBoard = [
  [TicTacToeEmptyCell, TicTacToeEmptyCell, TicTacToeEmptyCell],
  [TicTacToeEmptyCell, TicTacToeEmptyCell, TicTacToeEmptyCell],
  [TicTacToeEmptyCell, TicTacToeEmptyCell, TicTacToeEmptyCell]
];

type InsertX<
  Row extends TicTacToeCell[],
  X extends 0 | 1 | 2,
  C extends TicTacToeChip
> = X extends 0
  ? [C, Row[1], Row[2]]
  : X extends 1
  ? [Row[0], C, Row[2]]
  : [Row[0], Row[1], C];

type InsertChip<
  G extends TicTacToeGame,
  X extends 0 | 1 | 2,
  Y extends 0 | 1 | 2,
  C extends TicTacToeChip
> = G["board"][Y][X] extends TicTacToeEmptyCell
  ? Y extends 0
    ? [InsertX<G["board"][0], X, C>, G["board"][1], G["board"][2]]
    : Y extends 1
    ? [G["board"][0], InsertX<G["board"][1], X, C>, G["board"][2]]
    : [G["board"][0], G["board"][1], InsertX<G["board"][2], X, C>]
  : false;

type NewGame = {
  board: EmptyBoard;
  state: "❌";
};

// type Board = [[Field, Field, Field], [Field, Field, Field], [Field, Field, Field]]

type TurnChange<T extends TicTacToeState> = T extends TicTacToeChip
  ? T extends "❌"
    ? "⭕"
    : "❌"
  : never;

type Field = TicTacToeEmptyCell | TicTacToeChip;

type WinsWithRow<
  B extends TicTacToeBoard,
  C extends TicTacToeChip,
  Y extends any[] = []
> = Y["length"] extends 3
  ? false
  : B[Y["length"]][0] extends C
  ? B[Y["length"]][1] extends C
    ? B[Y["length"]][2] extends C
      ? true
      : WinsWithRow<B, C, [0, ...Y]>
    : WinsWithRow<B, C, [0, ...Y]>
  : WinsWithRow<B, C, [0, ...Y]>;

type WinsWithColumn<
  B extends TicTacToeBoard,
  C extends TicTacToeChip,
  X extends any[] = []
> = X["length"] extends 3
  ? false
  : B[0][X["length"]] extends C
  ? B[1][X["length"]] extends C
    ? B[2][X["length"]] extends C
      ? true
      : WinsWithColumn<B, C, [0, ...X]>
    : WinsWithColumn<B, C, [0, ...X]>
  : WinsWithColumn<B, C, [0, ...X]>;

type Draw<
  B extends TicTacToeBoard,
  X extends any[] = [],
  Y extends any[] = []
> = B[Y["length"]][X["length"]] extends TicTacToeEmptyCell
  ? false
  : Y["length"] extends 3
  ? true
  : X["length"] extends 2
  ? Draw<B, [], [0, ...Y]>
  : Draw<B, [0, ...X], Y>;

type ChipWinMessage<C extends TicTacToeChip> = C extends "❌"
  ? "❌ Won"
  : "⭕ Won";

// Tests only contain row/column wins, so did not implement a cross-axis win condition
type ChangeTurnOrAnnounceWinner<
  B extends TicTacToeBoard,
  S extends TicTacToeState
> = S extends TicTacToeChip
  ? Draw<B> extends true
    ? "Draw"
    : WinsWithRow<B, S> extends true
    ? ChipWinMessage<S>
    : WinsWithColumn<B, S> extends true
    ? ChipWinMessage<S>
    : TurnChange<S>
  : S;

type TicTacToe<
  G extends TicTacToeGame,
  Pos extends TicTacToePositions
> = G["state"] extends TicTacToeChip
  ? Pos extends `${infer Y}-${infer X}`
    ? Y extends keyof Positions
      ? X extends keyof Positions
        ? InsertChip<
            G,
            Positions[X],
            Positions[Y],
            G["state"]
          > extends TicTacToeBoard
          ? {
              board: InsertChip<G, Positions[X], Positions[Y], G["state"]>;
              state: ChangeTurnOrAnnounceWinner<
                InsertChip<G, Positions[X], Positions[Y], G["state"]>,
                G["state"]
              >;
            }
          : { board: G["board"]; state: G["state"] }
        : never
      : never
    : never
  : never;

type test_move1_actual = TicTacToe<NewGame, "top-center">;
//   ^?
type test_move1_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, "top-left">;
//   ^?
type test_move2_expected = {
  board: [["⭕", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "❌";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, "middle-center">;
//   ^?
type test_move3_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, "bottom-left">;
//   ^?
type test_move4_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "  "]];
  state: "❌";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_x_win_actual = TicTacToe<test_move4_actual, "bottom-center">;
//   ^?
type test_x_win_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "❌", "  "]];
  state: "❌ Won";
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, "bottom-right">;
//   ^?
type type_move5_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕";
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, "middle-left">;
//   ^?
type test_o_win_expected = {
  board: [["⭕", "❌", "  "], ["⭕", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕ Won";
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, "top-center">;
//   ^?
type test_invalid_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "  "]];
  state: "⭕";
};
type test_draw_actual = TicTacToe<test_before_draw, "bottom-right">;
//   ^?
type test_draw_expected = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "⭕"]];
  state: "Draw";
};
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
