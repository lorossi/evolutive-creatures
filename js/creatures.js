class Creature {
  constructor(width, height) {
    this._width = width;
    this._height = height;

    this._age = 0;
    this._start_energy = 300;
    this._energy = this._start_energy;
    this._split_energy = this._start_energy * 2;
    this._max_speed = 4;

    this._max_radius = 8;
    this._max_view_range = 300;
    this._max_view_angle = Math.PI;
    this._min_age = 30;

    this._pos = new Vector(random(width), random(height));
    this._vel = new Vector.random2D();

    this._picked_food = null;

    this._DNA = new DNA();
    this.unpack_DNA();
  }

  unpack_DNA() {
    this._generation = this._DNA.genome.generation;

    this._hue = this._DNA.genome.genome[1] * 360;
    this._radius = (this._DNA.genome.genome[2] * 0.8 + 0.2) * this._max_radius;
    this._view_range = (this._DNA.genome.genome[3] * 0.95 + 0.05) * this._max_view_range;
    this._view_angle = (this._DNA.genome.genome[4] * 0.95 + 0.05) * this._max_view_angle;
    this._speed = this._DNA.genome.genome[5] * this._max_speed;
    this._infant_age = (this._DNA.genome.genome[6] * 0.9 + 0.1) * this._min_age;
    this._distance_bias = this._DNA.genome.genome[7];
    this._family = this._DNA.genome.genome[8].toString(36).substr(2, 5);

    this._vel.setMag(this._speed);
  }


  show(ctx) {
    let alpha = this._energy / this._start_energy;

    ctx.save();
    ctx.translate(this._pos.x, this._pos.y);
    ctx.rotate(this._vel.copy().heading2D());

    ctx.beginPath();
    ctx.arc(0, 0, this._radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = `hsla(${this._hue}, 100%, 50%, ${alpha})`;
    ctx.strokeStyle = null;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, this._view_range, -this._view_angle / 2, this._view_angle / 2);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = `hsla(0, 100%, 50%, 0.05)`;
    ctx.strokeStyle = `hsla(0, 100%, 50%, 0.1)`;
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();

    /*
    if (this._picked_food) {
      let dist_vector = this._pos.copy().sub(this._picked_food.pos);
      ctx.save();
      ctx.translate(this._pos.x, this._pos.y);
      ctx.rotate(dist_vector.copy().heading2D() + Math.PI);
      ctx.moveTo(0, 0);
      ctx.lineTo(dist_vector.mag(), 0);
      ctx.closePath();
      ctx.strokeStyle = "purple";
      ctx.stroke();
      ctx.restore();
    }
    */

  }

  move(food) {
    this._age++;

    if (this._age < this._infant_age) return;

    if (this._picked_food && !food.includes(this._picked_food)) this._picked_food = null;

    if (!this._picked_food) {
      let best_food, best_vector;
      let best_score = 0;

      food.forEach(f => {
        let dist, dist_vector, angle;
        dist_vector = this._pos.copy().sub(f.pos);
        dist = dist_vector.mag();
        angle = dist_vector.heading2D() + Math.PI;

        if (dist < this._view_range && Math.abs(angle) < this._view_angle) {
          let score;
          score = Math.sqrt(Math.pow(this._distance_bias * dist, 2) + Math.pow((1 - this._distance_bias) * f.percent, 2));
          if (score > best_score) {
            best_food = f;
            best_score = score;
            best_vector = dist_vector.copy();
          }
        }
      });

      if (best_food) this._picked_food = best_food;
    } else if (this._picked_food) {
      let best_vector;
      best_vector = this._picked_food.pos.copy().sub(this._pos);

      if (best_vector.mag() < this._radius + this._picked_food.radius) {
        this._energy += this._picked_food.eat();
        this._picked_food = null;
      } else {
        this._vel = best_vector.copy().setMag(this._speed);
      }
    }

    this._pos.add(this._vel);

    if (this._pos.x - this._radius > this._width) this._pos.x -= this._width - this._radius;
    else if (this._pos.x + this._radius < 0) this._pos.x += this._width + this._radius;

    if (this._pos.y - this._radius > this._height) this._pos.y -= this._height - this._radius;
    else if (this._pos.y + this._radius < 0) this._pos.y += this._height + this._radius;

    let scl = 25;
    this._energy -= (this._speed / this._max_speed * scl) ** 2 / (scl ** 2);
    this._energy -= this._radius / this._max_radius;
    this._energy -= (this._view_range / this._max_view_range * 10) ** 3 / (scl ** 3);
    this._energy -= (this._view_angle / this._max_view_angle * 10) ** 4 / (scl ** 4);
  }

  split() {
    this._energy -= this._split_energy;
    let new_DNA;
    new_DNA = this._DNA.mutate();
    new_DNA.generation++;
    return new_DNA;
  }

  get DNA() {
    return this._DNA.pack_genomes();
  }

  set DNA(d) {
    this._DNA.unpack_genomes(d);
    this.unpack_DNA();
  }

  get energy() {
    return this._energy;
  }

  set energy(e) {
    this._energy = e;
  }

  get pos() {
    return this._pos.copy();
  }

  set pos(p) {
    this._pos = p.copy();
  }

  get generation() {
    return this._generation;
  }

  get dead() {
    return this._energy < 0;
  }

  get ready_to_duplicate() {
    return this._energy > this._split_energy;
  }

  get radius() {
    return this._radius;
  }

  get heading() {
    return this._vel.heading2D();
  }

  set heading(h) {
    this._vel.rotate(h);
    this._pos.add(this._vel);
  }
}
