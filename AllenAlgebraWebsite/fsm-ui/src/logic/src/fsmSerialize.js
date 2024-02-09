const Fsm = require("./fsm.js");
const State = require("./state.js");

class FsmSerializer {
  static extractTransitionPerState(fsm) {
    const transitions = [];
    for (const [label, state] of fsm.statesByLabel.entries()) {
      for (const [symbol, nextState] of state.transitions.entries()) {
        transitions.push({
          from: label,
          to: nextState.label,
          symbol: symbol,
          probability: state.probabilities.get(symbol),
        });
      }
    }
    return transitions;
  }

  static serialize(fsm) {
    return JSON.stringify({
      startStateLabels: [...fsm.startStateLabels.values()],
      stateLabels: [...fsm.statesByLabel.keys()],
      transitions: this.extractTransitionPerState(fsm),
      finalStateLabels: [...fsm.finalStateLabels.values()],
      alphabet: [...fsm.alphabet.values()],
    });
  }

  static deserialize(serializedData) {
    const data = JSON.parse(serializedData);

    const fsm = new Fsm();

    for (const label of data.stateLabels) {
      fsm.addState(new State(label));
    }

    for (const transition of data.transitions) {
      fsm.addTransition(
        transition.from,
        transition.to,
        transition.symbol,
        transition.probability
      );
    }

    for (const label of data.startStateLabels) {
      fsm.markAsStart(label);
    }

    for (const label of data.finalStateLabels) {
      fsm.markAsFinal(label);
    }

    return fsm;
  }
}

module.exports = FsmSerializer;
