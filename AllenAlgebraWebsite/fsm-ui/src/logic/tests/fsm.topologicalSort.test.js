const Fsm = require("../src/fsm");
const State = require("../src/state");

describe("topologicalSort", () => {
  let fsm1;

  beforeEach(() => {
    fsm1 = new Fsm();
    fsm1.addState(new State("A"));
    fsm1.addState(new State("B"));
    fsm1.addState(new State("C"));
    fsm1.addState(new State("D"));
    fsm1.addTransition("A", "B", ["ab"], 0.6);
    fsm1.addTransition("B", "D", ["bd"], 0.3);
    fsm1.addTransition("A", "C", ["ac"], 1.0);
    fsm1.addTransition("C", "D", ["cd"], 1.0);
    fsm1.markAsStart("A");
    fsm1.markAsFinal("D");
  });

  test("should return correct topological order", () => {
    const topologicalOrder = fsm1.topologicalSort();
    expect(topologicalOrder).toEqual(["A", "C", "B", "D"]);
  });
});
