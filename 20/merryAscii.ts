import { Equal, Expect } from "type-testing";

type Letters = {
  A: ["█▀█ ", "█▀█ ", "▀ ▀ "];
  B: ["█▀▄ ", "█▀▄ ", "▀▀  "];
  C: ["█▀▀ ", "█ ░░", "▀▀▀ "];
  E: ["█▀▀ ", "█▀▀ ", "▀▀▀ "];
  H: ["█ █ ", "█▀█ ", "▀ ▀ "];
  I: ["█ ", "█ ", "▀ "];
  M: ["█▄░▄█ ", "█ ▀ █ ", "▀ ░░▀ "];
  N: ["█▄░█ ", "█ ▀█ ", "▀ ░▀ "];
  P: ["█▀█ ", "█▀▀ ", "▀ ░░"];
  R: ["█▀█ ", "██▀ ", "▀ ▀ "];
  S: ["█▀▀ ", "▀▀█ ", "▀▀▀ "];
  T: ["▀█▀ ", "░█ ░", "░▀ ░"];
  Y: ["█ █ ", "▀█▀ ", "░▀ ░"];
  W: ["█ ░░█ ", "█▄▀▄█ ", "▀ ░ ▀ "];
  " ": ["░", "░", "░"];
  ":": ["#", "░", "#"];
  "*": ["░", "#", "░"];
};

type ToAsciiArt<
  T extends string,
  Row extends [string, string, string] = ["", "", ""],
  Result extends string[] = []
> = T extends `${infer S}${infer Rest}`
  ? S extends "\n"
    ? ToAsciiArt<Rest, ["", "", ""], [...Result, Row[0], Row[1], Row[2]]>
    : Uppercase<S> extends infer K
    ? K extends keyof Letters
      ? ToAsciiArt<
          Rest,
          [
            `${Row[0]}${Letters[K][0]}`,
            `${Row[1]}${Letters[K][1]}`,
            `${Row[2]}${Letters[K][2]}`
          ],
          Result
        >
      : never
    : never
  : Row[0] extends ""
  ? Result
  : ToAsciiArt<T, ["", "", ""], [...Result, Row[0], Row[1], Row[2]]>;

type test_0_actual = ToAsciiArt<"   * : * Merry * : *   \n  Christmas  ">;
//   ^?
type test_0_expected = [
  "░░░░░#░░░█▄░▄█ █▀▀ █▀█ █▀█ █ █ ░░░#░░░░░",
  "░░░#░░░#░█ ▀ █ █▀▀ ██▀ ██▀ ▀█▀ ░#░░░#░░░",
  "░░░░░#░░░▀ ░░▀ ▀▀▀ ▀ ▀ ▀ ▀ ░▀ ░░░░#░░░░░",
  "░░█▀▀ █ █ █▀█ █ █▀▀ ▀█▀ █▄░▄█ █▀█ █▀▀ ░░",
  "░░█ ░░█▀█ ██▀ █ ▀▀█ ░█ ░█ ▀ █ █▀█ ▀▀█ ░░",
  "░░▀▀▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀ ░▀ ░▀ ░░▀ ▀ ▀ ▀▀▀ ░░"
];
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>;

type test_1_actual = ToAsciiArt<"  Happy new  \n  * : * : * Year * : * : *  ">;
//   ^?
type test_1_expected = [
  "░░█ █ █▀█ █▀█ █▀█ █ █ ░█▄░█ █▀▀ █ ░░█ ░░",
  "░░█▀█ █▀█ █▀▀ █▀▀ ▀█▀ ░█ ▀█ █▀▀ █▄▀▄█ ░░",
  "░░▀ ▀ ▀ ▀ ▀ ░░▀ ░░░▀ ░░▀ ░▀ ▀▀▀ ▀ ░ ▀ ░░",
  "░░░░#░░░#░░░█ █ █▀▀ █▀█ █▀█ ░░░#░░░#░░░░",
  "░░#░░░#░░░#░▀█▀ █▀▀ █▀█ ██▀ ░#░░░#░░░#░░",
  "░░░░#░░░#░░░░▀ ░▀▀▀ ▀ ▀ ▀ ▀ ░░░#░░░#░░░░"
];
type test_1 = Expect<Equal<test_1_actual, test_1_expected>>;

type test_2_actual =
  ToAsciiArt<"  * : * : * : * : * : * \n  Trash  \n  * : * : * : * : * : * ">;
//   ^?
type test_2_expected = [
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░▀█▀ █▀█ █▀█ █▀▀ █ █ ░░",
  "░░░█ ░██▀ █▀█ ▀▀█ █▀█ ░░",
  "░░░▀ ░▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀ ░░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░"
];
type test_2 = Expect<Equal<test_2_actual, test_2_expected>>;

type test_3_actual =
  ToAsciiArt<"  : * : * : * : * : * : * : \n  Ecyrbe  \n  : * : * : * : * : * : * : ">;
//   ^?
type test_3_expected = [
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░█▀▀ █▀▀ █ █ █▀█ █▀▄ █▀▀ ░░",
  "░░█▀▀ █ ░░▀█▀ ██▀ █▀▄ █▀▀ ░░",
  "░░▀▀▀ ▀▀▀ ░▀ ░▀ ▀ ▀▀  ▀▀▀ ░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░"
];
type test_3 = Expect<Equal<test_3_actual, test_3_expected>>;
