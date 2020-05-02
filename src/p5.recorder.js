const downloadjs = require("downloadjs");

export default class Recorder {
  #chunks = [];
  #recorder;
  #saveAfterStop = true;
  #audioStreamTab;
  #defaultRecordingOptions = {
    filename: "p5.recorder.canvas.webm",
    recordAudio: true,
    audioBitRate: 128000,
    videoBitRate: 120000000,
    fps: 60,
  };
  #currentRecordingOptions = {
    canvas: undefined,
    filename: undefined,
    recordAudio: undefined,
    audioBitRate: undefined,
    videoBitRate: undefined,
    fps: undefined,
    mimeType: undefined,
  };
  #timer = {
    start: undefined,
    end: undefined,
  };
  #progress = 0;

  constructor(saveAfterStop = true) {
    this.#saveAfterStop = saveAfterStop;
  }

  get #currentBlob() {
    return new Blob(this.#chunks);
  }

  async start(options) {
    this.#mergeUserOptions(options);
    let stream = await this.#resolveStream();
    this.#createRecorder(stream);
    this.#recorder.start();
  }

  #mergeUserOptions(userOptions) {
    this.#currentRecordingOptions = {
      canvas: document.querySelector("canvas"),
      ...this.#defaultRecordingOptions,
      ...userOptions,
      mimeType: "video/webm",
    };
  }

  async #resolveStream() {
    let tracks = [];
    const { canvas, fps, recordAudio } = this.#currentRecordingOptions;
    //video track from canvas stream
    let videoStream = canvas.captureStream(fps);
    tracks.push(videoStream.getVideoTracks()[0]);

    /**
     * tracking here https://github.com/processing/p5.js-sound/issues/457
     * the possibility to not use navigator.mediaDevices.getDisplayMedia API
     */
    if (recordAudio) {
      //seems we can record using the same stream after user click for stop sharing.
      if (!this.#audioStreamTab || !this.#audioStreamTab.active)
        this.#audioStreamTab = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: true,
        });
      let audioTracks = this.#audioStreamTab.getAudioTracks();
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
    let date = this.#timer?.end?.getTime() || new Date().getTime();
    return date - this.#timer?.start?.getTime() || undefined;
  }

  get #webMtotalRecordedFrames() {
    return (this.#webMRecordedTime * this.#currentRecordingOptions.fps) / 1000 || 0;
  }

  /**
   * we can play with transcoding state, mixing mediaRecoder + transcoding when user ask for transcoding
   * makes more sense use the progress to transcoding only
   *
   * contains current status
   * status: {
   *   frames: 0,
   *   progress: 0,
   *   state: undefined,
   *   time: undefined,
   * }
   */
  get status() {
    return {
      state: this.#recorder?.state,
      time: this.#webMRecordedTime,
      frames: this.#webMtotalRecordedFrames,
      progress: this.#progress,
    };
  }
}
