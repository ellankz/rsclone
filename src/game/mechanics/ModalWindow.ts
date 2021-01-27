import Engine from '../../engine';
import ImageNode from '../../engine/nodes/ImageNode';
import TextNode from '../../engine/nodes/TextNode';
import VolumeSetting from './VolumeSetting';

export default class ModalWindow {
  engine: Engine;

  bgImage: HTMLImageElement;

  button: HTMLImageElement;

  bgNode: ImageNode;

  buttonNode: ImageNode;

  textNode: TextNode;

  textNodeButton: TextNode;

  modalWindowText: string;

  textOnTheButton: string;

  exitButtonNode: ImageNode;

  exitButtonTextNode: TextNode;

  volume: VolumeSetting;

  fullScreenToggleButton: ImageNode;

  fullScreenToggleText: TextNode;

  shadowToggleButton: ImageNode;

  shadowToggleText: TextNode;

  buttonActive: HTMLImageElement;

  shiftX: number;

  constructor(engine: Engine, modalWindowText: string, textOnTheButton: string) {
    this.engine = engine;
    this.bgImage = this.engine.loader.files[
      'assets/images/interface/window.png'
    ] as HTMLImageElement;
    this.button = this.engine.loader.files[
      'assets/images/interface/Button.png'
    ] as HTMLImageElement;
    this.buttonActive = this.engine.loader.files[
      'assets/images/interface/ButtonActive.png'
    ] as HTMLImageElement;
    this.modalWindowText = modalWindowText;
    this.textOnTheButton = textOnTheButton;
    this.shiftX = this.engine.getLayer('window').view.position.x;
    this.volume = new VolumeSetting(this.engine);
  }

  public draw() {
    this.drawBG();
    this.drawButton();
    this.drawText();
    this.drawTextButton();
    this.drawExitButton();
    this.drawVolume();
    this.drawShadowToggle();
    this.addEventListenerToButton();
  }

