import Timeout from './Timeout';

export default class Interval {
  interval: number;

  repeat: number;

  isStarted: boolean;

  isFinished: boolean;

  isDestroyed: boolean;

  isPaused: boolean;

  private count: number = 0;

  private callbacks: (() => void)[] = [];

  private startTime: number;

  private pauseTime: number;

  private intervalId: number;

  private restTime: number;

  private timeout: Timeout;

  private startCallback: () => void;

  private finishCallback: () => void;

  private createTimeout: (callback: () => void, interval: number, repeat?: number) => Timeout;

  constructor(
    createTimeout: (callback: () => void, interval: number, repeat?: number) => Timeout,
    callback: () => void,
    interval: number,
    repeat?: number,
  ) {
    this.interval = interval || 0;
    this.repeat = repeat;
    this.restTime = this.interval;
    this.callbacks.push(callback);
    this.createTimeout = createTimeout;
  }

  start() {
    if (this.isDestroyed || this.isStarted) return;

    if (this.startCallback) this.startCallback();

    this.startTime = Date.now();
    this.isStarted = true;

    this.intervalId = window.setInterval(() => this.callback(), this.interval);

    return this;
  }

  restart() {
    if (this.isDestroyed || !this.isStarted) return;

    this.startTime = Date.now();
    this.isPaused = false;
    this.restTime = this.interval;
    this.count = 0;

    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => this.callback(), this.interval);
  }

  pause() {
    if (!this.isStarted || this.isDestroyed || this.isPaused) return;

    this.pauseTime = Date.now();
    if (this.timeout && !this.timeout.isDestroyed) this.timeout.destroy();

    this.isPaused = true;
    clearInterval(this.intervalId);
  }

  resume() {
    if (!this.isStarted || this.isDestroyed || !this.isPaused) return;

    this.restTime = this.restTime - (this.pauseTime - this.startTime);
    this.startTime = Date.now();

    this.timeout = this.createTimeout(() => {
      this.intervalId = window.setInterval(() => this.callback(), this.interval);
    }, this.restTime).start();

    this.isPaused = false;
  }

  destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.isDestroyed = true;
  }

  before(callback: () => void) {
    if (!this.isStarted && !this.isDestroyed) {
      this.startCallback = callback;
    }
    return this;
  }

  then(callback: () => void) {
    if (!this.isStarted && !this.isDestroyed) {
      this.callbacks.push(callback);
    }
    return this;
  }

  finally(callback: () => void) {
    if (!this.isStarted && !this.isDestroyed) {
      this.finishCallback = callback;
    }
    return this;
  }

  private callback() {
    this.callbacks.forEach((callback) => {
      callback();
    });

    if (!this.repeat) return;

    this.count += 1;
    if (this.repeat === this.count) {
      clearInterval(this.intervalId);
      this.isFinished = true;
      if (this.finishCallback) this.finishCallback();
    }
  }
}
