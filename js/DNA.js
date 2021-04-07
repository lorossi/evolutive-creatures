class DNA {
  constructor() {
    this._generation = 1;
    this._mutation_rate = 0.25;
    this._mutation_chanche = 0.5;
    this._DNA_length = 10;

    this._genome = new Array(this._DNA_length);
    for (let i = 0; i < this._genome.length; i++) {
      this._genome[i] = random(1);
    }
  }

  pack_genomes() {
    let return_dict = {};

    return_dict.generation = this._generation;
    return_dict.genome = this._genome;

    return return_dict;
  }

  unpack_genomes(g) {
    this._generation = g.generation;
    this._genome = [...g.genome];
  }

  mutate() {
    let new_genome;
    new_genome = [...this._genome];

    for (let i = 0; i < this._genome.length; i++) {
      if (random() < this._mutation_chanche) {
        new_genome[i] *= random(1 - this._mutation_chanche, 1 + this._mutation_chanche);
      }

      new_genome[i] = constrain(new_genome[i]);
    }
    return this.pack_genomes();
  }

  get genome() {
    return this.pack_genomes();
  }

  set genome(g) {
    this.unpack_genomes(g);
  }

  get generation() {
    return this._generation;
  }

  set generation(g) {
    this._generation = g;
  }
}