import TextNode from '../nodes/TextNode';
import { Engine, NodesType, IVector } from '../types';
import Vector from './Vector';

export default class Event {
  offset: IVector;

  engine: Engine;

  hovered: NodesType[];

  eventsNames: string[];

  events: { [event: string]: Map<NodesType, ((e: any) => void)[]> };

  scaleRatio: number;

  private textNodes: TextNode[] = [];

  constructor(offset: IVector, engine: Engine) {
    this.offset = offset;
    this.engine = engine;
    this.events = {};
    this.hovered = [];

    this.eventsNames = ['click', 'mouseenter', 'mouseleave', 'mousedown', 'mouseup'];
    this.engine.events = {};
    this.eventsNames.forEach((event) => {
      if (event === 'mouseleave') {
        this.engine.events[event] = {};
      } else {
        this.engine.events[event] = { eventBubbling: false };
      }
    });

    this.scaleRatio = 1;
  }

  isPointInside(point: Vector, rectStart: Vector, size: Vector) {
    const targetPoint = new Vector(point.x / this.scaleRatio, point.y / this.scaleRatio);
    const xAxis = targetPoint.x >= rectStart.x && point.x / this.scaleRatio <= rectStart.x + size.x;
    const yAxis = targetPoint.y >= rectStart.y && point.y / this.scaleRatio <= rectStart.y + size.y;
    return xAxis && yAxis;
  }

  removeEvent(node: NodesType, event: string, callback: (e: any) => void) {
    if (this.events[event] && this.events[event].has(node)) {
      const callbacks = this.events[event].get(node);
      const idx = callbacks.indexOf(callback);
      if (idx !== -1) {
        callbacks.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  removeAllEvents(node: NodesType) {
    Object.values(this.events).forEach((nodes) => {
      if (nodes.has(node)) nodes.delete(node);
    });
  }

  addEvent(node: NodesType, event: string, callback: (e: any) => void) {
    if (!node || !callback || !this.eventsNames.includes(event)) return false;

    if (node instanceof TextNode && !this.textNodes.includes(node)) this.textNodes.push(node);

    const moveEvents = ['mouseenter', 'mouseleave'];

    if (!this.events[event]) {
      if (moveEvents.includes(event) && !moveEvents.some((eventName) => this.events[eventName])) {
        this.engine.container.addEventListener('mousemove', (e) => this.handle('mousemove', e));
        this.engine.container.addEventListener('mouseout', (e) => {
          if (this.events.mouseleave) {
            this.hovered.forEach((eventNode) => {
              if (this.events.mouseleave.has(eventNode)) {
                this.events.mouseleave.get(eventNode).forEach((cb) => cb(e));
              }
            });
            this.hovered = [];
          }
        });

        moveEvents.forEach((eventName) => {
          this.events[eventName] = new Map();
        });
      } else {
        this.engine.container.addEventListener(event, (e) => this.handle(event, e));
        this.events[event] = new Map();
      }
    }

    if (!this.events[event].get(node)) {
      this.events[event].set(node, []);
    }

    this.events[event].get(node).push(callback);
    return true;
  }

  private handle(event: string, e: any) {
    let options;
    let eventBubbling;

    if (event !== 'mousemove') {
      options = this.engine.events[event];
      eventBubbling = options ? options.eventBubbling : false;
    }

    let layers;
    if (this.engine.activeScreen) {
      layers = this.engine.screens[this.engine.activeScreen];
    } else {
      layers = Object.values(this.engine.layers);
    }

    layers = layers.slice().sort((a, b) => +a.canvas.style.zIndex - +b.canvas.style.zIndex);

    function checkNode(node: NodesType) {
      return !(node instanceof TextNode) || this.textNodes.includes(node);
    }

    const nodes: NodesType[] = layers
      .map((layer) => layer.nodes.filter((node) => checkNode.bind(this)(node)))
      .flat()
      .reverse();

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const layerEventBubbling = !node.layer.removeEventBubbling.includes(event);
      const nodeEventBubbling = !node.removeEventBubbling.includes(event);

      const pos = new Vector(
        node.position.x - node.layer.view.position.x,
        node.position.y - node.layer.view.position.y,
      );

      const point = new Vector(e.pageX - this.offset.x, e.pageY - this.offset.y);
      const size = 'dh' in node && 'dw' in node ? new Vector(node.dw, node.dh) : node.size;

      const isInside = this.isPointInside(point, pos, size);
      if (event === 'mousemove') {
        if (isInside) {
          options = this.engine.events.mouseenter;
          eventBubbling = options ? options.eventBubbling : false;

          if (this.events.mouseenter.has(node) && !this.hovered.includes(node)) {
            this.hovered.push(node);
            this.events.mouseenter.get(node).forEach((cb) => cb(e));
          }

          if (!this.hovered.includes(node) && !eventBubbling) {
            this.hovered.forEach((targetNode) => {
              if (this.events.mouseleave && this.events.mouseleave.has(targetNode)) {
                this.events.mouseleave.get(targetNode).forEach((cb) => cb(e));
              }
            });
            this.hovered = [];
          }

          if (!eventBubbling || !layerEventBubbling || !nodeEventBubbling) return;
        } else if (this.hovered.includes(node)) {
          this.hovered.splice(this.hovered.indexOf(node), 1);

          if (this.events.mouseleave && this.events.mouseleave.has(node)) {
            this.events.mouseleave.get(node).forEach((cb) => cb(e));
          }
        }
      } else if (isInside) {
        if (this.events[event].has(node)) {
          this.events[event].get(node).forEach((cb) => cb(e));
        }

        if (!eventBubbling || !layerEventBubbling || !nodeEventBubbling) return;
      }
    }
  }
}
