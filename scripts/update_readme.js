const pkg = require("../package.json");
const fs = require("fs");
const endOfLine = require("os").EOL;

let readme = `# p5.recorder

[![NPM](https://nodei.co/npm/p5.recorder.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/p5.recorder/)

[![](https://data.jsdelivr.com/v1/package/npm/p5.recorder/badge?style=rounded)](https://www.jsdelivr.com/package/npm/p5.recorder)
[![npm version](https://badge.fury.io/js/p5.recorder.svg)](https://badge.fury.io/js/p5.recorder)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/doriclaudino/p5.recorder/issues)

### Install (CDN)

\`\`\`html
<!--jsdelivr-->
<script src="https://cdn.jsdelivr.net/npm/p5.recorder@${pkg.version}/dist/p5.recorder.js"></script>
\`\`\`

### Install (NPM)

\`\`\`bash
npm install p5.drawer
or
yarn install p5.drawer
\`\`\`

Example \`using default options\`:
\`\`\`javascript
let rec = new p5.Recorder();
rec.start();

//stop after some time
rec.stop();
\`\`\`


Example \`using custom options\`:
\`\`\`javascript
let autoDownloadFile = false

//set to no download at the end
let rec = new p5.Recorder(autoDownloadFile);

let options = {
  filename: "my_custom_name_output.webm",
  recordAudio: true,
  audioBitRate: 128000,
  videoBitRate: ‭100000000‬ , //10 megabits
  fps: 45,
}

//passing custom configs
rec.start(options);

//stop after some time
rec.stop();

/**
 * contains current status
 * status: {
 *   frames: 0,
 *   progress: 0,
 *   state: undefined,
 *   time: undefined,
 * }
 */
rec.status;


//download the file after stop
rec.download();
\`\`\`


</br> 

## default options start() method:

| **name** | **value**  |
| --- | --- |
| filename | "p5.recorder.canvas.webm" |
| recordAudio | true |
| audioBitRate | 128000 |
| videoBitRate | 120000000 |
| fps | 60 |


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
`;

fs.writeFile("README.md", readme, function (err) {
  if (err) return console.log(err);
  console.log("\x1b[42m%s\x1b[40m", `update readme to ${pkg.version}`);
});

