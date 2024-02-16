import React, { useState } from "react";
import FsmView from "./FsmView";
import FsmSerializer from "../logic/src/fsmSerialize";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import NavigationMenu from "./NavigationMenu";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Histogram of Simulation Results",
    },
  },
};

const FsmSimulator = () => {
  const [fsm, setFsm] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [numberOfRuns, setNumberOfRuns] = useState(100);
  const [updateKey, setUpdateKey] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [barChartLabels, setBarChartLabels] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [totalSimulations, setTotalSimulations] = useState(0);

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
        setUpdateKey((x) => x + 1);
        setSimulations([]);
        setTotalSimulations(0);
        setBarChartData([]);
        setBarChartLabels([]);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.readAsText(file);
  };

  const simulateMany = () => {
    const newSimulations = [];
    for (let i = 0; i < numberOfRuns; i++) {
      newSimulations.push(fsm.simulate());
    }
    setSimulations([...simulations, ...newSimulations]);
    setTotalSimulations((x) => x + numberOfRuns);
  };

  const generateBarChart = () => {
    const newLabels = [
      ...new Set(simulations.map((x) => JSON.stringify(x.symbols))),
    ];
    setBarChartLabels(newLabels);

    const newBarChartData = [];
    for (let label of newLabels) {
      const count = simulations.filter(
        (x) => JSON.stringify(x.symbols) === label
      ).length;
      newBarChartData.push(count / simulations.length);
    }

    setBarChartData(newBarChartData);
    setUpdateKey((x) => x + 1);
  };

  const handleNumberOfRunsChange = (event) => {
    setNumberOfRuns(parseInt(event.target.value));
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

        {fsm && (
          <div>
            <button
              onClick={simulateMany}
              style={{
                ...styles.button,
                backgroundColor: "#4CAF50",
              }}
            >
              Simulate Many
            </button>
            <br />

            <input
              type="number"
              value={numberOfRuns}
              onChange={handleNumberOfRunsChange}
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.visualizationSection}>
          <div style={styles.visualizationContainer}>
            <h3>FSM Visualization</h3>
            {fsm && <FsmView key={updateKey} nodes={nodes} edges={edges} />}
          </div>
          <div style={styles.visualizationContainer}>
            <h3 style={styles.resultHeader}>Simulation Results</h3>
            <button
              onClick={() => setShowResults(!showResults)}
              style={{
                ...styles.button,
                backgroundColor: showResults ? "#FF3366" : "#4CAF50",
              }}
            >
              {showResults ? "Hide Results" : "Show Results"}
            </button>
            <button
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                backgroundColor: "#4CAF50",
                ...styles.button,
              }}
              onClick={generateBarChart}
            >
              Update bar chart
            </button>
            <Bar
              key={updateKey}
              options={options}
              data={{
                labels: barChartLabels,
                datasets: [
                  {
                    label: `Simulation Results - ${totalSimulations} runs `,
                    data: barChartData,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
            <br />
            {showResults && (
              <div style={styles.resultsContainer}>
                {simulations.map((result, index) => (
                  <div key={index} style={styles.resultItem}>
                    Result {index + 1}: {result.symbols.join(", ")}
                  </div>
                ))}
              </div>
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

export default FsmSimulator;
