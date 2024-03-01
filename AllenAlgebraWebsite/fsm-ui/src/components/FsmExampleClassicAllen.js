import React, { useState } from "react";
import Fsm from "../logic/src/fsm";
import State from "../logic/src/state";
import generateProbability from "../logic/src/allenRelationSimulator";
import FsmView from "./FsmView";
import SimulationResults from "./SimulationResults";
import NavigationMenu from "./NavigationMenu";
import Plot from "react-plotly.js";

const FsmExampleClassicAllen = () => {
  const [livingProbability, setLivingProbability] = useState(0.6);
  const [dyingProbability, setDyingProbability] = useState(0.3);
  const [superposedFsm, setSuperposedFsm] = useState(null);
  const [reactFlowNodesAndEdges, setReactFlowNodesAndEdges] = useState(null);
  const [updateKey, setUpdateKey] = useState(0);

  const [heatmapStep, setHeatmapStep] = useState(0.1);
  const [heatmapData, setHeatmapData] = useState(null);
  const [heatmapX, setHeatmapX] = useState([]);
  const [heatmapY, setHeatmapY] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState("during");
  const [maxIterations, setMaxIterations] = useState(1000);

  const allenRelations = [
    "is preceded",
    "precedes",
    "meets inverse",
    "meets",
    "overlaps inverse",
    "overlaps",
    "starts inverse",
    "starts",
    "during",
    "during inverse",
    "finishes",
    "finishes inverse",
    "equals",
  ];

  const handleRelationChange = (event) => {
    setSelectedRelation(event.target.value);
  };

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

  const handleHeatmapStepChange = (event) => {
    let newValue = parseFloat(event.target.value);
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setHeatmapStep(newValue);
  };

  const generateHeatmapData = () => {
    const data = [];
    const axisSteps = [];
    for (
      let livingProb = heatmapStep;
      livingProb <= 1;
      livingProb += heatmapStep
    ) {
      const row = [];
      axisSteps.push(livingProb);

      for (
        let dyingProb = heatmapStep;
        dyingProb <= 1;
        dyingProb += heatmapStep
      ) {
        const probability = generateProbability(
          maxIterations,
          livingProb,
          dyingProb,
          selectedRelation
        );

        row.push(probability);
      }
      data.push(row);
    }

    setHeatmapX(axisSteps);
    setHeatmapY(axisSteps);
    setHeatmapData(data);
    setShowHeatmap(true);
    setSuperposedFsm(null);
    setUpdateKey((x) => x + 1);
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
    setShowHeatmap(false); // Hide heatmap when generating FSM
  };

  const handleMaxIterationsChange = (event) => {
    let newValue = null;
    try {
      newValue = parseInt(event.target.value);
    } catch (e) {
      newValue = 0;
    }

    if (newValue < 0) {
      newValue = 0;
    }

    setMaxIterations(newValue);
  };

  return (
    <div>
      <NavigationMenu />
      <div
        style={{ display: "flex", height: "100%", justifyContent: "center" }}
      >
        <div
          style={{ flex: "1 1 20%", width: "20%", backgroundColor: "#f0f0f0" }}
        >
          <button
            onClick={generateHeatmapData}
            style={{
              backgroundColor: "#FF3366",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            Generate Heatmap
          </button>
          <select
            value={selectedRelation}
            onChange={handleRelationChange}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              color: "#333",
              fontSize: "16px",
              cursor: "pointer",
              outline: "none",
              marginLeft: "10px",
              marginTop: "10px",
            }}
          >
            {allenRelations.map((relation) => (
              <option key={relation} value={relation}>
                {relation}
              </option>
            ))}
          </select>
          <div>
            <label htmlFor="numberOfIterations">Iterations:</label>
            <input
              type="number"
              id="numberOfIterations"
              name="numberOfIterations"
              value={maxIterations}
              onChange={handleMaxIterationsChange}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                marginTop: "10px",
                marginLeft: "10px",
              }}
            />
          </div>
          <br />
          <label htmlFor="probabilityStep">Heat map step:</label>
          <input
            type="number"
            id="probabilityStep"
            name="livingProbability"
            value={heatmapStep}
            onChange={handleHeatmapStepChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              marginLeft: "10px",
            }}
          />
          <hr />
          <button
            onClick={regenerateFsm}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
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
                marginLeft: "10px",
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
                marginLeft: "10px",
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
          style={
            showHeatmap
              ? {
                  flex: "1 1 80%",
                  width: "80%",
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }
              : {
                  flex: "1 1 80%",
                  width: "80%",
                  backgroundColor: "#e0e0e0",
                }
          }
        >
          {showHeatmap
            ? heatmapData && (
                <Plot
                  key={updateKey}
                  data={[
                    {
                      type: "heatmap",
                      z: heatmapData,
                      x: heatmapX,
                      y: heatmapY,
                      colorscale: "Viridis",
                    },
                  ]}
                  layout={{
                    width: 800,
                    height: 600,
                    title: `Probability Heatmap - ${selectedRelation}`,
                    xaxis: {
                      autorange: false,
                      range: [0, 1],
                      title: "Probability of dying",
                    },
                    yaxis: {
                      autorange: false,
                      range: [0, 1],
                      title: "Probability of living",
                    },
                  }}
                />
              )
            : reactFlowNodesAndEdges && (
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
