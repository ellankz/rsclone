export interface Engine {
  size: IVector;
  canvasOffset: IVector;
  layers: { [key: string]: ILayer };
  container: HTMLElement;

  vector: (x?: number, y?: number) => IVector;

  init: (_box: string | HTMLElement, layersConfig?: string[]) => void;
  start: (name: string) => void;
  stop: () => void;

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
  | 'SpriteNode';
export type NodesType = IImageNode | IRectNode | ICircleNode | ISpriteNode | ITextNode;

export interface INode {
  position: IVector;
  size: IVector;
  type: NodesTypeName;
  layer: ILayer;
  sceneName: string;
  border?: string;

  events: [string, (e: any) => void][];

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

  draw: () => void;
  innerUpdate: () => void;
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
  offset: IVector;
  view: IView;
  nodes: NodesType[];

  drawRect: (RectConfig: any) => void;
  drawCircle: (CircleConfig: any) => void;
  drawText: (TextConfig: any) => void;
  drawImage: (ImageConfig: any) => void;
  clear: () => void;
  update: () => void;
}

export interface IView {
  position: IVector;
  layers: ILayer[];

  move: (IVector: any) => void;
  getPosition: (IVector: any) => IVector;
}

export interface NodeConfig {
  position: IVector;
  size: IVector;
  type: NodesTypeName;
  layer: ILayer;
  border?: string;
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
}

export interface RectConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  border?: string;
}

export interface CircleConfig {
  x: number;
  y: number;
  radius: number;
  color?: string;
  border?: string;
}

export interface TextConfig {
  x: number;
  y: number;
  text: string;
  font?: string;
  size?: number;
  color?: string;
  border?: string;
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
}

export interface SceneConfig {
  layer: ILayer;
  nodes: NodesType[];

  init?: () => void;
  update?: () => void;
  draw?: () => void;
  exit?: () => void;
}
