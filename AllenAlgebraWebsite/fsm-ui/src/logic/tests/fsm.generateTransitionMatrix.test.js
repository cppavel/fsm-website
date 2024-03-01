const Fsm = require("../src/fsm");
const State = require("../src/state");

describe("generateTransitionMatrix", () => {
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
    const result = fsm1.generateTransitionMatrix();

    expect(result.indexToStateMapping.size()).toEqual(4);
    expect(result.stateToIndexMapping.size()).toEqual(4);

    expect(
      result.matrix[result.stateToIndexMapping.get("A")][
        result.stateToIndexMapping.get("B")
      ]
    ).toEqual(0.6);

    expect(
      result.matrix[result.stateToIndexMapping.get("B")][
        result.stateToIndexMapping.get("D")
      ]
    ).toEqual(0.3);

    expect(
      result.matrix[result.stateToIndexMapping.get("A")][
        result.stateToIndexMapping.get("C")
      ]
    ).toEqual(1.0);

    expect(
      result.matrix[result.stateToIndexMapping.get("C")][
        result.stateToIndexMapping.get("D")
      ]
    ).toEqual(1.0);

    expect(
      result.initialDistribution[result.stateToIndexMapping.get("A")]
    ).toEqual(1.0);
  });
});
