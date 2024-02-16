import React, { useState } from "react";
import Fsm from "../logic/src/fsm";
import State from "../logic/src/state";
import FsmView from "./FsmView";
import SimulationResults from "./SimulationResults";
import NavigationMenu from "./NavigationMenu";

const FsmExampleClassicAllen = () => {
  const [livingProbability, setLivingProbability] = useState(0.6);
  const [dyingProbability, setDyingProbability] = useState(0.3);
  const [superposedFsm, setSuperposedFsm] = useState(null);
  const [reactFlowNodesAndEdges, setReactFlowNodesAndEdges] = useState(null);
  const [updateKey, setUpdateKey] = useState(0);

  const handleLivingProbabilityChange = (event) => {
    let newValue = parseFloat(event.target.value);
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setLivingProbability(newValue);
  };

  const handleDyingProbabilityChange = (event) => {
    let newValue = parseFloat(event.target.value);

    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setDyingProbability(newValue);
  };

  const normalizeProbabilities = () => {
    if (superposedFsm == null) {
      return;
    }

    superposedFsm.normalizeProbabilities();
    const newReactFlowNodesAndEdges =
      superposedFsm.generateNodesAndEdgesForReactFlowLongestPaths(
        0,
        0,
        400,
        250
      );
    setReactFlowNodesAndEdges(newReactFlowNodesAndEdges);
    setUpdateKey((x) => x + 1);
  };

  const regenerateFsm = () => {
    const fsm1 = new Fsm();
    fsm1.addState(new State("u_a"));
    fsm1.addState(new State("li_a"));
    fsm1.addState(new State("d_a"));
    fsm1.addTransition("u_a", "li_a", ["la"], livingProbability);
    fsm1.addTransition("li_a", "d_a", ["ra"], dyingProbability);
    fsm1.markAsStart("u_a");
    fsm1.markAsFinal("d_a");

    const fsm2 = new Fsm();
    fsm2.addState(new State("u_b"));
    fsm2.addState(new State("li_b"));
    fsm2.addState(new State("d_b"));
    fsm2.addTransition("u_b", "li_b", ["lb"], livingProbability);
    fsm2.addTransition("li_b", "d_b", ["rb"], dyingProbability);
    fsm2.markAsStart("u_b");
    fsm2.markAsFinal("d_b");

    const newSuperposedFsm = fsm1.superpose(fsm2);
    const newReactFlowNodesAndEdges =
      newSuperposedFsm.generateNodesAndEdgesForReactFlowLongestPaths(
        0,
        0,
        400,
        250
      );

    setSuperposedFsm(newSuperposedFsm);
    setReactFlowNodesAndEdges(newReactFlowNodesAndEdges);
    setUpdateKey((x) => x + 1);
  };

  return (
    <div>
      <NavigationMenu />
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
            <label htmlFor="livingProbability">Living Probability:</label>
            <input
              type="number"
              id="livingProbability"
              name="livingProbability"
              value={livingProbability}
              onChange={handleLivingProbabilityChange}
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
            <label htmlFor="dyingProbability">Dying Probability:</label>
            <input
              type="number"
              id="dyingProbability"
              name="dyingProbability"
              value={dyingProbability}
              onChange={handleDyingProbabilityChange}
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
              depad={(x) => x}
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
    </div>
  );
};

export default FsmExampleClassicAllen;
