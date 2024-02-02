import { useState, useCallback } from "react";
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

  const filterNodesByCurrentState = (nodes) => {
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
    return edges.filter(
      (edge) =>
        edge.source === currentState.id || edge.target === currentState.id
    );
  };

  const handleViewChange = (event) => {
    setIsGlobalView(event.target.checked);
  };

  return (
    <div style={{ height: "90vh" }}>
      <label>
        <input
          type="checkbox"
          checked={isGlobalView}
          onChange={handleViewChange}
        />
        Global view enabled
      </label>
      {!isGlobalView && (
        <div>
          <p>Current state: {currentState.id}</p>
          <p>Next states</p>
          {edges
            .filter((edge) => edge.source === currentState.id)
            .map((edge) => {
              return (
                <button
                  key={edge.target}
                  onClick={() => setCurrentState(findNodeByLabel(edge.target))}
                >
                  {`${edge.target} (${edge.label})`}
                </button>
              );
            })}
          <p>Previous states</p>
          {edges
            .filter((edge) => edge.target === currentState.id)
            .map((edge) => {
              return (
                <button
                  key={edge.source}
                  onClick={() => setCurrentState(findNodeByLabel(edge.source))}
                >
                  {`${edge.source} (${edge.label})`}
                </button>
              );
            })}
        </div>
      )}
      <hr />
      <ReactFlow
        nodes={isGlobalView ? nodes : filterNodesByCurrentState(nodes)}
        onNodesChange={onNodesChange}
        edges={isGlobalView ? edges : filterEdgesByCurrentState(edges)}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default FsmView;
