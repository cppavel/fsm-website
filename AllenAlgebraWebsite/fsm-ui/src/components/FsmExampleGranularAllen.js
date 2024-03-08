import React, { useState } from "react";
import Fsm from "../logic/src/fsm";
import State from "../logic/src/state";
import FsmView from "./FsmView";
import SimulationResults from "./SimulationResults";
import NavigationMenu from "./NavigationMenu";
import generateProbability from "../logic/src/allenRelationGranularSimulator";
import Plot from "react-plotly.js";

const FsmExampleGranularAllen = () => {
  const [pStart, setPStart] = useState(0.25);
  const [p, setP] = useState(0.1);
  const [pPrime, setPPrime] = useState(0.5);
  const [alpha, setAlpha] = useState(0.5);
  const [superposedFsm, setSuperposedFsm] = useState(null);
  const [reactFlowNodesAndEdges, setReactFlowNodesAndEdges] = useState(null);
  const [updateKey, setUpdateKey] = useState(0);

  const [heatmapStep, setHeatmapStep] = useState(0.1);
  const [heatmapData, setHeatmapData] = useState(null);
  const [heatmapX, setHeatmapX] = useState([]);
  const [heatmapY, setHeatmapY] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState("during");
  const [fixedParameter, setFixedParameter] = useState("p");
  const [fixedParameterValue, setFixedParameterValue] = useState(0.0);
  const [fixedParameterMap, setFixedParameterMap] = useState({});
  const [yAxisLabel, setYAxisLabel] = useState(null);
  const [xAxisLabel, setXAxisLabel] = useState(null);
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

  const parameters = ["p", "pPrime", "alpha", "pStart"];

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
      newSuperposedFsm.generateNodesAndEdgesForReactFlowLongestPaths(
        0,
        0,
        400,
        250
      );

    setSuperposedFsm(newSuperposedFsm);
    setReactFlowNodesAndEdges(newReactFlowNodesAndEdges);
    setFixedParameterMap({});
    setUpdateKey((x) => x + 1);
    setShowHeatmap(false); // Hide heatmap when generating FSM
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

  const handleHeatmapStepChange = (event) => {
    let newValue = parseFloat(event.target.value);
    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setHeatmapStep(newValue);
  };

  const handleRelationChange = (event) => {
    setSelectedRelation(event.target.value);
  };

  const handleFixedParameterChange = (event) => {
    setFixedParameter(event.target.value);
  };

  const handleFixedParameterValueChange = (event) => {
    let newValue = null;

    try {
      newValue = parseFloat(event.target.value);
    } catch (e) {
      newValue = 0;
    }

    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 1) {
      newValue = 1;
    }

    setFixedParameterValue(newValue);

    setFixedParameterMap((oldMap) => {
      oldMap[fixedParameter] = newValue;
      return oldMap;
    });
  };

  const removeFixedParameter = (parameter) => {
    setFixedParameterMap((oldMap) => {
      delete oldMap[parameter];
      setUpdateKey((x) => x + 1);
      return oldMap;
    });
  };

  const generateHeatmapData = () => {
    if (Object.keys(fixedParameterMap).length !== 2) {
      console.log(fixedParameterMap);
      alert("Exactly 2 parameters must be fixed to generate a heatmap.");
      return;
    }

    const data = [];
    const axisSteps = [];
    for (let paramOne = heatmapStep; paramOne <= 1; paramOne += heatmapStep) {
      const row = [];
      axisSteps.push(paramOne);

      for (let paramTwo = heatmapStep; paramTwo <= 1; paramTwo += heatmapStep) {
        const parameterValues = {};
        parameterValues["p"] = null;
        parameterValues["pPrime"] = null;
        parameterValues["alpha"] = null;
        parameterValues["pStart"] = null;

        for (let key of Object.keys(fixedParameterMap)) {
          parameterValues[key] = fixedParameterMap[key];
        }

        let paramOneUsed = false;
        for (let key of Object.keys(parameterValues)) {
          if (!paramOneUsed && parameterValues[key] == null) {
            parameterValues[key] = paramOne;
            paramOneUsed = true;
            setYAxisLabel(key);
          } else if (parameterValues[key] == null) {
            parameterValues[key] = paramTwo;
            setXAxisLabel(key);
          }
        }

        const probability = generateProbability(
          maxIterations,
          parameterValues["pStart"],
          parameterValues["p"],
          parameterValues["pPrime"],
          parameterValues["alpha"],
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
    setUpdateKey((x) => x + 1);
    setSuperposedFsm(null);
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
      <div style={{ display: "flex", height: "100%" }}>
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

          <br />

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

          <label htmlFor="fixedParameter">Fixed parameter:</label>
          <select
            id="fixedParameter"
            onChange={handleFixedParameterChange}
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
              marginBottom: "10px",
            }}
          >
            {parameters.map((parameter) => (
              <option key={parameter} value={parameter}>
                {parameter}
              </option>
            ))}
          </select>
          <br />
          <div>
            <label htmlFor="fixedParameterValue">Fixed param value:</label>
            <input
              type="number"
              id="fixedParameterValue"
              name="fixedParameterValue"
              value={fixedParameterValue}
              onChange={handleFixedParameterValueChange}
              style={{
                width: "33%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                marginTop: "10px",
                marginLeft: "10px",
              }}
            />
          </div>

          <p>Fixed parameters:</p>

          <ul>
            {fixedParameterMap &&
              Object.keys(fixedParameterMap).map((key) => (
                <li key={key}>
                  {key}: {fixedParameterMap[key]}
                  <button
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "none",
                      marginLeft: "10px",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      removeFixedParameter(key);
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>

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
                marginLeft: "10px",
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
                marginLeft: "10px",
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
                marginLeft: "10px",
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
                marginLeft: "10px",
              }}
            />
          </div>
          <hr />
          {superposedFsm && (
            <SimulationResults
              key={updateKey}
              fsm={superposedFsm}
              depad={depad}
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
                      title: xAxisLabel,
                    },
                    yaxis: {
                      autorange: false,
                      range: [0, 1],
                      title: yAxisLabel,
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

export default FsmExampleGranularAllen;
