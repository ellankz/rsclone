import { time } from 'console';
import Engine from '../../engine';
import ModalWindow from '../../game/ModalWindow';

export default class LooseScene {
  private engine: Engine;

  private message: any;

  public modalWindow: ModalWindow;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public init() {
    this.createLooseMessage();
    setTimeout(() => {
      this.message.destroy();
      this.createModalWindow();
    }, 5100);

    return this;
  }

  private createLooseMessage() {
    function getRandomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const img = this.engine.loader.files['assets/images/interface/the_zombies_ate_your_brains.png'] as HTMLImageElement;
    let randomNumberOne = 0;
    let randomNumberTwo = 0;
    let frames = 0;

    this.message = this.engine.createNode(
      {
        type: 'ImageNode',
        dh: 10,
        position: this.engine.vector(
          (this.engine.size.x / 2) - (img.width / 2),
          (this.engine.size.y / 2) - (img.height / 2),
        ),
        size: this.engine.vector(this.engine.size.x, this.engine.size.y),
        layer: 'window',
        img,
      }, () => {
        if (this.message.dh < 500) {
          this.message.position = this.engine.vector(
            (this.engine.size.x / 2) - this.message.dh / 2,
            (this.engine.size.y / 2) - this.message.dh / 2 + 70,
          );
          this.message.dh += 10;
          this.message.dw += 20;
        } else {
          randomNumberOne = getRandomNumber(-1, 1);
          randomNumberTwo = getRandomNumber(-1, 1);

          frames += 1;

          if (frames % 6 === 0) {
            this.message.position = this.engine.vector(
              (this.engine.size.x / 2) - this.message.dh / 2 - randomNumberOne,
              (this.engine.size.y / 2) - this.message.dh / 2 + 70 - randomNumberTwo,
            );
          }
          if (frames > 60) frames = 0;
        }
      },
    ).addTo('scene');
  }

  private createModalWindow() {
    this.modalWindow = new ModalWindow(this.engine, 'game over', 'try again');
    this.modalWindow.draw();
  }

  public restartLevel(restart: () => void) {
    setTimeout(() => {
      this.engine.on(this.modalWindow.buttonNode, 'click', () => {
        restart();
      });
    }, 5200);
  }
}
