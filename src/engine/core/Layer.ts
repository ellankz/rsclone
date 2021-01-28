import {
  CircleConfig,
  ILayer,
  ImageConfig,
  ITextNode,
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

  view: IView;

  nodes: NodesType[];

  screen: string;

  update: () => void;

  private queue: (() => void)[] = [];

  private isLoading: boolean;

  private isCleared: boolean = true;

  isUpdated: boolean = false;

  removeEventBubbling: string[] = [];

  shadows: { enabled: boolean };

  constructor(
    index: number,
    size: IVector,
    container: HTMLElement,
    shadows: { enabled: boolean },
    view?: IView,
  ) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position: absolute; left: 0; top: 0';
    canvas.width = size.x;
    canvas.height = size.y;
    canvas.style.zIndex = index.toString();

    container.appendChild(canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = size;
    this.view = view || new View([this]);
    this.nodes = [];
    this.update = null;
    this.screen = '';
    this.shadows = shadows;
  }

  public toTop(n?: number) {
    this.canvas.style.zIndex = (+this.canvas.style.zIndex + (n || 1) + 1).toString();
  }

  public toBack(n?: number) {
    this.canvas.style.zIndex = (+this.canvas.style.zIndex - (n || 1) - 1).toString();
  }

  public clear() {
    if (this.isCleared) return;
    this.isCleared = true;
    this.isUpdated = false;
    this.ctx.clearRect(0, 0, this.size.x, this.size.y);
  }

  public drawRect(params: RectConfig) {
    if (this.isLoading) {
      this.queue.push(() => this.drawRect(params));
      return;
    }

    this.isCleared = false;
    this.isUpdated = false;

    this.ctx.save();

    const pos = this.view.getPosition(new Vector(params.x, params.y));

    if (params.opacity) {
      this.ctx.globalAlpha = params.opacity;
    }

    if (params.filter) {
      this.ctx.filter = params.filter;
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
    if (this.isLoading) {
      this.queue.push(() => this.drawCircle(params));
      return;
    }

    this.isCleared = false;
    this.isUpdated = false;

    this.ctx.save();

    const pos = this.view.getPosition(new Vector(params.x, params.y));

    if (params.opacity) {
      this.ctx.globalAlpha = params.opacity;
    }

    if (params.filter) {
      this.ctx.filter = params.filter;
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

  public drawText(params: TextConfig, node: ITextNode) {
    if (this.isLoading) {
      this.queue.push(() => this.drawText(params, node));
      return;
    }

    this.isCleared = false;
    this.isUpdated = false;

    this.ctx.save();

    const pos = this.view.getPosition(new Vector(params.x, params.y));

    if (params.opacity) {
      this.ctx.globalAlpha = params.opacity;
    }

    if (params.filter) {
      this.ctx.filter = params.filter;
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

    const metrics = this.ctx.measureText(params.text);
    const nodeElement = node;
    nodeElement.size = new Vector(metrics.width, metrics.actualBoundingBoxDescent);

    this.ctx.restore();
  }

  public drawImage(params: ImageConfig) {
    if (this.isLoading) {
      this.queue.push(() => this.drawImage(params));
      return;
    }

    const pos = this.view.getPosition(new Vector(params.x, params.y));

    const draw = () => {
      this.isCleared = false;
      this.isUpdated = false;

      this.ctx.save();

      if (params.opacity) {
        this.ctx.globalAlpha = params.opacity;
      }

      if (params.filter) {
        this.ctx.filter = params.filter;
      }

      if (params.border) {
        Layer.setBorder(params.border, this.ctx);
        this.ctx.strokeRect(pos.x, pos.y, params.dw, params.dh);
      }

      if (params.shadow && this.shadows.enabled) {
        Layer.setShadow(params.shadow, pos.x, pos.y, this.ctx);
      }

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

      this.ctx.restore();
    };

    const isImgLoaded = params.img.complete && params.img.naturalHeight !== 0;

    if (!isImgLoaded) {
      this.isLoading = true;
      this.awaitImageLoad(params.img, draw);
    } else draw();
  }

  public resize(scaleRatio: number, size: Vector) {
    this.canvas.width = size.x;
    this.canvas.height = size.y;
    this.ctx.scale(scaleRatio, scaleRatio);
  }

  private static setBorder(border: string, ctx: CanvasRenderingContext2D) {
    const borderParams = border.split(' ');
    const width = parseInt(borderParams[0], 10);
    const color = borderParams[borderParams.length - 1];
    ctx.lineWidth = width || 1;
    ctx.strokeStyle = color || '#000';
  }

  protected awaitImageLoad(img: HTMLImageElement, drawFunc: () => void) {
    new Promise((resolve) => {
      const res = () => {
        img.removeEventListener('load', res);
        img.removeEventListener('error', res);
        resolve(img);
      };
      img.addEventListener('load', res);
      img.addEventListener('error', res);
    }).finally(() => {
      this.isLoading = false;
      drawFunc();
      while (!this.isLoading && this.queue.length > 0) {
        this.queue.shift()();
      }
    });
  }

  private static setShadow(
    shadow: string,
    posX: number,
    posY: number,
    ctx: CanvasRenderingContext2D,
  ) {
    const shadowParams = shadow.split(' ');
    const cx = posX + parseInt(shadowParams[0], 10);
    const cy = posY + parseInt(shadowParams[1], 10);
    const rx = parseInt(shadowParams[2], 10);
    const ry = parseInt(shadowParams[3], 10);

    ctx.save();
    ctx.beginPath();

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'black';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';

    ctx.translate(cx - rx, cy - ry);
    ctx.scale(rx, ry);
    ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);

    ctx.fill();
    ctx.restore();
  }
}
