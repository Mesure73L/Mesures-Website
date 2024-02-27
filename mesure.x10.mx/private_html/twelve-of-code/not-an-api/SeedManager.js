function RNG(seed) {
  this.m = 0x80000000; // 2**31;
  this.a = 1103515245;
  this.c = 12345;
  this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
}
RNG.prototype.nextInt = function () {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function () {
  return this.nextInt() / (this.m - 1);
}

class SeedManager {
  constructor(seed, randomValues) {
    this._rng = new RNG(seed);
    if (Array.isArray(randomValues)) {
      randomValues.forEach(name => {
        this[name] = this._rng.nextFloat();
      })
    }
  }
}