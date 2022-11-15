class Sketch extends Engine {
  preload() {
    this._creatures_num = 50;
    this._food_num = 100;
  }

  setup() {
    this._creatures = Array(this._creatures_num)
      .fill(0)
      .map(() => new Creature(this.width, this.height));
    this._food = Array(this._food_num)
      .fill(0)
      .map(() => new Food(this.width, this.height));
  }

  draw() {
    this.ctx.save();
    this.background("white");

    this._food.forEach((f) => f.show(this.ctx));
    this._creatures.forEach((creature) => {
      creature.show(this.ctx);
      creature.move();
    });
    this.ctx.restore();

    this._creatures = this._creatures.filter((creature) => creature.alive);
    this._creatures.forEach((c) => {
      this._food.forEach((f) => {
        if (f.alive && c.position.dist(f.position) < c.r + f.r) c.eat(f);
      });
    });
    this._food = this._food.filter((f) => f.alive);

    while (this._food.length < this._food_num) {
      this._food.push(new Food(this.width, this.height));
    }

    let new_creatures = [];
    this._creatures.forEach((c) => {
      if (c.can_duplicate) {
        new_creatures.push(c.duplicate());
      }
    });
    this._creatures = this._creatures.concat(new_creatures);

    console.log(this._creatures.length);
  }
}
