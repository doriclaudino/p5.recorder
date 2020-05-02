const s = (s) => {
  let soundFile, fft, filter, filterFreq, filterRes;

  s.preload = () => {
    soundFile = s.loadSound("./beat.mp3");
  };

  s.setup = () => {
    s.createCanvas(710, 256);
    s.fill(255, 40, 255);
    soundFile.loop();

    filter = new p5.LowPass();

    soundFile.disconnect();
    soundFile.connect(filter);

    fft = new p5.FFT();
    s.userStartAudio();
  };

  s.draw = () => {
    s.background(30);

    filterFreq = s.map(s.mouseX, 0, s.width, 10, 22050);
    filterRes = s.map(s.mouseY, 0, s.height, 15, 5);
    filter.set(filterFreq, filterRes);

    var spectrum = fft.analyze();

    s.noStroke();

    for (var i = 0; i < spectrum.length; i++) {
      var x = s.map(i, 0, spectrum.length, 0, s.width);
      var h = -s.height + s.map(spectrum[i], 0, 255, s.height, 0);
      s.rect(x, s.height, s.width / spectrum.length, h);
    }
  };
};

const myp5 = new p5(s);
rec = new p5.Recorder();
console.log(rec);
