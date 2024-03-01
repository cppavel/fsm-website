const reactFlow = require("reactflow");

const State = require("./state.js");
const DeepSet = require("./set.js");
const DeepDict = require("./dict.js");

class Fsm {
  constructor() {
    this.startStateLabels = new DeepSet();
    this.statesByLabel = new DeepDict();
    this.finalStateLabels = new DeepSet();
    this.alphabet = new DeepSet();
  }

  addState(state) {
    if (this.statesByLabel.has(state.label)) {
      return;
    }

    this.statesByLabel.set(state.label, state);
  }

  markAsStart(label) {
    if (this.startStateLabels.size() > 0) {
      throw new Error(`Only a single starting state is allowed!`);
    }

    if (!this.statesByLabel.has(label)) {
      throw new Error(
        `Cannot mark a non-existent state as starting: ${label}!`
      );
    }

    this.startStateLabels.add(label);
  }

  markAsFinal(label) {
    if (!this.statesByLabel.has(label)) {
      throw new Error(`Non existent state: ${label}!`);
    }

    this.finalStateLabels.add(label);
  }

  addTransition(startStateLabel, endStateLabel, symbol, probability) {
    if (!this.statesByLabel.has(startStateLabel)) {
      throw new Error(`Non existent state: ${startStateLabel}!`);
    }

    if (!this.statesByLabel.has(endStateLabel)) {
      throw new Error(`Non existent state: ${endStateLabel}!`);
    }

    this.alphabet.add(symbol);

    this.statesByLabel
      .get(startStateLabel)
      .addTransition(
        symbol,
        this.statesByLabel.get(endStateLabel),
        probability
      );
  }

  normalizeProbabilities() {
    for (const state of this.statesByLabel.values()) {
      state.normalizeProbabilities();
    }
  }

  generateThisFsmTransitions(otherFsm, superposedFsm, currentStateLabel) {
    const thisFsmStateLabel = currentStateLabel[0];
    const otherFsmStateLabel = currentStateLabel[1];
    const newStateLabels = [];

    for (const [symbol, nextState] of this.statesByLabel
      .get(thisFsmStateLabel)
      .transitions.entries()) {
      const newStateLabel = [nextState.label, otherFsmStateLabel];
      const newState = new State(newStateLabel);

      superposedFsm.addState(newState);

      if (
        this.finalStateLabels.has(nextState.label) &&
        otherFsm.finalStateLabels.has(otherFsmStateLabel)
      ) {
        superposedFsm.markAsFinal(newStateLabel);
      }

      const probabilityThisFsm = this.statesByLabel
        .get(thisFsmStateLabel)
        .probabilities.get(symbol);

      const probabilityOtherFsm =
        1 -
        otherFsm.statesByLabel
          .get(otherFsmStateLabel)
          .probabilities.values()
          .reduce((s, a) => s + a, 0);

      const newProbability = probabilityThisFsm * probabilityOtherFsm;

      superposedFsm.addTransition(
        currentStateLabel,
        newStateLabel,
        symbol,
        newProbability
      );

      newStateLabels.push(newStateLabel);
    }

    return newStateLabels;
  }

  generateOtherFsmTransitions(otherFsm, superposedFsm, currentStateLabel) {
    const thisFsmStateLabel = currentStateLabel[0];
    const otherFsmStateLabel = currentStateLabel[1];
    const newStateLabels = [];

    for (const [symbol, nextState] of otherFsm.statesByLabel
      .get(otherFsmStateLabel)
      .transitions.entries()) {
      const newStateLabel = [thisFsmStateLabel, nextState.label];
      const newState = new State(newStateLabel);
      superposedFsm.addState(newState);

      if (
        this.finalStateLabels.has(thisFsmStateLabel) &&
        otherFsm.finalStateLabels.has(nextState.label)
      ) {
        superposedFsm.markAsFinal(newStateLabel);
      }

      const probabilityThisFsm =
        1 -
        this.statesByLabel
          .get(thisFsmStateLabel)
          .probabilities.values()
          .reduce((s, a) => s + a, 0);
      const probabilityOtherFsm = otherFsm.statesByLabel
        .get(otherFsmStateLabel)
        .probabilities.get(symbol);

      const newProbability = probabilityThisFsm * probabilityOtherFsm;

      superposedFsm.addTransition(
        currentStateLabel,
        newStateLabel,
        symbol,
        newProbability
      );

      newStateLabels.push(newStateLabel);
    }

    return newStateLabels;
  }

