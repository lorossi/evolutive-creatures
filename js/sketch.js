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
    // prints the DNA of the closest creature
    for (let i = 0; i < this._creatures.length; i++) {
      let c = this._creatures[i];
      if (dist(e.offsetX, e.offsetY, c.pos.x, c.pos.y) < c.radius * 10) {
        console.log(c.DNA);
        return;
      }
    }
  }

  keyDown(e) {
    console.log(e);
    if (e.code == "KeyS") {
      // save DNA by pressing S
      this.saveDNA();
    } else if (e.code == "KeyR") {
      // load DNA by pressing R
      this.loadDNA();
    } else if (e.code == "Enter") {
      // reset everything by pressing ENTER
      // does not remove saved DNA
      this.setup();
      console.log("DNA reset");
    }
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

  loadDNA() {
    // load genomes from local storage
    let old_genomes;
    if (window.localStorage.getItem("genome")) {
      old_genomes = JSON.parse(window.localStorage.getItem("genome"));
    }


    this._ambient.age = 0;
    this._creatures = [];
    let genome_counter = 0;
    // create new creatures with old genome
    for (let i = 0; i < this._starting_creatures; i++) {
      let new_c, new_d;
      new_c = new Creature(this._canvas.width, this._canvas.height);
      new_d = new DNA().genomes = old_genomes[genome_counter];
      new_c.DNA = new_d;
      this._creatures.push(new_c);

      genome_counter = (genome_counter + 1) % old_genomes.length;
    }

    console.log("DNA loaded");
  }

  saveDNA() {
    // save genome to local storage
    // first, sort it from newest to oldest
    let sorted_creatures;
    sorted_creatures = this._creatures.sort((c1, c2) => c2.generation - c1.generation);
    let DNA_to_save;
    DNA_to_save = sorted_creatures.map(s => s.DNA);

    window.localStorage.setItem("genome", JSON.stringify(DNA_to_save));

    console.log("DNA saved");
  }

  setup() {
    this._ambient = new Ambient(this._canvas.width, this._canvas.height);
    this._resets = 0;
    this._starting_creatures = 30;
    this._min_creatures = 4;
    this._creatures = [];
    for (let i = 0; i < this._starting_creatures; i++) {
      this._creatures.push(new Creature(this._canvas.width, this._canvas.height));
    }
  }


  draw() {
    this.background("white");

    let newborns = [];
    this._ambient.show(this._ctx);
    this._creatures.forEach(c => {
      c.show(this._ctx);
      c.move(this._ambient.food);

      if (c.ready_to_duplicate) {
        let new_DNA;
        new_DNA = c.split();
        let dpos;
        dpos = new Vector.random2D().setMag(c.radius * 4);
        let new_c;
        new_c = new Creature(this._canvas.width, this._canvas.height);

        new_c.DNA = new_DNA;
        new_c.pos = c.pos.add(dpos);
        new_c.heading = random_interval(Math.PI, 0.1);
        newborns.push(new_c);
      }
    });
    this._ambient.update();
    this._creatures.push(...newborns);
    this._creatures = this._creatures.filter(c => !c.dead);

    if (this._creatures.length <= this._min_creatures) {
      this.saveDNA();
      this.loadDNA();
      this._resets++;
    }

    let creatures_number = this._creatures.length;
    let food_number = this._ambient.food.length;
    let newest_generation = Math.max(...this._creatures.map(c => c.generation));
    this._ctx.save();
    this._ctx.font = "24px Arial";
    this._ctx.fillStyle = "black";
    this._ctx.textBaseline = "top";
    this._ctx.fillText(`Creatures: ${creatures_number}`, 0, 0);
    this._ctx.fillText(`Food: ${food_number}`, 0, 24);
    this._ctx.fillText(`Gen: ${newest_generation}`, 0, 48);
    this._ctx.fillText(`Resets: ${this._resets}`, 0, 72);
    this._ctx.restore();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // page loaded
  let canvas, ctx, s;
  canvas = document.querySelector("#sketch");
  // inject canvas in page
  if (canvas.getContext) {
    ctx = canvas.getContext("2d", { alpha: false });
    s = new Sketch(canvas, ctx, 60);
  }

  canvas.addEventListener("click", (e) => {
    s.click(e);
  });

  document.addEventListener('keydown', (e) => {
    s.keyDown(e);
  });
});