import Vector from './core/Vector';
import Scene from './core/Scene';
import Layer from './core/Layer';
import RectNode from './nodes/RectNode';
import CircleNode from './nodes/CircleNode';
import ImageNode from './nodes/ImageNode';
import SpriteNode from './nodes/SpriteNode';
import TextNode from './nodes/TextNode';
import {
  CircleNodeConfig,
  ImageNodeConfig,
  SpriteNodeConfig,
  TextNodeConfig,
  NodeConfig,
  NodesType,
  NodesTypeName,
  InputNodeConfig,
  ISpriteNode,
} from './types';
import View from './core/View';
import Event from './core/Event';
import Loader from './core/Loader';
import AudioPlayer from './core/AudioPlayer';
import InputNode from './nodes/InputNode';
import Timeout from './TimeManager/Timeout';
import Interval from './TimeManager/Interval';
import Timer from './TimeManager/Timer';

export default class Engine {
  size: Vector;

  containerOffset: Vector;

  screens: { [name: string]: Layer[] };

  layers: { [name: string]: Layer };

  activeScreen: string;

  screenZIndex: number;

  events: { [event: string]: { [option: string]: any } };

  container: HTMLElement;

  loader: Loader;

  audioPlayer: any;

  shadows: { enabled: boolean };

  vector: (x?: number, y?: number) => Vector;

  timeout: (callback: () => void, timeout: number, repeat?: number) => Timeout;

  interval: (callback: () => void, interval: number, repeat?: number) => Interval;

  private running: boolean;

  private scenes: { [name: string]: Scene };

  private activeScene: Scene;

  private animation: number;

  private event: Event;

  private scaleRatio: number;

  private fullscreenMode: boolean;

  private resizeCallback: () => void;

  private timers: { [name: string]: Timer };

  private spriteNodes: ISpriteNode[];

  constructor(
    _box: string | HTMLElement,
    config?: string[] | { [name: string]: string[] },
    screenZIndex?: number,
  ) {
    this.size = null;
    this.containerOffset = null;
    this.activeScreen = '';
    this.activeScene = null;
    this.screenZIndex = screenZIndex || 100;
    this.running = false;
    this.events = {};
    this.spriteNodes = [];

    this.screens = {};
    this.layers = {};
    this.scenes = {};
    this.timers = {};
    this.event = null;
    this.animation = null;
    this.fullscreen = false;
    this.shadows = { enabled: true };
    this.scaleRatio = 1;

    this.vector = (x?: number, y?: number) => new Vector(x, y);

    this.timeout = (callback: () => void, timeout: number, repeat?: number) => {
      const newTimeout = new Timeout(callback, timeout, repeat);
      return newTimeout;
    };

    this.interval = (callback: () => void, interval: number, repeat?: number) => {
      const newInterval = new Interval(callback, interval, repeat);
      return newInterval;
    };

    this.init(_box, config);
  }

  // Events
  public on(node: NodesType, event: string, callback: (e: any) => void) {
    return this.event.addEvent(node, event, callback);
  }

  public off(node: NodesType, event: string, callback: (e: any) => void) {
    return this.event.removeEvent(node, event, callback);
  }

  // Init
  public init(_box: string | HTMLElement, config?: string[] | { [name: string]: string[] }) {
    this.container = typeof _box === 'string' ? document.getElementById(_box) : _box;
    this.container.style.position = 'relative';

    const box: DOMRect = this.container.getBoundingClientRect();

    this.containerOffset = this.vector(box.left, box.top);
    this.size = this.vector(box.width, box.height);

    this.event = new Event(this.containerOffset, this);

    if (!config) {
      this.createLayer('main', 0);
    } else if (!Array.isArray(config)) {
      Object.keys(config).forEach((screen) => {
        const layers = config[screen];
        if (!layers || layers.length <= 0) return;

        layers.forEach((layer) => this.createLayer(layer));
        this.createScreen(screen, layers);
      });

      const topScreen = Object.keys(this.screens)[Object.keys(this.screens).length - 1];
      this.setScreen(topScreen);
    } else if (config.length > 0) {
      config.forEach((layer, i) => {
        this.createLayer(layer, i);
      });
    }
  }

  //   Engine
  public start(name: string) {
    if (this.running) return;
    this.running = this.setScene(name);
    if (this.running) {
      this.spriteNodes.forEach((node) => node.resume());
      this.updateScene();
    }
  }

