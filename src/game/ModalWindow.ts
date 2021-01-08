import Engine from '../engine';
import ImageNode from '../engine/nodes/ImageNode';
import TextNode from '../engine/nodes/TextNode';

const windowUrl = require('../assets/images/interface/window.png');
const buttonUrl = require('../assets/images/interface/Button.png');

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

  constructor(engine: Engine, modalWindowText: string, textOnTheButton: string) {
    this.engine = engine;
    this.bgImage = new Image();
    this.button = new Image();
    this.modalWindowText = modalWindowText;
    this.textOnTheButton = textOnTheButton;
  }

  public draw() {
    this.drawBG();
    this.drawText();
    this.drawButton();
    this.drawTextButton();
    this.addEventListenerToButton();
  }

  private drawText() {
    this.bgImage.addEventListener('load', () => {
      if (this.modalWindowText === 'game paused') {
        this.textNode = this.engine.createNode({
          type: 'TextNode',
          position: this.engine.vector(
            (this.engine.size.x / 2) - 70,
            (this.engine.size.y / 2) - 40,
          ),
          text: this.modalWindowText,
          layer: 'top',
          font: 'regular-samdan',
          fontSize: 50,
          color: '#d9bc6b',
        }) as TextNode;
      }

      if (this.modalWindowText === 'game over') {
        this.textNode = this.engine.createNode({
          type: 'TextNode',
          position: this.engine.vector(
            (this.engine.size.x / 2) - 50,
            (this.engine.size.y / 2) - 40,
          ),
          text: this.modalWindowText,
          layer: 'top',
          font: 'regular-samdan',
          fontSize: 50,
          color: '#d9bc6b',
        }) as TextNode;
      }
    });
  }

  private drawBG() {
    this.bgImage.src = windowUrl.default;

    this.bgImage.addEventListener('load', () => {
      this.bgNode = this.engine.createNode(
        {
          type: 'ImageNode',
          position: this.engine.vector(
            (this.engine.size.x / 2) - (this.bgImage.width / 2) + 90,
            (this.engine.size.y / 2) - (this.bgImage.height / 2) + 25,
          ),
          size: this.engine.vector(this.engine.size.x, this.engine.size.y),
          layer: 'top',
          img: this.bgImage,
          dh: 500,
        },
      ) as ImageNode;
    });
  }

  private drawButton() {
    this.button.src = buttonUrl.default;

    this.bgImage.addEventListener('load', () => {
      this.buttonNode = this.engine.createNode(
        {
          type: 'ImageNode',
          position: this.engine.vector(
            (this.engine.size.x / 2) - 35,
            (this.engine.size.y / 2) + 95,
          ),
          size: this.engine.vector(this.engine.size.x, this.engine.size.y),
          layer: 'top',
          img: this.button,
          dh: 800,
        },
      ) as ImageNode;
    });
  }

  private drawTextButton() {
    this.bgImage.addEventListener('load', () => {
      this.button.addEventListener('load', () => {
        if (this.textOnTheButton === 'resume game') {
          this.textNodeButton = this.engine.createNode({
            type: 'TextNode',
            position: this.engine.vector(
              (this.engine.size.x / 2) - 20,
              (this.engine.size.y / 2) + 110,
            ),
            text: this.textOnTheButton,
            layer: 'top',
            font: 'regular-samdan',
            fontSize: 26,
            color: '#288115',
            border: '1px solid black',
          }) as TextNode;
        }

        if (this.textOnTheButton === 'try again') {
          this.textNodeButton = this.engine.createNode({
            type: 'TextNode',
            position: this.engine.vector(
              (this.engine.size.x / 2) - 8,
              (this.engine.size.y / 2) + 110,
            ),
            text: this.textOnTheButton,
            layer: 'top',
            font: 'regular-samdan',
            fontSize: 28,
            color: '#288115',
            border: '1px solid black',
          }) as TextNode;
        }
      });
    });
  }

  private addEventListenerToButton() {
    this.bgImage.addEventListener('load', () => {
      this.button.addEventListener('load', () => {
        this.engine.on(this.buttonNode, 'click', () => {
          this.removeModalWindow();
          // resume or restart game
        });
      });
    });
  }

  private removeModalWindow() {
    this.textNode.destroy();
    this.textNodeButton.destroy();
    this.bgNode.destroy();
    this.buttonNode.destroy();
    this.textNode.clearLayer();
  }
}
