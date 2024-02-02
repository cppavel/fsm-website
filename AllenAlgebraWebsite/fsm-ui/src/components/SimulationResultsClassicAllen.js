import React, { useState } from "react";
import DeepDict from "../logic/src/dict";

const SimulationResultsClassicAllen = ({ fsm }) => {
  const [simulations, setSimulations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [numberOfRuns, setNumberOfRuns] = useState(100);

  const allenMapping = {
    lb_rb_la_ra: "is preceded",
    la_ra_lb_rb: "preceeds",
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

  const findAllenRelationProbabilities = () => {
    const counts = new DeepDict();
    for (let simulation of simulations) {
      const key = simulation.symbols.join("_");
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

  return (
    <div>
      <button
        onClick={simulateMany}
        style={{
          backgroundColor: "gray",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          border: "none",
        }}
      >
        Simulate Many
      </button>

      <input
        type="number"
        value={numberOfRuns}
        onChange={handleNumberOfRunsChange}
      ></input>

      <input
        type="checkbox"
        checked={showResults}
        onChange={() => setShowResults(!showResults)}
      />
      <label>Show Individual Run Results</label>
      <div>
        <p>Allen probabilities:</p>
        {
          <table
            style={{ borderCollapse: "collapse", border: "1px solid black" }}
          >
            <tr>
              <th>Allen relation</th>
              <th>Probability</th>
            </tr>
            {findAllenRelationProbabilities()
              .entries()
              .sort()
              .map(([allenName, probability]) => {
                return (
                  <tr>
                    <td> {allenName}</td>
                    <td>{probability.toFixed(3)}</td>
                  </tr>
                );
              })}
          </table>
        }
      </div>
      {showResults && (
        <div>
          {simulations.map((simulation, index) => (
            <div>
              <p>Result: {index + 1}</p>
              <p>String: {simulation.symbols.join("_")}</p>
              <p>
                Allen relation: {allenMapping[simulation.symbols.join("_")]}
              </p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulationResultsClassicAllen;
