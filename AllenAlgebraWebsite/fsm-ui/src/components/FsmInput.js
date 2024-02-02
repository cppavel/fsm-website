import React, { useState } from "react";
import FsmView from "./FsmView";
import Fsm from "../logic/src/fsm";
import State from "../logic/src/state";

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

    console.log(transitions);

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
    const reactFlowNodesAndEdges = fsm.generateNodesAndEdgesForReactFlow(
      0,
      0,
      250,
      250
    );

    console.log(fsm);

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
    let prob = 0.0;

    if (formData.probability < 0) {
      prob = 0.0;
    } else if (formData.probability > 1) {
      prob = 1.0;
    } else {
      prob = parseFloat(formData.probability);
    }
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

  return (
    <div>
      <h2>Finite State Automaton Editor</h2>
      <form onSubmit={addState}>
        <label>
          Add State:
          <input
            type="text"
            value={newStateName}
            onChange={handleNewStateChange}
          />
          <button type="submit">Add State</button>
        </label>
      </form>
      <form onSubmit={addTransition}>
        <label>
          Add Transition:
          <input
            type="text"
            name="sourceState"
            placeholder="Source State"
            value={formData.sourceState}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="targetState"
            placeholder="Target State"
            value={formData.targetState}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="inputSymbol"
            placeholder="Input Symbol"
            value={formData.inputSymbol}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="probability"
            placeholder="Probability"
            value={formData.probability}
            onChange={handleInputChange}
          />
          <button type="submit">Add Transition</button>
        </label>
      </form>
      <form onSubmit={markAsFinal}>
        <label>
          Mark State as Final:
          <input
            type="text"
            name="finalState"
            placeholder="State to mark as final"
            value={formData.finalState}
            onChange={handleInputChange}
          />
          <button type="submit">Mark as Final</button>
        </label>
      </form>
      <form onSubmit={markAsStarting}>
        <label>
          Mark State as Starting:
          <input
            type="text"
            name="startingStateInput"
            placeholder="State to mark as starting"
            value={formData.startingStateInput}
            onChange={handleInputChange}
          />
          <button type="submit">Mark as Starting</button>
        </label>
      </form>

      <h3>States:</h3>
      <ul>
        {states.map((state) => (
          <li key={state}>
            {state} {startingState === state && "(Starting)"}{" "}
            {finalStates.includes(state) && "(Final)"}
          </li>
        ))}
      </ul>

      <h3>Transitions:</h3>
      <ul>
        {transitions.map((transition, index) => (
          <li key={index}>
            {`${transition.source}--(${transition.input})-->${transition.target} P=${transition.probability}`}
          </li>
        ))}
      </ul>
      <button onClick={createFsmOnClick}>Update FSM View</button>
      <FsmView key={updateKey} nodes={nodes} edges={edges} />
    </div>
  );
};

export default FsmInput;
