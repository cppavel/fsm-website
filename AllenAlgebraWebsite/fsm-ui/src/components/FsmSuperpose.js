import React, { useState } from "react";
import FsmView from "./FsmView";
import FsmSerializer from "../logic/src/fsmSerialize";

const FsmLoader = () => {
  const [superposedView, setSuperposedView] = useState(false);
  const [fsm1, setFsm1] = useState(null);
  const [nodes1, setNodes1] = useState([]);
  const [edges1, setEdges1] = useState([]);

  const [fsm2, setFsm2] = useState(null);
  const [nodes2, setNodes2] = useState([]);
  const [edges2, setEdges2] = useState([]);

  const [superposedFsm, setSuperposedFsm] = useState(null);
  const [superposedNodes, setSuperposedNodes] = useState([]);
  const [superposedEdges, setSuperposedEdges] = useState([]);

  const handleSuperpose = () => {
    if (fsm1 && fsm2) {
      const superposed = fsm1.superpose(fsm2);
      const reactFlowNodesAndEdges =
        superposed.generateNodesAndEdgesForReactFlow(0, 0, 250, 250);
      setSuperposedNodes(reactFlowNodesAndEdges.nodes);
      setSuperposedEdges(reactFlowNodesAndEdges.edges);
      setSuperposedFsm(superposed);
      setSuperposedView(true);
    }
  };

  const downloadSerializedFsm = (fsm) => {
    const serializedFsm = FsmSerializer.serialize(fsm);
    const blob = new Blob([serializedFsm], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "serialized_fsm.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event, setFsm, setNodes, setEdges) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const parsedFsm = FsmSerializer.deserialize(content);
        const reactFlowNodesAndEdges =
          parsedFsm.generateNodesAndEdgesForReactFlow(0, 0, 250, 250);
        setNodes(reactFlowNodesAndEdges.nodes);
        setEdges(reactFlowNodesAndEdges.edges);
        setFsm(parsedFsm);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={fsm1 || fsm2 ? styles.containerInitialized : styles.container}>
      <div style={styles.uploadSection}>
        <div style={styles.uploadContainer}>
          <h3 style={styles.uploadHeading}>
            Upload Finite State Machine 1 (FSM1)
          </h3>
          <input
            style={styles.input}
            type="file"
            accept=".json"
            onChange={(e) => handleFileChange(e, setFsm1, setNodes1, setEdges1)}
          />
        </div>
        <div style={styles.uploadContainer}>
          <h3 style={styles.uploadHeading}>
            Upload Finite State Machine 2 (FSM2)
          </h3>
          <input
            style={styles.input}
            type="file"
            accept=".json"
            onChange={(e) => handleFileChange(e, setFsm2, setNodes2, setEdges2)}
          />
        </div>
      </div>
      {fsm1 && fsm2 && !superposedView && (
        <button
          variant="contained"
          color="primary"
          onClick={handleSuperpose}
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          Superpose FSMs
        </button>
      )}

      {superposedView && (
        <button
          variant="contained"
          color="primary"
          onClick={() => {
            setSuperposedView(false);
            setSuperposedFsm(null);
          }}
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          Go back to original FSMs
        </button>
      )}
      {superposedView && (
        <button
          onClick={() => downloadSerializedFsm(superposedFsm)}
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "10px",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "1px solid #007bff",
            backgroundColor: "#007bff",
            color: "white",
          }}
        >
          Download Superposed FSM
        </button>
      )}

      <div style={styles.visualizationSection}>
        {!superposedView && (
          <div style={styles.visualizationContainer}>
            <h3>FSM1 Visualization</h3>
            {fsm1 && <FsmView nodes={nodes1} edges={edges1} />}
          </div>
        )}
        {!superposedView && (
          <div style={styles.visualizationContainer}>
            <h3>FSM2 Visualization</h3>
            {fsm2 && <FsmView fsm={fsm2} nodes={nodes2} edges={edges2} />}
          </div>
        )}
        {superposedView && (
          <div style={styles.visualizationContainer}>
            <h3>Superposed FSM Visualization</h3>
            {superposedFsm && (
              <FsmView nodes={superposedNodes} edges={superposedEdges} />
            )}
          </div>
        )}
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
  },
  containerInitialized: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
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
};

export default FsmLoader;