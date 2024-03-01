const Fsm = require("./fsm.js");
const State = require("./state.js");
const DeepDict = require("./dict.js");

const allenMapping = {
  lb_rb_la_ra: "is preceded",
  la_ra_lb_rb: "precedes",
  "lb_la,rb_ra": "meets inverse",
  "la_ra,lb_rb": "meets",
  lb_la_rb_ra: "overlaps inverse",
  la_lb_ra_rb: "overlaps",
  "la,lb_rb_ra": "starts inverse",
  "la,lb_ra_rb": "starts",
  lb_la_ra_rb: "during",
  la_lb_rb_ra: "during inverse",
  "lb_la_ra,rb": "finishes",
  "la_lb_ra,rb": "finishes inverse",
  "la,lb_ra,rb": "equals",
};

const depad = (path) => {
  return path
    .replace("_oa_", "_")
    .replace("oa,", "")
    .replace(",oa", "")
    .replace("_ob_", "_")
    .replace("ob,", "")
    .replace(",ob", "");
};

const findAllenRelationProbabilities = (simulations) => {
  const counts = new DeepDict();
  for (let simulation of simulations) {
    const key = depad(simulation.symbols.join("_"));
    const allenName = allenMapping[key];
    if (counts.has(allenName)) {
      counts.set(allenName, counts.get(allenName) + 1);
    } else {
      counts.set(allenName, 1);
    }
  }

  for (let allenName of counts.keys()) {
    counts.set(allenName, counts.get(allenName) / simulations.length);
  }

  return counts;
};

const generateProbability = (
  maxIterations,
  pStart,
  p,
  pPrime,
  alpha,
  relation
) => {
  const fsm1 = new Fsm();
  fsm1.addState(new State("u_a"));
  fsm1.addState(new State("li_a"));
  fsm1.addState(new State("oli_a"));
  fsm1.addState(new State("d_a"));
  fsm1.addTransition("u_a", "li_a", ["la"], pStart);
  fsm1.addTransition("li_a", "oli_a", ["oa"], (1 - alpha) * (1 - p));
  fsm1.addTransition("li_a", "d_a", ["ra"], p);
  fsm1.addTransition("oli_a", "d_a", ["ra"], pPrime);
  fsm1.markAsStart("u_a");
  fsm1.markAsFinal("d_a");

  const fsm2 = new Fsm();
  fsm2.addState(new State("u_b"));
  fsm2.addState(new State("li_b"));
  fsm2.addState(new State("oli_b"));
  fsm2.addState(new State("d_b"));
  fsm2.addTransition("u_b", "li_b", ["lb"], pStart);
  fsm2.addTransition("li_b", "oli_b", ["ob"], (1 - alpha) * (1 - p));
  fsm2.addTransition("li_b", "d_b", ["rb"], p);
  fsm2.addTransition("oli_b", "d_b", ["rb"], pPrime);
  fsm2.markAsStart("u_b");
  fsm2.markAsFinal("d_b");

  const allenFsm = fsm1.superpose(fsm2);
  const simulations = [];

  for (let i = 0; i < maxIterations; i++) {
    simulations.push(allenFsm.simulate());
  }

  const allenRelationProbabilities =
    findAllenRelationProbabilities(simulations);

  if (allenRelationProbabilities.has(relation)) {
    return allenRelationProbabilities.get(relation);
  }

  return 0;
};

module.exports = generateProbability;
