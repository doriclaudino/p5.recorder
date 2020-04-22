# p5.recorder

[![NPM](https://nodei.co/npm/p5.recorder.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/p5.recorder/)

[![](https://data.jsdelivr.com/v1/package/npm/p5.recorder/badge?style=rounded)](https://www.jsdelivr.com/package/npm/p5.recorder)
[![npm version](https://badge.fury.io/js/p5.recorder.svg)](https://badge.fury.io/js/p5.recorder)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/doriclaudino/p5.recorder/issues)


### Install (CDN)
```html
<!-- option one jsdelivr-->
<script src="https://cdn.jsdelivr.net/npm/p5.recorder@0.0.2/dist/p5.recorder.js"></script>

<!-- option two githack-->
<script src="https://raw.githack.com/doriclaudino/p5.recorder/master/dist/p5.recorder.js"></script>

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


basic example:
```javascript 
//let rec = new p5.Recorder([output = "p5.recorder.canvas.webm"], [saveAtEnd = true]);
let rec = new p5.Recorder(outputName, saveAtEnd);
rec.start();
rec.stop();

//if you set saveAtEnd to false,
//make sure you call rec.download()
```


## still in development
 only support .webm for now

## for future reference
https://editor.p5js.org/doriclaudino/sketches/LgLw5UaBr
