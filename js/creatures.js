class Creature {
  constructor(width, height, born = 0) {
    this._width = width;
    this._height = height;
    this._born = born;

    this._age = 0;
    this._start_energy = 300;
    this._energy = this._start_energy;
    this._max_speed = 10;
    this._max_acceleration = 3;
    this._combact_factor = 25;

    this._max_radius = 15;
    this._max_view_range = 500;
    this._max_view_angle = Math.PI;
    this._max_eat_radius = 6;
    this._min_age = 30;
    this._carnivore_threshold = 0.9;

    this._pos = new Vector(random(width), random(height));
    this._vel = new Vector.random2D();
    this._acc = new Vector.random2D();

    this._picked_food = null;
    this._picked_enemy = null;

    this._DNA = new DNA();
    this.unpack_DNA();
  }

  unpack_DNA() {
    this._generation = this._DNA.genome.generation;
    this._family = this._DNA.family;

    this._hue = this._DNA.genome.genome[1] * 360;
    this._radius = (this._DNA.genome.genome[2] * 0.8 + 0.2) * this._max_radius;
    this._view_range = (this._DNA.genome.genome[3] * 0.95 + 0.05) * this._max_view_range;
    this._view_angle = (this._DNA.genome.genome[4] * 0.95 + 0.05) * this._max_view_angle;
    this._speed = this._DNA.genome.genome[5] * this._max_speed;
    this._acceleration = this._DNA.genome.genome[6] * this._max_acceleration;
    this._infancy_age = (this._DNA.genome.genome[7] * 0.9 + 0.1) * this._min_age;
    this._distance_bias = this._DNA.genome.genome[8];
    this._diet = this._DNA.genome.genome[9];
    this._split_energy = this._start_energy * (2 * this._DNA.genome.genome[10] + 4);
    this._min_energy = this._start_energy * (0.5 * this._DNA.genome.genome[11] + 2);
    this._eat_radius = this._max_eat_radius * this._DNA.genome.genome[12];
    this._aggressivity = this._DNA.genome.genome[13];
    this._attack = this._DNA.genome.genome[14];
    this._defence = this._DNA.genome.genome[15];
    this._attack_radius = this._DNA.genome.genome[16] * this._max_view_range;

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

    if (this._picked_enemy) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(this._pos.x, this._pos.y);
      ctx.lineTo(this._picked_enemy.pos.x, this._picked_enemy.pos.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      this._picked_enemy = null;
    }
  }

  move(food, creatures) {
    this._age++;

    if (this._age < this._infancy_age) return;

    if (this._picked_food && !food.includes(this._picked_food) && this._diet < this._carnivore_threshold) this._picked_food = null;
    else if (this._picked_food && !creatures.includes(this._picked_food) && this._diet >= this._carnivore_threshold) this._picked_food = null;


    if (!this._picked_food) {
      let food_source;

      if (this._diet < this._carnivore_threshold) {
        // herbivore
        food_source = food;
      } else {
        // carnivore
        food_source = creatures.filter(c => c != this && c.carnivore);
      }

      let best_food;
      let best_score = 0;

      food_source.forEach(f => {
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
          }
        }
      });

      if (best_food) this._picked_food = best_food;
    } else if (this._picked_food) {
      let best_vector;
      best_vector = this._picked_food.pos.copy().sub(this._pos);

      if (best_vector.mag() < this._radius + this._picked_food.radius + (this._eat_radius * this._radius)) {
        this._energy += this._picked_food.eat_creature();
        this._picked_food = null;
      } else {
        this._acc = best_vector.copy().setMag(this._acceleration);
      }
    }


    if (this._aggressivity < random()) {
      let best_enemy;
      let best_score = 0;

      let enemies = creatures.filter(c => c != this);
      enemies.forEach(e => {
        let dist, dist_vector, angle;
        dist_vector = this._pos.copy().sub(e.pos);
        dist = dist_vector.mag();
        angle = dist_vector.heading2D() + Math.PI;

        if (dist < this._attack_radius && Math.abs(angle) < this._view_angle && this._attack > e.defence) {
          let score = Math.sqrt(Math.pow(this._attack - e.attack, 2) + Math.pow(this._defence - e.defence, 2));
          if (score > best_score) {
            best_score = score;
            best_enemy = e;
          }
        }
      });

      if (best_enemy) {
        this._picked_enemy = best_enemy;
        best_enemy.attack_creature(this._attack);
      }
    }


    this._vel.add(this._acc).limit(this._max_speed);
    this._pos.add(this._vel);

    if (this._pos.x - this._radius > this._width) this._pos.x -= this._width - this._radius;
    else if (this._pos.x + this._radius < 0) this._pos.x += this._width + this._radius;

    if (this._pos.y - this._radius > this._height) this._pos.y -= this._height - this._radius;
    else if (this._pos.y + this._radius < 0) this._pos.y += this._height + this._radius;

    let scl = 10;
    this._energy -= (this._speed / this._max_speed * scl) ** 2 / (scl ** 2);
    this._energy -= this._radius / this._max_radius;
    this._energy -= (this._view_range / this._max_view_range * scl) ** 3 / (scl ** 3);
    this._energy -= (this._eat_radius / this._max_eat_radius * scl) ** 3 / (scl ** 3);
    this._energy -= (this._view_angle / this._max_view_angle * scl) ** 5 / (scl ** 5);
  }

  split() {
    this._energy -= this._split_energy;
    let new_DNA;
    new_DNA = this._DNA.mutate();
    new_DNA.generation++;
    return new_DNA;
  }

  attack_creature(a) {
    let diff = (a - this._defence) * this._combact_factor;
    this._energy -= diff;
  }

  eat_creature() {
    let old_energy = this._energy;
    this._energy = 0;
    return old_energy;
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
    return this._energy <= 0;
  }

  get ready_to_duplicate() {
    return this._energy > this._split_energy && this._energy - this._split_energy > this._min_energy;
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

  get diet() {
    return this._diet;
  }

  get carnivore() {
    return this._diet > this._carnivore_threshold;
  }

  get aggressivity() {
    return this._aggressivity;
  }

  get attack() {
    return this._attack;
  }

  get defence() {
    return this._defence;
  }

  get formatted_DNA() {
    return {
      generation: this._generation,
      born: this._born,
      family: this._family,
      radius: this._radius,
      view_range: this._view_range,
      view_angle: this._view_angle,
      speed: this._speed,
      acceleration: this._acceleration,
      infancy_age: this._infancy_age,
      distance_bias: this._distance_bias,
      diet: this._diet,
      carnivore: this._diet > this._carnivore_threshold,
      split_energy: this._split_energy,
      min_energy: this._min_energy,
      eat_radius: this._eat_radius * this._radius,
      attack: this._attack,
      defence: this._defence,
      aggressivity: this._aggressivity,
      attack_radius: this._attack_radius,
    };
  }
}
