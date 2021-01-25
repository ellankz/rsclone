import { SceneConfig, IScene } from '../types';

export default class Scene implements IScene {
  scene: SceneConfig;

  constructor(scene: SceneConfig) {
    this.scene = scene;
    if (!this.scene.nodes) {
      this.scene.nodes = [];
    }
  }

  public init() {
    if ('init' in this.scene) {
      this.scene.init();
    }
  }

  public updateNodes() {
    this.scene.nodes.forEach((node) => {
      if (!node) return;
      if ('innerUpdate' in node) node.innerUpdate();
      if ('update' in node) node.update(node);
    });
  }

  public update() {
    if ('update' in this.scene) {
      this.scene.update();
    }
  }

  public clear() {
    this.scene.nodes.forEach((node) => node.clearLayer());
  }

  public draw() {
    if ('draw' in this.scene) {
      this.scene.draw();
    }
  }

  public exit() {
    if ('exit' in this.scene) {
      this.scene.exit();
    }
  }

  public drawNodes() {
    this.scene.nodes.forEach((node) => {
      if (node && 'draw' in node) {
        node.draw();
      }
    });
  }
}
