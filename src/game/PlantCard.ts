import Plant from '../models/Plant';
import { PlantPreset } from '../types';
import plantsData from '../data/plants.json';
import Engine from '../engine';
import {
  LEFT_CAMERA_OFFSET_COEF,
  PLANT_CARD_HEIGHT_COEF,
  PLANT_CARD_WIDTH_COEF,
} from '../constats';
import { IImageNode, NodesType } from '../engine/types';

export default class PlantCard {
  public plant: Plant;

  private plantsData: { [dymanic: string]: PlantPreset } = plantsData;

  private type: string;

  private isActive: boolean;

  public isToggle: boolean = false;

  private orderNum: number;

  private plantData: PlantPreset;

  private engine: Engine;

  private sunCount: { suns: number };

  private prepareToPlant: (plantType: string) => void;

  public node: IImageNode;

  private selection: IImageNode;

  constructor(
    type: string,
    orderNum: number,
    engine: Engine,
    sunCount: { suns: number },
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
    const image = this.engine.loader.files[`assets/images/cards/${this.type}.png`];

    const srcPos = this.getSrcPos();
    this.node = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        LEFT_CAMERA_OFFSET_COEF * this.engine.size.x,
        this.orderNum * this.engine.size.y * PLANT_CARD_HEIGHT_COEF * 1.3,
      ),
      size: this.engine.vector(
        this.engine.size.x * PLANT_CARD_WIDTH_COEF,
        this.engine.size.y * PLANT_CARD_HEIGHT_COEF,
      ),
      layer: 'main',
      img: image,
      dh: this.engine.size.y * PLANT_CARD_HEIGHT_COEF * 1.1,
      srcPosition: this.engine.vector(0, srcPos),
    }) as IImageNode;
  }

  public addEventListener(plantCards: PlantCard[]) {
    this.engine.on(this.node as NodesType, 'click', () => {
      if (this.sunCount.suns >= this.plantData.cost) {
        this.prepareToPlant(this.type);
        if (this.selection) this.removeSelection();

        if (this.isActive) {
          plantCards.forEach((card) => {
            card.removeToggle();
            card.removeSelect();
          });

          this.isToggle = !this.isToggle;
          this.updateCardState();
        }
      }
    });
  }

  public removeToggle() {
    this.isToggle = false;
    return this.isToggle;
  }

  public updateCardState() {
    this.isActive = this.sunCount.suns >= this.plantData.cost;
    const srcPos = this.getSrcPos();
    this.node.srcY = srcPos;
    this.node.clearLayer();

    if (!this.isToggle) this.removeSelect();
    if (this.isToggle) this.select();
  }

  public select() {
    this.node.filter = 'brightness(1.1)';
    this.drawSelection();
    return this.isToggle;
  }

  public removeSelect() {
    this.node.filter = 'brightness(1)';
    if (this.selection) this.removeSelection();
    return this.isToggle;
  }

  public destroy() {
    this.node.destroy();
  }

  private drawSelection() {
    const image = this.engine.loader.files['assets/images/interface/selectPlantCard.png'];

    this.selection = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        LEFT_CAMERA_OFFSET_COEF * this.engine.size.x - 0.5,
        this.orderNum * this.engine.size.y * PLANT_CARD_HEIGHT_COEF * 1.3 + 3,
      ),
      size: this.engine.vector(
        this.engine.size.x,
        this.engine.size.y,
      ),
      layer: 'main',
      img: image,
      dh: this.engine.size.y * 0.3,
    }) as IImageNode;
  }

  private removeSelection() {
    this.selection.destroy();
  }
}
