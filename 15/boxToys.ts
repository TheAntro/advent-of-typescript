import { Expect, Equal } from "type-testing";

type IsUnion<T, C = T> = T extends C ? ([C] extends [T] ? false : true) : never;

type BoxToys<
  T,
  C extends number,
  Tuple extends any[] = []
> = Tuple["length"] extends C
  ? IsUnion<C> extends true
    ? [C] extends [infer N, ...infer Rest]
      ? N extends number
        ? Tuple | BoxToys<T, N>
        : never
      : Tuple
    : Tuple
  : BoxToys<T, C, [T, ...Tuple]>;

type test_doll_actual = BoxToys<"doll", 1>;
//   ^?
type test_doll_expected = ["doll"];
type test_doll = Expect<Equal<test_doll_expected, test_doll_actual>>;

type test_nutcracker_actual = BoxToys<"nutcracker", 3 | 4>;
//   ^?
type test_nutcracker_expected =
  | ["nutcracker", "nutcracker", "nutcracker"]
  | ["nutcracker", "nutcracker", "nutcracker", "nutcracker"];
type test_nutcracker = Expect<
  Equal<test_nutcracker_expected, test_nutcracker_actual>
>;

// Had to add a test case to see that it really works
type test_santa_actual = BoxToys<"santa", 3 | 4 | 5>;
//   ^?
type test_santa_expected =
  | ["santa", "santa", "santa"]
  | ["santa", "santa", "santa", "santa"]
  | ["santa", "santa", "santa", "santa", "santa"];
type test_santa = Expect<Equal<test_santa_expected, test_santa_actual>>;