  generateBothFsmsTransitions(otherFsm, superposedFsm, currentStateLabel) {
    const thisFsmStateLabel = currentStateLabel[0];
    const otherFsmStateLabel = currentStateLabel[1];
    const newStateLabels = [];

    for (const [symbolThis, nextStateThis] of this.statesByLabel
      .get(thisFsmStateLabel)
      .transitions.entries()) {
      for (const [symbolOther, nextStateOther] of otherFsm.statesByLabel
        .get(otherFsmStateLabel)
        .transitions.entries()) {
        const newStateLabel = [nextStateThis.label, nextStateOther.label];
        const newState = new State(newStateLabel);
        superposedFsm.addState(newState);

        if (
          this.finalStateLabels.has(nextStateThis.label) &&
          otherFsm.finalStateLabels.has(nextStateOther.label)
        ) {
          superposedFsm.markAsFinal(newStateLabel);
        }

        const probabilityThisFsm = this.statesByLabel
          .get(thisFsmStateLabel)
          .probabilities.get(symbolThis);
        const probabilityOtherFsm = otherFsm.statesByLabel
          .get(otherFsmStateLabel)
          .probabilities.get(symbolOther);

        const newProbability = probabilityThisFsm * probabilityOtherFsm;

        superposedFsm.addTransition(
          currentStateLabel,
          newStateLabel,
          [symbolThis, symbolOther],
          newProbability
        );

        newStateLabels.push(newStateLabel);
      }
    }

    return newStateLabels;
  }

  stringifyStatesAndTransitions() {
    let result = "";
    for (const state of this.statesByLabel.values()) {
      result += `State: ${state.label}\n`;
      for (const [symbol, nextState] of state.transitions.entries()) {
        result += `  Transition: ${symbol} -> ${
          nextState.label
        } P=${state.probabilities.get(symbol)}\n`;
      }
    }
    return result;
  }

  superpose(otherFsm) {
    const superposedFsm = new Fsm();
    const thisStartState = this.statesByLabel.get(
      this.startStateLabels.values()[0]
    );
    const otherStartState = otherFsm.statesByLabel.get(
      otherFsm.startStateLabels.values()[0]
    );

    const superFsmStartStateLabel = [
      thisStartState.label,
      otherStartState.label,
    ];

    const superFsmStartState = new State(superFsmStartStateLabel);
    superposedFsm.addState(superFsmStartState);
    superposedFsm.markAsStart(superFsmStartStateLabel);

    const stateLabelQueue = [superFsmStartStateLabel];

    while (stateLabelQueue.length > 0) {
      const currentStateLabel = stateLabelQueue.pop();

      const thisFsmNewLabels = this.generateThisFsmTransitions(
        otherFsm,
        superposedFsm,
        currentStateLabel
      );

      stateLabelQueue.push(...thisFsmNewLabels);

      const otherFsmNewLabels = this.generateOtherFsmTransitions(
        otherFsm,
        superposedFsm,
        currentStateLabel
      );

      stateLabelQueue.push(...otherFsmNewLabels);

      const bothFsmsTransitionNewLabels = this.generateBothFsmsTransitions(
        otherFsm,
        superposedFsm,
        currentStateLabel
      );

      stateLabelQueue.push(...bothFsmsTransitionNewLabels);
    }

    return superposedFsm;
  }

  topologicalSort() {
    const visited = new DeepSet();
    const stack = [];

    const dfs = (currentStateLabel) => {
      visited.add(currentStateLabel);

      for (const nextState of this.statesByLabel
        .get(currentStateLabel)
        .transitions.values()) {
        if (!visited.has(nextState.label)) {
          dfs(nextState.label);
        }
      }

      stack.push(currentStateLabel);
    };

    for (const stateLabel of this.statesByLabel.keys()) {
      if (!visited.has(stateLabel)) {
        dfs(stateLabel);
      }
    }

    return stack.reverse();
  }

