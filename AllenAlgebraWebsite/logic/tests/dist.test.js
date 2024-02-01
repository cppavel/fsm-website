const DeepDict = require("../src/dict.js");

describe("Dict", () => {
  let dict;

  beforeEach(() => {
    dict = new DeepDict();
  });

  test("set method should set a value", () => {
    const key = { a: 1 };
    const value = "test";
    dict.set(key, value);
    expect(dict.get(key)).toBe(value);
  });

  test("has method should check if a key exists", () => {
    const key = { a: 1 };
    dict.set(key, "test");
    expect(dict.has(key)).toBe(true);
  });

  test("delete method should delete a key", () => {
    const key = { a: 1 };
    dict.set(key, "test");
    expect(dict.has(key)).toBe(true);
    dict.delete(key);
    expect(dict.has(key)).toBe(false);
  });

  test("keys method should return all keys", () => {
    const key1 = { a: 1 };
    const key2 = { b: 2 };
    dict.set(key1, "test1");
    dict.set(key2, "test2");
    expect(dict.keys()).toEqual([key1, key2]);
  });

  test("values method should return all values", () => {
    const key1 = { a: 1 };
    const key2 = { b: 2 };
    const value1 = "test1";
    const value2 = "test2";
    dict.set(key1, value1);
    dict.set(key2, value2);
    expect(dict.values()).toEqual([value1, value2]);
  });

  test("entries method should return all entries", () => {
    const key1 = { a: 1 };
    const key2 = { b: 2 };
    const value1 = "test1";
    const value2 = "test2";
    dict.set(key1, value1);
    dict.set(key2, value2);
    expect(dict.entries()).toEqual([
      [key1, value1],
      [key2, value2],
    ]);
  });

  test("clear method should clear all entries", () => {
    const key1 = { a: 1 };
    const key2 = { b: 2 };
    dict.set(key1, "test1");
    dict.set(key2, "test2");
    dict.clear();
    expect(dict.size()).toBe(0);
  });

  test("size method should return the correct size", () => {
    const key1 = { a: 1 };
    const key2 = { b: 2 };
    dict.set(key1, "test1");
    dict.set(key2, "test2");
    expect(dict.size()).toBe(2);
  });
});
