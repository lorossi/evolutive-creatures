class Food {
  constructor(width, height) {
    const x = (Math.random() * 0.9 + 0.1) * width;
    const y = (Math.random() * 0.9 + 0.1) * height;
    this._pos = new Vector(x, y);
    this._r = 2;
    this._energy = 500;
    this._alive = true;
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._pos.x, this._pos.y);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(0, 0, this._r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  get energy() {
    return this._energy;
  }

  get alive() {
    return this._alive;
  }

  set alive(alive) {
    this._alive = alive;
  }

  get position() {
    return this._pos.copy();
  }

  get r() {
    return this._r;
  }
}
