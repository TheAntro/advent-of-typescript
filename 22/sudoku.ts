// Could not bring myself to finish this. Had a great December with these, thanks :)
import { Equal, Expect } from "type-testing";

/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer =
  | Dasher
  | Dancer
  | Prancer
  | Vixen
  | Comet
  | Cupid
  | Donner
  | Blitzen
  | Rudolph;

type Row = [
  [Reindeer, Reindeer, Reindeer],
  [Reindeer, Reindeer, Reindeer],
  [Reindeer, Reindeer, Reindeer]
];
type SudokuGame = [Row, Row, Row, Row, Row, Row, Row, Row, Row];

// Thanks jcalz for inspiration: https://stackoverflow.com/questions/72863199/how-to-check-if-tuple-includes-a-particular-type-inside-a-conditional-type
type IncludesReindeer<T extends Reindeer[], C extends Reindeer> = {
  [I in keyof T]: T[I] extends C ? unknown : never;
}[number] extends never
  ? false
  : true;

type GetNewSlot<
  Checked extends any[],
  CurSlot extends number
> = Checked["length"] extends 0
  ? 0
  : Checked["length"] extends 3
  ? 1
  : Checked["length"] extends 6
  ? 2
  : CurSlot;
type GetNewSlotCol<
  Checked extends any[],
  CurSlotCol extends any[]
> = Checked["length"] extends 0 | 3 | 6 ? [] : [0, ...CurSlotCol];

type ValidateRow<
  R extends Row,
  Checked extends Reindeer[] = [],
  Slot extends number = 0,
  SlotCol extends any[] = []
> = Checked["length"] extends 9
  ? true
  : R[Slot][SlotCol["length"]] extends infer Current extends Reindeer
  ? IncludesReindeer<Checked, Current> extends true
    ? false
    : [Current, ...Checked] extends infer NewChecked extends Reindeer[]
    ? ValidateRow<
        R,
        NewChecked,
        GetNewSlot<NewChecked, Slot>,
        GetNewSlotCol<NewChecked, SlotCol>
      >
    : never
  : never;

type ValidateRows<T extends Row[]> = T extends [
  infer R extends Row,
  ...infer Rest extends Row[]
]
  ? ValidateRow<R> extends false
    ? false
    : ValidateRows<Rest>
  : true;

type GetNewColValChecked<T extends Reindeer[], Current extends Reindeer> = [
  Current,
  ...T
] extends infer NewColValChecked extends Reindeer[]
  ? NewColValChecked["length"] extends 9
    ? []
    : NewColValChecked
  : never;

type GetNewCheckedCols<
  CurrentCols extends any[],
  NewColValChecked extends any[]
> = NewColValChecked["length"] extends 0 ? [0, ...CurrentCols] : CurrentCols;

type ValidateColumns<
  G extends SudokuGame,
  Checked extends Reindeer[] = [],
  CheckedCols extends any[] = [],
  Slot extends number = 0,
  Col extends any[] = []
> = CheckedCols["length"] extends 9
  ? true
  : G[Checked["length"]][Slot][Col["length"]] extends infer Current extends Reindeer
  ? IncludesReindeer<Checked, Current> extends true
    ? false
    : GetNewColValChecked<
        Checked,
        Current
      > extends infer NewChecked extends Reindeer[]
    ? GetNewCheckedCols<
        CheckedCols,
        NewChecked
      > extends infer NewCheckedCols extends any[]
      ? /* Add more type stuff here */ false
      : never
    : never
  : never;

type Validate<G extends SudokuGame> = ValidateRows<G> extends false
  ? false
  : true;

type checkIncludes = IncludesReindeer<["💃", "🦌", "💨"], Blitzen>;

