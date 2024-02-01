const FSM = require("../src/fsm.js");
const State = require("../src/state.js");

describe("markAsFinal", () => {
  let fsm;

  beforeEach(() => {
    fsm = new FSM();
    fsm.addState(new State("state1"));
  });

  test("should mark a state as final", () => {
    fsm.markAsFinal("state1");
    expect(fsm.finalStateLabels.has("state1")).toBe(true);
  });

  test("should throw error if trying to mark a non-existent state as final", () => {
    expect(() => fsm.markAsFinal("nonExistentState")).toThrow(Error);
  });
});
