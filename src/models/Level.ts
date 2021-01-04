import { COLS_NUM, ROWS_NUM } from '../constats';
import Engine from '../engine';
import Cell from '../game/Cell';
import PlantCard from '../game/PlantCard';
import SunCount from '../game/SunCount';
import { LevelConfig, PlantType, ZombieConfig } from '../types';
import Plant from './Plant';
import Zombie from './Zombie';

export default class Level {
  private zombiesArr: Zombie[] = [];

  private plantsArr: Plant[] = [];

  public sunCount: {suns: number} = { suns: 50 };

  public width: number = COLS_NUM;

  public height: number = ROWS_NUM;

  private zombiesConfig: ZombieConfig[];

  public plantTypes: PlantType[];

  private plantCards: PlantCard[];

  private engine: Engine;

  private cells: Cell[][];

  private preparedToPlant: PlantType | null;

  private occupiedCells: Map<Cell, Plant>;

  constructor(levelConfig: LevelConfig, engine: Engine, cells: Cell[][]) {
    this.zombiesConfig = levelConfig.zombies;
    this.plantTypes = levelConfig.plantTypes;
    this.engine = engine;
    this.plantCards = [];
    this.preparedToPlant = null;
    this.cells = cells;
    this.occupiedCells = new Map();
  }

  public init() {
    this.zombiesArr = this.zombiesConfig.map((configItem) => new Zombie(configItem));
    this.createSunCount();
    this.createPlantCards();
    this.listenCellClicks();
    return this;
  }

  public get zombies() {
    return this.zombiesArr;
  }

  public get plants() {
    return this.plantsArr;
  }

  public createPlant(type: PlantType) {
    const newPlant = new Plant({ type }, this.engine);
    this.plantsArr.push(newPlant);
    return newPlant;
  }

  private createSunCount() {
    const sunCounter = new SunCount(this.engine, this.sunCount, this.updateSunCount);
    sunCounter.draw();
  }

  public updateSunCount(newCount:number) {
    this.sunCount.suns = newCount;
  }

  public prepareToPlant(plantType: PlantType) {
    this.preparedToPlant = plantType;
  }

  public resetPreparedPlant() {
    this.prepareToPlant = null;
  }

  private createPlantCards() {
    this.plantTypes.forEach((type, index) => {
      const card = new PlantCard(
        type, index, this.engine, this.sunCount, this.prepareToPlant.bind(this),
      );
      card.draw();
      this.plantCards.push(card);
    });
  }

  private listenCellClicks() {
    for (let x = 0; x < this.cells.length; x += 1) {
      for (let y = 0; y < this.cells[x].length; y += 1) {
        this.engine.on(this.cells[x][y].node, 'click', () => {
          const cell = this.cells[x][y];
          if (this.preparedToPlant && !this.occupiedCells.has(cell)) {
            const plant = this.createPlant(this.preparedToPlant);
            plant.draw(cell);
            this.occupiedCells.set(cell, plant);
            const newSunCount = this.sunCount.suns - plant.cost;
            this.updateSunCount(newSunCount);
            this.preparedToPlant = null;
          }
        });
      }
    }
  }
}
