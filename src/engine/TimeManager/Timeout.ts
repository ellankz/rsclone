export default class Timeout {
  timeout: number;

  repeat: number;

  isStarted: boolean;

  isFinished: boolean;

  isDestroyed: boolean;

  isPaused: boolean;

  private count: number = 0;

  private callbacks: (() => void)[] = [];

  private startTime: number;

  private pauseTime: number;

  private timerId: number;

  private restTime: number;

  private startCallback: () => void;

  private finishCallback: () => void;

  constructor(callback: () => void, timeout: number, repeat?: number) {
    this.timeout = timeout || 0;
    this.repeat = repeat || 1;
    this.restTime = this.timeout;
    this.callbacks.push(callback);
  }

  start() {
    if (this.isDestroyed || this.isStarted) return;

    if (this.startCallback) this.startCallback();

    this.startTime = Date.now();
    this.isStarted = true;

    this.timerId = window.setTimeout(() => this.callback(), this.timeout);

    return this;
  }

  restart() {
    if (this.isDestroyed || !this.isStarted) return;

    this.startTime = Date.now();
    this.isPaused = false;
    this.restTime = this.timeout;
    this.count = 0;

    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = window.setTimeout(() => this.callback(), this.timeout);
  }

  pause() {
    if (!this.isStarted || this.isDestroyed || this.isPaused) return;

    this.pauseTime = Date.now();

    this.isPaused = true;
    clearTimeout(this.timerId);
  }

  resume() {
    if (!this.isStarted || this.isDestroyed || !this.isPaused) return;

    this.restTime = this.restTime - (this.pauseTime - this.startTime);
    this.startTime = Date.now();

    this.timerId = window.setTimeout(() => this.callback(), this.restTime);
    this.isPaused = false;
  }

  destroy() {
    if (this.timerId) clearTimeout(this.timerId);
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

    this.count += 1;

    if (this.repeat > this.count) {
      const count = this.count;
      this.restart();
      this.count = count;
      return;
    }

    this.isFinished = true;
    if (this.finishCallback) this.finishCallback();
  }
}
