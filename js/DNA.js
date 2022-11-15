class DNA {
  constructor() {
    this._mutation_rate = 0.1;
    this._DNA_length = 20;

    this._genome = new Array(this._DNA_length).fill(0);
  }

  random() {
    this._genome = this._genome.map(() => Math.random());
  }

  mutate() {
    return [...this._genome].map((g) =>
      Math.random() < this._mutation_rate ? Math.random() : g
    );
  }

  get genome() {
    return [...this._genome];
  }

  set genome(g) {
    this._genome = [...g];
  }
}
