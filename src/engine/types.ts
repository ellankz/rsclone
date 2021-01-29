export interface Engine {
  size: IVector;
  containerOffset: IVector;
  screens: { [name: string]: ILayer[] };
  activeScreen: string;
  layers: { [name: string]: ILayer };
  container: HTMLElement;
  events: { [event: string]: { [option: string]: any } };
  fullscreen: boolean;
  readonly scale: number;

  vector: (x?: number, y?: number) => IVector;
  timeout: (callback: () => void, timeout: number, repeat?: number) => ITimeout;
  interval: (callback: () => void, interval: number, repeat?: number) => IInterval;
  timer: (
    timers: (string | ITimeout | IInterval | ITimer)[],
    sequentially?: boolean,
    name?: string,
  ) => ITimer;

  on: (node: NodesType, event: string, callback: (e: any) => void) => boolean;
  off: (node: NodesType, event: string, callback: (e: any) => void) => boolean;

  init: (_box: string | HTMLElement, config?: string[] | { [name: string]: string[] }) => void;
  start: (name: string) => void;
  stop: () => void;

  createScreen: (name: string, layersNames: string[]) => void;
  setScreen: (name: string) => void;

  createLayer: (name: string, index: number) => void;
  getLayer: (name: string) => ILayer;

  createScene: (name: string, Construct?: any) => void;
  getSceneNodes: (name: string) => NodesType[];

  createNode: (params: any, update?: () => void) => NodesType;

  createView: (layersNames: string[]) => IView;
}

export interface IVector {
  x: number;
  y: number;

  plus: (IVector: any) => IVector;
  minus: (IVector: any) => IVector;
}

export type NodesTypeName =
  | 'Node'
  | 'RectNode'
  | 'CircleNode'
  | 'TextNode'
  | 'ImageNode'
  | 'SpriteNode'
  | 'InputNode';

export type NodesType = IImageNode | IRectNode | ICircleNode | ISpriteNode | ITextNode | IInputNode;

export interface INode {
  position: IVector;
  size: IVector;
  type: NodesTypeName;
  layer: ILayer;
  sceneName: string;
  border?: string;
  opacity?: number;
  filter?: string;
  shadow?: string;
  name?: string;

  removeEventBubbling: string[];

  move: (IVector: any) => void;
  addTo: (sceneName: string) => NodesType;
  update?: (node: NodesType) => void;
  destroy: () => void;
  removeAllEvents: () => void;
  clearLayer: () => void;
}

export interface IRectNode extends INode {
  color: string;

  draw: () => void;
}

export interface ICircleNode extends INode {
  color: string;
  radius: number;

  draw: () => void;
  innerUpdate: () => void;
}

export interface ITextNode extends INode {
  color: string;
  font: string;
  fontSize: number;
  text: string;

  draw: () => void;
}

export interface IImageNode extends INode {
  img: HTMLImageElement;
  srcX: number;
  srcY: number;
  dh: number;
  dw: number;

  draw: () => void;
}

export interface SpriteStatesConfig {
  [dynamic: string]: {
    img: HTMLImageElement;
    frames: number;
    speed?: number;
    dh?: number;
    startFrame?: number;
    positionAdjust?: IVector;
    size?: IVector;
    repeat?: number;
  };
}

export interface ISpriteNode extends INode {
  img: HTMLImageElement;
  dh: number;
  dw: number;
  srcX: number;
  srcY: number;
  frameW: number;
  frameH: number;
  frames: number;
  startFrame: number;
  speed: number;
  interval: IInterval;

  readonly currentState: string;

  pause: () => void;
  resume: () => void;
  then: (callback: () => void) => void;
  draw: () => void;
  innerUpdate: () => void;
  switchState: (state: string) => void;
}

export interface IInputNode extends INode {
  input: any;
  placeholder: string;
  draw: () => void;
}

export interface IScene {
  scene: SceneConfig;

  init: () => void;
  updateNodes: () => void;
  update: () => void;
  draw: () => void;
  drawNodes: () => void;
  exit: () => void;
  clear: () => void;
}

