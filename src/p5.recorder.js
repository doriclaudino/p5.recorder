const _download = require("downloadjs");

export default class Recorder {
  _isRecording;
  _targetFps;
  _endTime;
  _outputName;
  _chunks;
  _recorder;
  _saveAfterStop;
  _canvas;
  _audioBitRate;
  _videoBitRate;
  _recordAudio;
  _defaultCanvasMimeType;
  _defaultStartOption;

  constructor(saveAfterStop = true) {
    this._isRecording = false;
    this._chunks = [];
    this._saveAfterStop = saveAfterStop;
    this._defaultCanvasMimeType = "video/webm";
    this._defaultStartOption = {
      outputName: "p5.recorder.canvas.webm",
      recordAudio: true,
      audioBitRate: 128000,
      videoBitRate: 10000000 * 12,
      fps: 60,
    };
  }

  get currentBlob() {
    return new Blob(this._chunks);
  }

  async start(options = this._defaultStartOption) {
    if (this._isRecording) throw new Error("Stop first before start again");

    //merge options
    let mergeOptions = {
      canvasElement: document.querySelector("canvas"),
      ...this._defaultStartOption,
      ...options,
    };
    this._canvas = mergeOptions.canvasElement;
    this._outputName = mergeOptions.outputName;
    this._recordAudio = mergeOptions.recordAudio;
    this._audioBitRate = mergeOptions.audioBitRate;
    this._videoBitRate = mergeOptions.videoBitRate;
    this._targetFps = mergeOptions.fps;

    if (!this._canvas) throw new Error("Can't find the canvas for start recording");
    if (!this._canvas.captureStream) throw new Error("Canvas can't support capture Stream");

    let streamToRecord = await this._resolveStream();
    this._createRecorder(streamToRecord);
    this._recorder.start();
  }

  get getMediaRecorderOptionsForCanvas() {
    return (
      {
        audioBitsPerSecond: this._audioBitRate,
        videoBitsPerSecond: this._videoBitRate,
        mimeType: this._defaultCanvasMimeType,
      } || {}
    );
  }

  async _resolveStream() {
    let tracks = [];

    //video track from canvas stream
    let videoStream = this._canvas.captureStream(this._targetFps);
    tracks.push(videoStream.getVideoTracks()[0]);

    /**
     * tracking here https://github.com/processing/p5.js-sound/issues/457
     * the possibility to not use navigator.mediaDevices.getDisplayMedia API
     */
    if (this._recordAudio) {
      let tabStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      let audioTracks = tabStream.getAudioTracks();
      audioTracks.forEach((track) => tracks.push(track));
    }

    //combine video and audiotracks
    let combinedStream = new MediaStream(tracks);
    return combinedStream;
  }

  _createRecorder(stream) {
    this._recorder = new MediaRecorder(stream, this.getMediaRecorderOptionsForCanvas);
    this._recorder.onstop = this._onMediaRecorderStop.bind(this);
    this._recorder.onstart = this._onMediaRecorderStart.bind(this);
    this._recorder.ondataavailable = this._onDataAvailable.bind(this);
    this._recorder.onstop = this._onMediaRecorderStop.bind(this);
    this._recorder.onerror = (e) => console.log(e);
    return this._recorder;
  }

  _onDataAvailable(e) {
    if (e.data.size) {
      this._chunks.push(e.data);
    }
  }

  _onMediaRecorderStart() {
    this._isRecording = true;
    this._initialRecordingTime = new Date();
    this._endRecordingTime = undefined;
    this._progress = 0;
    this._chunks = [];
    this._chunks.length = 0;
  }

  _onMediaRecorderStop() {
    this._isRecording = false;
    this._endRecordingTime = new Date();
    this._progress = 100;

    /**
     * we need process the mp4 encode for types diff from webm
     */
    if (this._saveAfterStop) this.download();
  }

  download() {
    _download(this.currentBlob, this._outputName, "video/webm");
  }

  stop() {
    this._recorder.stop();
  }

  get totalRecordedTime() {
    return (
      this._endRecordingTime &&
      this._endRecordingTime.getTime() - this._initialRecordingTime.getTime()
    );
  }

  get currentRecordingTime() {
    return new Date().getTime() - this._initialRecordingTime.getTime();
  }

  get currentRecordingFrames() {
    return this.currentRecordingTime * this._targetFps;
  }

  get totalRecordedFrames() {
    return (this.totalRecordedTime * this._targetFps) / 1000;
  }
}
