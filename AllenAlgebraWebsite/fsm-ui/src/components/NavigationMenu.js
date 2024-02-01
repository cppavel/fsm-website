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
          <Link to="/fsmview">Fsm view</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationMenu;
