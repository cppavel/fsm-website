import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import FsmExampleClassicAllen from "./components/FsmExampleClassicAllen";
import FsmInput from "./components/FsmInput";
import FsmExampleGranularAllen from "./components/FsmExampleGranularAllen";

const App = () => {
  return (
    <Router basename="/fsm-website">
      <div>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route
            path="/fsmexample-allen"
            element={<FsmExampleClassicAllen />}
          />
          <Route path="/fsminput" element={<FsmInput />} />
          <Route
            path="/fsmexample-granular"
            element={<FsmExampleGranularAllen />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
