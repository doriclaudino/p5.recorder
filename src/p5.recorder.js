const _download = require("downloadjs");

export default class Recorder {
  #_targetFps;
  #_outputName;
  #_chunks;
  #_recorder;
  #_saveAfterStop;
  #_canvas;
  #_progress;
  #_timer;

  constructor(output = "p5.recorder.canvas.webm", saveAfterStop = true) {
    this.#_targetFps = 60;
    this.#_outputName = output;
    this.#_chunks = [];
    this.#_saveAfterStop = saveAfterStop;
    this.#_timer = {};
  }

  //doriclaudino
  get #currentBlob() {
    return new Blob(this.#_chunks);
  }

  get #isRecording() {
    return this.#_recorder && this.#_recorder.state === "recording";
  }

  get #isPaused() {
    return this.#_recorder && this.#_recorder.state === "paused";
  }

  start(canvas = document.querySelector("canvas"), outputName = this.#_outputName, extras = {}) {
    if (this.#isRecording || this.#isPaused) throw new Error("Stop first before start again");
    this.#_canvas = canvas;
    this.#_outputName = outputName;

    if (!this.#_canvas) throw new Error("Can't find the canvas for start recording");
    if (!this.#_canvas.captureStream) throw new Error("Canvas can't support capture Stream");

    let stream = this.#_canvas.captureStream(this.#_targetFps);

    /**
     * https://developers.google.com/web/updates/2016/01/mediarecorder
     * we should check possible codecs
     */
    this.#_recorder = new MediaRecorder(stream);
    this.#_recorder.ondataavailable = this.#_onDataAvailable.bind(this);

    //default for webm
    this.#_recorder.onstop = this.#_onMediaRecorderStop.bind(this);
    this.#_recorder.onstart = this.#_onMediaRecorderStart.bind(this);
    this.#_recorder.start();
  }

  #_onDataAvailable(e) {
    if (e.data.size) {
      this.#_chunks.push(e.data);
    }
  }

  #_onMediaRecorderStart() {
    this.#_timer = {
      start: new Date(),
      end: undefined,
    };
    this.#_progress = 0;
    this.#_chunks = [];
    this.#_chunks.length = 0;
  }

  #_onMediaRecorderStop() {
    this.#_timer.end = new Date();
    this.#_progress = 100;
    if (this.#_saveAfterStop) this.download();
  }

  download() {
    _download(this.#currentBlob, this.#_outputName, "video/webm");
  }

  stop() {
    this.#_recorder.stop();
  }

  get #webMRecordedTime() {
    let date = this.#_timer.end ? this.#_timer.end.getTime() : new Date().getTime();
    return date - this.#_timer.start.getTime();
  }

  get #webMtotalRecordedFrames() {
    return (this.#webMRecordedTime * this.#_targetFps) / 1000;
  }

  /**
   * we can play with transcoding state, mixing mediaRecoder + transcoding when user ask for transcoding
   * makes more sense use the progress to transcoding only
   */
  get status() {
    return {
      state: this.#_recorder.state,
      time: this.#webMRecordedTime,
      frames: this.#webMtotalRecordedFrames,
      progress: this.#_progress,
    };
  }
}
