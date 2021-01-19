import Plant from '../models/Plant';
import { PlantPreset } from '../types';
import plantsData from '../data/plants.json';
import Engine from '../engine';
import { LEFT_CAMERA_OFFSET_COEF, PLANT_CARD_HEIGHT_COEF, PLANT_CARD_WIDTH_COEF } from '../constats';
import { IImageNode, NodesType } from '../engine/types';

export default class PlantCard {
  public plant: Plant;

  private plantsData: {[dymanic: string]: PlantPreset} = plantsData;

  private type: string;

  private isActive: boolean;

  private orderNum: number;

  private plantData: PlantPreset;

  private engine: Engine;

  private sunCount: {suns: number};

  private prepareToPlant: (plantType: string) => void;

  private node: IImageNode;

  constructor(
    type: string, orderNum: number, engine: Engine, sunCount: {suns: number},
    prepareToPlant: (plantType: string) => void,
  ) {
    this.type = type;
    this.isActive = false;
    this.orderNum = orderNum;
    this.plantData = this.plantsData[type] as PlantPreset;
    this.engine = engine;
    this.sunCount = sunCount;
    this.prepareToPlant = prepareToPlant;
  }

  public getSrcPos = () => (this.isActive ? 0 : this.engine.size.y * PLANT_CARD_HEIGHT_COEF);

  draw() {
    this.isActive = this.sunCount.suns >= this.plantData.cost;
    const image = new Image();
    image.src = `assets/images/cards/${this.type}.png`;

    const srcPos = this.getSrcPos();
    this.node = this.engine.createNode(
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
    ) as IImageNode;
    this.engine.on(this.node as NodesType, 'click', () => {
      if (this.sunCount.suns >= this.plantData.cost) {
        this.prepareToPlant(this.type);
      }
    });
  }

  public updateCardState() {
    this.isActive = this.sunCount.suns >= this.plantData.cost;
    const srcPos = this.getSrcPos();
    this.node.srcY = srcPos;
    this.node.clearLayer();
  }

  public destroy() {
    this.node.destroy();
  }
}