export interface ILayer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  size: IVector;
  view: IView;
  nodes: NodesType[];
  screen: string;
  removeEventBubbling: string[];
  isUpdated: boolean;

  toTop: (n?: number) => void;
  toBack: (n?: number) => void;

  drawRect: (RectConfig: any) => void;
  drawCircle: (CircleConfig: any) => void;
  drawText: (TextConfig: any, node: ITextNode) => void;
  drawImage: (ImageConfig: any) => void;
  clear: () => void;
  update: () => void;

  resize: (scaleRatio: number, size: IVector) => void;
}

export interface IView {
  position: IVector;
  layers: ILayer[];

  move: (IVector: any) => void;
  getPosition: (IVector: any) => IVector;
}

export interface ITimeout {
  isStarted: boolean;
  isPaused: boolean;
  isDestroyed: boolean;
  isFinished: boolean;
  parentTimer: ITimer;

  start: () => ITimeout;
  pause: () => void;
  resume: () => void;
  destroy: () => void;

  before: (callback: () => void) => ITimeout;
  then: (callback: () => void) => ITimeout;
  finally: (callback: () => void) => ITimeout;
}

export interface IInterval {
  isStarted: boolean;
  isPaused: boolean;
  isDestroyed: boolean;
  isFinished: boolean;
  parentTimer: ITimer;

  start: () => IInterval;
  pause: () => void;
  resume: () => void;
  destroy: () => void;

  before: (callback: () => void) => IInterval;
  then: (callback: () => void) => IInterval;
  finally: (callback: () => void) => IInterval;
}

export interface ITimer {
  isStarted: boolean;
  isPaused: boolean;
  isDestroyed: boolean;
  isFinished: boolean;
  parentTimer: ITimer;

  add: (timer: ITimeout | IInterval | ITimer) => ITimer;
  remove: (timer: ITimeout | IInterval | ITimer) => ITimer;

  start: () => ITimer;
  pause: () => void;
  resume: () => void;
  destroy: () => void;

  before: (callback: () => void) => ITimer;
  finally: (callback: () => void) => ITimer;
}

export interface NodeConfig {
  position: IVector;
  size: IVector;
  type: NodesTypeName;
  layer: ILayer;
  border?: string;
  opacity?: number;
  filter?: string;
  shadow?: string;
  name?: string;
  removeEventBubbling?: string[];
}

export interface RectNodeConfig extends NodeConfig {
  color?: string;
}

export interface CircleNodeConfig extends NodeConfig {
  color?: string;
  radius: number;
}

export interface TextNodeConfig extends NodeConfig {
  color?: string;
  font?: string;
  fontSize?: number;
  text: string;
}

export interface ImageNodeConfig extends NodeConfig {
  img: HTMLImageElement;
  srcPosition?: IVector;
  dh?: number;
}

export interface SpriteNodeConfig extends NodeConfig {
  img: HTMLImageElement;
  dh?: number;
  frames: number;
  startFrame?: number;
  speed?: number;
  states: SpriteStatesConfig;
  name?: string;
  repeat?: number;
}

export interface InputNodeConfig extends NodeConfig {
  placeholder: string;
}

export interface RectConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  border?: string;
  opacity?: number;
  filter?: string;
}

export interface CircleConfig {
  x: number;
  y: number;
  radius: number;
  color?: string;
  border?: string;
  opacity?: number;
  filter?: string;
}

export interface TextConfig {
  x: number;
  y: number;
  text: string;
  font?: string;
  size?: number;
  color?: string;
  border?: string;
  opacity?: number;
  filter?: string;
}

export interface ImageConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  img: HTMLImageElement;
  srcX: number;
  srcY: number;
  dh: number;
  dw: number;
  border?: string;
  opacity?: number;
  filter?: string;
  shadow?: string;
}

export interface SceneConfig {
  layer: ILayer;
  nodes: NodesType[];

  init?: () => void;
  update?: () => void;
  draw?: () => void;
  exit?: () => void;
}
