const Fsm = require("../src/fsm.js");
const State = require("../src/state.js");

describe("addState", () => {
  let fsm;
  let state;

  beforeEach(() => {
    fsm = new Fsm();
    state = new State("test");
  });

  test("add state", () => {
    fsm.addState(state);
    expect(fsm.statesByLabel.size()).toBe(1);
  });

  test("add duplicate state", () => {
    fsm.addState(state);
    fsm.addState(state);
    expect(fsm.statesByLabel.size()).toBe(1);
  });
});
