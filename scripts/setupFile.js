require("canvas");
const p5 = require("p5");
global.p5 = p5;

const mockStream = {
  data: { size: 1, value: "data-value" }
};

class MediaRecorder {
  onstop;
  onstart;
  ondataavailable;

  constructor(stream) {
    this.onstop = jest.fn();
    this.onstart = jest.fn();
    this.ondataavailable = jest.fn();
  }

  start() {
    this.onstart();
  }
  stop() {
    this.ondataavailable(mockStream);
    this.onstop();
  }
}
global.MediaRecorder = MediaRecorder;
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();
// global.location.hostname = "localhost";
