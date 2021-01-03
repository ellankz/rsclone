import Plant from '../models/Plant';
import { PlantPreset } from '../types';
import plantsData from '../data/plants.json';
import Engine from '../engine';
import { LEFT_CAMERA_OFFSET_COEF, PLANT_CARD_HEIGHT_COEF, PLANT_CARD_WIDTH_COEF } from '../constats';

require.context('../assets/images/cards', true, /\.(png|jpg)$/);

export default class PlantCard {
  public plant: Plant;

  private plantsData: {[dymanic: string]: PlantPreset} = plantsData;

  private type: string;

  private isActive: boolean;

  private orderNum: number;

  private plantData: PlantPreset;

  private engine: Engine;

  private sunCount: number;

  constructor(type: string, orderNum: number, engine: Engine, sunCount: number) {
    this.type = type;
    this.isActive = false;
    this.orderNum = orderNum;
    this.plantData = this.plantsData[type] as PlantPreset;
    this.engine = engine;
    this.sunCount = sunCount;
  }

  draw() {
    this.updateCardState(this.sunCount);
    const image = new Image();
    image.src = `../assets/images/cards/${this.type}.png`;
    const srcPos = this.isActive ? 0 : this.engine.size.y * PLANT_CARD_HEIGHT_COEF;
    this.engine.createNode(
      {
        type: 'ImageNode',
        position: this.engine.vector(
          LEFT_CAMERA_OFFSET_COEF * this.engine.size.x,
          this.orderNum * this.engine.size.y * PLANT_CARD_HEIGHT_COEF * 1.3,
        ),
        size: this.engine.vector(
          this.engine.size.x * PLANT_CARD_WIDTH_COEF, this.engine.size.y * PLANT_CARD_HEIGHT_COEF,
        ),
        layer: 'main',
        img: image,
        dh: this.engine.size.y * PLANT_CARD_HEIGHT_COEF * 1.1,
        srcPosition: this.engine.vector(0, srcPos),
      },
    );
  }

  public updateCardState(sunsAvailable: number) {
    if (sunsAvailable >= this.plantData.cost) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  }
}
