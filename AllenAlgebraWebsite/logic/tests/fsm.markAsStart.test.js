const Fsm = require("../src/fsm.js");
const State = require("../src/state.js");

describe("markAsStart", () => {
  let fsm;

  beforeEach(() => {
    fsm = new Fsm();
    fsm.addState(new State("state1"));
  });

  test("should mark a state as start", () => {
    fsm.markAsStart("state1");
    expect(fsm.startStateLabels.has("state1")).toBe(true);
  });

  test("should throw error if trying to mark more than one start state", () => {
    fsm.startStateLabels.add("state1");
    expect(() => fsm.markAsStart("state1")).toThrow(Error);
  });

  test("should throw error if trying to mark a non-existent state as start", () => {
    expect(() => fsm.markAsStart("nonExistentState")).toThrow(Error);
  });
});
