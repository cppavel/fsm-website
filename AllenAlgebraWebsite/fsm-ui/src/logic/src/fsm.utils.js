function serialize(fsm) {
  return JSON.stringify(fsm, (key, value) => {
    if (value instanceof Map || value instanceof Set) {
      return [...value];
    } else if (value instanceof State) {
      return { label: value.label, transitions: [...value.transitions] };
    } else {
      return value;
    }
  });
}

function deserialize(json) {
  const fsmData = JSON.parse(json);
  const fsm = new Fsm();

  for (const [key, value] of Object.entries(fsmData)) {
    if (value instanceof Array) {
      if (value.length > 0 && value[0] instanceof Array) {
        const map = new Map(value);
        fsm[key] = map;
      } else {
        const set = new Set(value);
        fsm[key] = set;
      }
    } else if (key === "statesByLabel") {
      const dict = new DeepDict();
      for (const [stateLabel, stateData] of Object.entries(value)) {
        const state = new State(stateData.label);
        for (const [symbol, nextStateLabel] of stateData.transitions) {
          const nextState = new State(nextStateLabel);
          state.transitions.set(symbol, nextState);
        }
        dict.set(stateLabel, state);
      }
      fsm[key] = dict;
    } else {
      fsm[key] = value;
    }
  }

  return fsm;
}
