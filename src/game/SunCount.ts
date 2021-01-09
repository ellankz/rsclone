import {
  LEFT_CAMERA_OFFSET_COEF,
  PLANT_CARD_WIDTH_COEF,
  SUN_COUNT_HEIGHT_COEF, SUN_COUNT_WIDTH_COEF,
  TOP_OFFSET_COEF,
} from '../constats';
import Engine from '../engine';
import TextNode from '../engine/nodes/TextNode';

const sunBack = require('../assets/images/interface/SunBack.png');

export default class SunCount {
  count: {suns: number};

  engine: Engine;

  bgImage: HTMLImageElement;

  updateCountInLevel: (newCount: number) => void;

  textNode: TextNode;

  localCount: number;

  constructor(engine: Engine, sunCount: {suns: number}, countUpdateCB: (newCount: number) => void) {
    this.count = sunCount;
    this.engine = engine;
    this.bgImage = new Image();
    this.updateCountInLevel = countUpdateCB;
    this.localCount = sunCount.suns;
  }

  public draw() {
    this.drawBG();
    this.drawText();
  }

  private drawText() {
    this.bgImage.addEventListener('load', () => {
      this.textNode = this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(
          this.engine.size.x * (PLANT_CARD_WIDTH_COEF + LEFT_CAMERA_OFFSET_COEF) * 1.5,
          this.engine.size.y * TOP_OFFSET_COEF * 2,
        ),
        text: this.count.suns.toString(),
        layer: 'main',
        font: 'sans-serif',
        fontSize: 50,
        color: 'black',
      }) as TextNode;
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
    if (this.localCount !== this.count.suns) {
      this.localCount = this.count.suns;
      this.updateCountInLevel(this.count.suns);
      this.textNode.text = this.count.suns.toString();
    }
  }
}
