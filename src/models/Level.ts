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
const MS = 1000;
const X_HOME = 150;

export default class Level {
  private zombiesArr: Zombie[] = [];

  private zombie: Zombie;

  private plantsArr: Plant[] = [];

  private plant: Plant;

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

  public isEnd: boolean;

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
    this.addBackground('back', this.engine.loader.files[BG_URL] as HTMLImageElement, BG_LEVEL_OFFSET_X);
    this.createSunCount();
    this.createPlantCards();
    this.startLevel();
    return this;
  }

  public get zombies() {
    return this.zombiesArr;
  }

  public get plants() {
    return this.plantsArr;
  }

  startLevel() {
    this.createZombies();
    this.dropSuns();
    this.listenCellClicks();
    this.listenGameEvents();
  }

  stopLevel() {
    this.isEnd = true;
    this.sunFall.stop();

    this.plantsArr.forEach((plant) => {
      plant.stopShooting();
    });

    this.zombiesArr.forEach((zombie) => {
      zombie.stop();
    });
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

  public createZombies() {
    // Generate row without repeating more then (2) times
    function getRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const random: any = {
      prev: null,
      count: 0,
      consecutive: 2,

      nextRandom(min: number, max: number) {
        if (this.prev === null || this.count < this.consecutive) {
          const res = getRandomNumber(min, max);
          if (res === this.prev) {
            this.count += 1;
          } else {
            this.prev = res;
            this.count = 1;
          }
          return res;
        }

        let res = this.prev;
        while (res === this.prev) {
          res = getRandomNumber(min, max);
        }

        this.prev = res;
        this.count = 1;
        return res;
      },
    };

    // Generate zombies
    for (let i: number = 0; i < this.zombiesConfig.length; i += 1) {
      let cell: Cell;
      let row: number = null;

      setTimeout(() => {
        row = random.nextRandom(0, ROWS_NUM - 1);
        this.zombie = new Zombie(this.zombiesConfig[i], this.engine);
        cell = this.cells[0][row];
        this.zombie.row = row;
        this.zombie.draw(cell, this.occupiedCells);
        this.zombiesArr.push(this.zombie);
      }, this.zombiesConfig[i].startDelay * MS);
    }
  }

  public listenGameEvents() {
    const trackPosition = () => {
      this.zombiesArr.forEach((zombie) => {
        if (zombie.position && zombie.position.x < X_HOME) {
          this.stopLevel();
        } else {
          zombie.attack(this.occupiedCells);
        }
        
        this.plantsArr.forEach((plant) => {

          if (zombie.row === plant.row && zombie.position && !this.isEnd) {
            plant.switchState('attack', zombie, plant);

            if (zombie.health <= 0) {
              zombie.remove();
              plant.switchState('basic');
              plant.stopShooting();
            }
          }
        });
      });
      this.zombiesArr = this.deleteZombie();
      this.plantsArr = this.deletePlant();

      setTimeout(trackPosition, 1000);
    };
    trackPosition();
  }

  private deleteZombie() {
    const index = this.zombiesArr.findIndex((el) => el.health <= 0);
    if (index >= 0) this.zombiesArr.splice(index, 1);
    return this.zombiesArr;
  }

  private deletePlant() {
    const index = this.plantsArr.findIndex((el) => el.health <= 0);
    if (index >= 0) this.plantsArr.splice(index, 1);
    return this.plantsArr;
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
          if (this.preparedToPlant && !this.occupiedCells.has(cell)) {
            this.plant = this.createPlant(this.preparedToPlant);
            this.plant.draw(cell);
            this.plant.row = cell.position.y;

            this.occupiedCells.set(cell, this.plant);

            this.updateSunCount(this.sunCount.suns - this.plant.cost);

            this.preparedToPlant = null;
          }
        });
      }
    }
  }

  dropSuns() {
    this.sunFall = new FallingSun(
      this.engine, this.sunCount, this.cells, this.updateSunCount.bind(this),
    );
    this.sunFall.init();
  }
}
