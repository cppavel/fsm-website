import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import FsmView from "./components/FsmView";
import FsmExamples from "./components/FsmExamples";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/fsmview" element={<FsmView />} />
          <Route path="/fsmexamples" element={<FsmExamples />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
