import {
  LEFT_CAMERA_OFFSET_COEF,
  PLANT_CARD_WIDTH_COEF,
  SUN_COUNT_HEIGHT_COEF, SUN_COUNT_WIDTH_COEF,
  TOP_OFFSET_COEF,
} from '../constats';
import Engine from '../engine';

const sunBack = require('../assets/images/interface/SunBack.png');

export default class SunCount {
  count: number;

  engine: Engine;

  bgImage: HTMLImageElement;

  updateCountInLevel: (newCount: number) => void;

  constructor(engine: Engine, sunCount: number, countUpdateCB: (newCount: number) => void) {
    this.count = sunCount;
    this.engine = engine;
    this.bgImage = new Image();
    this.updateCountInLevel = countUpdateCB;
  }

  public draw() {
    this.drawBG();
    this.drawText();
  }

  private drawText() {
    this.bgImage.addEventListener('load', () => {
      this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          this.engine.size.x * (PLANT_CARD_WIDTH_COEF + LEFT_CAMERA_OFFSET_COEF) * 1.5,
          this.engine.size.y * TOP_OFFSET_COEF * 2,
        ),
        text: this.count.toString(),
        layer: 'main',
        font: 'serif',
        fontSize: 50,
        color: 'black',
      })
        .addTo('scene');
    });
  }

  private drawBG() {
    this.bgImage.src = sunBack.default;
    this.engine.createNode(
      {
        type: 'ImageNode',
        position: this.engine.vector(
          this.engine.size.x * (PLANT_CARD_WIDTH_COEF + LEFT_CAMERA_OFFSET_COEF) * 1.2,
          this.engine.size.y * TOP_OFFSET_COEF,
        ),
        size: this.engine.vector(
          this.engine.size.x * SUN_COUNT_WIDTH_COEF, this.engine.size.y * SUN_COUNT_HEIGHT_COEF,
        ),
        layer: 'main',
        img: this.bgImage,
        dh: this.engine.size.y * SUN_COUNT_HEIGHT_COEF * 1.5,
      },
    );
  }

  public update() {
    this.updateCountInLevel(this.count);
    this.drawText();
  }

  public addSunCount(number: number) {
    this.count += number;
    this.update();
    return this.count;
  }

  public substractSunCount(number: number) {
    this.count -= number;
    this.update();
    return this.count;
  }
}
