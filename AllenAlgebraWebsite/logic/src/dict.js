class DeepDict {
  constructor() {
    this.map = new Map();
  }

  set(key, value) {
    const stringifiedKey = JSON.stringify(key);
    this.map.set(stringifiedKey, value);
  }

  get(key) {
    const stringifiedKey = JSON.stringify(key);
    return this.map.get(stringifiedKey);
  }

  has(key) {
    const stringifiedKey = JSON.stringify(key);
    return this.map.has(stringifiedKey);
  }

  delete(key) {
    const stringifiedKey = JSON.stringify(key);
    return this.map.delete(stringifiedKey);
  }

  keys() {
    return [...this.map.keys()].map((key) => JSON.parse(key));
  }

  values() {
    return [...this.map.values()];
  }

  entries() {
    return [...this.map.entries()].map(([key, value]) => [
      JSON.parse(key),
      value,
    ]);
  }

  clear() {
    this.map.clear();
  }

  size() {
    return this.map.size;
  }
}

module.exports = DeepDict;
