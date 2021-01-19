import Engine from '../../engine';

export const TEXT_BUTTONS_COLOR: string = '#0daf1b';
export const TEXT_BUTTONS_FONT: string = 'Samdan';

export class ScreenCreator {
  protected engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public openScreen(screen: string, scene: string): void {
    this.engine.stop();
    this.engine.setScreen(screen);
    this.engine.start(scene);
  }

  protected createLayers(layers: Array<string>): void {
    layers.forEach((layer: string) => this.engine.createLayer(layer));
  }

  protected setEvent(node: any, event: string, callback: () => void): void {
    this.engine.on(node, event, callback);
  }

  protected setActive(button: any, active: string, nonActive: string): void {
    const copyButton = button;
    this.engine.on(copyButton, 'mousedown', () => {
      copyButton.img = this.engine.loader.files[active];
      copyButton.clearLayer();
    });

    this.engine.on(copyButton, 'mouseup', () => {
      copyButton.img = this.engine.loader.files[nonActive];
      copyButton.clearLayer();
    });
  }

  protected setLink(node: any, link: string): void {
    this.engine.on(node, 'click', () => {
      window.open(link, '_blank');
    });
  }
}
