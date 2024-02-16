import React, { useState } from "react";
import Fsm from "../logic/src/fsm";
import State from "../logic/src/state";
import FsmView from "./FsmView";
import SimulationResults from "./SimulationResults";

const FsmExampleGranularAllen = () => {
  const [pStart, setPStart] = useState(0.25);
  const [p, setP] = useState(0.1);
  const [pPrime, setPPrime] = useState(0.5);
  const [alpha, setAlpha] = useState(0.5);
  const [superposedFsm, setSuperposedFsm] = useState(null);
  const [reactFlowNodesAndEdges, setReactFlowNodesAndEdges] = useState(null);
  const [updateKey, setUpdateKey] = useState(0);

  const handlePStartChange = (event) => {
    let newValue = parseFloat(event.target.value);
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setPStart(newValue);
  };

  const handlePChange = (event) => {
    let newValue = parseFloat(event.target.value);
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setP(newValue);
  };

  const handlePPrimeChange = (event) => {
    let newValue = parseFloat(event.target.value);
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setPPrime(newValue);
  };

  const handleAlphaChange = (event) => {
    let newValue = parseFloat(event.target.value);
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setAlpha(newValue);
  };

  const normalizeProbabilities = () => {
    if (superposedFsm == null) {
      return;
    }

    superposedFsm.normalizeProbabilities();
    const newReactFlowNodesAndEdges =
      superposedFsm.generateNodesAndEdgesForReactFlow(0, 0, 400, 250);
    setReactFlowNodesAndEdges(newReactFlowNodesAndEdges);
    setUpdateKey((x) => x + 1);
  };

  const regenerateFsm = () => {
    const fsm1 = new Fsm();
    fsm1.addState(new State("u_a"));
    fsm1.addState(new State("li_a"));
    fsm1.addState(new State("oli_a"));
    fsm1.addState(new State("d_a"));
    fsm1.addTransition("u_a", "li_a", ["la"], pStart);
    fsm1.addTransition("li_a", "oli_a", ["oa"], (1 - alpha) * (1 - p));
    fsm1.addTransition("li_a", "d_a", ["ra"], p);
    fsm1.addTransition("oli_a", "d_a", ["ra"], pPrime);
    fsm1.markAsStart("u_a");
    fsm1.markAsFinal("d_a");

    const fsm2 = new Fsm();
    fsm2.addState(new State("u_b"));
    fsm2.addState(new State("li_b"));
    fsm2.addState(new State("oli_b"));
    fsm2.addState(new State("d_b"));
    fsm2.addTransition("u_b", "li_b", ["lb"], pStart);
    fsm2.addTransition("li_b", "oli_b", ["ob"], (1 - alpha) * (1 - p));
    fsm2.addTransition("li_b", "d_b", ["rb"], p);
    fsm2.addTransition("oli_b", "d_b", ["rb"], pPrime);
    fsm2.markAsStart("u_b");
    fsm2.markAsFinal("d_b");

    const newSuperposedFsm = fsm1.superpose(fsm2);
    const newReactFlowNodesAndEdges =
      newSuperposedFsm.generateNodesAndEdgesForReactFlow(0, 0, 400, 250);

    setSuperposedFsm(newSuperposedFsm);
    setReactFlowNodesAndEdges(newReactFlowNodesAndEdges);
    setUpdateKey((x) => x + 1);
  };

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
        style={{ flex: "1 1 20%", width: "20%", backgroundColor: "#f0f0f0" }}
      >
        <button
          onClick={regenerateFsm}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          Generate FSM
        </button>
        {superposedFsm && (
          <button
            onClick={normalizeProbabilities}
            style={{
              backgroundColor: "#2196F3",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              marginRight: "10px",
              marginBottom: "10px",
            }}
          >
            Normalize Probabilities
          </button>
        )}
        <div>
          <label htmlFor="pStart">p_start:</label>
          <input
            type="number"
            id="pStart"
            name="pStart"
            value={pStart}
            onChange={handlePStartChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          />
        </div>
        <div>
          <label htmlFor="p">p:</label>
          <input
            type="number"
            id="p"
            name="p"
            value={p}
            onChange={handlePChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          />
        </div>
        <div>
          <label htmlFor="pPrime">p_prime:</label>
          <input
            type="number"
            id="pPrime"
            name="pPrime"
            value={pPrime}
            onChange={handlePPrimeChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          />
        </div>
        <div>
          <label htmlFor="alpha">alpha:</label>
          <input
            type="number"
            id="alpha"
            name="alpha"
            value={alpha}
            onChange={handleAlphaChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          />
        </div>
        {superposedFsm && (
          <SimulationResults
            key={updateKey}
            fsm={superposedFsm}
            depad={depad}
          />
        )}
      </div>
      <div
        style={{ flex: "1 1 80%", width: "80%", backgroundColor: "#e0e0e0" }}
      >
        {reactFlowNodesAndEdges && (
          <FsmView
            key={updateKey}
            nodes={reactFlowNodesAndEdges.nodes}
            edges={reactFlowNodesAndEdges.edges}
          />
        )}
      </div>
    </div>
  );
};

export default FsmExampleGranularAllen;
