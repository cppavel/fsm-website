import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import FsmView from "./components/FsmView";
import FsmExamples from "./components/FsmExamples";
import FsmInput from "./components/FsmInput";

const App = () => {
  return (
    <Router basename="/fsm-website">
      <div>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/fsmview" element={<FsmView />} />
          <Route path="/fsmexamples" element={<FsmExamples />} />
          <Route path="/fsminput" element={<FsmInput />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
