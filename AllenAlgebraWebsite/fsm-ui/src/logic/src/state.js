const DeepDict = require("./dict.js");

class State {
  constructor(label) {
    this.label = label;
    this.transitions = new DeepDict();
    this.probabilities = new DeepDict();
  }

  addTransition(symbol, nextState, probability) {
    if (this.transitions.has(symbol)) {
      return;
    }

    if (probability < 0 || probability > 1) {
      throw new Error(
        `Probability has to be between 0.0 and 1.0, supplied: ${probability}!`
      );
    }

    this.transitions.set(symbol, nextState);
    this.probabilities.set(symbol, probability);
  }
}

module.exports = State;
