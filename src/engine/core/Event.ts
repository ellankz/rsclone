import { NodesType } from '../types';
import Vector from './Vector';
import View from './View';

export default class Event {
  view: View;

  offset: Vector;

  constructor(view: View, offset: Vector) {
    this.view = view;
    this.offset = offset;
  }

  handle(node: NodesType, event: string, callback: () => void) {
    switch (event) {
      case 'click': {
        this.onClick(node, callback);
        break;
      }
      default:
        break;
    }
  }

  onClick(node: NodesType, callback: () => void) {
    function isPointInside(point: Vector, rectStart: Vector, size: Vector) {
      const xAxis = point.x >= rectStart.x && point.x <= rectStart.x + size.x;
      const yAxis = point.y >= rectStart.y && point.y <= rectStart.y + size.y;
      return xAxis && yAxis;
    }

    node.layer.canvas.addEventListener('click', (e) => {
      const pos = new Vector(
        node.position.x - this.view.position.x,
        node.position.y - this.view.position.y,
      );
      const point = new Vector(e.pageX - this.offset.x, e.pageY - this.offset.y);
      const size = 'dh' in node && 'dw' in node ? new Vector(node.dw, node.dh) : node.size;

      const isInside = isPointInside(point, pos, size);
      if (isInside) callback();
    });
  }
}
