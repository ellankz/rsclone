import Engine from '../engine';
import PlantCard from '../game/PlantCard';
import SunCount from '../game/SunCount';
import { LevelConfig, PlantType, ZombieConfig } from '../types';
import Plant from './Plant';
import Zombie from './Zombie';

const FIELD_WIDTH = 9;
const FIELD_HEIGHT = 5;

export default class Level {
  private zombiesArr: Zombie[] = [];

  private plantsArr: Plant[] = [];

  public sunCount: number = 50;

  public width: number = FIELD_WIDTH;

  public height: number = FIELD_HEIGHT;

  private zombiesConfig: ZombieConfig[];

  public plantTypes: PlantType[];

  private plantCards: PlantCard[];

  private engine: Engine;

  constructor(levelConfig: LevelConfig, engine: Engine) {
    this.zombiesConfig = levelConfig.zombies;
    this.plantTypes = levelConfig.plantTypes;
    this.engine = engine;
    this.plantCards = [];
  }

  public init() {
    this.zombiesArr = this.zombiesConfig.map((configItem) => new Zombie(configItem));
    this.createSunCount();
    this.createPlantCards();
    return this;
  }

  public get zombies() {
    return this.zombiesArr;
  }

  public get plants() {
    return this.plantsArr;
  }

  public createPlant(type: PlantType) {
    const newPlant = new Plant({ type });
    this.plantsArr.push(newPlant);
  }

  createSunCount() {
    const sunCounter = new SunCount(this.engine, this.sunCount, this.updateSunCount);
    sunCounter.draw();
  }

  updateSunCount(newCount:number) {
    this.sunCount = newCount;
  }

  createPlantCards() {
    this.plantTypes.forEach((type, index) => {
      const card = new PlantCard(type, index, this.engine, this.sunCount);
      card.draw();
      this.plantCards.push(card);
    });
  }
}
