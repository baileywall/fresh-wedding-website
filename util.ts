export const NUMBER_TO_ELEMENT = new Map<number, string>([
  [1, "h"],
  [2, "he"],
  [3, "li"],
  [4, "be"],
  [5, "b"],
  [6, "c"],
  [7, "n"],
  [8, "o"],
  [9, "f"],
  [10, "ne"],
]);

export const ELEMENT_TO_NUMBER = NUMBER_TO_ELEMENT.entries().reduce(
  (prev, curr) => {
    prev.set(curr[1], curr[0]);
    return prev;
  },
  new Map<string, number>()
);
