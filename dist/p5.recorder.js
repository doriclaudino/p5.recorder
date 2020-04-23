/**
 * Copyright p5.recorder
 * v0.0.2
 * by doriclaudino <dori.claudino@gmail.com>
 * 4/22/2020
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

	class Recorder {
	  constructor() {
	    var output = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "p5.recorder.canvas.webm";
	    var saveAfterStop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    _defineProperty(this, "_isRecording", void 0);
	    _defineProperty(this, "_targetFps", void 0);
	    _defineProperty(this, "_endTime", void 0);
	    _defineProperty(this, "_outputName", void 0);
	    _defineProperty(this, "_chunks", void 0);
	    _defineProperty(this, "_recorder", void 0);
	    _defineProperty(this, "_saveAfterStop", void 0);
	    _defineProperty(this, "_canvas", void 0);
	    this._isRecording = false;
	    this._targetFps = 60;
	    this._outputName = output;
	    this._chunks = [];
	    this._saveAfterStop = saveAfterStop;
	  }
	  get currentBlob() {
	    return new Blob(this._chunks);
	  }
	  start() {
	    var canvas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.querySelector("canvas");
	    var outputName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._outputName;
	    if (this._isRecording) throw new Error("Stop first before start again");
	    this._canvas = canvas;
	    this._outputName = outputName;
	    if (!this._canvas) throw new Error("Can't find the canvas for start recording");
	    if (!this._canvas.captureStream) throw new Error("Canvas can't support capture Stream");
	    var stream = this._canvas.captureStream(this._targetFps);
	    this._recorder = new MediaRecorder(stream);
	    this._recorder.ondataavailable = this._onDataAvailable.bind(this);
	    this._recorder.onstop = this._onMediaRecorderStop.bind(this);
	    this._recorder.onstart = this._onMediaRecorderStart.bind(this);
	    this._recorder.start();
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
	    download(this.currentBlob, this._outputName, "video/webm");
	  }
	  stop() {
	    this._recorder.stop();
	  }
	  get totalRecordedTime() {
	    return this._endRecordingTime && this._endRecordingTime.getTime() - this._initialRecordingTime.getTime();
	  }
	  get currentRecordingTime() {
	    return new Date().getTime() - this._initialRecordingTime.getTime();
	  }
	  get currentRecordingFrames() {
	    return this.currentRecordingTime * this._targetFps;
	  }
	  get totalRecordedFrames() {
	    return this.totalRecordedTime * this._targetFps / 1000;
	  }
	}

	return Recorder;

})));
//# sourceMappingURL=p5.recorder.js.map
