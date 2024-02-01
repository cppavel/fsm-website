const Fsm = require("../src/fsm.js");
const State = require("../src/state.js");

describe("superpose", () => {
  let fsm1, fsm2;

  beforeEach(() => {
    fsm1 = new Fsm();
    fsm1.addState(new State("u_a"));
    fsm1.addState(new State("li_a"));
    fsm1.addState(new State("d_a"));
    fsm1.addTransition("u_a", "li_a", ["la"], 0.6);
    fsm1.addTransition("li_a", "d_a", ["ra"], 0.3);
    fsm1.markAsStart("u_a");
    fsm1.markAsFinal("d_a");

    fsm2 = new Fsm();
    fsm2.addState(new State("u_b"));
    fsm2.addState(new State("li_b"));
    fsm2.addState(new State("d_b"));
    fsm2.addTransition("u_b", "li_b", ["lb"], 0.6);
    fsm2.addTransition("li_b", "d_b", ["rb"], 0.3);
    fsm2.markAsStart("u_b");
    fsm2.markAsFinal("d_b");
  });

  test("should superpose two FSMs correctly", () => {
    const superposedFsm = fsm1.superpose(fsm2);
    expect(superposedFsm.startStateLabels.values()).toContainEqual([
      "u_a",
      "u_b",
    ]);
    expect(superposedFsm.startStateLabels.size()).toEqual(1);

    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["u_a", "u_b"]);
    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["li_a", "u_b"]);
    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["u_a", "li_b"]);
    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["li_a", "li_b"]);
    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["d_a", "li_b"]);
    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["li_a", "d_b"]);
    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["d_a", "d_b"]);
    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["u_a", "d_b"]);
    expect(superposedFsm.statesByLabel.keys()).toContainEqual(["d_a", "u_b"]);

    expect(superposedFsm.finalStateLabels.values()).toContainEqual([
      "d_a",
      "d_b",
    ]);
    expect(superposedFsm.finalStateLabels.size()).toEqual(1);

    expect(superposedFsm.alphabet.values()).toContainEqual(["la"]);
    expect(superposedFsm.alphabet.values()).toContainEqual(["lb"]);
    expect(superposedFsm.alphabet.values()).toContainEqual([["la"], ["lb"]]);
    expect(superposedFsm.alphabet.values()).toContainEqual(["ra"]);
    expect(superposedFsm.alphabet.values()).toContainEqual(["rb"]);
    expect(superposedFsm.alphabet.values()).toContainEqual([["ra"], ["rb"]]);
    expect(superposedFsm.alphabet.values()).toContainEqual([["la"], ["rb"]]);
    expect(superposedFsm.alphabet.values()).toContainEqual([["ra"], ["lb"]]);

    expect(superposedFsm.stringifyStatesAndTransitions()).toEqual(
      `State: u_a,u_b
  Transition: la -> li_a,u_b P=0.24
  Transition: lb -> u_a,li_b P=0.24
  Transition: la,lb -> li_a,li_b P=0.36
State: li_a,u_b
  Transition: ra -> d_a,u_b P=0.12
  Transition: lb -> li_a,li_b P=0.42
  Transition: ra,lb -> d_a,li_b P=0.18
State: u_a,li_b
  Transition: la -> li_a,li_b P=0.42
  Transition: rb -> u_a,d_b P=0.12
  Transition: la,rb -> li_a,d_b P=0.18
State: li_a,li_b
  Transition: ra -> d_a,li_b P=0.21
  Transition: rb -> li_a,d_b P=0.21
  Transition: ra,rb -> d_a,d_b P=0.09
State: d_a,li_b
  Transition: rb -> d_a,d_b P=0.3
State: li_a,d_b
  Transition: ra -> d_a,d_b P=0.3
State: d_a,d_b
State: u_a,d_b
  Transition: la -> li_a,d_b P=0.6
State: d_a,u_b
  Transition: lb -> d_a,li_b P=0.6
`
    );
  });
});
