import Engine from '../../engine';

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

  protected setEvent(node: any, event: string, callback: () => void):void {
    this.engine.on(node, event, callback);
  }

  protected setActive(button: any, active: string, nonActive: string): void {
    const copyButton = button;
    this.engine.on(copyButton, 'mousedown', () => {
      copyButton.img.src = active;
      copyButton.clearLayer();
    });

    this.engine.on(copyButton, 'mouseup', () => {
      copyButton.img.src = nonActive;
      copyButton.clearLayer();
    });
  }
}
