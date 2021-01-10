import Engine from '../engine';

export class ScreenCreator {
  protected engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public openScreen(screen: string, scene: string): void {
    this.engine.stop();
    this.engine.setScreen(screen);
    this.engine.start(screen);
  }

  protected createLayers(layers: Array<string>): void {
    layers.forEach((layer: string) => this.engine.createLayer(layer));
  }

  public static createImg(src: string): HTMLImageElement {
    const imageElement: HTMLImageElement = new Image();
    imageElement.src = src;
    return imageElement;
  }

  protected setEvent(node: any, event: string, callback: () => void):void {
    this.engine.on(node, event, callback);
  }
}
