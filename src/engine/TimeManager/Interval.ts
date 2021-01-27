import Timer from './Timer';

export default class Interval {
  interval: number;

  repeat: number;

  isStarted: boolean;

  isFinished: boolean;

  isDestroyed: boolean;

  isPaused: boolean;

  parentTimer: Timer;

  private count: number = 0;

  private callbacks: (() => void)[] = [];

  private startTime: number;

  private pauseTime: number;

  private intervalId: number;

  private restTime: number;

  private timeoutId: number;

  private startCallbacks: (() => void)[] = [];

  private finishCallbacks: (() => void)[] = [];

  private isEnd: boolean;

  onEnd: () => void;

  constructor(callback: () => void, interval: number, repeat?: number) {
    this.interval = interval || 0;
    this.repeat = repeat;
    this.restTime = this.interval;
    this.callbacks.push(callback);
  }

  start() {
    if (this.isDestroyed) return this;
    if (this.isStarted) {
      this.restart();
      return this;
    }

    if (this.startCallbacks) {
      this.startCallbacks.forEach((callback) => callback());
    }

    this.startTime = Date.now();
    this.isStarted = true;

    this.intervalId = window.setInterval(() => this.callback(), this.interval);

    return this;
  }

  pause() {
    if (!this.isStarted || this.isDestroyed || this.isPaused) return;

    this.pauseTime = Date.now();
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.isPaused = true;
    clearInterval(this.intervalId);
  }

  resume() {
    if (!this.isStarted || this.isDestroyed || !this.isPaused) return;

    this.restTime -= this.pauseTime - this.startTime;
    this.startTime = Date.now();

    this.timeoutId = window.setTimeout(() => {
      this.callback();
      this.intervalId = window.setInterval(() => this.callback(), this.interval);
    }, this.restTime);

    this.isPaused = false;
  }

  destroy() {
    if (this.isDestroyed) return;

    if (this.intervalId) clearInterval(this.intervalId);

    if (this.timeoutId) clearTimeout(this.timeoutId);

    if (this.parentTimer) this.parentTimer.remove(this);

    this.isDestroyed = true;

    if (this.onEnd && !this.isEnd) {
      this.isEnd = true;
      this.onEnd();
    }
  }

  before(callback: () => void) {
    if (!this.isStarted && !this.isDestroyed) {
      this.startCallbacks.push(callback);
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
      this.finishCallbacks.push(callback);
    }
    return this;
  }

  private restart() {
    if (this.isDestroyed || !this.isStarted) return;

    this.startTime = Date.now();
    this.isPaused = false;
    this.isFinished = false;
    this.isEnd = false;
    this.restTime = this.interval;
    this.count = 0;

    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => this.callback(), this.interval);
  }

  private callback() {
    this.callbacks.forEach((callback) => {
      callback();
    });

    this.startTime = Date.now();
    this.restTime = this.interval;

    if (!this.repeat) return;

    this.count += 1;
    if (this.repeat === this.count) {
      clearInterval(this.intervalId);

      if (this.onEnd && !this.isEnd) {
        this.isEnd = true;
        this.onEnd();
      }

      this.isFinished = true;
      if (this.finishCallbacks.length > 0) {
        this.finishCallbacks.forEach((callback) => callback());
      }
    }
  }
}
