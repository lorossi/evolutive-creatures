class Creature {
  constructor(width, height, generation = 0) {
    this._width = width;
    this._height = height;
    this._generation = generation;

    this._max_r = 10;
    this._max_energy = 1000;

    const x = (Math.random() * 0.9 + 0.1) * width;
    const y = (Math.random() * 0.9 + 0.1) * height;

    this._position = new Vector(x, y);
    this._velocity = new Vector().random2D();

    this._dna = new DNA();
    this._dna.random();

    this.unpackDNA();
  }

  unpackDNA() {
    this._energy = this._max_energy;

    this._hue = this._dna.genome[0] * 360;
    this._r = this._dna.genome[1] * this._max_r;
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._position.x, this._position.y);
    const alpha = this._energy / this._max_energy;
    ctx.fillStyle = `hsla(${this._hue}, 100%, 50%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, this._r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  move() {
    this._energy--;
    this._position.add(this._velocity);

    if (
      this._position.x + this._r > this._width ||
      this._position.x - this._r < 0
    )
      this._velocity.invertX();
    if (
      this._position.y + this._r > this._height ||
      this._position.y - this._r < 0
    )
      this._velocity.invertY();
  }

  duplicate() {
    this._energy -= this._max_energy;
    const c = new Creature(this._width, this._height, this._generation + 1);
    c.DNA = this._dna.mutate();
    c.position = this._position.copy();
    c.unpackDNA();
    return c;
  }

  eat(food) {
    this._energy += food.energy;
    food.alive = false;
  }

  get alive() {
    return this._energy > 0;
  }

  get position() {
    return this._position.copy();
  }

  set position(position) {
    this._position = position.copy();
  }

  get r() {
    return this._r;
  }

  get DNA() {
    return this._dna;
  }

  set DNA(dna) {
    this._dna = dna;
  }

  get can_duplicate() {
    return this._energy >= 2 * this._max_energy;
  }
}
