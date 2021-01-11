import { COLS_NUM, ROWS_NUM } from '../constats';
import Engine from '../engine';
import Cell from '../game/Cell';
import PlantCard from '../game/PlantCard';
import SunCount from '../game/SunCount';
import { LevelConfig, PlantType, ZombieConfig } from '../types';
import Plant from './Plant';
import Zombie from './Zombie';
import { FallingSun } from '../game/mechanics/FallingSun';
import { SunFlower } from './plants/SunFlower';
import { Peashooter } from './plants/Peashooter';

const BG_URL = 'assets/images/interface/background1.jpg';
const BG_LEVEL_OFFSET_X = 370;

export default class Level {
  private zombiesArr: Zombie[] = [];

  private plantsArr: Plant[] = [];

  public sunCount: {suns: number} = { suns: 500 };

  public width: number = COLS_NUM;

  public height: number = ROWS_NUM;

  private zombiesConfig: ZombieConfig[];

  public plantTypes: PlantType[];

  private plantCards: PlantCard[];

  private engine: Engine;

  private cells: Cell[][];

  private preparedToPlant: PlantType | null;

  private occupiedCells: Map<Cell, Plant>;

  private sunCounter: SunCount;

  private sunFall: FallingSun;

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
    this.addBackground('back', this.engine.loader.files[BG_URL] as HTMLImageElement, BG_LEVEL_OFFSET_X);
    this.createSunCount();
    this.createPlantCards();
    this.listenCellClicks();
    this.startLevel();
    return this;
  }

  public get zombies() {
    return this.zombiesArr;
  }

  public get plants() {
    return this.plantsArr;
  }

  addBackground(layer: string, image: HTMLImageElement, xOffset: number) {
    this.engine
      .createNode(
        {
          type: 'ImageNode',
          position: this.engine.vector(0, 0),
          size: this.engine.vector(this.engine.size.x + xOffset, this.engine.size.y),
          layer,
          img: image,
          dh: this.engine.size.y,
        },
      );
  }

  public createPlant(type: PlantType) {
    let newPlant: Plant;
    switch (type) {
      case 'SunFlower':
        newPlant = new SunFlower(this.engine, this.updateSunCount.bind(this), this.sunCount);
        break;
      case 'Peashooter':
        newPlant = new Peashooter({ type }, this.engine);
        break;
      default:
        newPlant = new Plant({ type }, this.engine);
        break;
    }
    this.plantsArr.push(newPlant);
    return newPlant;
  }

  private createSunCount() {
    this.sunCounter = new SunCount(this.engine, this.sunCount);
    this.sunCounter.draw();
  }

  public updateSunCount(newCount:number) {
    this.sunCount.suns = newCount;
    this.reDrawCardsAndCount();
  }

  private reDrawCardsAndCount() {
    this.plantCards.forEach((card) => {
      card.updateCardState();
    });
    this.sunCounter.update();
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
        const cell = this.cells[x][y];
        this.engine.on(cell.node, 'click', () => {
          if (this.occupiedCells.has(cell)) {
            const plant = this.occupiedCells.get(cell);
            plant.switchState('attack');
          }
          if (this.preparedToPlant && !this.occupiedCells.has(cell)) {
            const plant = this.createPlant(this.preparedToPlant);
            plant.draw(cell);

            this.occupiedCells.set(cell, plant);

            this.updateSunCount(this.sunCount.suns - plant.cost);

            this.preparedToPlant = null;
          }
        });
      }
    }
  }

  startLevel() {
    this.dropSuns();
  }

  stopLevel() {
    this.sunFall.stop();
  }

  dropSuns() {
    this.sunFall = new FallingSun(
      this.engine, this.sunCount, this.cells, this.updateSunCount.bind(this),
    );
    this.sunFall.init();
  }
}
