import TextNode from '../nodes/TextNode';
import { Engine, NodesType, IVector } from '../types';

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

    this.eventsNames = ['click', 'mouseenter', 'mousemove', 'mouseup', 'mousedown'];
    this.engine.events = {};
    this.eventsNames.forEach((event) => {
      this.engine.events[event] = { eventBubbling: false };
    });

    this.scaleRatio = 1;
  }

  isPointInside(
    point: { x: number; y: number },
    rectStart: { x: number; y: number },
    size: { x: number; y: number },
  ) {
    const targetPoint = { x: point.x / this.scaleRatio, y: point.y / this.scaleRatio };
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
    if (!node || !callback) return false;

    const moveEvents = ['mouseenter', 'mouseleave'];

    if (!this.eventsNames.includes(event) && !moveEvents.includes(event)) return false;

    if (node instanceof TextNode && !this.textNodes.includes(node)) this.textNodes.push(node);

    if (!this.events[event]) {
      if (moveEvents.includes(event) && !moveEvents.some((eventName) => this.events[eventName])) {
        this.engine.container.addEventListener('mousemove', (e) => {
          this.handleMoveEvent('mousemove', e);
        });
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
        this.engine.container.addEventListener(event, (e) => this.handleClickEvent(event, e));
        this.events[event] = new Map();
      }
    }

    if (!this.events[event].get(node)) {
      this.events[event].set(node, []);
    }

    this.events[event].get(node).push(callback);
    return true;
  }

  private handleClickEvent(event: string, e: any) {
    const layers = this.getLayers();
    for (let i = 0; i < layers.length; i += 1) {
      const { nodes } = layers[i];
      if (nodes.length) {
        for (let j = nodes.length - 1; j >= 0; j -= 1) {
          const node = nodes[j];
          if (!(node instanceof TextNode && !this.textNodes.includes(node))) {
            const pos = {
              x: node.position.x - node.layer.view.position.x,
              y: node.position.y - node.layer.view.position.y,
            };

            const point = { x: e.pageX - this.offset.x, y: e.pageY - this.offset.y };
            const size = 'dh' in node && 'dw' in node ? { x: node.dw, y: node.dh } : node.size;

            const isInside = this.isPointInside(point, pos, size);

            if (isInside) {
              if (this.events[event].has(node)) this.events[event].get(node).forEach((cb) => cb(e));
              if (!this.engine.events[event].eventBubbling) return;
              if (node.layer.removeEventBubbling.includes(event)) return;
              if (node.removeEventBubbling.includes(event)) return;
            }
          }
        }
      }
    }
  }

  private handleMoveEvent(event: string, e: any) {
    const layers = this.getLayers();
    for (let i = 0; i < layers.length; i += 1) {
      const { nodes } = layers[i];
      if (nodes.length) {
        for (let j = nodes.length - 1; j >= 0; j -= 1) {
          const node = nodes[j];
          if (!(node instanceof TextNode && !this.textNodes.includes(node))) {
            const pos = {
              x: node.position.x - node.layer.view.position.x,
              y: node.position.y - node.layer.view.position.y,
            };

            const point = { x: e.pageX - this.offset.x, y: e.pageY - this.offset.y };
            const size = 'dh' in node && 'dw' in node ? { x: node.dw, y: node.dh } : node.size;

            const isInside = this.isPointInside(point, pos, size);
            if (isInside) {
              if (this.events.mouseenter.has(node) && !this.hovered.includes(node)) {
                this.hovered.push(node);
                this.events.mouseenter.get(node).forEach((cb) => cb(e));
              }

              if (!this.hovered.includes(node) && !this.engine.events[event].eventBubbling) {
                this.hovered.forEach((targetNode) => {
                  if (this.events.mouseleave && this.events.mouseleave.has(targetNode)) {
                    this.events.mouseleave.get(targetNode).forEach((cb) => cb(e));
                  }
                });
                this.hovered = [];
              }
              if (!this.engine.events[event].eventBubbling) return;
              if (node.layer.removeEventBubbling.includes(event)) return;
              if (node.removeEventBubbling.includes(event)) return;
            } else if (this.hovered.includes(node)) {
              this.hovered.splice(this.hovered.indexOf(node), 1);

              if (this.events.mouseleave && this.events.mouseleave.has(node)) {
                this.events.mouseleave.get(node).forEach((cb) => cb(e));
              }
            }
          }
        }
      }
    }
  }

  private getLayers() {
    let layers;
    if (this.engine.activeScreen) {
      layers = this.engine.screens[this.engine.activeScreen];
    } else {
      layers = Object.values(this.engine.layers);
    }

    return layers.sort((a, b) => +b.canvas.style.zIndex - +a.canvas.style.zIndex);
  }
}
