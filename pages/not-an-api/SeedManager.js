function RNG(seed) {
  this.m = BigNumber(0x80000000);
  this.a = BigNumber(1103515245);
  this.c = BigNumber(12345);
  this.state = BigNumber(seed);
}
RNG.prototype.nextInt = function () {
  this.state = this.a.times(this.state).plus(this.c).modulo(this.m);
  return this.state;
}
RNG.prototype.nextFloat = function () {
  return this.nextInt().dividedBy((this.m.minus(1)));
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