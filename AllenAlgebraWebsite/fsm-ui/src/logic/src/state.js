const DeepDict = require("./dict.js");

class State {
  constructor(label) {
    this.label = label;
    this.transitions = new DeepDict();
    this.probabilities = new DeepDict();
  }

  normalizeProbabilities() {
    let sum = 0;
    // eslint-disable-next-line no-unused-vars
    for (let [_, probability] of this.probabilities.entries()) {
      sum += probability;
    }

    if (sum > 0) {
      for (let [symbol, probability] of this.probabilities.entries()) {
        this.probabilities.set(symbol, probability / sum);
      }
    }
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
