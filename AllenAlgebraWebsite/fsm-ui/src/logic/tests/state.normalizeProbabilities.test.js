const State = require("../src/state.js");

describe("State", () => {
  describe("normalizeProbabilities", () => {
    test("should correctly normalize probabilities", () => {
      const state = new State("test");
      state.probabilities.set("a", 1);
      state.probabilities.set("b", 2);
      state.probabilities.set("c", 3);

      state.normalizeProbabilities();

      expect(state.probabilities.get("a")).toBeCloseTo(1 / 6);
      expect(state.probabilities.get("b")).toBeCloseTo(2 / 6);
      expect(state.probabilities.get("c")).toBeCloseTo(3 / 6);
    });

    test("should handle empty probabilities", () => {
      const state = new State("test");
      state.normalizeProbabilities();
      expect(state.probabilities.size()).toBe(0);
    });
  });
});
