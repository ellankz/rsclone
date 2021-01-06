import Engine from '../engine';
import TextNode from '../engine/nodes/TextNode';
import Game from '../game/index';

const windowUrl = require('../assets/images/interface/window.png');
const buttonUrl = require('../assets/images/interface/Button.png');

export default class ModalWindow {
  engine: Engine;

  bgImage: HTMLImageElement;

  textNode: TextNode;

  textButton: TextNode;

  button: HTMLImageElement;

  constructor(engine: Engine) {
    this.engine = engine;
    this.bgImage = new Image();
    this.button = new Image();
  }

  public draw() {
    this.drawBG();
    this.drawText();
    this.drawButton();
    this.drawTextButton();
  }

  private drawText() {
    this.bgImage.addEventListener('load', () => {
      this.textNode = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) - 40,
          (this.engine.size.y / 2) - 40,
        ),
        text: 'game over',
        layer: 'top',
        font: 'regular-samdan',
        fontSize: 50,
        color: '#d9bc6b',
      }) as TextNode;
    });
  }

  private drawBG() {
    this.bgImage.src = windowUrl.default;
    let modal: any;

    this.bgImage.addEventListener('load', () => {
      modal = this.engine.createNode(
        {
          type: 'ImageNode',
          position: this.engine.vector(
            (this.engine.size.x / 2) - (this.bgImage.width / 2) + 100,
            (this.engine.size.y / 2) - (this.bgImage.height / 2) + 25,
          ),
          size: this.engine.vector(this.engine.size.x, this.engine.size.y),
          layer: 'top',
          img: this.bgImage,
          dh: 500,
        },
      );
    });
  }

  private drawButton() {
    this.button.src = buttonUrl.default;
    let button: any;

    this.bgImage.addEventListener('load', () => {
        this.engine.on(this.engine.createNode(
            {
              type: 'ImageNode',
              position: this.engine.vector(
                (this.engine.size.x / 2) - 20,
                (this.engine.size.y / 2) + 95,
              ),
              size: this.engine.vector(this.engine.size.x, this.engine.size.y),
              layer: 'top',
              img: this.button,
              dh: 800,
            },
          ), 'click', () => {
            const game = new Game(this.engine);
            game.init();  
        })
    });
  }

  private drawTextButton() {
    this.bgImage.addEventListener('load', () => {
      this.textNode = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
            (this.engine.size.x / 2) + 8,
            (this.engine.size.y / 2) + 110,
        ),
        text: 'try again',
        layer: 'top',
        font: 'regular-samdan',
        fontSize: 28,
        color: '#288115',
        border: '1px solid black',
      }) as TextNode;
    });
  }
}
