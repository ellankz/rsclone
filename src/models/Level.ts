import { LevelConfig, PlantType, ZombieConfig } from '../types';
import Plant from './Plant';
import Zombie from './Zombie';

const FIELD_WIDTH = 9;
const FIELD_HEIGHT = 5;

export default class Level {
  private zombiesArr: Zombie[] = [];

  private plantsArr: Plant[] = [];

  public sunCount: number = 0;

  public width: number = FIELD_WIDTH;

  public height: number = FIELD_HEIGHT;

  private zombiesConfig: ZombieConfig[];

  public plantTypes: PlantType[];

  constructor(levelConfig: LevelConfig) {
    this.zombiesConfig = levelConfig.zombies;
    this.plantTypes = levelConfig.plantTypes;
  }

  public init() {
    this.zombiesArr = this.zombiesConfig.map((configItem) => new Zombie(configItem));
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
}
