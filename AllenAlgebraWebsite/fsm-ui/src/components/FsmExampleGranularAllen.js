import Fsm from "../logic/src/fsm";
import State from "../logic/src/state";
import FsmView from "./FsmView";
import SimulationResults from "./SimulationResults";

const FsmExampleGranularAllen = () => {
  const p_start = 0.25;
  const p = 0.1;
  const p_prime = 0.5;
  const alpha = 0.5;

  const fsm1 = new Fsm();
  fsm1.addState(new State("u_a"));
  fsm1.addState(new State("li_a"));
  fsm1.addState(new State("oli_a"));
  fsm1.addState(new State("d_a"));
  fsm1.addTransition("u_a", "li_a", ["la"], p_start);
  fsm1.addTransition("li_a", "oli_a", ["oa"], (1 - alpha) * (1 - p));
  fsm1.addTransition("li_a", "d_a", ["ra"], p);
  fsm1.addTransition("oli_a", "d_a", ["ra"], p_prime);
  fsm1.markAsStart("u_a");
  fsm1.markAsFinal("d_a");

  const fsm2 = new Fsm();
  fsm2.addState(new State("u_b"));
  fsm2.addState(new State("li_b"));
  fsm2.addState(new State("oli_b"));
  fsm2.addState(new State("d_b"));
  fsm2.addTransition("u_b", "li_b", ["lb"], p_start);
  fsm2.addTransition("li_b", "oli_b", ["ob"], (1 - alpha) * (1 - p));
  fsm2.addTransition("li_b", "d_b", ["rb"], p);
  fsm2.addTransition("oli_b", "d_b", ["rb"], p_prime);
  fsm2.markAsStart("u_b");
  fsm2.markAsFinal("d_b");

  const superposedFsm = fsm1.superpose(fsm2);
  const reactFlowNodesAndEdges =
    superposedFsm.generateNodesAndEdgesForReactFlow(0, 0, 400, 250, 7);

  const depad = (path) => {
    return path
      .replace("_oa_", "_")
      .replace("oa,", "")
      .replace(",oa", "")
      .replace("_ob_", "_")
      .replace("ob,", "")
      .replace(",ob", "");
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{ flex: "1 1 25%", width: "25%", backgroundColor: "#f0f0f0" }}
      >
        <SimulationResults fsm={superposedFsm} depad={depad} />
      </div>
      <div
        style={{ flex: "1 1 75%", width: "75%", backgroundColor: "#e0e0e0" }}
      >
        <FsmView
          nodes={reactFlowNodesAndEdges.nodes}
          edges={reactFlowNodesAndEdges.edges}
        />
      </div>
    </div>
  );
};

export default FsmExampleGranularAllen;
