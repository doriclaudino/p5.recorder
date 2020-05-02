/**
 * Copyright p5.recorder
 * v0.0.7
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
	    obj[key] = value;
	  }

	  return obj;
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

	function _classPrivateFieldGet(receiver, privateMap) {
	  var descriptor = privateMap.get(receiver);

	  if (!descriptor) {
	    throw new TypeError("attempted to get private field on non-instance");
	  }

	  if (descriptor.get) {
	    return descriptor.get.call(receiver);
	  }

	  return descriptor.value;
	}

	function _classPrivateFieldSet(receiver, privateMap, value) {
	  var descriptor = privateMap.get(receiver);

	  if (!descriptor) {
	    throw new TypeError("attempted to set private field on non-instance");
	  }

	  if (descriptor.set) {
	    descriptor.set.call(receiver, value);
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

	class Recorder {
	  constructor() {
	    var saveAfterStop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    _webMtotalRecordedFrames.set(this, {
	      get: _get_webMtotalRecordedFrames,
	      set: void 0
	    });
	    _webMRecordedTime.set(this, {
	      get: _get_webMRecordedTime,
	      set: void 0
	    });
	    _onMediaRecorderStop.add(this);
	    _onMediaRecorderStart.add(this);
	    _onDataAvailable.add(this);
	    _createRecorder.add(this);
	    _resolveStream.add(this);
	    _mergeUserOptions.add(this);
	    _currentBlob.set(this, {
	      get: _get_currentBlob,
	      set: void 0
	    });
	    _chunks.set(this, {
	      writable: true,
	      value: []
	    });
	    _recorder.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _saveAfterStop.set(this, {
	      writable: true,
	      value: true
	    });
	    _audioStreamTab.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _defaultRecordingOptions.set(this, {
	      writable: true,
	      value: {
	        filename: "p5.recorder.canvas.webm",
	        recordAudio: true,
	        audioBitRate: 128000,
	        videoBitRate: 120000000,
	        fps: 60
	      }
	    });
	    _currentRecordingOptions.set(this, {
	      writable: true,
	      value: {
	        canvas: undefined,
	        filename: undefined,
	        recordAudio: undefined,
	        audioBitRate: undefined,
	        videoBitRate: undefined,
	        fps: undefined,
	        mimeType: undefined
	      }
	    });
	    _timer.set(this, {
	      writable: true,
	      value: {
	        start: undefined,
	        end: undefined
	      }
	    });
	    _progress.set(this, {
	      writable: true,
	      value: 0
	    });
	    _classPrivateFieldSet(this, _saveAfterStop, saveAfterStop);
	  }
	  start(options) {
	    var _this = this;
	    return _asyncToGenerator(function* () {
	      _classPrivateMethodGet(_this, _mergeUserOptions, _mergeUserOptions2).call(_this, options);
	      var stream = yield _classPrivateMethodGet(_this, _resolveStream, _resolveStream2).call(_this);
	      _classPrivateMethodGet(_this, _createRecorder, _createRecorder2).call(_this, stream);
	      _classPrivateFieldGet(_this, _recorder).start();
	    })();
	  }
	  download() {
	    download(_classPrivateFieldGet(this, _currentBlob), _classPrivateFieldGet(this, _currentRecordingOptions).filename, _classPrivateFieldGet(this, _currentRecordingOptions).mimeType);
	  }
	  stop() {
	    _classPrivateFieldGet(this, _recorder).stop();
	  }
	  get status() {
	    var _classPrivateFieldGet2;
	    return {
	      state: (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _recorder)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.state,
	      time: _classPrivateFieldGet(this, _webMRecordedTime),
	      frames: _classPrivateFieldGet(this, _webMtotalRecordedFrames),
	      progress: _classPrivateFieldGet(this, _progress)
	    };
	  }
	}
	var _chunks = new WeakMap();
	var _recorder = new WeakMap();
	var _saveAfterStop = new WeakMap();
	var _audioStreamTab = new WeakMap();
	var _defaultRecordingOptions = new WeakMap();
	var _currentRecordingOptions = new WeakMap();
	var _timer = new WeakMap();
	var _progress = new WeakMap();
	var _currentBlob = new WeakMap();
	var _mergeUserOptions = new WeakSet();
	var _resolveStream = new WeakSet();
	var _createRecorder = new WeakSet();
	var _onDataAvailable = new WeakSet();
	var _onMediaRecorderStart = new WeakSet();
	var _onMediaRecorderStop = new WeakSet();
	var _webMRecordedTime = new WeakMap();
	var _webMtotalRecordedFrames = new WeakMap();
	var _get_currentBlob = function _get_currentBlob() {
	  return new Blob(_classPrivateFieldGet(this, _chunks));
	};
	var _mergeUserOptions2 = function _mergeUserOptions2(userOptions) {
	  _classPrivateFieldSet(this, _currentRecordingOptions, _objectSpread2({
	    canvas: document.querySelector("canvas")
	  }, _classPrivateFieldGet(this, _defaultRecordingOptions), {}, userOptions, {
	    mimeType: "video/webm"
	  }));
	};
	var _resolveStream2 = function () {
	  var _resolveStream3 = _asyncToGenerator(function* () {
	    var tracks = [];
	    var {
	      canvas,
	      fps,
	      recordAudio
	    } = _classPrivateFieldGet(this, _currentRecordingOptions);
	    var videoStream = canvas.captureStream(fps);
	    tracks.push(videoStream.getVideoTracks()[0]);
	    if (recordAudio) {
	      if (!_classPrivateFieldGet(this, _audioStreamTab) || !_classPrivateFieldGet(this, _audioStreamTab).active) _classPrivateFieldSet(this, _audioStreamTab, (yield navigator.mediaDevices.getDisplayMedia({
	        audio: true,
	        video: true
	      })));
	      var audioTracks = _classPrivateFieldGet(this, _audioStreamTab).getAudioTracks();
	      audioTracks.forEach(track => tracks.push(track));
	    }
	    var combinedStream = new MediaStream(tracks);
	    return combinedStream;
	  });
	  function _resolveStream2() {
	    return _resolveStream3.apply(this, arguments);
	  }
	  return _resolveStream2;
	}();
	var _createRecorder2 = function _createRecorder2(stream) {
	  _classPrivateFieldSet(this, _recorder, new MediaRecorder(stream, this.currentRecordingOptions));
	  _classPrivateFieldGet(this, _recorder).onstop = _classPrivateMethodGet(this, _onMediaRecorderStop, _onMediaRecorderStop2).bind(this);
	  _classPrivateFieldGet(this, _recorder).onstart = _classPrivateMethodGet(this, _onMediaRecorderStart, _onMediaRecorderStart2).bind(this);
	  _classPrivateFieldGet(this, _recorder).ondataavailable = _classPrivateMethodGet(this, _onDataAvailable, _onDataAvailable2).bind(this);
	  _classPrivateFieldGet(this, _recorder).onstop = _classPrivateMethodGet(this, _onMediaRecorderStop, _onMediaRecorderStop2).bind(this);
	  _classPrivateFieldGet(this, _recorder).onerror = e => console.log(e);
	  return _classPrivateFieldGet(this, _recorder);
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
	  var _classPrivateFieldGet3, _classPrivateFieldGet4, _classPrivateFieldGet5, _classPrivateFieldGet6;
	  var date = ((_classPrivateFieldGet3 = _classPrivateFieldGet(this, _timer)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : (_classPrivateFieldGet4 = _classPrivateFieldGet3.end) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.getTime()) || new Date().getTime();
	  return date - ((_classPrivateFieldGet5 = _classPrivateFieldGet(this, _timer)) === null || _classPrivateFieldGet5 === void 0 ? void 0 : (_classPrivateFieldGet6 = _classPrivateFieldGet5.start) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.getTime()) || undefined;
	};
	var _get_webMtotalRecordedFrames = function _get_webMtotalRecordedFrames() {
	  return _classPrivateFieldGet(this, _webMRecordedTime) * _classPrivateFieldGet(this, _currentRecordingOptions).fps / 1000 || 0;
	};

	return Recorder;

})));
//# sourceMappingURL=p5.recorder.js.map
