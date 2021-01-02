import { ISpriteNode, SpriteNodeConfig, NodesType } from '../types';
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

  private animation = false;

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

    if (params.dh) {
      this.dh = params.dh;
      const ratio = (this.dh * 100) / this.frameH;
      this.dw = Math.ceil((this.frameW * ratio) / 100);
    } else {
      this.dh = this.frameH;
      this.dw = this.frameW;
    }
  }

  public innerUpdate() {
    if (this.animation) return;

    this.srcX = (this.srcX + this.frameW) % this.size.x;
    this.animation = true;

    setTimeout(() => {
      this.animation = false;
    }, this.speed);
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
}
