import Interval from './Interval';
import Timeout from './Timeout';

export default class Timer {
  private timers: (Timeout | Interval | Timer)[];

  private sequentially: boolean;

  isStarted: boolean;

  isPaused: boolean;

  isDestroyed: boolean;

  isFinished: boolean;

  parentTimer: Timer;

  private finishedTimers: number = 0;

  private startCallbacks: (() => void)[] = [];

  private finishCallbacks: (() => void)[] = [];

  private isEnd: boolean;

  private currentTimer: number;

  onEnd: () => void;

  constructor(timers: (Timeout | Interval | Timer)[], sequentially?: boolean) {
    this.timers = timers;
    this.sequentially = sequentially;
  }

  add(targetTimer: Timeout | Interval | Timer) {
    const timer = targetTimer;
    if (this.isDestroyed || timer.parentTimer) return this;

    timer.parentTimer = this;
    this.timers.push(timer);

    if (!this.sequentially) {
      this.setFinish(timer);
      if (this.isStarted && !timer.isStarted) timer.start();
      if (this.isPaused && !timer.isPaused) timer.pause();
    }

    return this;
  }

  remove(targetTimer: Timeout | Interval | Timer) {
    const timer = targetTimer;
    if (this.isDestroyed) return this;
    const idx = this.timers.indexOf(timer);
    if (idx !== -1) {
      this.timers.splice(idx, 1);
    }

    timer.parentTimer = null;
    if (timer.onEnd) timer.onEnd();
    timer.onEnd = null;

    return this;
  }

  start() {
    if (this.isDestroyed || this.timers.length === 0) return this;
    if (this.isStarted) {
      this.restart();
      return this;
    }

    if (this.startCallbacks.length > 0) {
      this.startCallbacks.forEach((callback) => callback());
    }

    this.isStarted = true;

    if (this.sequentially) {
      this.setSequence();
    } else {
      this.timers.forEach((timer) => {
        this.setFinish(timer);
      });
      this.timers.forEach((timer) => {
        timer.start();
      });
    }

    return this;
  }

  pause() {
    if (!this.isStarted || this.isDestroyed || this.timers.length === 0) return;

    this.isPaused = true;

    if (this.sequentially && this.timers[this.currentTimer]) {
      this.timers[this.currentTimer].pause();
    } else {
      this.timers.forEach((timer) => timer.pause());
    }
  }

  resume() {
    if (!this.isStarted || this.isDestroyed || this.timers.length === 0) return;

    this.isPaused = false;

    if (this.sequentially && this.timers[this.currentTimer]) {
      this.timers[this.currentTimer].resume();
    } else {
      this.timers.forEach((timer) => timer.resume());
    }
  }

  destroy() {
    if (this.isDestroyed || this.timers.length === 0) return;

    if (this.parentTimer) this.parentTimer.remove(this);

    this.isDestroyed = true;
    this.timers.forEach((timer) => timer.destroy());
    this.timers = [];

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

  finally(callback: () => void) {
    if (!this.isStarted && !this.isDestroyed) {
      this.finishCallbacks.push(callback);
    }
    return this;
  }

  private restart() {
    if (this.isDestroyed || !this.isStarted || this.timers.length === 0) return;

    this.isFinished = false;
    this.isEnd = false;

    if (this.sequentially) {
      this.currentTimer = undefined;
      this.timers.forEach((targetTimer) => {
        const timer = targetTimer;
        timer.onEnd = null;
      });
      this.setSequence();
    } else {
      this.timers.forEach((timer) => this.setFinish(timer));
      this.timers.forEach((timer) => timer.start());
    }
  }

  private setFinish(targetTimer: Timeout | Interval | Timer) {
    const timer = targetTimer;
    if (timer.isDestroyed) {
      this.updateFinishedTimers();
      return;
    }
    timer.onEnd = () => {
      this.updateFinishedTimers();
      timer.onEnd = null;
    };
  }

  private finish() {
    if (this.onEnd && !this.isEnd) {
      this.isEnd = true;
      this.onEnd();
    }
    if (this.finishCallbacks.length > 0) {
      this.finishCallbacks.forEach((callback) => callback());
    }
    this.isFinished = true;
    this.finishedTimers = 0;
  }

  private updateFinishedTimers() {
    this.finishedTimers += 1;
    if (this.finishedTimers === this.timers.length) {
      this.finish();
    }
  }

  private setSequence() {
    this.currentTimer = this.currentTimer !== undefined ? this.currentTimer + 1 : 0;
    let timer = this.timers[this.currentTimer];

    if (!timer) {
      this.finish();
      return;
    }

    while (timer.isDestroyed && this.currentTimer + 2 > this.timers.length) {
      this.currentTimer += 1;
      timer = this.timers[this.currentTimer];
    }

    if (timer.isDestroyed) {
      this.finish();
      return;
    }

    timer.onEnd = () => {
      this.setSequence();
      timer.onEnd = null;
    };

    timer.start();
  }
}
