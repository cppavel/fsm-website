const Fsm = require("../src/fsm");
const State = require("../src/state");

describe("generateNodesAndEdgesForReactFlow", () => {
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

  test("should return correct nodes and edges", () => {
    const reactFlowNodesAndEdges = fsm1.generateNodesAndEdgesForReactFlow(
      0,
      0,
      100,
      50
    );

    expect(reactFlowNodesAndEdges.nodes).toEqual([
      {
        id: "A",
        position: { x: 0, y: 0 },
      },
      {
        id: "C",
        position: { x: 100, y: 0 },
      },
      {
        id: "D",
        position: { x: 200, y: 0 },
      },
      {
        id: "B",
        position: { x: 100, y: 50 },
      },
    ]);

    expect(reactFlowNodesAndEdges.edges).toEqual([
      { id: "A-ab-B", source: "A", target: "B", label: "ab P=0.6" },
      { id: "A-ac-C", source: "A", target: "C", label: "ac P=1" },
      { id: "C-cd-D", source: "C", target: "D", label: "cd P=1" },
      { id: "B-bd-D", source: "B", target: "D", label: "bd P=0.3" },
    ]);
  });
});
