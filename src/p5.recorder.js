// const { createWorker } = require("@ffmpeg/ffmpeg");
import * as _download from "downloadjs";
/**
 * version only save webm
 */

export class Recorder {
  constructor(output = "p5.recorder.canvas.webm", saveAtEnd = false) {
    this._isRecording = false;
    this._targetFps = 60;
    this._initialTime;
    this._endTime;
    this._outputName = output;
    this._chunks;
    this._recorder;
    this._saveAtEnd = saveAtEnd;
    this._canvas;
  }

  get currentBlob() {
    return new Blob(this._chunks);
  }

  start(canvas = document.querySelector("canvas"), outputName, extras = {}) {
    if (this._isRecording) throw new Error(`Stop first before start again`);
    this._canvas = canvas;
    this._outputName = outputName;
    if (!this._canvas || !this._canvas.captureStream)
      throw new Error(`Can't find the canvas for start recording`);
    let stream = this._canvas.captureStream(this._targetFps);

    /**
     * https://developers.google.com/web/updates/2016/01/mediarecorder
     * we should check possible codecs
     */
    this._recorder = new MediaRecorder(stream);
    this._recorder.ondataavailable = e => {
      if (e.data.size) {
        this._chunks.push(e.data);
      }
    };

    //default for webm
    recorder.onstop = onRecorderStop;
    recorder.onstart = this._onMediaRecorderStart;
    recorder.start();
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
    if (this._saveAtEnd) saveBlob();
  }

  download() {
    _download(this.currentBlob, this._outputName, "video/webm");
  }

  stop() {
    this._recorder.stop();
  }

  get totalRecordedTime() {
    return this._endRecordingTime - this._initialRecordingTime;
  }

  get currentRecordingTime() {
    return new Date() - this._initialRecordingTime;
  }

  get currentRecordingFrames() {
    return this.currentRecordingTime * this.targetFps;
  }

  get targetFps() {
    return this._targetFps;
  }

  get totalRecordedFrames() {
    return (this.totalRecordedTime * this.targetFps) / 1000;
  }
}

export default {
  Recorder
};