  public stop() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.animation);
    this.spriteNodes.forEach((node) => node.pause());
  }

  private updateScene() {
    if (!this.running) return;
    this.activeScene.clear();
    this.activeScene.updateNodes();
    this.activeScene.update();
    this.activeScene.drawNodes();
    this.activeScene.draw();
    if (this.running) {
      this.animation = requestAnimationFrame(this.updateScene.bind(this));
    }
  }

  // Screens
  public createScreen(name: string, layersNames: string[]) {
    if (this.screens[name] || !layersNames || layersNames.length <= 0) return;

    const layers = layersNames.map((layerName) => {
      const layer = this.layers[layerName];
      layer.screen = name;
      return layer;
    });

    this.screens[name] = layers;
  }

  public setScreen(name: string) {
    if (!this.screens[name]) return;

    if (this.activeScreen) {
      const lastLayers = this.screens[this.activeScreen];
      lastLayers.forEach((layer) => {
        const { canvas } = layer;
        canvas.style.zIndex = (+layer.canvas.style.zIndex - 100).toString();
      });
    }

    const layers = this.screens[name];
    layers.forEach((layer) => {
      const { canvas } = layer;
      canvas.style.zIndex = (+layer.canvas.style.zIndex + 100).toString();
    });

    this.activeScreen = name;
    if (this.fullscreenMode) this.setFullscreen();
  }

  // Layers
  public createLayer(name: string, index?: number) {
    if (this.layers[name]) return;
    const idx = index && index !== 0 ? index : Object.keys(this.layers).length;
    const layer = new Layer(idx as number, this.size, this.container, this.shadows);
    this.layers[name] = layer;

    layer.update = () => {
      if (layer.isUpdated) return;
      layer.nodes.forEach((node) => {
        if (!this.activeScene || !this.activeScene.scene.nodes.includes(node)) {
          node.draw();
        }
      });
      layer.isUpdated = true;
    };
  }

  public getLayer(name: string) {
    return this.layers[name];
  }

  //   Scenes
  public createScene(name: string, Construct?: any) {
    if (this.scenes[name]) return;
    this.scenes[name] = new Scene(Construct ? new Construct() : {});
  }

  public getSceneNodes(name: string) {
    if (!name || !this.scenes[name]) return null;
    return this.scenes[name].scene.nodes;
  }

  private setScene(name: string) {
    if (!name || !this.scenes[name]) return false;

    if (this.activeScene) {
      this.activeScene.exit();
    }

    this.activeScene = this.scenes[name];
    this.activeScene.init();
    return true;
  }

  //   Nodes
  private static createNodeType(params: NodeConfig, update?: (node: NodesType) => void) {
    const { type } = params as { type: NodesTypeName };

    switch (type) {
      case 'RectNode': {
        return new RectNode(params, update);
      }
      case 'CircleNode': {
        return new CircleNode(params as CircleNodeConfig, update);
      }
      case 'TextNode': {
        return new TextNode(params as TextNodeConfig, update);
      }
      case 'ImageNode': {
        return new ImageNode(params as ImageNodeConfig, update);
      }
      case 'SpriteNode': {
        return new SpriteNode(params as SpriteNodeConfig, update);
      }
      case 'InputNode': {
        return new InputNode(params as InputNodeConfig, update);
      }

      default:
        break;
    }
    return null;
  }

  public createNode(params: any, update?: (node: NodesType) => void) {
    const layer = this.layers[params.layer];
    const config: NodeConfig = { ...params, layer };
    const node = Engine.createNodeType(config, update) as NodesType;

    if (!node) return null;

    if (node instanceof SpriteNode) {
      this.spriteNodes.push(node);
    }

    layer.nodes.push(node);

    node.draw();

    function addTo(sceneName: string) {
      if (!sceneName) return null;
      if (node.sceneName) {
        const sceneNodes = this.scenes[node.sceneName].scene.nodes;
        const sceneIdx = sceneNodes.indexOf(node);
        if (sceneIdx !== -1) {
          sceneNodes.splice(sceneIdx, 1);
        }
      }
      node.sceneName = sceneName;
      const curScene = this.scenes[sceneName];
      if (!curScene) return null;
      curScene.scene.nodes.push(node);
      return node;
    }

    function destroy() {
      if (node.sceneName) {
        const sceneNodes = this.scenes[node.sceneName].scene.nodes;
        const sceneIdx = sceneNodes.indexOf(node);
        if (sceneIdx !== -1) {
          sceneNodes.splice(sceneIdx, 1);
        }
      }
      const layerIdx = node.layer.nodes.indexOf(node);
      if (layerIdx !== -1) {
        node.layer.nodes.splice(layerIdx, 1);
        node.clearLayer();
      }
      if (node instanceof SpriteNode) {
        node.interval.destroy();
      }
      node.removeAllEvents();
    }

    node.removeAllEvents = () => this.event.removeAllEvents(node);

    node.addTo = addTo.bind(this);
    node.destroy = destroy.bind(this);

    return node;
  }

  //   View
  public createView(layersNames: string[]) {
    const layers: Layer[] = layersNames.map((name) => this.layers[name]);
    if (layers.every((layer) => !layer === false)) {
      return new View(layers);
    }
    return null;
  }

  // Loader

  public preloadFiles(
    beforeLoadCB: () => Promise<void>,
    loadedOneCB: (percent: number) => void,
    afterLoadCB: () => void,
  ) {
    this.loader = new Loader(beforeLoadCB, loadedOneCB, afterLoadCB);
    this.loader.init();
  }

  // AudioPlayer
  public addAudio(soundList: { [dynamic: string]: string }) {
    this.audioPlayer = new AudioPlayer(soundList, this.loader);
    this.audioPlayer.init();
  }

  // fullscreen
  public get fullscreen() {
    return this.fullscreenMode;
  }

  public set fullscreen(value: boolean) {
    if (this.fullscreenMode !== value) {
      this.fullscreenMode = value;
      this.setContainerPosition(value);

      const callback = this.setFullscreen.bind(this);

      if (value) {
        this.resizeCallback = callback;
        this.setFullscreen();
        window.addEventListener('resize', callback);
      } else {
        this.cancelFullscreen();
        if (this.resizeCallback) {
          window.removeEventListener('resize', callback);
        }
      }
    }
  }

  private setFullscreen() {
    if (!this.container) return;
    let scaleRatio = 1;

    const gameAspectRatio = this.size.x / this.size.y;
    const documentWidth = document.documentElement.clientWidth;
    const documentHeight = document.documentElement.clientHeight;
    const windowAspectRatio = documentWidth / documentHeight;

    if (windowAspectRatio > gameAspectRatio) {
      scaleRatio = documentHeight / this.size.y;
    } else {
      scaleRatio = documentWidth / this.size.x;
    }
    this.scaleRatio = scaleRatio;
    this.event.scaleRatio = this.scaleRatio;

    const layers = Object.values(this.layers);

    this.container.style.width = `${this.size.x * this.scaleRatio}px`;
    this.container.style.height = `${this.size.y * this.scaleRatio}px`;

    const box = this.container.getBoundingClientRect();
    const offset = new Vector(box.left, box.top);
    const size = new Vector(box.width, box.height);

    this.event.offset = offset;

    layers.forEach((layer) => {
      layer.resize(scaleRatio, size);
      layer.clear();
      layer.update();
    });
  }

  private cancelFullscreen() {
    if (!this.container) return;
    const scaleRatio = 1;
    const layers = Object.values(this.layers);

    this.container.style.width = `${this.size.x}px`;
    this.container.style.height = `${this.size.y}px`;

    this.event.offset = this.containerOffset;

    layers.forEach((layer) => {
      layer.resize(scaleRatio, this.size);
      layer.clear();
      layer.update();
    });

    this.event.offset = this.containerOffset;
    this.event.scaleRatio = 1;
  }

  get scale() {
    return this.scaleRatio;
  }

  private setContainerPosition(isFullscreen: boolean) {
    if (this.container) {
      if (isFullscreen) {
        this.container.style.top = '50%';
        this.container.style.left = '50%';
        this.container.style.transform = 'translate(-50%, -50%)';
        this.container.style.position = 'fixed';
        document.body.style.overflow = 'hidden';
      } else {
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.transform = 'none';
        this.container.style.position = 'relative';
        document.body.style.overflow = 'auto';
      }
    }
  }

  // Timers
  timer(timers: (string | Timeout | Interval | Timer)[], sequentially?: boolean, name?: string) {
    const targetTimers = timers
      .map((elem) => {
        if (typeof elem === 'string') {
          return this.timers[elem];
        }
        return elem;
      })
      .filter((elem) => elem);

    const timer = new Timer(targetTimers, sequentially);
    if (name) {
      if (this.timers[name]) this.timers[name].destroy();
      this.timers[name] = timer;
    }
    return timer;
  }

  getTimer(name: string) {
    return this.timers[name] || null;
  }
}
