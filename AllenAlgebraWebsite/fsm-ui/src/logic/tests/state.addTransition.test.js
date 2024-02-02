const State = require("../src/state.js");

describe("addTransition", () => {
  let state;

  beforeEach(() => {
    state = new State("test");
  });

  test("check adding new transitions", () => {
    state.addTransition(["a"], state, 1.0);
    expect(state.transitions.size()).toBe(1);
  });

  test("check adding existing transition throws", () => {
    state.addTransition(["a"], state, 1.0);
    state.addTransition(["a"], state, 1.0);
    expect(state.transitions.size()).toBe(1);
  });

  test("negative probability throws", () => {
    expect(() => {
      state.addTransition(["a"], new State("test1"), -0.1);
    }).toThrow(Error);
  });

  test("probability greater than 1 throws", () => {
    expect(() => {
      state.addTransition(["a"], new State("test1"), 1.1);
    }).toThrow(Error);
  });
});
