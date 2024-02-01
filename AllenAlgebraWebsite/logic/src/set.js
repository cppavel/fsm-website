const Dict = require("./dict.js");

class DeepSet {
  constructor() {
    this.dictionary = new Dict();
  }

  add(value) {
    this.dictionary.set(value, value);
  }

  delete(value) {
    return this.dictionary.delete(value);
  }

  has(value) {
    return this.dictionary.has(value);
  }

  values() {
    return this.dictionary.keys();
  }

  clear() {
    this.dictionary.clear();
  }

  size() {
    return this.dictionary.size();
  }
}

module.exports = DeepSet;
