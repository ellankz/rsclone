import { IInputNode, InputNodeConfig, NodesType } from '../types';
import Node from './Node';
import '../../../node_modules/canvasinput/CanvasInput';

const { CanvasInput } = window as any;

export default class InputNode extends Node implements IInputNode {
  color: string;

  input: any;

  placeholder: string;

  constructor(params: InputNodeConfig, update?: (node: NodesType) => void) {
    super(params, update);
    this.type = 'InputNode';
    this.placeholder = params.placeholder;
  }

  public draw() {
    const {
      size, position, placeholder, layer,
    } = this;
    if (this.input) {
      this.input.render();
    } else {
      this.input = new CanvasInput({
        canvas: layer.canvas,
        fontSize: 18,
        fontColor: '#212121',
        fontWeight: 'bold',
        width: size.x - 10,
        height: size.y - 10,
        padding: 5,
        x: position.x,
        y: position.y,
        borderColor: '#FFF',
        borderRadius: 0,
        boxShadow: 'none',
        innerShadow: 'none',
        placeHolder: placeholder,
      });
      this.input.render();
    }
  }
}
