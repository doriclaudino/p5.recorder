import Recorder from "../src/p5.recorder";

describe("smoke tests", () => {
  var recoder = new Recorder("aaa", false);
  test("can create an instance", () => {
    expect(recoder).toBeTruthy();
  });
});

describe("env tests", () => {
  test("should p5 appear on global scope", () => {
    expect(global.p5).toBeTruthy();
  });

  test("should p5 appear on window scope", () => {
    expect(window.p5).toBeTruthy();
  });

  test("should created canvas", () => {
    expect(document.getElementById("defaultCanvas0")).toBeTruthy();
  });

  test("p5 instance should exist", () => {
    expect(myp5).toBeTruthy();
  });

  test("should setup be true", () => {
    expect(myp5._setupDone).toBeTruthy();
  });
});

describe("Recorder", () => {
  var outputName = "randomOutputName";
  var shouldSaveAtEnd = false;
  var recoder = new Recorder(outputName, false);
  test("should override the output name", () => {
    expect(recoder._outputName).toEqual(outputName);
  });

  test("should override the saveAtEnd option", () => {
    expect(recoder._saveAtEnd).toEqual(shouldSaveAtEnd);
    shouldSaveAtEnd = true;
    recoder._saveAtEnd = shouldSaveAtEnd;
    expect(recoder._saveAtEnd).toEqual(shouldSaveAtEnd);
  });
});
