const FsmSerializer = require("../src/fsmSerialize.js");
const Fsm = require("../src/fsm.js");
const State = require("../src/state.js");

describe("FsmSerializer", () => {
  let fsm;
  const serializedDataExpected = `{"startStateLabels":["A"],"stateLabels":["A","B","C","D"],"transitions":[{"from":"A","to":"B","symbol":["ab"],"probability":0.125},{"from":"A","to":"C","symbol":["ac"],"probability":0.25},{"from":"B","to":"D","symbol":["bd"],"probability":0.5},{"from":"C","to":"D","symbol":["cd"],"probability":0.6}],"finalStateLabels":["D"],"alphabet":[["ab"],["ac"],["bd"],["cd"]]}`;

  beforeEach(() => {
    fsm = new Fsm();
    fsm.addState(new State("A"));
    fsm.addState(new State("B"));
    fsm.addState(new State("C"));
    fsm.addState(new State("D"));
    fsm.addTransition("A", "B", ["ab"], 0.125);
    fsm.addTransition("A", "C", ["ac"], 0.25);
    fsm.addTransition("B", "D", ["bd"], 0.5);
    fsm.addTransition("C", "D", ["cd"], 0.6);
    fsm.markAsFinal("D");
    fsm.markAsStart("A");
  });

  describe("extractTransitionPerState", () => {
    it("should extract transitions per state from an FSM object", () => {
      const transitionsPerState = FsmSerializer.extractTransitionPerState(fsm);

      expect(transitionsPerState).toEqual([
        { from: "A", to: "B", symbol: ["ab"], probability: 0.125 },
        { from: "A", to: "C", symbol: ["ac"], probability: 0.25 },
        { from: "B", to: "D", symbol: ["bd"], probability: 0.5 },
        { from: "C", to: "D", symbol: ["cd"], probability: 0.6 },
      ]);
    });
  });

  describe("serialize", () => {
    it("should serialize an FSM object into a string", () => {
      const serializedData = FsmSerializer.serialize(fsm);

      expect(typeof serializedData).toBe("string");
      expect(serializedData).toBe(serializedDataExpected);
    });
  });

  describe("deserialize", () => {
    it("should deserialize a string into an FSM object", () => {
      const deserializedFsm = FsmSerializer.deserialize(serializedDataExpected);
      expect(deserializedFsm.alphabet.values()).toEqual([
        ["ab"],
        ["ac"],
        ["bd"],
        ["cd"],
      ]);
      expect(deserializedFsm.statesByLabel.keys()).toEqual([
        "A",
        "B",
        "C",
        "D",
      ]);
      expect(deserializedFsm.startStateLabels.values()).toEqual(["A"]);
      expect(deserializedFsm.finalStateLabels.values()).toEqual(["D"]);
      expect(deserializedFsm.stringifyStatesAndTransitions()).toEqual(
        fsm.stringifyStatesAndTransitions()
      );
    });
  });
});
