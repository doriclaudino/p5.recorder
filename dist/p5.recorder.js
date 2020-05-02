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
	    var output = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "p5.recorder.canvas.webm";
	    var saveAfterStop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
	    _isPaused.set(this, {
	      get: _get_isPaused,
	      set: void 0
	    });
	    _isRecording.set(this, {
	      get: _get_isRecording,
	      set: void 0
	    });
	    _currentBlob.set(this, {
	      get: _get_currentBlob,
	      set: void 0
	    });
	    _targetFps.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _outputName.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _chunks.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _recorder.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _saveAfterStop.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _canvas.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _progress.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _timer.set(this, {
	      writable: true,
	      value: void 0
	    });
	    _classPrivateFieldSet(this, _targetFps, 60);
	    _classPrivateFieldSet(this, _outputName, output);
	    _classPrivateFieldSet(this, _chunks, []);
	    _classPrivateFieldSet(this, _saveAfterStop, saveAfterStop);
	    _classPrivateFieldSet(this, _timer, {});
	  }
	  start() {
	    var canvas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector("canvas");
	    var outputName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _classPrivateFieldGet(this, _outputName);
	    if (_classPrivateFieldGet(this, _isRecording) || _classPrivateFieldGet(this, _isPaused)) throw new Error("Stop first before start again");
	    _classPrivateFieldSet(this, _canvas, canvas);
	    _classPrivateFieldSet(this, _outputName, outputName);
	    if (!_classPrivateFieldGet(this, _canvas)) throw new Error("Can't find the canvas for start recording");
	    if (!_classPrivateFieldGet(this, _canvas).captureStream) throw new Error("Canvas can't support capture Stream");
	    var stream = _classPrivateFieldGet(this, _canvas).captureStream(_classPrivateFieldGet(this, _targetFps));
	    _classPrivateFieldSet(this, _recorder, new MediaRecorder(stream));
	    _classPrivateFieldGet(this, _recorder).ondataavailable = _classPrivateMethodGet(this, _onDataAvailable, _onDataAvailable2).bind(this);
	    _classPrivateFieldGet(this, _recorder).onstop = _classPrivateMethodGet(this, _onMediaRecorderStop, _onMediaRecorderStop2).bind(this);
	    _classPrivateFieldGet(this, _recorder).onstart = _classPrivateMethodGet(this, _onMediaRecorderStart, _onMediaRecorderStart2).bind(this);
	    _classPrivateFieldGet(this, _recorder).start();
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
