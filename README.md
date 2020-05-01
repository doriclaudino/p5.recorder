# p5.recorder

[![NPM](https://nodei.co/npm/p5.recorder.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/p5.recorder/)

[![](https://data.jsdelivr.com/v1/package/npm/p5.recorder/badge?style=rounded)](https://www.jsdelivr.com/package/npm/p5.recorder)
[![npm version](https://badge.fury.io/js/p5.recorder.svg)](https://badge.fury.io/js/p5.recorder)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/doriclaudino/p5.recorder/issues)

### Install (CDN)

```html
<!--jsdelivr-->
<script src="https://cdn.jsdelivr.net/npm/p5.recorder@0.0.5/dist/p5.recorder.js"></script>

<!--
  option three local source
  downloading from: https://github.com/doriclaudino/p5.recorder/blob/master/dist/p5.recorder.js -->
<script src="../p5.recorder.js"></script>
```

### Install (NPM)

```bash
npm install p5.drawer
or
yarn install p5.drawer
```

Example `using default options`:
```javascript
let rec = new p5.Recorder();
rec.start();

//stop after some time
rec.stop();
```


Example `using custom options`:
```javascript
let autoDownloadFile = false

//set to no download at the end
let rec = new p5.Recorder(autoDownloadFile);

let options = {
  outputName: "my_custom_name_output.webm",
  recordAudio: true,
  audioBitRate: 128000,
  videoBitRate: ‭100000000‬ , //10 megabits
  fps: 45,
}

//passing custom configs
rec.start(options);

//stop after some time
rec.stop();

//download the file after stop
rec.download();
```

## enable audio
Don't forget to __CHECK__ enable audio (we are trying a better approach to capture audio-context on p5js-sound):

![Image description](https://i.imgur.com/LVgEuzA.png)




## commands
- yarn dev
- yarn build



## still in development

only support .webm for now

## for future reference

https://editor.p5js.org/doriclaudino/sketches/LgLw5UaBr