type checkFalse = ValidateRow<
  [["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["⚡", "🔴", "🌟"]]
>;
type checkTrue = ValidateRow<
  [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]]
>;

type test_sudoku_1_actual = Validate<
  [
    //   ^?
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"], ["🔴", "🌩️", "🌟"]],
    [["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"]],
    [["⚡", "☄️", "❤️"], ["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["🌩️", "🔴", "⚡"]],
    [["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"]],
    [["❤️", "🌟", "☄️"], ["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"]]
  ]
>;
type test_sudoku_1 = Expect<Equal<test_sudoku_1_actual, true>>;

type test_sudoku_2_actual = Validate<
  [
    //   ^?
    [["🌩️", "💨", "☄️"], ["🌟", "🦌", "⚡"], ["❤️", "🔴", "💃"]],
    [["🌟", "⚡", "❤️"], ["🔴", "💃", "☄️"], ["🌩️", "💨", "🦌"]],
    [["🔴", "🦌", "💃"], ["💨", "❤️", "🌩️"], ["🌟", "⚡", "☄️"]],
    [["❤️", "☄️", "🌩️"], ["💃", "⚡", "🔴"], ["💨", "🦌", "🌟"]],
    [["🦌", "💃", "⚡"], ["🌩️", "🌟", "💨"], ["🔴", "☄️", "❤️"]],
    [["💨", "🌟", "🔴"], ["🦌", "☄️", "❤️"], ["⚡", "💃", "🌩️"]],
    [["☄️", "🔴", "💨"], ["❤️", "🌩️", "🦌"], ["💃", "🌟", "⚡"]],
    [["💃", "❤️", "🦌"], ["⚡", "🔴", "🌟"], ["☄️", "🌩️", "💨"]],
    [["⚡", "🌩️", "🌟"], ["☄️", "💨", "💃"], ["🦌", "❤️", "🔴"]]
  ]
>;
type test_sudoku_2 = Expect<Equal<test_sudoku_2_actual, true>>;

type test_sudoku_3_actual = Validate<
  [
    //   ^?
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🌟", "⚡", "💨"], ["❤️", "💃", "🔴"], ["☄️", "🌩️", "🦌"]],
    [["☄️", "🌩️", "❤️"], ["⚡", "🌟", "🦌"], ["💃", "🔴", "💨"]],
    [["🌩️", "💃", "🔴"], ["🦌", "💨", "⚡"], ["🌟", "☄️", "❤️"]],
    [["❤️", "☄️", "⚡"], ["💃", "🌩️", "🌟"], ["🦌", "💨", "🔴"]],
    [["💨", "🌟", "🦌"], ["☄️", "🔴", "❤️"], ["🌩️", "💃", "⚡"]],
    [["💃", "💨", "🌟"], ["🔴", "🦌", "☄️"], ["❤️", "⚡", "🌩️"]],
    [["🔴", "❤️", "☄️"], ["🌟", "⚡", "🌩️"], ["💨", "🦌", "💃"]],
    [["⚡", "🦌", "🌩️"], ["💨", "❤️", "💃"], ["🔴", "🌟", "☄️"]]
  ]
>;
type test_sudoku_3 = Expect<Equal<test_sudoku_3_actual, true>>;

type test_sudoku_4_actual = Validate<
  [
    //   ^?
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"], ["🔴", "🌩️", "🌟"]],
    [["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"]],
    [["⚡", "☄️", "❤️"], ["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["⚡", "🔴", "🌟"]],
    [["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"]],
    [["❤️", "🌟", "☄️"], ["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"]]
  ]
>;
type test_sudoku_4 = Expect<Equal<test_sudoku_4_actual, false>>;

type test_sudoku_5_actual = Validate<
  [
    //   ^?
    [["🌩️", "💨", "☄️"], ["🌟", "🦌", "⚡"], ["❤️", "🔴", "💃"]],
    [["🌟", "⚡", "❤️"], ["🔴", "💃", "☄️"], ["🌩️", "💨", "🦌"]],
    [["🔴", "🦌", "💃"], ["💨", "❤️", "🌩️"], ["🌟", "⚡", "☄️"]],
    [["❤️", "☄️", "🌩️"], ["💃", "⚡", "🔴"], ["💨", "🦌", "🌟"]],
    [["🦌", "💃", "⚡"], ["🌩️", "🌟", "💨"], ["🔴", "☄️", "❤️"]],
    [["💨", "🌟", "🔴"], ["🦌", "☄️", "❤️"], ["⚡", "💃", "🌩️"]],
    [["☄️", "🔴", "💨"], ["❤️", "💃", "🦌"], ["💃", "🌟", "⚡"]],
    [["💃", "❤️", "🦌"], ["⚡", "🔴", "🌟"], ["☄️", "🌩️", "💨"]],
    [["⚡", "🌩️", "🌟"], ["☄️", "💨", "💃"], ["🦌", "❤️", "🔴"]]
  ]
>;
type test_sudoku_5 = Expect<Equal<test_sudoku_5_actual, false>>;

type test_sudoku_6_actual = Validate<
  [
    //   ^?
    [["⚡", "🔴", "🌩️"], ["🦌", "❤️", "💨"], ["💨", "🌟", "☄️"]],
    [["❤️", "🦌", "🌟"], ["💨", "🌟", "🔴"], ["💃", "⚡", "🌩️"]],
    [["💨", "💃", "🌟"], ["☄️", "⚡", "🌩️"], ["🔴", "❤️", "🦌"]],
    [["🦌", "⚡", "🔴"], ["❤️", "💃", "💨"], ["☄️", "🌩️", "🌟"]],
    [["🌟", "🌩️", "💃"], ["⚡", "🔴", "☄️"], ["❤️", "🦌", "💨"]],
    [["☄️", "💨", "❤️"], ["🌟", "🌩️", "🦌"], ["⚡", "💃", "🔴"]],
    [["🌩️", "☄️", "💨"], ["💃", "🦌", "⚡"], ["🌟", "🔴", "❤️"]],
    [["🔴", "❤️", "⚡"], ["🌩️", "☄️", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🌟", "🦌"], ["🔴", "💨", "❤️"], ["🌩️", "☄️", "⚡"]]
  ]
>;
type test_sudoku_6 = Expect<Equal<test_sudoku_6_actual, false>>;

type test_sudoku_7_actual = Validate<
  [
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["💃", "🦌", "☄️"], ["❤️", "🌩️", "🌟"], ["⚡", "🔴", "💨"]],
    [["🦌", "☄️", "❤️"], ["🌩️", "🌟", "⚡"], ["🔴", "💨", "💃"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["❤️", "🌩️", "🌟"], ["⚡", "🔴", "💨"], ["💃", "🦌", "☄️"]],
    [["🌩️", "🌟", "⚡"], ["🔴", "💨", "💃"], ["🦌", "☄️", "❤️"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["⚡", "🔴", "💨"], ["💃", "🦌", "☄️"], ["❤️", "🌩️", "🌟"]],
    [["🔴", "💨", "💃"], ["🦌", "☄️", "❤️"], ["🌩️", "🌟", "⚡"]]
  ]
>;

type test_sudoku_7 = Expect<Equal<test_sudoku_7_actual, false>>;

type test_sudoku_8_actual = Validate<
  [
    //   ^?
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]]
  ]
>;

type test_sudoku_8 = Expect<Equal<test_sudoku_8_actual, false>>;
