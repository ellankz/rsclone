import Vector from '../core/Vector';
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

  interval: number;

  private animation = false;

  private states: SpriteStatesConfig;

  private initialPosition: Vector;

  constructor(params: SpriteNodeConfig, update?: (node: NodesType) => void) {
    super(params, update);
    this.type = 'SpriteNode';
    this.img = params.img;
    this.frames = params.frames;
    this.startFrame = params.startFrame || 0;
    this.speed = params.speed || 0;

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
    };

    this.animate();
  }

  private animate() {
    this.interval = window.setInterval(() => {
      this.animation = false;
    }, this.speed);
  }

  public innerUpdate() {
    if (this.animation) return;
    this.srcX = (this.srcX + this.frameW) % this.size.x;
    this.animation = true;
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
    });
  }

  public switchState(stateName: string) {
    if (!this.states[stateName]) return;
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

    window.clearInterval(this.interval);
    this.animate();

    this.frameW = this.size.x / this.frames;
    this.frameH = this.size.y;

    this.srcX = this.startFrame * this.frameW;
    this.srcY = 0;

    this.setDwDH(state.dh || this.dh);
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
