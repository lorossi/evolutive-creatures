class Food {
  constructor(x, y, spawn_delay = false) {
    this.x = x;
    this.y = y;
    this._max_energy = 200;

    this._percent = 0;
    this._max_age = random(1, 5) * 60;
    this._max_radius = 10;
    this.pos = new Vector(this.x, this.y);
    this.dead = false;
    this.color = "black";

    if (spawn_delay)
      this._age = random(1, 5) * -60;
    else
      this._age = 0;
  }

  update() {
    this._age++;
    this._percent = constrain(this._age / this._max_age, 0, 1);
  }

  eat() {
    this.dead = true;
    return this.energy;
  }

  get energy() {
    return this._percent * this._max_energy;
  }

  get radius() {
    return this._percent * this._max_radius;
  }

  get percent() {
    return this._percent;
  }

}

class Environment {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this._border = 0.15;

    this._food_decrease_age = 60 * 60;
    this._age = 0;
    this._food_number = 50;
    this._food = [];
    for (let i = 0; i < this._food_number; i++) {
      let fx, fy;
      fx = random(this._border, 1 - this._border) * this._width;
      fy = random(this._border, 1 - this._border) * this._height;
      this._food.push(new Food(fx, fy));
    }
  }

  show(ctx) {
    ctx.save();
    this._food.forEach(f => {
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  }

  update() {
    this._age++;
    this._food.forEach(f => f.update());
    this._food = this._food.filter(f => !f.dead);

    let food_number;
    if (this._age > this._food_decrease_age) {
      food_number = this._food_number - (this._age - this._food_decrease_age) / (60 * 2.5);
    } else {
      food_number = this._food_number;
    }

    let diff = food_number - this._food.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        let fx, fy;
        fx = random(this._border, 1 - this._border) * this._width;
        fy = random(this._border, 1 - this._border) * this._height;
        this._food.push(new Food(fx, fy, true));
      }
    }
  }

  get food() {
    return this._food.filter(f => f._age > 0);
  }

  get age() {
    return this._age;
  }

  set age(a) {
    this._age = a;
  }
}
