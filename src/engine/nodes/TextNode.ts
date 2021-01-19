import { ITextNode, TextNodeConfig, NodesType } from '../types';
import Node from './Node';

export default class TextNode extends Node implements ITextNode {
  color: string;

  font: string;

  fontSize: number;

  text: string;

  constructor(params: TextNodeConfig, update?: (node: NodesType) => void) {
    super(params, update);
    this.type = 'TextNode';
    this.color = params.color || '#000';
    this.font = params.font || 'serif';
    this.fontSize = params.fontSize || 30;
    this.text = params.text;
  }

  public draw() {
    this.layer.drawText(
      {
        x: this.position.x,
        y: this.position.y,
        size: this.fontSize,
        font: this.font,
        color: this.color,
        text: this.text,
        border: this.border,
        opacity: this.opacity,
        filter: this.filter,
      },
      this,
    );
  }
}
