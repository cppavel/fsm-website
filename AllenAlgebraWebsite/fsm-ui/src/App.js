import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FsmExampleClassicAllen from "./components/FsmExampleClassicAllen";
import FsmInput from "./components/FsmInput";
import FsmExampleGranularAllen from "./components/FsmExampleGranularAllen";
import FsmSuperpose from "./components/FsmSuperpose";
import FsmSimulator from "./components/FsmSimulator";
import FsmMatrix from "./components/FsmMatrix";

const App = () => {
  return (
    <Router basename="/fsm-website">
      <div>
        <Routes>
          <Route path="/" exact element={<FsmExampleClassicAllen />} />
          <Route
            path="/fsmexample-allen"
            element={<FsmExampleClassicAllen />}
          />
          <Route path="/fsminput" element={<FsmInput />} />
          <Route
            path="/fsmexample-granular"
            element={<FsmExampleGranularAllen />}
          />
          <Route path="/fsm-superpose" element={<FsmSuperpose />} />
          <Route path="/fsm-simulate" element={<FsmSimulator />} />
          <Route path="/fsm-matrix" element={<FsmMatrix />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
