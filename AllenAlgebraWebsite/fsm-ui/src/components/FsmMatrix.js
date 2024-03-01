import React, { useState } from "react";
import FsmView from "./FsmView";
import FsmSerializer from "../logic/src/fsmSerialize";
import NavigationMenu from "./NavigationMenu";

const FsmMatrix = () => {
  const [fsm, setFsm] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [currentDistributionVector, setCurrentDistributionVector] =
    useState(null);
  const [initialDistribution, setInitialDistribution] = useState(null);
  const [transitionMatrix, setTransitionMatrix] = useState(null);
  const [indexToStateMapping, setIndexToStateMapping] = useState(null);
  const [stepsToPerform, setStepsToPerform] = useState(0);

  const [updateKey, setUpdateKey] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const parsedFsm = FsmSerializer.deserialize(content);
        const reactFlowNodesAndEdges =
          parsedFsm.generateNodesAndEdgesForReactFlowLongestPaths(
            0,
            0,
            250,
            250
          );
        setNodes(reactFlowNodesAndEdges.nodes);
        setEdges(reactFlowNodesAndEdges.edges);
        setFsm(parsedFsm);

        const transitionMatrix = parsedFsm.generateTransitionMatrix();
        setTransitionMatrix(transitionMatrix.matrix);
        setIndexToStateMapping(transitionMatrix.indexToStateMapping);
        setInitialDistribution(transitionMatrix.initialDistribution);
        setUpdateKey((x) => x + 1);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.readAsText(file);
  };

  const TransitionTable = ({ matrix, labels }) => {
    return (
      <table
        style={{
          borderCollapse: "collapse",
          border: "1px solid black",
          margin: "auto",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}></th>
            {labels.values().map((label, index) => (
              <th
                key={index}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                {labels.get(rowIndex)}
              </th>
              {row.map((probability, colIndex) => (
                <td
                  key={colIndex}
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {probability.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleNumberOfStepsChange = (event) => {
    setStepsToPerform(parseInt(event.target.value));
  };

  const simulateTransitionMatrix = () => {
    let newDistribution = [...initialDistribution];

    for (let i = 0; i < stepsToPerform; i++) {
      const nextDistribution = new Array(initialDistribution.length).fill(0);
      for (
        let fromState = 0;
        fromState < transitionMatrix.length;
        fromState++
      ) {
        for (let toState = 0; toState < transitionMatrix.length; toState++) {
          nextDistribution[toState] +=
            newDistribution[fromState] * transitionMatrix[fromState][toState];
        }
      }
      newDistribution = nextDistribution;
    }

    setCurrentDistributionVector(newDistribution);
  };

  return (
    <div>
      <NavigationMenu />
      <div style={styles.container}>
        <div style={styles.uploadSection}>
          <div style={styles.uploadContainer}>
            <h3 style={styles.uploadHeading}>
              Upload Finite State Machine (FSM)
            </h3>
            <input
              style={styles.input}
              type="file"
              accept=".json"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div style={styles.visualizationSection}>
          <div style={styles.visualizationContainer}>
            <h3>FSM Visualization</h3>
            {fsm && <FsmView key={updateKey} nodes={nodes} edges={edges} />}
          </div>
          <div style={styles.visualizationContainer}>
            <h3>Transition Matrix</h3>
            {transitionMatrix && (
              <TransitionTable
                matrix={transitionMatrix}
                labels={indexToStateMapping}
              />
            )}

            <h3>Initial Distribution</h3>

            {initialDistribution && (
              <table
                style={{
                  borderCollapse: "collapse",
                  border: "1px solid black",
                  margin: "auto",
                }}
              >
                <thead>
                  <tr style={{ border: "1px solid black", padding: "8px" }}>
                    {indexToStateMapping.values().map((state, index) => (
                      <th
                        key={index}
                        style={{ border: "1px solid black", padding: "8px" }}
                      >
                        {state}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ border: "1px solid black", padding: "8px" }}>
                    {initialDistribution.map((probability, index) => (
                      <td
                        key={index}
                        style={{ border: "1px solid black", padding: "8px" }}
                      >
                        {probability.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}

            <div>
              <label htmlFor="numberOfSteps">Number of steps:</label>
              <input
                id="numberOfSteps"
                type="number"
                value={stepsToPerform}
                onChange={handleNumberOfStepsChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              />
              <button
                onClick={simulateTransitionMatrix}
                style={{
                  backgroundColor: "#FF3366",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  marginBottom: "10px",
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
              >
                Run simulation for {stepsToPerform} steps
              </button>
            </div>

            <h3>Distribution after {stepsToPerform} steps</h3>

            {currentDistributionVector && (
              <table
                style={{
                  borderCollapse: "collapse",
                  border: "1px solid black",
                  margin: "auto",
                }}
              >
                <thead>
                  <tr style={{ border: "1px solid black", padding: "8px" }}>
                    {indexToStateMapping.values().map((state, index) => (
                      <th
                        key={index}
                        style={{ border: "1px solid black", padding: "8px" }}
                      >
                        {state}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ border: "1px solid black", padding: "8px" }}>
                    {currentDistributionVector.map((probability, index) => (
                      <td
                        key={index}
                        style={{ border: "1px solid black", padding: "8px" }}
                      >
                        {probability.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  uploadSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    marginTop: "10px",
    width: "100%",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    color: "white",
    cursor: "pointer",
    marginBottom: "10px",
  },
  uploadContainer: {
    marginRight: "20px",
    display: "flex",
    alignItems: "center",
  },
  uploadHeading: {
    marginRight: "10px",
  },
  visualizationSection: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  visualizationContainer: {
    flex: "1",
    marginRight: "20px",
    backgroundColor: "#f2f2f2",
    padding: "20px",
    borderRadius: "5px",
  },
  resultHeader: {
    marginBottom: "10px",
  },
  resultsContainer: {
    maxHeight: "100vh",
    overflowY: "auto",
  },
  resultItem: {
    marginBottom: "5px",
  },
};

export default FsmMatrix;
