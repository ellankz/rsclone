import {
  CircleConfig,
  ILayer,
  ImageConfig,
  IVector,
  IView,
  NodesType,
  RectConfig,
  TextConfig,
} from '../types';
import Vector from './Vector';
import View from './View';

export default class Layer implements ILayer {
  canvas: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  size: IVector;

  offset: IVector;

  view: IView;

  nodes: NodesType[];

  screen: string;

  update: () => void;

  constructor(index: number, size: IVector, container: HTMLElement, offset: IVector, view?: IView) {
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
    this.view = view || new View([this]);
    this.nodes = [];
    this.update = null;
    this.screen = '';
  }

  public toTop(n?: number) {
    this.canvas.style.zIndex = (+this.canvas.style.zIndex + (n || 1) + 1).toString();
  }

  public toBack(n?: number) {
    this.canvas.style.zIndex = (+this.canvas.style.zIndex - (n || 1) - 1).toString();
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
  }

  public drawRect(params: RectConfig) {
    this.ctx.save();

    const pos = this.view.getPosition(new Vector(params.x, params.y));

    if (params.opacity) {
      this.ctx.globalAlpha = params.opacity;
    }

    if (params.color) {
      this.ctx.fillStyle = params.color;
      this.ctx.fillRect(pos.x, pos.y, params.width, params.height);
    }

    if (params.border) {
      Layer.setBorder(params.border, this.ctx);
      this.ctx.strokeRect(pos.x, pos.y, params.width, params.height);
    }

    this.ctx.restore();
  }

  public drawCircle(params: CircleConfig) {
    this.ctx.save();

    const pos = this.view.getPosition(new Vector(params.x, params.y));

    if (params.opacity) {
      this.ctx.globalAlpha = params.opacity;
    }

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
      Layer.setBorder(params.border, this.ctx);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  public drawText(params: TextConfig) {
    this.ctx.save();

    const pos = this.view.getPosition(new Vector(params.x, params.y));

    if (params.opacity) {
      this.ctx.globalAlpha = params.opacity;
    }

    this.ctx.font = `${params.size}px ${params.font}`;
    this.ctx.textBaseline = 'top';

    if (params.color) {
      this.ctx.fillStyle = params.color;
    }

    this.ctx.fillText(params.text, pos.x, pos.y);

    if (params.border) {
      Layer.setBorder(params.border, this.ctx);
      this.ctx.strokeText(params.text, pos.x, pos.y);
    }

    this.ctx.restore();
  }

  public drawImage(params: ImageConfig) {
    this.ctx.save();

    const pos = this.view.getPosition(new Vector(params.x, params.y));

    if (params.opacity) {
      this.ctx.globalAlpha = params.opacity;
    }

    const isLoaded = params.img.complete && params.img.naturalHeight !== 0;

    const draw = () => {
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
        Layer.setBorder(params.border, this.ctx);
        this.ctx.strokeRect(pos.x, pos.y, params.dw, params.dh);
      }
    };

    if (!isLoaded) {
      params.img.addEventListener('load', draw);
    } else draw();

    this.ctx.restore();
  }

  private static setBorder(border: string, ctx: CanvasRenderingContext2D) {
    const borderParams = border.split(' ');
    const width = parseInt(borderParams[0], 10);
    const color = borderParams[borderParams.length - 1];
    ctx.lineWidth = width || 1;
    ctx.strokeStyle = color || '#000';
  }
}
