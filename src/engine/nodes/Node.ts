import { NodeConfig, INode, NodesTypeName } from '../types';
import Vector from '../core/Vector';
import Layer from '../core/Layer';

export default class Node implements INode {
  position: Vector;

  size: Vector;

  type: NodesTypeName;

  layer: Layer;

  border: string;

  constructor(params: NodeConfig) {
    this.position = params.position;
    this.size = params.size;
    this.type = 'Node';
    this.layer = params.layer;
    this.border = params.border;
  }

  public move(v: Vector) {
    this.position.plus(v);
  }

  public clearLayer() {
    this.layer.clear();
  }
}
