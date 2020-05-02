/**
 * Copyright p5.recorder
 * v0.0.5
 * by doriclaudino <dori.claudino@gmail.com>
 * 5/2/2020
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, (global.p5 = global.p5 || {}, global.p5.Recorder = factory()));
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var download = createCommonjsModule(function (module, exports) {
	(function (root, factory) {
		{
			module.exports = factory();
		}
	}(commonjsGlobal, function () {
		return function download(data, strFileName, strMimeType) {
			var self = window,
				defaultMime = "application/octet-stream",
				mimeType = strMimeType || defaultMime,
				payload = data,
				url = !strFileName && !strMimeType && payload,
				anchor = document.createElement("a"),
				toString = function(a){return String(a);},
				myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
				fileName = strFileName || "download",
				blob,
				reader;
				myBlob= myBlob.call ? myBlob.bind(self) : Blob ;
			if(String(this)==="true"){
				payload=[payload, mimeType];
				mimeType=payload[0];
				payload=payload[1];
			}
			if(url && url.length< 2048){
				fileName = url.split("/").pop().split("?")[0];
				anchor.href = url;
			  	if(anchor.href.indexOf(url) !== -1){
	        		var ajax=new XMLHttpRequest();
	        		ajax.open( "GET", url, true);
	        		ajax.responseType = 'blob';
	        		ajax.onload= function(e){
					  download(e.target.response, fileName, defaultMime);
					};
	        		setTimeout(function(){ ajax.send();}, 0);
				    return ajax;
				}
			}
			if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)){
				if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
					payload=dataUrlToBlob(payload);
					mimeType=payload.type || defaultMime;
				}else {
					return navigator.msSaveBlob ?
						navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
						saver(payload) ;
				}
			}else {
				if(/([\x80-\xff])/.test(payload)){
					var i=0, tempUiArr= new Uint8Array(payload.length), mx=tempUiArr.length;
					for(i;i<mx;++i) tempUiArr[i]= payload.charCodeAt(i);
				 	payload=new myBlob([tempUiArr], {type: mimeType});
				}
			}
			blob = payload instanceof myBlob ?
				payload :
				new myBlob([payload], {type: mimeType}) ;
			function dataUrlToBlob(strUrl) {
				var parts= strUrl.split(/[:;,]/),
				type= parts[1],
				decoder= parts[2] == "base64" ? atob : decodeURIComponent,
				binData= decoder( parts.pop() ),
				mx= binData.length,
				i= 0,
				uiArr= new Uint8Array(mx);
				for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);
				return new myBlob([uiArr], {type: type});
			 }
			function saver(url, winMode){
				if ('download' in anchor) {
					anchor.href = url;
					anchor.setAttribute("download", fileName);
					anchor.className = "download-js-link";
					anchor.innerHTML = "downloading...";
					anchor.style.display = "none";
					document.body.appendChild(anchor);
					setTimeout(function() {
						anchor.click();
						document.body.removeChild(anchor);
						if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
					}, 66);
					return true;
				}
				if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
					if(/^data:/.test(url))	url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
					if(!window.open(url)){
						if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
					}
					return true;
				}
				var f = document.createElement("iframe");
				document.body.appendChild(f);
				if(!winMode && /^data:/.test(url)){
					url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
				}
				f.src=url;
				setTimeout(function(){ document.body.removeChild(f); }, 333);
			}
			if (navigator.msSaveBlob) {
				return navigator.msSaveBlob(blob, fileName);
			}
			if(self.URL){
				saver(self.URL.createObjectURL(blob), true);
			}else {
				if(typeof blob === "string" || blob.constructor===toString ){
					try{
						return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
					}catch(y){
						return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
					}
				}
				reader=new FileReader();
				reader.onload=function(e){
					saver(this.result);
				};
				reader.readAsDataURL(blob);
			}
			return true;
		};
	}));
	});

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	  try {
	    var info = gen[key](arg);
	    var value = info.value;
	  } catch (error) {
	    reject(error);
	    return;
	  }

	  if (info.done) {
	    resolve(value);
	  } else {
	    Promise.resolve(value).then(_next, _throw);
	  }
	}

	function _asyncToGenerator(fn) {
	  return function () {
	    var self = this,
	        args = arguments;
	    return new Promise(function (resolve, reject) {
	      var gen = fn.apply(self, args);

	      function _next(value) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
	      }

	      function _throw(err) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
	      }

	      _next(undefined);
	    });
	  };
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    if (!descriptor.writable) {
	      throw new TypeError("attempted to set read only private field");
	    }

	    descriptor.value = value;
	  }

	  return value;
	}

	function _classPrivateMethodGet(receiver, privateSet, fn) {
	  if (!privateSet.has(receiver)) {
	    throw new TypeError("attempted to get private field on non-instance");
	  }

	  return fn;
	}

	function ownKeys(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	class Recorder {
	  constructor() {
	    var saveAfterStop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    _defineProperty(this, "_isRecording", void 0);
	    _defineProperty(this, "_targetFps", void 0);
	    _defineProperty(this, "_endTime", void 0);
	    _defineProperty(this, "_outputName", void 0);
	    _defineProperty(this, "_chunks", void 0);
	    _defineProperty(this, "_recorder", void 0);
	    _defineProperty(this, "_saveAfterStop", void 0);
	    _defineProperty(this, "_canvas", void 0);
	    _defineProperty(this, "_audioBitRate", void 0);
	    _defineProperty(this, "_videoBitRate", void 0);
	    _defineProperty(this, "_recordAudio", void 0);
	    _defineProperty(this, "_defaultCanvasMimeType", void 0);
	    _defineProperty(this, "_defaultStartOption", void 0);
	    this._isRecording = false;
	    this._chunks = [];
	    this._saveAfterStop = saveAfterStop;
	    this._defaultCanvasMimeType = "video/webm";
	    this._defaultStartOption = {
	      outputName: "p5.recorder.canvas.webm",
	      recordAudio: true,
	      audioBitRate: 128000,
	      videoBitRate: 10000000 * 12,
	      fps: 60
	    };
	  }
	  get currentBlob() {
	    return new Blob(this._chunks);
	  }
	  start() {
	    var _arguments = arguments,
	        _this = this;
	    return _asyncToGenerator(function* () {
	      var options = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : _this._defaultStartOption;
	      if (_this._isRecording) throw new Error("Stop first before start again");
	      var mergeOptions = _objectSpread2({
	        canvasElement: document.querySelector("canvas")
	      }, _this._defaultStartOption, {}, options);
	      _this._canvas = mergeOptions.canvasElement;
	      _this._outputName = mergeOptions.outputName;
	      _this._recordAudio = mergeOptions.recordAudio;
	      _this._audioBitRate = mergeOptions.audioBitRate;
	      _this._videoBitRate = mergeOptions.videoBitRate;
	      _this._targetFps = mergeOptions.fps;
	      if (!_this._canvas) throw new Error("Can't find the canvas for start recording");
	      if (!_this._canvas.captureStream) throw new Error("Canvas can't support capture Stream");
	      var streamToRecord = yield _this._resolveStream();
	      _this._createRecorder(streamToRecord);
	      _this._recorder.start();
	    })();
	  }
	  get getMediaRecorderOptionsForCanvas() {
	    return {
	      audioBitsPerSecond: this._audioBitRate,
	      videoBitsPerSecond: this._videoBitRate,
	      mimeType: this._defaultCanvasMimeType
	    } || {};
	  }
	  _resolveStream() {
	    var _this2 = this;
	    return _asyncToGenerator(function* () {
	      var tracks = [];
	      var videoStream = _this2._canvas.captureStream(_this2._targetFps);
	      tracks.push(videoStream.getVideoTracks()[0]);
	      if (_this2._recordAudio) {
	        var tabStream = yield navigator.mediaDevices.getDisplayMedia({
	          audio: true,
	          video: true
	        });
	        var audioTracks = tabStream.getAudioTracks();
	        audioTracks.forEach(track => tracks.push(track));
	      }
	      var combinedStream = new MediaStream(tracks);
	      return combinedStream;
	    })();
	  }
	  _createRecorder(stream) {
	    this._recorder = new MediaRecorder(stream, this.getMediaRecorderOptionsForCanvas);
	    this._recorder.onstop = this._onMediaRecorderStop.bind(this);
	    this._recorder.onstart = this._onMediaRecorderStart.bind(this);
	    this._recorder.ondataavailable = this._onDataAvailable.bind(this);
	    this._recorder.onstop = this._onMediaRecorderStop.bind(this);
	    this._recorder.onerror = e => console.log(e);
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
	    if (this._saveAfterStop) this.download();
	  }
	  download() {
	    download(_classPrivateFieldGet(this, _currentBlob), _classPrivateFieldGet(this, _outputName), "video/webm");
	  }
	  stop() {
	    _classPrivateFieldGet(this, _recorder).stop();
	  }
	  get status() {
	    return {
	      state: _classPrivateFieldGet(this, _recorder).state,
	      time: _classPrivateFieldGet(this, _webMRecordedTime),
	      frames: _classPrivateFieldGet(this, _webMtotalRecordedFrames),
	      progress: _classPrivateFieldGet(this, _progress)
	    };
	  }
	}
	var _targetFps = new WeakMap();
	var _outputName = new WeakMap();
	var _chunks = new WeakMap();
	var _recorder = new WeakMap();
	var _saveAfterStop = new WeakMap();
	var _canvas = new WeakMap();
	var _progress = new WeakMap();
	var _timer = new WeakMap();
	var _currentBlob = new WeakMap();
	var _isRecording = new WeakMap();
	var _isPaused = new WeakMap();
	var _onDataAvailable = new WeakSet();
	var _onMediaRecorderStart = new WeakSet();
	var _onMediaRecorderStop = new WeakSet();
	var _webMRecordedTime = new WeakMap();
	var _webMtotalRecordedFrames = new WeakMap();
	var _get_currentBlob = function _get_currentBlob() {
	  return new Blob(_classPrivateFieldGet(this, _chunks));
	};
	var _get_isRecording = function _get_isRecording() {
	  return _classPrivateFieldGet(this, _recorder) && _classPrivateFieldGet(this, _recorder).state === "recording";
	};
	var _get_isPaused = function _get_isPaused() {
	  return _classPrivateFieldGet(this, _recorder) && _classPrivateFieldGet(this, _recorder).state === "paused";
	};
	var _onDataAvailable2 = function _onDataAvailable2(e) {
	  if (e.data.size) {
	    _classPrivateFieldGet(this, _chunks).push(e.data);
	  }
	};
	var _onMediaRecorderStart2 = function _onMediaRecorderStart2() {
	  _classPrivateFieldSet(this, _timer, {
	    start: new Date(),
	    end: undefined
	  });
	  _classPrivateFieldSet(this, _progress, 0);
	  _classPrivateFieldSet(this, _chunks, []);
	  _classPrivateFieldGet(this, _chunks).length = 0;
	};
	var _onMediaRecorderStop2 = function _onMediaRecorderStop2() {
	  _classPrivateFieldGet(this, _timer).end = new Date();
	  _classPrivateFieldSet(this, _progress, 100);
	  if (_classPrivateFieldGet(this, _saveAfterStop)) this.download();
	};
	var _get_webMRecordedTime = function _get_webMRecordedTime() {
	  var date = _classPrivateFieldGet(this, _timer).end ? _classPrivateFieldGet(this, _timer).end.getTime() : new Date().getTime();
	  return date - _classPrivateFieldGet(this, _timer).start.getTime();
	};
	var _get_webMtotalRecordedFrames = function _get_webMtotalRecordedFrames() {
	  return _classPrivateFieldGet(this, _webMRecordedTime) * _classPrivateFieldGet(this, _targetFps) / 1000;
	};

	return Recorder;

})));
//# sourceMappingURL=p5.recorder.js.map
