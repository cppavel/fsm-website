import React, { useState } from "react";
import DeepDict from "../logic/src/dict";

const SimulationResults = ({ fsm, depad }) => {
  const [simulations, setSimulations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [numberOfRuns, setNumberOfRuns] = useState(100);

  const allenMapping = {
    lb_rb_la_ra: "is preceded",
    la_ra_lb_rb: "precedes",
    "lb_la,rb_ra": "meets inverse",
    "la_ra,lb_rb": "meets",
    lb_la_rb_ra: "overlaps inverse",
    la_lb_ra_rb: "overlaps",
    "la,lb_rb_ra": "starts inverse",
    "la,lb_ra_rb": "starts",
    lb_la_ra_rb: "during",
    la_lb_rb_ra: "during inverse",
    "lb_la_ra,rb": "finishes",
    "la_lb_ra,rb": "finishes inverse",
    "la,lb_ra,rb": "equals",
  };

  const simulateMany = () => {
    const newSimulations = [];
    for (let i = 0; i < numberOfRuns; i++) {
      newSimulations.push(fsm.simulate());
    }
    setSimulations([...simulations, ...newSimulations]);
  };

  const handleNumberOfRunsChange = (event) => {
    setNumberOfRuns(parseInt(event.target.value));
  };

  const findAllenRelationProbabilities = () => {
    const counts = new DeepDict();
    for (let simulation of simulations) {
      const key = depad(simulation.symbols.join("_"));
      const allenName = allenMapping[key];
      if (counts.has(allenName)) {
        counts.set(allenName, counts.get(allenName) + 1);
      } else {
        counts.set(allenName, 1);
      }
    }

    for (let allenName of counts.keys()) {
      counts.set(allenName, counts.get(allenName) / simulations.length);
    }

    return counts;
  };

  return (
    <div>
      <button
        onClick={simulateMany}
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
        Simulate Many
      </button>
      <br />

      <input
        type="number"
        value={numberOfRuns}
        onChange={handleNumberOfRunsChange}
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginBottom: "10px",
          marginTop: "10px",
        }}
      />

      <br />

      <button
        onClick={() => setSimulations([])}
        style={{
          backgroundColor: "#FF3366",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          marginRight: "10px",
          marginTop: "10px",
        }}
      >
        Clear Results
      </button>

      <div>
        <p>Allen probabilities:</p>
        <table
          style={{ borderCollapse: "collapse", border: "1px solid black" }}
        >
          <thead>
            <tr>
              <th style={{ padding: "8px", border: "1px solid black" }}>
                Allen relation
              </th>
              <th style={{ padding: "8px", border: "1px solid black" }}>
                Probability
              </th>
            </tr>
          </thead>
          <tbody>
            {findAllenRelationProbabilities()
              .entries()
              .sort()
              .map(([allenName, probability]) => (
                <tr key={allenName}>
                  <td style={{ padding: "8px", border: "1px solid black" }}>
                    {allenName}
                  </td>
                  <td style={{ padding: "8px", border: "1px solid black" }}>
                    {probability.toFixed(3)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <input
        type="checkbox"
        checked={showResults}
        onChange={() => setShowResults(!showResults)}
        style={{ marginTop: "15px", marginRight: "10px" }}
      />
      <label style={{ marginBottom: "10px" }}>
        Show Individual Run Results
      </label>

      {showResults && (
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {simulations.map((simulation, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p style={{ marginBottom: "5px" }}>Result: {index + 1}</p>
              <p style={{ marginBottom: "5px" }}>
                String: {depad(simulation.symbols.join("_"))}
              </p>
              <p style={{ marginBottom: "5px" }}>
                Allen relation:{" "}
                {allenMapping[depad(simulation.symbols.join("_"))]}
              </p>
              <hr style={{ marginBottom: "5px" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulationResults;
