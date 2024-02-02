import Fsm from "../logic/src/fsm";
import State from "../logic/src/state";
import FsmView from "./FsmView";

const FsmExamples = () => {
  const fsm1 = new Fsm();
  fsm1.addState(new State("u_a"));
  fsm1.addState(new State("li_a"));
  fsm1.addState(new State("d_a"));
  fsm1.addTransition("u_a", "li_a", ["la"], 0.6);
  fsm1.addTransition("li_a", "d_a", ["ra"], 0.3);
  fsm1.markAsStart("u_a");
  fsm1.markAsFinal("d_a");

  const fsm2 = new Fsm();
  fsm2.addState(new State("u_b"));
  fsm2.addState(new State("li_b"));
  fsm2.addState(new State("d_b"));
  fsm2.addTransition("u_b", "li_b", ["lb"], 0.6);
  fsm2.addTransition("li_b", "d_b", ["rb"], 0.3);
  fsm2.markAsStart("u_b");
  fsm2.markAsFinal("d_b");

  const superposedFsm = fsm1.superpose(fsm2);
  const reactFlowNodesAndEdges =
    superposedFsm.generateNodesAndEdgesForReactFlow(0, 0, 250, 250);

  console.log(reactFlowNodesAndEdges);

  return (
    <FsmView
      nodes={reactFlowNodesAndEdges.nodes}
      edges={reactFlowNodesAndEdges.edges}
    />
  );
};

export default FsmExamples;
