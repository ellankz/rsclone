import {
  LEFT_CAMERA_OFFSET_COEF,
  PLANT_CARD_WIDTH_COEF,
  SUN_COUNT_HEIGHT_COEF,
  SUN_COUNT_WIDTH_COEF,
  TOP_OFFSET_COEF,
} from '../../constats';
import Engine from '../../engine';
import { ITextNode } from '../../engine/types';

const SUNBACK_URL = 'assets/images/interface/SunBack.png';

export default class SunCount {
  count: { suns: number };

  engine: Engine;

  bgImage: HTMLImageElement;

  textNode: ITextNode;

  localCount: number;

  constructor(engine: Engine, sunCount: { suns: number }) {
    this.count = sunCount;
    this.engine = engine;
    this.bgImage = this.engine.loader.files[SUNBACK_URL] as HTMLImageElement;
    this.localCount = sunCount.suns;
  }

  public draw() {
    this.drawBG();
    this.drawText();
  }

  private drawText() {
    this.textNode = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        this.engine.size.x * (PLANT_CARD_WIDTH_COEF + LEFT_CAMERA_OFFSET_COEF) * 1.7 + 20,
        this.engine.size.y * TOP_OFFSET_COEF * 2.4,
      ),
      text: this.count.suns.toString(),
      layer: 'main',
      font: 'Samdan',
      fontSize: 50,
      color: 'black',
    }) as ITextNode;
  }

  private drawBG() {
    this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        this.engine.size.x * (PLANT_CARD_WIDTH_COEF + LEFT_CAMERA_OFFSET_COEF) * 1.2,
        this.engine.size.y * TOP_OFFSET_COEF,
      ),
      size: this.engine.vector(
        this.engine.size.x * SUN_COUNT_WIDTH_COEF,
        this.engine.size.y * SUN_COUNT_HEIGHT_COEF,
      ),
      layer: 'main',
      img: this.bgImage,
      dh: this.engine.size.y * SUN_COUNT_HEIGHT_COEF * 1.5,
    });
  }

  public update() {
    if (this.localCount !== this.count.suns) {
      this.localCount = this.count.suns;
      this.textNode.text = this.count.suns.toString();
      this.textNode.clearLayer();
    }
  }
}
