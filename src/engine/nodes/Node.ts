import {
  NodeConfig,
  INode,
  NodesTypeName,
  NodesType,
  ILayer,
} from '../types';
import Vector from '../core/Vector';

export default class Node implements INode {
  position: Vector;

  size: Vector;

  type: NodesTypeName;

  layer: ILayer;

  sceneName: string;

  border?: string;

  opacity?: number;

  filter?: string;

  shadow?: string;

  name?: string;

  removeEventBubbling: string[];

  addTo: (sceneName: string) => NodesType;

  destroy: () => void;

  removeAllEvents: () => void;

  update?: (node: NodesType) => void;

  constructor(params: NodeConfig, update?: (node: NodesType) => void) {
    this.position = params.position;
    this.size = params.size;
    this.type = 'Node';
    this.layer = params.layer;
    this.sceneName = '';

    this.border = params.border;
    this.opacity = params.opacity;
    this.filter = params.filter;
    this.shadow = params.shadow;
    this.name = params.name;

    this.addTo = null;
    this.destroy = null;
    this.removeAllEvents = null;

    this.removeEventBubbling = params.removeEventBubbling || [];

    if (update) {
      this.update = update;
    }
  }

  public move(v: Vector) {
    this.position.plus(v);
  }

  public clearLayer() {
    this.layer.clear();
    this.layer.update();
  }
}
