import Engine from '../engine';
import ModalWindow from '../game/ModalWindow';

const messageUrl = require('../assets/images/interface/zombies_ate_your_brain.png');

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    let randomNumberOne = 0;
    let randomNumberTwo = 0;
    let frames = 0;

    const message: any = this.engine.createNode(
      {
        type: 'ImageNode',
        dh: 10,
        position: this.engine.vector(
          (this.engine.size.x / 2) - (this.bgImage.width / 2),
          (this.engine.size.y / 2) - (this.bgImage.height / 2),
        ),
        size: this.engine.vector(this.engine.size.x, this.engine.size.y),
        layer: 'top',
        img: this.bgImage,
      }, () => {
        if (message.dh < 500) {
          message.clearLayer();
          message.position = this.engine.vector(
            (this.engine.size.x / 2) - message.dh / 2,
            (this.engine.size.y / 2) - message.dh / 2 + 70,
          );
          message.dh += 10;
          message.dw += 20;
        } else {
          randomNumberOne = getRandomNumber(-2, 2);
          randomNumberTwo = getRandomNumber(-2, 2);

          frames += 1;

          if (frames % 5 === 0) {
            message.position = this.engine.vector(
              (this.engine.size.x / 2) - message.dh / 2 - randomNumberOne,
              (this.engine.size.y / 2) - message.dh / 2 + 70 - randomNumberTwo,
            );
          }
          if (frames > 60) frames = 0;

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
    this.modalWindow = new ModalWindow(this.engine, 'game over', 'try again');
    this.modalWindow.draw();
  }
}
