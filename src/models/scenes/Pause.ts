import Engine from '../../engine';
import ModalWindow from '../../game/ModalWindow';

export default class LooseScene {
  private engine: Engine;

  public modalWindow: ModalWindow;

  private bg: any;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public init() {
    this.createBg();
    this.createModalWindow();
    return this;
  }

  private createBg() {
    this.bg = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: 'window',
      color: 'rgba(0, 0, 0, 0.5)',
    }).addTo('scene');
  }
 

  private createModalWindow() {
    this.modalWindow = new ModalWindow(this.engine, 'game paused', 'resume game');
    this.modalWindow.draw();
  }

  public resumeGame(resume: () => void, exit: () => void) {
    setTimeout(() => {
      this.engine.on(this.modalWindow.buttonNode, 'click', () => {
        resume();
        this.bg.destroy();
      });
      this.engine.on(this.modalWindow.exitButtonNode, 'click', () => {
        this.engine.audioPlayer.stopSound('menu');
        exit();
        this.bg.destroy();
      });
    }, 100);
  }
}
