import Engine from '../engine';
import ModalWindow from '../game/ModalWindow';

const messageUrl = require('../assets/images/interface/zombies_ate_your_brain.png');

export default class LooseScene {
  private engine: Engine;

  private bgImage: HTMLImageElement;

  private modalWindow: ModalWindow;

  constructor(engine: Engine) {
    this.engine = engine;
    this.bgImage = new Image();
  }

  public init() {
    this.createLooseMessage();
    setTimeout(() => {
      this.createModalWindow();
    }, 5500);

    return this;
  }

  private createLooseMessage() {
    this.bgImage.src = messageUrl.default;
    this.engine.createScene('animation');

    const message: any = this.engine.createNode(
      {
        type: 'ImageNode',
        dh: 10,
        position: this.engine.vector((this.engine.size.x / 2) - (this.bgImage.width / 2), this.engine.size.y / 2 - (this.bgImage.height / 2)),
        size: this.engine.vector(this.engine.size.x, this.engine.size.y),
        layer: 'top',
        img: this.bgImage,
      }, () => {
        if (message.dh < 500) {
          message.clearLayer();
          message.position = this.engine.vector(
            (this.engine.size.x / 2) - message.dh / 2,
            (this.engine.size.y / 2) - message.dh / 2 + 50,
          );
          message.dh += 10;
          message.dw += 20;
        } else {
          setTimeout(() => {
            message.destroy();
            message.clearLayer();
          }, 5000);
        }
      },
    ).addTo('animation');

    this.engine.stop();
    this.engine.start('animation');
    if (message.dh >= 500) this.engine.stop();
  }

  private createModalWindow() {
    this.modalWindow = new ModalWindow(this.engine);
    this.modalWindow.draw();
  }
}
