import React, { useState } from "react";
import FsmView from "./FsmView";
import Fsm from "../logic/src/fsm";
import State from "../logic/src/state";
import FsmSerializer from "../logic/src/fsmSerialize";

const FsmInput = () => {
  const [states, setStates] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [startingState, setStartingState] = useState(null);
  const [finalStates, setFinalStates] = useState([]);
  const [newStateName, setNewStateName] = useState("");
  const [formData, setFormData] = useState({
    sourceState: "",
    targetState: "",
    inputSymbol: "",
    probability: 0.0,
    finalState: "",
    startingStateInput: "",
  });

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [updateKey, setUpdateKey] = useState(0);

  const createFsm = () => {
    const fsm = new Fsm();
    states.forEach((state) => {
      fsm.addState(new State(state));
    });

    transitions.forEach((transition) => {
      fsm.addTransition(
        transition.source,
        transition.target,
        [transition.input],
        transition.probability
      );
    });

    if (startingState) {
      fsm.markAsStart(startingState);
    }

    finalStates.forEach((finalState) => {
      fsm.markAsFinal(finalState);
    });

    return fsm;
  };

  const createFsmOnClick = () => {
    const fsm = createFsm();
    const reactFlowNodesAndEdges =
      fsm.generateNodesAndEdgesForReactFlowLongestPaths(0, 0, 250, 250);

    setNodes(reactFlowNodesAndEdges.nodes);
    setEdges(reactFlowNodesAndEdges.edges);
    setUpdateKey((x) => x + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNewStateChange = (event) => {
    setNewStateName(event.target.value);
  };

  const addState = (event) => {
    event.preventDefault();
    if (newStateName.trim() === "") {
      alert("Please enter a state name.");
      return;
    }
    const newState = newStateName.trim();
    if (!states.includes(newState)) {
      setStates([...states, newState]);
    }

    setNewStateName("");
  };

  const addTransition = (e) => {
    e.preventDefault();
    let prob = Math.min(1.0, Math.max(0.0, parseFloat(formData.probability)));

    setTransitions([
      ...transitions,
      {
        source: formData.sourceState,
        target: formData.targetState,
        input: formData.inputSymbol,
        probability: prob,
      },
    ]);
    setFormData({
      ...formData,
      sourceState: "",
      targetState: "",
      inputSymbol: "",
      probability: 0.0,
    });
  };

  const markAsFinal = (e) => {
    e.preventDefault();
    if (formData.finalState && !finalStates.includes(formData.finalState)) {
      setFinalStates([...finalStates, formData.finalState]);
    }
    setFormData({
      ...formData,
      finalState: "",
    });
  };

  const markAsStarting = (e) => {
    e.preventDefault();
    if (formData.startingStateInput) {
      setStartingState(formData.startingStateInput);
    }
    setFormData({
      ...formData,
      startingStateInput: "",
    });
  };

  const downloadSerializedFsm = () => {
    const fsm = createFsm();
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

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          flex: "1 1 20%",
          width: "20%",
          backgroundColor: "#f2f2f2",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>FSM Editor</h2>
        <form onSubmit={addState} style={{ marginBottom: "20px" }}>
          <label style={{ display: "block" }}>
            Add State:
            <br />
            <input
              type="text"
              value={newStateName}
              onChange={handleNewStateChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <br />
            <button
              type="submit"
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #007bff",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              Add State
            </button>
          </label>
        </form>
        <form onSubmit={addTransition} style={{ marginBottom: "20px" }}>
          <label style={{ display: "block" }}>
            Add Transition:
            <br />
            <input
              type="text"
              name="sourceState"
              placeholder="Source State"
              value={formData.sourceState}
              onChange={handleInputChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="targetState"
              placeholder="Target State"
              value={formData.targetState}
              onChange={handleInputChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="inputSymbol"
              placeholder="Input Symbol"
              value={formData.inputSymbol}
              onChange={handleInputChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              name="probability"
              placeholder="Probability"
              value={formData.probability}
              onChange={handleInputChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <br />
            <button
              type="submit"
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #007bff",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              Add Transition
            </button>
          </label>
        </form>
        <form onSubmit={markAsFinal} style={{ marginBottom: "20px" }}>
          <label style={{ display: "block" }}>
            Mark State as Final:
            <input
              type="text"
              name="finalState"
              placeholder="State to mark as final"
              value={formData.finalState}
              onChange={handleInputChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <br />
            <button
              type="submit"
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #007bff",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              Mark as Final
            </button>
          </label>
        </form>
        <form onSubmit={markAsStarting} style={{ marginBottom: "20px" }}>
          <label style={{ display: "block" }}>
            Mark State as Starting:
            <input
              type="text"
              name="startingStateInput"
              placeholder="State to mark as starting"
              value={formData.startingStateInput}
              onChange={handleInputChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <br />
            <button
              type="submit"
              style={{
                marginTop: "10px",
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #007bff",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              Mark as Starting
            </button>
          </label>
        </form>

        <h3 style={{ marginBottom: "10px" }}>States:</h3>
        <ul style={{ marginBottom: "20px", paddingLeft: "20px" }}>
          {states.map((state) => (
            <li key={state} style={{ marginBottom: "5px", fontWeight: "bold" }}>
              {state} {startingState === state && "(Starting)"}{" "}
              {finalStates.includes(state) && "(Final)"}
            </li>
          ))}
        </ul>

        <h3 style={{ marginBottom: "10px" }}>Transitions:</h3>
        <ul style={{ marginBottom: "20px", paddingLeft: "20px" }}>
          {transitions.map((transition, index) => (
            <li key={index} style={{ marginBottom: "5px" }}>
              {`${transition.source}--(${transition.input})-->${transition.target} P=${transition.probability}`}
            </li>
          ))}
        </ul>
        <button
          onClick={createFsmOnClick}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Update FSM View
        </button>
        <button
          onClick={downloadSerializedFsm}
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "1px solid #007bff",
            backgroundColor: "#007bff",
            color: "white",
          }}
        >
          Download Serialized FSM
        </button>
      </div>
      <div
        style={{
          flex: "1 1 80%",
          width: "80%",
          backgroundColor: "#f2f2f2",
          padding: "20px",
        }}
      >
        <FsmView key={updateKey} nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

export default FsmInput;
