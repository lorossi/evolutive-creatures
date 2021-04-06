class Sketch {
  constructor(canvas, ctx, fps) {
    this._canvas = canvas;
    this._ctx = ctx;
    this._setFps(fps);

    // init variables
    this._frameCount = 0;
    this._frameRate = 0;
    this._fpsBuffer = new Array(0);
    this._width = this._canvas.width;
    this._height = this._canvas.height;

    // start sketch
    this._run();
  }

  _setFps(fps) {
    // set fps
    this._fps = fps || 60;
    // keep track of time to handle fps
    this.then = performance.now();
    // time between frames
    this._fps_interval = 1 / this._fps;
  }

  _run() {
    // bootstrap the sketch
    this.setup();
    // anti alias
    this._ctx.imageSmoothingQuality = "high";
    this._timeDraw();
  }

  _timeDraw() {
    // request another frame
    window.requestAnimationFrame(this._timeDraw.bind(this));
    let diff;
    diff = performance.now() - this.then;
    if (diff < this._fps_interval) {
      // not enough time has passed, so we request next frame and give up on this render
      return;
    }
    // updated last frame rendered time
    this.then = performance.now();
    // compute frame rate
    // update frame count
    this._frameCount++;
    // update fpsBuffer
    this._fpsBuffer.unshift(1000 / diff);
    this._fpsBuffer = this._fpsBuffer.splice(0, 30);
    // calculate average fps
    this._frameRate = this._fpsBuffer.reduce((a, b) => a + b, 0) / this._fpsBuffer.length;
    // now draw
    this._ctx.save();
    this.draw();
    this._ctx.restore();
  }

  click(e) {

  }

  keyDown(e) {

  }

  saveAsImage(title) {
    let container;
    container = document.createElement("a");
    container.download = title + ".png";
    container.href = this.canvas.toDataURL("image/png");
    document.body.appendChild(container);

    container.click();
    document.body.removeChild(container);
  }

  background(color) {
    // reset background
    // reset canvas
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
    // set background
    this._ctx.fillStyle = color;
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  setup() {
    // ran once
    this.background("white");
  }

  draw() {
    // ran continuosly
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // page loaded
  let canvas, ctx, s;
  canvas = document.querySelector("#sketch");
  // inject canvas in page
  if (canvas.getContext) {
    ctx = canvas.getContext("2d", { alpha: false });
    s = new Sketch(canvas, ctx);
  }

  canvas.addEventListener("click", (e) => {
    s.click(e);
  });

  document.addEventListener('keydown', (e) => {
    s.keyDown(e);
  });
});