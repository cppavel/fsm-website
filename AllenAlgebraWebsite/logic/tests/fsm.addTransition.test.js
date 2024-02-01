const Fsm = require("../src/fsm.js");
const State = require("../src/state.js");

describe("addTransition", () => {
  let fsm;

  beforeEach(() => {
    fsm = new Fsm();
    fsm.addState(new State("state1"));
    fsm.addState(new State("state2"));
  });

  test("should add a transition", () => {
    fsm.addTransition("state1", "state2", ["a"], 1.0);
    expect(fsm.alphabet.has(["a"])).toBe(true);
  });

  test("should throw error if start state does not exist", () => {
    expect(() =>
      fsm.addTransition("nonExistentState", "state2", ["a"], 1.0)
    ).toThrow(Error);
  });

  test("should throw error if end state does not exist", () => {
    expect(() =>
      fsm.addTransition("state1", "nonExistentState", ["a"], 1.0)
    ).toThrow(Error);
  });
});
