import React from "react";
import { Link } from "react-router-dom";

const NavigationMenu = () => {
  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li style={styles.li}>
          <Link to="/fsmexample-allen" style={styles.link}>
            Fsm Example Classic Allen
          </Link>
        </li>
        <li style={styles.li}>
          <Link to="/fsmexample-granular" style={styles.link}>
            Fsm Example Granular Allen
          </Link>
        </li>
        <li style={styles.li}>
          <Link to="/fsminput" style={styles.link}>
            Fsm Input
          </Link>
        </li>
        <li style={styles.li}>
          <Link to="/fsm-superpose" style={styles.link}>
            Fsm Superpose
          </Link>
        </li>
        <li style={styles.li}>
          <Link to="/fsm-simulate" style={styles.link}>
            Fsm Simulate
          </Link>
        </li>
        <li style={styles.li}>
          <Link to="/fsm-matrix" style={styles.link}>
            Fsm Matrix
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#333",
    padding: "15px",
    marginBottom: "20px",
  },
  ul: {
    listStyleType: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
  },
  li: {
    margin: "0 10px",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    transition: "color 0.3s ease",
  },
  linkHover: {
    color: "#FFD700",
  },
};

export default NavigationMenu;
