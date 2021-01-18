import Engine from '../engine';
import ImageNode from '../engine/nodes/ImageNode';
import TextNode from '../engine/nodes/TextNode';

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

  constructor(engine: Engine, modalWindowText: string, textOnTheButton: string) {
    this.engine = engine;
    this.bgImage = this.engine.loader.files['assets/images/interface/window.png'] as HTMLImageElement;
    this.button = this.engine.loader.files['assets/images/interface/Button.png'] as HTMLImageElement;
    this.modalWindowText = modalWindowText;
    this.textOnTheButton = textOnTheButton;
  }

  public draw() {
    this.drawBG();
    this.drawButton();
    this.drawText();
    this.drawTextButton();
    this.drawExitButton();
    this.addEventListenerToButton();
  }

  private drawText() {
    if (this.modalWindowText === 'game paused') {
      this.textNode = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) - 90,
          (this.engine.size.y / 2) - 70,
        ),
        text: this.modalWindowText,
        layer: 'window',
        font: 'regular-samdan',
        fontSize: 50,
        color: '#d9bc6b',
      }) as TextNode;
    }

    if (this.modalWindowText === 'game over') {
      this.textNode = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) - 75,
          (this.engine.size.y / 2) - 40,
        ),
        text: this.modalWindowText,
        layer: 'window',
        font: 'regular-samdan',
        fontSize: 50,
        color: '#d9bc6b',
      }) as TextNode;
    }
  }

  private drawBG() {
    this.bgNode = this.engine.createNode(
      {
        type: 'ImageNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) - (this.bgImage.width / 2) + 70,
          (this.engine.size.y / 2) - (this.bgImage.height / 2) + 25,
        ),
        size: this.engine.vector(this.engine.size.x, this.engine.size.y),
        layer: 'window',
        img: this.bgImage,
        dh: 500,
      },
    ) as ImageNode;
  }

  private drawButton() {
    this.buttonNode = this.engine.createNode(
      {
        type: 'ImageNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) - 135,
          (this.engine.size.y / 2) + 95,
        ),
        size: this.engine.vector(this.engine.size.x, this.engine.size.y),
        layer: 'window',
        img: this.button,
        dh: 800,
      },
    ) as ImageNode;
  }

  private drawTextButton() {
    if (this.textOnTheButton === 'resume game') {
      this.textNodeButton = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) - 118,
          (this.engine.size.y / 2) + 110,
        ),
        text: this.textOnTheButton,
        layer: 'window',
        font: 'regular-samdan',
        fontSize: 26,
        color: '#0daf1b',
      }) as TextNode;
    }

    if (this.textOnTheButton === 'try again') {
      this.textNodeButton = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) - 110,
          (this.engine.size.y / 2) + 110,
        ),
        text: this.textOnTheButton,
        layer: 'window',
        font: 'regular-samdan',
        fontSize: 28,
        color: '#0daf1b',
      }) as TextNode;
    }
  }

  private drawExitButton() {
    this.exitButtonNode = this.engine.createNode(
      {
        type: 'ImageNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) + 30,
          (this.engine.size.y / 2) + 95,
        ),
        size: this.engine.vector(this.engine.size.x, this.engine.size.y),
        layer: 'window',
        img: this.button,
        dh: 800,
      },
    ) as ImageNode;

    this.exitButtonTextNode = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) + 55,
        (this.engine.size.y / 2) + 110,
      ),
      text: 'main menu',
      layer: 'window',
      font: 'regular-samdan',
      fontSize: 26,
      color: '#0daf1b',
    }) as TextNode;
  }

  public addEventListenerToButton() {
    const active = this.engine.loader.files['assets/images/interface/ButtonActive.png'] as HTMLImageElement;

    this.engine.on(this.buttonNode, 'mousedown', () => {
      this.buttonNode.img = active;
      this.buttonNode.clearLayer();
    });

    this.engine.on(this.buttonNode, 'mouseup', () => {
      this.buttonNode.img = this.button;
      this.buttonNode.clearLayer();
    });

    this.engine.on(this.buttonNode, 'click', () => {
      this.removeModalWindow();
    });

    this.engine.on(this.exitButtonNode, 'click', () => {
      this.removeModalWindow();
    });
  }

  private removeModalWindow() {
    this.textNode.destroy();
    this.textNodeButton.destroy();
    this.bgNode.destroy();
    this.buttonNode.destroy();
    this.exitButtonNode.destroy();
    this.exitButtonTextNode.destroy();
  }
}
