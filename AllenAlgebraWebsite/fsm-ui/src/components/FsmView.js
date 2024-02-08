import React, { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

function FsmView(props) {
  const [isGlobalView, setIsGlobalView] = useState(true);
  const [nodes, setNodes] = useState(props.nodes);
  const [edges, setEdges] = useState(props.edges);
  const [currentState, setCurrentState] = useState(props.nodes[0]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const findNodeByLabel = (label) => {
    return nodes.find((node) => node.data.label === label);
  };

  const filterNodesByCurrentState = (nodes, edges) => {
    if (!currentState) return [];

    const relevantNodeIds = [currentState.id];

    edges.forEach((edge) => {
      if (edge.source === currentState.id) {
        relevantNodeIds.push(edge.target);
      }
      if (edge.target === currentState.id) {
        relevantNodeIds.push(edge.source);
      }
    });

    return relevantNodeIds.map((nodeId) => findNodeByLabel(nodeId));
  };

  const filterEdgesByCurrentState = (edges) => {
    if (!currentState) return [];

    return edges.filter(
      (edge) =>
        edge.source === currentState.id || edge.target === currentState.id
    );
  };

  const handleViewChange = (event) => {
    setIsGlobalView(event.target.checked);
  };

  const goToNextState = (targetNodeId) => {
    setCurrentState(findNodeByLabel(targetNodeId));
  };

  const goToPreviousState = (sourceNodeId) => {
    setCurrentState(findNodeByLabel(sourceNodeId));
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <label style={{ marginBottom: "10px", fontSize: "1.2rem" }}>
        <input
          type="checkbox"
          checked={isGlobalView}
          onChange={handleViewChange}
        />
        Global view enabled
      </label>
      {currentState && !isGlobalView && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <p style={{ marginBottom: "10px", fontSize: "1.2rem" }}>
            Current state: {currentState.id}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <p style={{ marginBottom: "5px", fontSize: "1rem" }}>
                Next states
              </p>
              {edges
                .filter((edge) => edge.source === currentState.id)
                .map((edge) => (
                  <button
                    key={edge.target}
                    style={{
                      margin: "5px",
                      padding: "10px",
                      borderRadius: "5px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      fontSize: "0.9rem",
                    }}
                    onClick={() => goToNextState(edge.target)}
                  >
                    {`${edge.target} (${edge.label})`}
                  </button>
                ))}
            </div>
            <div style={{ marginLeft: "20px" }}>
              <p style={{ marginBottom: "5px", fontSize: "1rem" }}>
                Previous states
              </p>
              {edges
                .filter((edge) => edge.target === currentState.id)
                .map((edge) => (
                  <button
                    key={edge.source}
                    style={{
                      margin: "5px",
                      padding: "10px",
                      borderRadius: "5px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      fontSize: "0.9rem",
                    }}
                    onClick={() => goToPreviousState(edge.source)}
                  >
                    {`${edge.source} (${edge.label})`}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
      <hr style={{ width: "100%" }} />
      {nodes && edges && (
        <ReactFlow
          style={{ width: "100%", height: "70vh" }}
          nodes={isGlobalView ? nodes : filterNodesByCurrentState(nodes, edges)}
          onNodesChange={onNodesChange}
          edges={isGlobalView ? edges : filterEdgesByCurrentState(edges)}
          onEdgesChange={onEdgesChange}
        >
          <Background />
          <Controls />
        </ReactFlow>
      )}
    </div>
  );
}

export default FsmView;