  private drawText() {
    if (this.modalWindowText === 'game paused') {
      this.textNode = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          this.engine.size.x / 2 - 90 + this.shiftX,
          this.engine.size.y / 2 - 100,
        ),
        text: this.modalWindowText,
        layer: 'window',
        font: 'Samdan',
        fontSize: 50,
        color: '#d9bc6b',
      }) as TextNode;
    }

    if (this.modalWindowText === 'game over') {
      this.textNode = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          this.engine.size.x / 2 - 75 + this.shiftX,
          this.engine.size.y / 2 - 40,
        ),
        text: this.modalWindowText,
        layer: 'window',
        font: 'Samdan',
        fontSize: 50,
        color: '#d9bc6b',
      }) as TextNode;
    }
  }

  private drawBG() {
    this.bgNode = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        this.engine.size.x / 2 - this.bgImage.width / 2 + 70 + this.shiftX,
        this.engine.size.y / 2 - this.bgImage.height / 2 + 25,
      ),
      size: this.engine.vector(this.bgImage.width, this.bgImage.height),
      layer: 'window',
      img: this.bgImage,
      dh: 330,
    }) as ImageNode;
  }

  private drawButton() {
    this.buttonNode = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        this.engine.size.x / 2 - 135 + this.shiftX,
        this.engine.size.y / 2 + 95,
      ),
      size: this.engine.vector(this.button.width, this.button.height),
      layer: 'window',
      img: this.button,
      dh: 55,
    }) as ImageNode;
  }

  private drawTextButton() {
    if (this.textOnTheButton === 'resume game') {
      this.textNodeButton = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          this.engine.size.x / 2 - 118 + this.shiftX,
          this.engine.size.y / 2 + 110,
        ),
        text: this.textOnTheButton,
        layer: 'window',
        font: 'Samdan',
        fontSize: 26,
        color: '#0daf1b',
      }) as TextNode;
    }

    if (this.textOnTheButton === 'try again') {
      this.textNodeButton = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          this.engine.size.x / 2 - 110 + this.shiftX,
          this.engine.size.y / 2 + 110,
        ),
        text: this.textOnTheButton,
        layer: 'window',
        font: 'Samdan',
        fontSize: 28,
        color: '#0daf1b',
      }) as TextNode;
    }
  }

  private drawExitButton() {
    this.exitButtonNode = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        this.engine.size.x / 2 + 30 + this.shiftX,
        this.engine.size.y / 2 + 95,
      ),
      size: this.engine.vector(this.button.width, this.button.height),
      layer: 'window',
      img: this.button,
      dh: 55,
    }) as ImageNode;

    this.exitButtonTextNode = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        this.engine.size.x / 2 + 55 + this.shiftX,
        this.engine.size.y / 2 + 110,
      ),
      text: 'main menu',
      layer: 'window',
      font: 'Samdan',
      fontSize: 26,
      color: '#0daf1b',
    }) as TextNode;
  }

  private drawVolume() {
    if (this.modalWindowText === 'game paused') this.volume.init();
  }

  private drawFullScreenToggle() {
    if (this.modalWindowText !== 'game paused') return;
    this.fullScreenToggleButton = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(this.engine.size.x / 2 + 45, this.engine.size.y / 2.3),
      size: this.engine.vector(this.button.width, this.button.height),
      layer: 'window',
      img: this.engine.fullscreen ? this.buttonActive : this.button,
      dh: 35,
    }) as ImageNode;

    this.fullScreenToggleText = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(this.engine.size.x / 2 + 55, this.engine.size.y / 2.3 + 6),
      text: 'fullscreen',
      layer: 'window',
      font: 'Samdan',
      fontSize: 21,
      color: '#0daf1b',
    }) as TextNode;
  }

  private drawShadowToggle() {
    if (this.modalWindowText !== 'game paused') return;
    this.shadowToggleButton = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - 25 + this.shiftX,
        this.engine.size.y / 2.3,
      ),
      size: this.engine.vector(this.button.width, this.button.height),
      layer: 'window',
      img: this.engine.shadows.enabled ? this.buttonActive : this.button,
      dh: 35,
    }) as ImageNode;

    this.shadowToggleText = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - 8 + this.shiftX,
        (this.engine.size.y / 2.3) + 8,
      ),
      text: 'shadows',
      layer: 'window',
      font: 'Samdan',
      fontSize: 21,
      color: '#0daf1b',
    }) as TextNode;
  }

  public addEventListenerToButton() {
    const active = this.buttonActive;

    this.engine.on(this.buttonNode, 'mousedown', () => {
      this.buttonNode.img = active;
      this.buttonNode.clearLayer();
    });

    this.engine.on(this.buttonNode, 'mouseup', () => {
      this.buttonNode.img = this.button;
      this.buttonNode.clearLayer();
    });

    this.engine.on(this.buttonNode, 'click', () => {
      this.engine.audioPlayer.playSound('bleep');
      this.removeModalWindow();
    });

    this.engine.on(this.exitButtonNode, 'mousedown', () => {
      this.exitButtonNode.img = active;
      this.exitButtonNode.clearLayer();
    });

    this.engine.on(this.exitButtonNode, 'mouseup', () => {
      this.exitButtonNode.img = this.button;
      this.exitButtonNode.clearLayer();
    });

    this.engine.on(this.exitButtonNode, 'click', () => {
      this.engine.audioPlayer.playSound('bleep');
      this.removeModalWindow();
    });

    this.engine.on(this.fullScreenToggleButton, 'click', () => {
      this.engine.fullscreen = !this.engine.fullscreen;
    });

    this.engine.on(this.shadowToggleButton, 'click', () => {
      this.engine.shadows.enabled = !this.engine.shadows.enabled;
      this.shadowToggleButton.img = this.engine.shadows.enabled ? active : this.button;
      this.exitButtonNode.clearLayer();
    });
  }

  private removeModalWindow() {
    this.textNode.destroy();
    this.textNodeButton.destroy();
    this.bgNode.destroy();
    this.buttonNode.destroy();
    this.exitButtonNode.destroy();
    this.exitButtonTextNode.destroy();
    this.volume.destroyNodes();
    if (this.shadowToggleButton) this.shadowToggleButton.destroy();
    if (this.shadowToggleText) this.shadowToggleText.destroy();
  }
}
