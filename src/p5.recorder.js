const downloadjs = require("downloadjs");

export default class Recorder {
  #chunks = [];
  #recorder;
  #saveAfterStop = true;
  #canvas;
  #defaultRecordingOptions = {
    filename: "p5.recorder.canvas.webm",
    recordAudio: true,
    audioBitRate: 128000,
    videoBitRate: 120000000,
    fps: 60,
  };
  #currentRecordingOptions = {
    filename,
    recordAudio,
    audioBitRate,
    videoBitRate,
    fps,
    mimeType,
  };
  #timer = {
    start,
    end,
  };
  #progress;

  constructor(saveAfterStop = true) {
    this.#saveAfterStop = saveAfterStop;
  }

  get #currentBlob() {
    return new Blob(this.#chunks);
  }

  get #isRecording() {
    return this.#recorder && this.#recorder.state && this.#recorder.state !== "recording";
  }

  async start(options) {
    if (this.#isRecording) throw new Error("Stop first before start again");

    this.#mergeUserOptions(options);
    this.#createRecorder(await this.#resolveStream());
  }

  #mergeUserOptions(userOptions) {
    this.#currentRecordingOptions = {
      canvasElement: document.querySelector("canvas"),
      ...this.#defaultRecordingOptions,
      ...userOptions,
      mimeType: "video/webm",
    };
  }

  async #resolveStream() {
    let tracks = [];

    //video track from canvas stream
    let videoStream = this.#canvas.captureStream(this.#currentRecordingOptions.fps);
    tracks.push(videoStream.getVideoTracks()[0]);

    /**
     * tracking here https://github.com/processing/p5.js-sound/issues/457
     * the possibility to not use navigator.mediaDevices.getDisplayMedia API
     */
    if (this.#currentRecordingOptions.recordAudio) {
      let tabStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      let audioTracks = tabStream.getAudioTracks();
      audioTracks.forEach((track) => tracks.push(track));
    }

    //combine video and audiotracks
    let combinedStream = new MediaStream(tracks);
    return combinedStream;
  }

  #createRecorder(stream) {
    this.#recorder = new MediaRecorder(stream, this.currentRecordingOptions);
    this.#recorder.onstop = this.#onMediaRecorderStop.bind(this);
    this.#recorder.onstart = this.#onMediaRecorderStart.bind(this);
    this.#recorder.ondataavailable = this.#onDataAvailable.bind(this);
    this.#recorder.onstop = this.#onMediaRecorderStop.bind(this);
    this.#recorder.onerror = (e) => console.log(e);
    return this.#recorder;
  }

  #onDataAvailable(e) {
    if (e.data.size) {
      this.#chunks.push(e.data);
    }
  }

  #onMediaRecorderStart() {
    this.#timer = {
      start: new Date(),
      end: undefined,
    };
    this.#progress = 0;
    this.#chunks = [];
    this.#chunks.length = 0;
  }

  #onMediaRecorderStop() {
    this.#timer.end = new Date();
    this.#progress = 100;
    if (this.#saveAfterStop) this.download();
  }

  download() {
    downloadjs(
      this.#currentBlob,
      this.#currentRecordingOptions.filename,
      this.#currentRecordingOptions.mimeType
    );
  }

  stop() {
    this.#recorder.stop();
  }

  get #webMRecordedTime() {
    let date = this.#timer.end ? this.#timer.end.getTime() : new Date().getTime();
    return date - this.#timer.start.getTime();
  }

  get #webMtotalRecordedFrames() {
    return (this.#webMRecordedTime * this.#currentRecordingOptions.fps) / 1000;
  }

  /**
   * we can play with transcoding state, mixing mediaRecoder + transcoding when user ask for transcoding
   * makes more sense use the progress to transcoding only
   */
  get status() {
    return {
      state: this.#recorder.state,
      time: this.#webMRecordedTime,
      frames: this.#webMtotalRecordedFrames,
      progress: this.#progress,
    };
  }
}
