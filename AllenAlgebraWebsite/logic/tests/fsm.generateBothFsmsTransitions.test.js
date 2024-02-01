const Fsm = require("../src/fsm.js");
const State = require("../src/state.js");

describe("generateOtherFsmTransitions", () => {
  let fsm1, fsm2;
  let superposedFsm;
  beforeEach(() => {
    fsm1 = new Fsm();
    fsm2 = new Fsm();
    superposedFsm = new Fsm();

    fsm1.addState(new State("initalState"));
    fsm1.addState(new State("midState1"));
    fsm1.addState(new State("midState2"));
    fsm1.addState(new State("finalState"));

    fsm1.addTransition("initalState", "midState1", ["a"], 0.6);
    fsm1.addTransition("initalState", "midState2", ["b"], 0.3);
    fsm1.addTransition("midState1", "finalState", ["c"], 1.0);
    fsm1.addTransition("midState2", "finalState", ["d"], 1.0);
    fsm1.markAsStart("initalState");
    fsm1.markAsFinal("finalState");

    fsm2.addState(new State("initalState"));
    fsm2.addState(new State("midState1"));
    fsm2.addState(new State("midState2"));
    fsm2.addState(new State("finalState"));

    fsm2.addTransition("initalState", "midState1", ["a"], 0.6);
    fsm2.addTransition("initalState", "midState2", ["b"], 0.3);
    fsm2.addTransition("midState1", "finalState", ["c"], 1.0);
    fsm2.addTransition("midState2", "finalState", ["d"], 1.0);
    fsm2.markAsStart("initalState");
    fsm2.markAsFinal("finalState");

    superposedFsm.addState(new State(["initalState", "initalState"]));
  });

  test("should generate transitions for superposed FSM correctly", () => {
    const res = fsm1.generateBothFsmsTransitions(fsm2, superposedFsm, [
      "initalState",
      "initalState",
    ]);

    expect(res).toEqual([
      ["midState1", "midState1"],
      ["midState1", "midState2"],
      ["midState2", "midState1"],
      ["midState2", "midState2"],
    ]);

    const transitions = superposedFsm.statesByLabel.get([
      "initalState",
      "initalState",
    ]).transitions;

    const probabilities = superposedFsm.statesByLabel.get([
      "initalState",
      "initalState",
    ]).probabilities;

    expect(transitions.size()).toEqual(4);

    expect(transitions.keys()[0]).toEqual([["a"], ["a"]]);
    expect(transitions.keys()[1]).toEqual([["a"], ["b"]]);
    expect(transitions.keys()[2]).toEqual([["b"], ["a"]]);
    expect(transitions.keys()[3]).toEqual([["b"], ["b"]]);

    expect(probabilities.size()).toEqual(4);
    expect(probabilities.keys()[0]).toEqual([["a"], ["a"]]);
    expect(probabilities.keys()[1]).toEqual([["a"], ["b"]]);
    expect(probabilities.keys()[2]).toEqual([["b"], ["a"]]);
    expect(probabilities.keys()[3]).toEqual([["b"], ["b"]]);

    expect(probabilities.values()[0]).toBeCloseTo(0.6 * 0.6);
    expect(probabilities.values()[1]).toBeCloseTo(0.6 * 0.3);
    expect(probabilities.values()[2]).toBeCloseTo(0.3 * 0.6);
    expect(probabilities.values()[3]).toBeCloseTo(0.3 * 0.3);

    expect(superposedFsm.alphabet.values()).toContainEqual([["a"], ["a"]]);
    expect(superposedFsm.alphabet.values()).toContainEqual([["a"], ["b"]]);
    expect(superposedFsm.alphabet.values()).toContainEqual([["b"], ["a"]]);
    expect(superposedFsm.alphabet.values()).toContainEqual([["b"], ["b"]]);
  });

  test("should generate transitions for superposed FSM correctly (final)", () => {
    superposedFsm.addState(new State(["midState1", "midState2"]));
    const res = fsm1.generateBothFsmsTransitions(fsm2, superposedFsm, [
      "midState1",
      "midState2",
    ]);

    expect(res).toEqual([["finalState", "finalState"]]);

    const transitions = superposedFsm.statesByLabel.get([
      "midState1",
      "midState2",
    ]).transitions;

    const probabilities = superposedFsm.statesByLabel.get([
      "midState1",
      "midState2",
    ]).probabilities;

    expect(transitions.size()).toEqual(1);

    expect(transitions.keys()[0]).toEqual([["c"], ["d"]]);

    expect(probabilities.size()).toEqual(1);
    expect(probabilities.keys()[0]).toEqual([["c"], ["d"]]);

    expect(probabilities.values()[0]).toBeCloseTo(1.0 * 1.0);

    expect(superposedFsm.alphabet.values()).toContainEqual([["c"], ["d"]]);
  });
});
