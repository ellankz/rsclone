import Vector from '../core/Vector';
import Interval from '../TimeManager/Interval';
import {
  ISpriteNode,
  SpriteNodeConfig,
  NodesType,
  SpriteStatesConfig,
} from '../types';
import Node from './Node';

export default class SpriteNode extends Node implements ISpriteNode {
  img: HTMLImageElement;

  dh: number;

  dw: number;

  srcX: number;

  srcY: number;

  frameW: number;

  frameH: number;

  frames: number;

  startFrame: number;

  speed: number;

  private repeat: number;

  private count: number = 0;

  private state: string;

  private animation = false;

  private states: SpriteStatesConfig;

  private initialPosition: Vector;

  private finishCallbacks: (() => void)[] = [];

  private isFinished: boolean;

  interval: Interval;

  constructor(params: SpriteNodeConfig, update?: (node: NodesType) => void) {
    super(params, update);
    this.type = 'SpriteNode';
    this.img = params.img;
    this.frames = params.frames;
    this.startFrame = params.startFrame || 0;
    this.speed = params.speed || 0;
    this.repeat = params.repeat;
    this.state = 'basic';

    this.frameW = this.size.x / this.frames;
    this.frameH = this.size.y;

    this.srcX = this.startFrame * this.frameW;
    this.srcY = 0;

    this.setDwDH(params.dh);

    this.initialPosition = new Vector(this.position.x, this.position.y);

    this.states = params.states || {};
    this.states.basic = {
      img: this.img,
      frames: this.frames,
      dh: this.dh,
      startFrame: this.startFrame,
      speed: this.speed,
      positionAdjust: new Vector(0, 0),
      size: this.size,
      repeat: this.repeat,
    };

    this.animate();
  }

  pause() {
    if (this.interval && !this.interval.isPaused) this.interval.pause();
  }

  resume() {
    if (this.interval && this.interval.isPaused) this.interval.resume();
  }

  private animate() {
    if (this.interval && !this.interval.isDestroyed) {
      this.interval.destroy();
    }
    this.interval = new Interval(() => {
      this.animation = false;
    }, this.speed).start();
  }

  public innerUpdate() {
    if (this.animation || this.count === this.repeat) return;

    this.animation = true;

    if (this.srcX + this.frameW === this.size.x) {
      if (this.repeat) {
        this.count += 1;
      }
    }

    if (this.count === this.repeat) {
      if (!this.isFinished) {
        this.isFinished = true;
        this.finishCallbacks.forEach((callback) => callback());
      }
      return;
    }

    this.srcX = (this.srcX + this.frameW) % this.size.x;
  }

  public draw() {
    this.layer.drawImage({
      x: this.position.x,
      y: this.position.y,
      img: this.img,
      srcX: this.srcX,
      srcY: this.srcY,
      width: this.frameW,
      height: this.frameH,
      dw: this.dw,
      dh: this.dh,
      border: this.border,
      opacity: this.opacity,
      filter: this.filter,
      shadow: this.shadow,
    });
  }

  public switchState(stateName: string) {
    if (!this.states[stateName]) return;
    this.interval?.destroy();
    const state = this.states[stateName];
    this.img = state.img;
    this.frames = state.frames;
    if (state.positionAdjust) {
      this.position = new Vector(
        this.initialPosition.x + state.positionAdjust.x,
        this.initialPosition.y + state.positionAdjust.y,
      );
    } else {
      this.position = new Vector(this.initialPosition.x, this.initialPosition.y);
    }
    this.size = state.size || this.size;
    this.startFrame = state.startFrame || 0;
    this.speed = state.speed || this.speed;
    this.repeat = state.repeat;
    this.count = 0;
    this.finishCallbacks = [];
    this.isFinished = false;

    this.animate();

    this.frameW = this.size.x / this.frames;
    this.frameH = this.size.y;

    this.srcX = this.startFrame * this.frameW;
    this.srcY = 0;

    this.setDwDH(state.dh || this.dh);
    this.state = stateName;
  }

  public get currentState() {
    return this.state;
  }

  public then(callback: () => void) {
    if (this.isFinished) {
      callback();
    } else {
      this.finishCallbacks.push(callback);
    }
  }

  private setDwDH(providedDH: number) {
    if (providedDH) {
      this.dh = providedDH;
      const ratio = (this.dh * 100) / this.frameH;
      this.dw = Math.ceil((this.frameW * ratio) / 100);
    } else {
      this.dh = this.frameH;
      this.dw = this.frameW;
    }
  }
}
