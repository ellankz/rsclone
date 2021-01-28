import Engine from '../../engine';
import ModalWindow from '../mechanics/ModalWindow';

export default class LooseScene {
  private engine: Engine;

  private message: any;

  public modalWindow: ModalWindow;

  private bg: any;

  private restartCallback: () => void;

  private exitCallback: () => void;

  constructor(engine: Engine, restart: () => void, exit: () => void) {
    this.engine = engine;
    this.restartCallback = restart;
    this.exitCallback = exit;
  }

  public init() {
    this.createBg();
    this.createLooseMessage();
    this.engine.audioPlayer.stopSound('levelMain');
    this.engine.audioPlayer.playSound('losegame');
    this.engine.audioPlayer.playSound('scream');

    const windowTimeout = this.engine.timeout(() => {
      this.message.destroy();
      this.createModalWindow();
    }, 5100);

    const restartTimeout = this.engine.timeout(() => {
      this.restartLevel();
    }, 100);

    const timer = this.engine
      .timer([windowTimeout, restartTimeout], true)
      .finally(() => {
        timer.destroy();
      })
      .start();

    return this;
  }

  private createBg() {
    const INTERVAL = 0.005;
    let opacity = 0;
    let timeInterval = INTERVAL;

    this.bg = this.engine
      .createNode(
        {
          type: 'RectNode',
          position: this.engine.vector(0, 0),
          size: this.engine.vector(this.engine.size.x, this.engine.size.y),
          layer: 'top',
          color: `rgba(0, 0, 0, ${opacity})`,
        },
        () => {
          if (opacity >= 0.5) {
            timeInterval = 0;
            this.bg.color = `rgba(0, 0, 0, ${opacity})`;
          } else {
            opacity += timeInterval;
            this.bg.color = `rgba(0, 0, 0, ${opacity})`;
          }
        },
      )
      .addTo('scene');
  }

  private createLooseMessage() {
    function getRandomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const img = this.engine.loader.files[
      'assets/images/interface/the_zombies_ate_your_brains.png'
    ] as HTMLImageElement;
    let randomNumberOne = 0;
    let randomNumberTwo = 0;
    let frames = 0;

    this.message = this.engine
      .createNode(
        {
          type: 'ImageNode',
          dh: 10,
          position: this.engine.vector(
            this.engine.size.x / 2 - img.width / 2,
            this.engine.size.y / 2 - img.height / 2,
          ),
          size: this.engine.vector(this.engine.size.x, this.engine.size.y),
          layer: 'window',
          img,
        },
        () => {
          if (this.message.dh < 500) {
            this.message.position = this.engine.vector(
              this.engine.size.x / 2 - this.message.dh / 2,
              this.engine.size.y / 2 - this.message.dh / 2 + 70,
            );
            this.message.dh += 10;
            this.message.dw += 20;
          } else {
            randomNumberOne = getRandomNumber(-1, 1);
            randomNumberTwo = getRandomNumber(-1, 1);

            frames += 1;

            if (frames % 6 === 0) {
              this.message.position = this.engine.vector(
                this.engine.size.x / 2 - this.message.dh / 2 - randomNumberOne,
                this.engine.size.y / 2 - this.message.dh / 2 + 70 - randomNumberTwo,
              );
            }
            if (frames > 60) frames = 0;
          }
        },
      )
      .addTo('scene');
  }

  private createModalWindow() {
    this.modalWindow = new ModalWindow(this.engine, 'game over', 'try again');
    this.modalWindow.draw();
  }

  private restartLevel() {
    this.engine.on(this.modalWindow.buttonNode, 'click', () => {
      this.restartCallback();
      this.bg.destroy();
    });
    this.engine.on(this.modalWindow.exitButtonNode, 'click', () => {
      this.exitCallback();
      this.bg.destroy();
    });
  }
}
