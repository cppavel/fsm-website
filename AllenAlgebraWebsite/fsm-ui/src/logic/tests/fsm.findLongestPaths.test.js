const Fsm = require("../src/fsm.js");
const State = require("../src/state.js");

describe("FSM", () => {
  describe("findLongestPaths", () => {
    test("should correctly find longest paths", () => {
      const fsm = new Fsm();
      fsm.addState(new State("a"));
      fsm.addState(new State("b"));
      fsm.addState(new State("c"));
      fsm.addTransition("a", "b", ["ab"], 0.6);
      fsm.addTransition("b", "c", ["bc"], 0.3);
      fsm.addTransition("a", "c", ["ac"], 0.3);

      const longestPaths = fsm.findLongestPaths();

      expect(longestPaths.entries()).toEqual([
        ['"a"', 0],
        ['"b"', 1],
        ['"c"', 2],
      ]);
    });

    test("should handle FSM with no states", () => {
      const fsm = new Fsm();

      const longestPaths = fsm.findLongestPaths();

      expect(longestPaths.entries()).toEqual([]);
    });
  });
});
