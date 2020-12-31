import Vector from './core/Vector';
import Scene from './core/Scene';
import Layer from './core/Layer';
import RectNode from './nodes/RectNode';
import CircleNode from './nodes/CircleNode';
import ImageNode from './nodes/ImageNode';
import SpriteNode from './nodes/SpriteNode';
import {
  CircleNodeConfig,
  ImageNodeConfig,
  SpriteNodeConfig,
  NodeConfig,
  SceneConfig,
  NodesType,
} from './types';
import View from './core/View';
import Event from './core/Event';

export default class Engine {
  size: Vector;

  canvasOffset: Vector;

  running: boolean;

  stopped: boolean;

  activeScene: Scene;

  layers: { [key: string]: Layer };

  scenes: { [key: string]: Scene };

  view: View;

  event: Event;

  container: HTMLElement;

  constructor(_box: string | HTMLElement, layersArray: string[]) {
    this.size = null;
    this.canvasOffset = null;
    this.activeScene = null;
    this.running = false;
    this.stopped = true;

    this.layers = {};
    this.scenes = {};

    this.view = new View(this.layers, this.scenes);
    this.event = null;

    this.init(_box, layersArray);
  }

  static vector(x?: number, y?: number) {
    return new Vector(x, y);
  }

  public on(node: NodesType, event: string, callback: () => void) {
    this.event.handle(node, event, callback);
  }

  // Init
  public init(_box: string | HTMLElement, layersArray: string[]) {
    this.container = typeof _box === 'string' ? document.getElementById(_box) : _box;

    const box: DOMRect = this.container.getBoundingClientRect();

    this.canvasOffset = Engine.vector(box.left, box.top);
    this.size = Engine.vector(box.width, box.height);

    this.event = new Event(this.view, this.canvasOffset);

    if (layersArray && layersArray.length > 0) {
      layersArray.forEach((layer, i) => {
        this.createLayer(layer, i);
      });
    } else {
      this.createLayer('main', 0);
    }
  }

  //   Engine
  public start(name: string) {
    if (this.running || !this.stopped) return;
    this.running = this.setScene(name);
    this.stopped = !this.running;
    if (this.running) {
      this.updateScene();
    }
  }

  public stop() {
    if (this.stopped && !this.running) return;
    this.stopped = true;
    this.running = false;
  }

  private updateScene() {
    this.activeScene.clear();
    this.activeScene.updateNodes();
    this.activeScene.update();
    this.activeScene.drawNodes();
    this.activeScene.draw();
    if (this.running) {
      requestAnimationFrame(this.updateScene.bind(this));
    }
  }

  // Layers
  public createLayer(name: string, index: number) {
    if (this.layers[name]) return;
    this.layers[name] = new Layer(index, this.size, this.container, this.canvasOffset, this.view);
  }

  public getLayer(name: string) {
    return this.layers[name];
  }

  //   Scenes
  public createScene(name: string, Construct: any) {
    if (this.scenes[name]) return;
    this.scenes[name] = new Scene(new Construct());
  }

  public setScene(name: string) {
    if (!name || !this.scenes[name]) return false;

    if (this.activeScene) {
      this.activeScene.exit();
    }

    this.activeScene = this.scenes[name];
    this.activeScene.init();
    return true;
  }

  //   Nodes
  private static createNodeType(params: NodeConfig) {
    switch (params.type) {
      case 'RectNode': {
        return new RectNode(params);
      }
      case 'CircleNode': {
        return new CircleNode(params as CircleNodeConfig);
      }
      case 'ImageNode': {
        return new ImageNode(params as ImageNodeConfig);
      }
      case 'SpriteNode': {
        return new SpriteNode(params as SpriteNodeConfig);
      }
      default:
        break;
    }
    return false;
  }

  public createNode(scene: SceneConfig, params: any) {
    const layer = this.layers[params.layer];
    const config: NodeConfig = { ...params, layer };
    const node = Engine.createNodeType(config) as NodesType;
    const curScene = scene;

    if (!curScene.nodes) {
      curScene.nodes = [];
    }
    curScene.nodes.push(node);

    if (!layer.nodes) {
      layer.nodes = [];
    }
    layer.nodes.push(node);

    return node;
  }
}
