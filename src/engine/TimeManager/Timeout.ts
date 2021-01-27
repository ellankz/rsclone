import Timer from './Timer';

export default class Timeout {
  timeout: number;

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

  private timerId: number;

  private restTime: number;

  private startCallbacks: (() => void)[] = [];

  private finishCallbacks: (() => void)[] = [];

  private isEnd: boolean;

  onEnd: () => void;

  constructor(callback: () => void, timeout: number, repeat?: number) {
    this.timeout = timeout || 0;
    this.repeat = repeat || 1;
    this.restTime = this.timeout;
    this.callbacks.push(callback);
  }

  start() {
    if (this.isDestroyed) return this;
    if (this.isStarted) {
      this.restart();
      return this;
    }

    if (this.startCallbacks.length > 0) {
      this.startCallbacks.forEach((callback) => callback());
    }

    this.startTime = Date.now();
    this.isStarted = true;

    this.timerId = window.setTimeout(() => this.callback(), this.timeout);

    return this;
  }

  pause() {
    if (!this.isStarted || this.isDestroyed || this.isPaused) return;

    this.pauseTime = Date.now();

    this.isPaused = true;
    clearTimeout(this.timerId);
  }

  resume() {
    if (!this.isStarted || this.isDestroyed || !this.isPaused) return;

    this.restTime -= this.pauseTime - this.startTime;
    this.startTime = Date.now();

    this.timerId = window.setTimeout(() => this.callback(), this.restTime);
    this.isPaused = false;
  }

  destroy() {
    if (this.isDestroyed) return;

    if (this.timerId) clearTimeout(this.timerId);

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
    this.restTime = this.timeout;
    this.count = 0;

    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = window.setTimeout(() => this.callback(), this.timeout);
  }

  private callback() {
    this.callbacks.forEach((callback) => {
      callback();
    });

    this.count += 1;

    if (this.repeat > this.count) {
      const { count } = this;
      this.restart();
      this.count = count;
      return;
    }

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
