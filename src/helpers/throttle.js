export class Throttler {
  constructor(delay) {
    this.delay = delay;
    this.wait = false;
  }

  exec(callback) {
    if (this.wait) {
      return;
    }

    if (!this.wait) {
      this.wait = true;
    }

    setTimeout(() => {
      this.wait = false;
      callback();
    }, this.delay);
  }
}
