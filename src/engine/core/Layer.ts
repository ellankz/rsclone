import {
  CircleConfig,
  ILayer,
  ImageConfig,
  NodesType,
  RectConfig,
  TextConfig,
} from '../types';
import Vector from './Vector';
import View from './View';

export default class Layer implements ILayer {
  canvas: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  size: Vector;

  offset: Vector;

  view: View;

  nodes: NodesType[];

  constructor(index: number, size: Vector, container: HTMLElement, offset: Vector, view?: View) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `position: absolute; left: ${offset.x}px; top: ${offset.y}px`;
    canvas.width = size.x;
    canvas.height = size.y;
    canvas.style.zIndex = index.toString();

    container.appendChild(canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = size;
    this.offset = offset;
    this.view = view || new View({}, {});
    this.nodes = [];
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
  }

  public drawRect(params: RectConfig) {
    const pos = this.view.getPosition(new Vector(params.x, params.y));

    if (params.color) {
      this.ctx.fillStyle = params.color;
      this.ctx.fillRect(pos.x, pos.y, params.width, params.height);
    }

    if (params.border) {
      this.ctx.strokeStyle = params.border;
      this.ctx.strokeRect(pos.x, pos.y, params.width, params.height);
    }
  }

  public drawCircle(params: CircleConfig) {
    const pos = this.view.getPosition(new Vector(params.x, params.y));

    this.ctx.beginPath();
    this.ctx.arc(
      pos.x + params.radius,
      pos.y + params.radius,
      params.radius,
      0,
      2 * Math.PI,
      false,
    );

    if (params.color) {
      this.ctx.fillStyle = params.color;
      this.ctx.fill();
    }

    if (params.border) {
      this.ctx.strokeStyle = params.border;
      this.ctx.stroke();
    }
  }

  public drawText(params: TextConfig) {
    const pos = this.view.getPosition(new Vector(params.x, params.y));

    this.ctx.font = `${params.size || 30}px ${params.font || 'serif'}`;
    this.ctx.textBaseline = 'top';

    if (params.color) {
      this.ctx.fillStyle = params.color;
    }

    this.ctx.fillText(params.text, pos.x, pos.y);
  }

  public drawImage(params: ImageConfig) {
    const pos = this.view.getPosition(new Vector(params.x, params.y));

    this.ctx.drawImage(
      params.img,
      params.srcX,
      params.srcY,
      params.width,
      params.height,
      pos.x,
      pos.y,
      params.dw,
      params.dh,
    );

    if (params.border) {
      this.ctx.strokeStyle = params.border;
      this.ctx.strokeRect(pos.x, pos.y, params.dw, params.dh);
    }
  }
}
