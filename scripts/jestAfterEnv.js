/**
 * cicle
 * -  create container and instance before every test
 * -  delete container and instance after every test
 */
global.myp5 = undefined;
global.myp5Container = undefined;

beforeEach(done => {
  global.myp5Container = document.createElement("div");
  document.body.appendChild(global.myp5Container);
  new p5(function(p) {
    let x = 100,
      y = 100;
    p.setup = function() {
      p.createCanvas(200, 200);
      global.myp5 = p;
      myp5.canvas.captureStream = function() {};
      done();
    };
    p.draw = () => {
      p.background(0);
      p.fill(255);
      p.rect(p.random(x), p.random(y), 50, 50);
    };
  }, global.myp5Container);
});

afterEach(function() {
  global.myp5.remove();
  if (global.myp5Container && global.myp5Container.parentNode) {
    myp5Container.parentNode.removeChild(global.myp5Container);
  }
  global.myp5Container = null;
});
