import Recorder from "../src/p5.recorder";

describe("smoke tests", () => {
  var mainRecorder = new Recorder("aaa", false);
  test("can create an instance", () => {
    expect(mainRecorder).toBeTruthy();
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
  var mainRecorder = new Recorder();

  beforeEach(() => {
    //stop navigation error of on download module
    // window.history.pushState({}, "Test Title", "/test.html?query=true");
    mainRecorder = new Recorder();
  });

  test("should override the output name", () => {
    mainRecorder._outputName = "aloha.webm";
    expect(mainRecorder._outputName).toEqual("aloha.webm");
  });

  test("should override the saveAfterStop option", () => {
    expect(mainRecorder._saveAfterStop).toBeTruthy();
    mainRecorder._saveAfterStop = false;
    expect(mainRecorder._saveAfterStop).toBeFalsy();
  });

  test("should start and stop stream", () => {
    const somethingSpy = jest.spyOn(myp5.canvas, "captureStream");
    mainRecorder.start(myp5.canvas);
    expect(somethingSpy).toBeCalled();
    expect(mainRecorder._isRecording).toBeTruthy();
    mainRecorder.stop();
    expect(mainRecorder._isRecording).toBeFalsy();
  });

  test("should throw error on start twice", () => {
    mainRecorder.start(myp5.canvas);
    expect(() => mainRecorder.start(myp5.canvas)).toThrow("Stop first before start again");
  });

  test("should download file after stop", () => {
    const somethingSpy = jest.spyOn(mainRecorder, "download");
    mainRecorder.start(myp5.canvas);
    mainRecorder.stop();
    expect(somethingSpy).toBeCalled();
  });

  test("chunks available after stop", () => {
    // const somethingSpy = jest.spyOn(mainRecorder, "download");
    mainRecorder.start(myp5.canvas);
    const somethingSpy = jest.spyOn(mainRecorder._recorder, "ondataavailable");
    mainRecorder.stop();
    expect(somethingSpy).toBeCalled();
    expect(mainRecorder._chunks).toHaveLength(1);
  });

  test("should record timers", () => {
    mainRecorder.start(myp5.canvas);

    //make duration as 5s
    //should check faketimers
    mainRecorder._initialRecordingTime = new Date(
      mainRecorder._initialRecordingTime.getTime() - 5000
    );
    expect(mainRecorder.currentRecordingTime).toEqual(5000);
    expect(mainRecorder.totalRecordedTime).toBeUndefined();

    mainRecorder.stop();
    expect(mainRecorder.totalRecordedTime).toBeTruthy();

    //make duration as 10s
    mainRecorder._endRecordingTime = new Date(mainRecorder._initialRecordingTime.getTime() + 10000);
    expect(mainRecorder.totalRecordedTime).toEqual(10000);
  });

  test("recorded frames should be bigger than zero", function(done) {
    /**
     * console.error
    Error: Not implemented: navigation (except hash changes)
     */
    jest.spyOn(console, "error").mockImplementation();
    mainRecorder.start(myp5.canvas);
    myp5.draw();
    jest.useRealTimers();

    setTimeout(function() {
      mainRecorder.stop();
      expect(mainRecorder.totalRecordedTime).toBeGreaterThan(500);
      expect(mainRecorder.totalRecordedFrames).toBeGreaterThan(
        (500 * mainRecorder._targetFps) / 1000
      );
      done();
    }, 500);
    expect(mainRecorder.currentRecordingFrames).toBeGreaterThan(1);
    expect(mainRecorder.totalRecordedTime).toBeUndefined();
  });
});
