import React from "react";
import { Link } from "react-router-dom";

const NavigationMenu = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/fsmexample-allen">Fsm Example Classic Allen</Link>
        </li>
        <li>
          <Link to="/fsminput">Fsm Input</Link>
        </li>
        <li>
          <Link to="/fsmexample-granular">Fsm Example Granular Allen</Link>
        </li>
        <li>
          <Link to="/fsm-superpose">Fsm Superpose</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
