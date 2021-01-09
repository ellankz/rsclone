import { NodesType, IVector } from '../types';
import Vector from './Vector';

export default class Event {
  offset: IVector;

  removeEvent: (node: NodesType, event: [string, (e: any) => void]) => void;

  constructor(offset: IVector) {
    this.offset = offset;

    this.removeEvent = (node: NodesType, event: [string, (e: any) => void]) => {
      node.layer.canvas.removeEventListener(event[0], event[1]);
      node.events.splice(node.events.indexOf(event), 1);
    };
  }

  handle(node: NodesType, event: string, callback: (e: any) => void) {
    switch (event) {
      case 'click': {
        this.onClick(node, callback);
        break;
      }
      default:
        break;
    }
  }

  onClick(node: NodesType, callback: (e: any) => void) {
    function isPointInside(point: Vector, rectStart: Vector, size: Vector) {
      const xAxis = point.x >= rectStart.x && point.x <= rectStart.x + size.x;
      const yAxis = point.y >= rectStart.y && point.y <= rectStart.y + size.y;
      return xAxis && yAxis;
    }

    const func = (e: any) => {
      const pos = new Vector(
        node.position.x - node.layer.view.position.x,
        node.position.y - node.layer.view.position.y,
      );
      const point = new Vector(e.pageX - this.offset.x, e.pageY - this.offset.y);
      const size = 'dh' in node && 'dw' in node ? new Vector(node.dw, node.dh) : node.size;

      const isInside = isPointInside(point, pos, size);
      if (isInside) callback(e);
    };

    node.events.push(['click', func]);

    node.layer.canvas.addEventListener('click', func);
  }
}
