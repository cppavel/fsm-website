const DeepSet = require("../src/set.js");

describe("SetArray", () => {
  let setArray;

  beforeEach(() => {
    setArray = new DeepSet();
  });

  test("add method should add a value", () => {
    const value = "test";
    setArray.add(value);
    expect(setArray.has(value)).toBe(true);
  });

  test("delete method should delete a value", () => {
    const value = "test";
    setArray.add(value);
    expect(setArray.has(value)).toBe(true);
    setArray.delete(value);
    expect(setArray.has(value)).toBe(false);
  });

  test("clear method should clear all values", () => {
    setArray.add("test1");
    setArray.add("test2");
    setArray.clear();
    expect(setArray.size()).toBe(0);
  });

  test("size method should return the correct size", () => {
    setArray.add("test1");
    setArray.add("test2");
    expect(setArray.size()).toBe(2);
  });

  test("values method should return all values", () => {
    const value1 = "test1";
    const value2 = "test2";
    setArray.add(value1);
    setArray.add(value2);
    expect(setArray.values()).toEqual([value1, value2]);
  });
});
