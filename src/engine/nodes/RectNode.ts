import { IRectNode, RectNodeConfig } from '../types';
import Node from './Node';

export default class RectNode extends Node implements IRectNode {
  color: string;

  constructor(params: RectNodeConfig) {
    super(params);
    this.type = 'RectNode';
    this.color = params.color || '#000';
  }

  public draw() {
    this.layer.drawRect({
      x: this.position.x,
      y: this.position.y,
      width: this.size.x,
      height: this.size.y,
      color: this.color,
      border: this.border,
    });
  }
}
