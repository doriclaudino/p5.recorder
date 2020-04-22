import Recorder from "../src/p5.recorder";

describe("smoke tests", () => {
  new Recorder();
  var recoder = new Recorder("aaa", false);
  test("can create an instance", () => {
    expect(recoder).toBeTruthy();
  });
});

describe("p5 available global", () => {
  test("should p5 appear on global scope", () => {
    expect(global.p5).toBeTruthy();
  });

  test("should p5 appear on window scope", () => {
    expect(window.p5).toBeTruthy();
  });

  test("should created canvas", () => {
    expect(document.getElementById("defaultCanvas0")).toBeTruthy();
  });

  test("should setup be true", () => {
    expect(myp5).toBeTruthy();
  });

  test("should setup be true", () => {
    expect(myp5._setupDone).toBeTruthy();
  });

  test("should setup be true", () => {
    expect(myp5._setupDone).toBeTruthy();
  });

  // test("can save canvas", done => {
  //   /**
  //    * fail
  //    * object_url = get_URL().createObjectURL(blob);
  //    * get_URL(...).createObjectURL is not a function
  //    */
  //   myp5.saveCanvas(myp5.canvas, "myCanvas", "jpg");
  //   done();
  // });
});