  findLongestPaths() {
    const topologicalSort = this.topologicalSort();
    const distances = new DeepDict();

    for (const stateLabel of this.statesByLabel.keys()) {
      distances.set(`${stateLabel}`, 0);
    }

    for (const stateLabel of topologicalSort) {
      // eslint-disable-next-line no-unused-vars
      for (const [_, nextState] of this.statesByLabel
        .get(stateLabel)
        .transitions.entries()) {
        const newDistance = distances.get(`${stateLabel}`) + 1;
        if (newDistance > distances.get(`${nextState.label}`)) {
          distances.set(`${nextState.label}`, newDistance);
        }
      }
    }

    return distances;
  }

  simulate() {
    let currentStateLabel = this.startStateLabels.values()[0];

    const symbols = [];
    const states = [];

    while (true) {
      const currentState = this.statesByLabel.get(currentStateLabel);

      if (this.finalStateLabels.has(currentStateLabel)) {
        return { symbols: symbols, states: states };
      }

      const transitionProbabilities = currentState.probabilities;

      let cumulativeProbability = 0;
      const randomValue = Math.random();

      for (const [symbol, probability] of transitionProbabilities.entries()) {
        cumulativeProbability += probability;

        if (randomValue < cumulativeProbability) {
          states.push(currentStateLabel);
          symbols.push(symbol);
          currentStateLabel = currentState.transitions.get(symbol).label;
          break;
        }
      }
    }
  }

  generateConnectionsForReactFlow() {
    const nodes = [];
    const edges = [];

    const queue = [this.startStateLabels.values()[0]];
    const visited = new DeepSet();

    while (queue.length > 0) {
      const currentStateLabel = queue.pop();
      visited.add(currentStateLabel);
      const currentState = this.statesByLabel.get(currentStateLabel);

      const node = {
        id: `${currentStateLabel}`,
        data: {
          label: `${currentStateLabel}`,
        },
        sourcePosition: "right",
        targetPosition: "left",
      };

      if (this.finalStateLabels.has(currentStateLabel)) {
        node.style = {
          backgroundColor: "red",
        };
      } else if (this.startStateLabels.has(currentStateLabel)) {
        node.style = {
          backgroundColor: "green",
        };
      }

      nodes.push(node);

      for (const [symbol, nextState] of currentState.transitions.entries()) {
        const edge = {
          id: `${currentStateLabel}-${symbol}-${nextState.label}`,
          source: `${currentStateLabel}`,
          target: `${nextState.label}`,
          label: `${symbol} P=${currentState.probabilities
            .get(symbol)
            .toFixed(3)}`,
          markerEnd: {
            type: reactFlow.MarkerType.ArrowClosed,
          },
        };
        edges.push(edge);

        if (!visited.has(nextState.label)) {
          queue.push(nextState.label);
        }
      }
    }

    return [nodes, edges];
  }

  generateNodesAndEdgesForReactFlowTopologicalSort(
    startNodeX,
    startNodeY,
    stepX,
    stepY,
    nodesPerHorizontalLayer = 3
  ) {
    const [nodes, edges] = this.generateConnectionsForReactFlow();

    const topologicalOrder = this.topologicalSort().map((x) => `${x}`);

    for (const node of nodes) {
      const order = topologicalOrder.indexOf(node.id);
      const shiftX = Math.floor(order / nodesPerHorizontalLayer);
      const shiftY = order % nodesPerHorizontalLayer;
      node.position = {
        x: startNodeX + stepX * shiftX,
        y: startNodeY + stepY * shiftY,
      };
    }

    return {
      nodes: nodes,
      edges: edges,
    };
  }

  generateNodesAndEdgesForReactFlowLongestPaths(
    startNodeX,
    startNodeY,
    stepX,
    stepY
  ) {
    const [nodes, edges] = this.generateConnectionsForReactFlow();

    const longestPaths = this.findLongestPaths();
    const countAtSameXCoordinate = new DeepDict();

    for (const node of nodes) {
      const distance = longestPaths.get(node.id);

      if (!countAtSameXCoordinate.has(distance)) {
        countAtSameXCoordinate.set(distance, 0);
      }

      const count = countAtSameXCoordinate.get(distance);
      node.position = {
        x: startNodeX + stepX * distance,
        y: startNodeY + stepY * count + (stepY / 4) * distance,
      };

      countAtSameXCoordinate.set(distance, count + 1);
    }

    return {
      nodes: nodes,
      edges: edges,
    };
  }
}

module.exports = Fsm;
