const Fsm = require("../src/fsm.js");
const State = require("../src/state.js");

describe("addState", () => {
  let fsm;

  beforeEach(() => {
    fsm = new Fsm();
    fsm.addState(new State("A"));
    fsm.addState(new State("B"));
    fsm.addTransition("A", "B", "ab", 0.5);
    fsm.markAsFinal("B");
    fsm.markAsStart("A");
  });

  test("overrideProbability", () => {
    expect(fsm.statesByLabel.get("A").probabilities.get("ab")).toBe(0.5);
    fsm.overrideProbability("A", "ab", 0.7);
    expect(fsm.statesByLabel.get("A").probabilities.get("ab")).toBe(0.7);
  });
});
