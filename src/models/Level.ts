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
import { WallNut } from './plants/WallNut';
import { Chomper } from './plants/Chomper';
import { CherryBomb } from './plants/CherryBomb';
import { SnowPea } from './plants/SnowPea';
import { PotatoMine } from './plants/PotatoMine';

import { Shovel } from '../game/mechanics/Shovel';
import LawnCleaner from './LawnCleaner';

import levels from '../data/levels.json';
import { DataService } from '../api-service/DataService';
import MenuToggle from '../game/MenuToggle';
import TextNode from '../engine/nodes/TextNode';

const BG_URL = 'assets/images/interface/background1.jpg';
const BG_LEVEL_OFFSET_X = 370;
const MS = 1000;

export default class Level {
  public zombiesArr: Zombie[] = [];

  private zombie: Zombie;

  private plantsArr: Plant[] = [];

  private plant: Plant;

  public sunCount: { suns: number } = { suns: 200 };

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

  public sunFall: FallingSun;

  public isEnd: boolean;

  private Shovel: Shovel;

  public lawnCleaners: LawnCleaner[];

  public timer: any;

  public zombiesTimer: any;

  public restZombies: number;

  private zombiesKilled: number = 0;

  private plantsPlanted: number = 0;

  levelConfig: LevelConfig;

  levelNumber: number;

  dataService: DataService;

  public creatingZombies: number = 0;

  menuButton: MenuToggle;

  runPause: (event: KeyboardEvent) => void;

  levelNumberNode: TextNode;

  constructor(
    levelNumber: number,
    engine: Engine,
    cells: Cell[][],
    dataService: DataService,
    runPause: (event: KeyboardEvent) => void,
  ) {
    this.levelNumber = levelNumber;
    this.dataService = dataService;
    this.levelConfig = levels[levelNumber] as LevelConfig;
    this.zombiesConfig = this.levelConfig.zombies;
    this.plantTypes = this.levelConfig.plantTypes;
    this.engine = engine;
    this.plantCards = [];
    this.lawnCleaners = [];
    this.preparedToPlant = null;
    this.cells = cells;
    this.occupiedCells = new Map();
    this.runPause = runPause;
  }

  public init() {
    this.addBackground(
      'back',
      this.engine.loader.files[BG_URL] as HTMLImageElement,
      BG_LEVEL_OFFSET_X,
    );
    this.createSunCount();

    this.drawMenuButton();
    this.startLevel();
    return this;
  }

  stopSunFall() {
    if (this.sunFall) this.sunFall.stop();
  }

  resumeSunFall() {
    this.dropSuns();
  }

  public getZombies() {
    return this.zombiesArr;
  }

  public getPlants() {
    return this.plantsArr;
  }

  public clearZombieArray() {
    this.zombiesArr = [];
    return this.zombiesArr;
  }

  public clearPlantsArray() {
    this.plantsArr = [];
    return this.plantsArr;
  }

  public getRestZombies() {
    return this.restZombies;
  }

  private reduceZombies() {
    this.zombiesKilled += 1;
    this.restZombies -= 1;
    return this.restZombies;
  }

  startLevel() {
    this.addShovel();
    this.createPlantCards();
    this.listenCellClicks();
    this.isEnd = false;
    this.restZombies = this.zombiesConfig.length;
    this.placeLawnCleaners();
    this.createZombies(this.creatingZombies);
    this.listenGameEvents();
    this.dropSuns();
    this.drawLevelNumber();
  }

  stopLevel(hasWon: boolean) {
    this.isEnd = true;
    this.occupiedCells.clear();
    this.stopListenCellClicks();
    this.removePlantCards();
    this.stopSunFall();
    this.deleteLevelNumberNode();
    this.clearLawnCleaners();
    this.zombiesArr.forEach((zombie) => {
      zombie.stop();
    });
    this.plantsArr.forEach((plant) => {
      plant.stopAttack();
      plant.isDestroyed();
    });
    this.dataService.saveGame({
      level: this.levelNumber + 1,
      win: hasWon,
      zombiesKilled: this.zombiesKilled,
      plantsPlanted: this.plantsPlanted,
    });
    this.zombiesKilled = 0;
    this.plantsPlanted = 0;
    clearTimeout(this.timer);
  }

  handleZombieNearHome(zombie: Zombie) {
    const lawnCLeaner = this.lawnCleaners[zombie.row];
    if (lawnCLeaner) {
      this.lawnCleaners[zombie.row] = undefined;
      this.runOverWithLawnCleaner(lawnCLeaner, zombie.row);
      return true;
    }
    return false;
  }

  runOverWithLawnCleaner(lawnCLeaner: LawnCleaner, row: number) {
    const preparedToDieAgain: Zombie[] = [];
    this.zombiesArr.forEach((zombie) => {
      if (row === zombie.row) {
        preparedToDieAgain.push(zombie);
      }
    });
    lawnCLeaner.run(preparedToDieAgain, () => {
      this.reduceZombies();
      this.zombiesArr = this.deleteZombie();
    });
  }

  addBackground(layer: string, image: HTMLImageElement, xOffset: number) {
    this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x + xOffset, this.engine.size.y),
      layer,
      img: image,
      dh: this.engine.size.y,
    });
  }

  drawLevelNumber() {
    this.levelNumberNode = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(this.engine.size.x - 130, this.engine.size.y - 40),
      layer: 'main',
      text: `Level ${this.levelNumber + 1}`,
      font: 'Samdan',
      fontSize: 40,
      color: '#111111',
    }) as TextNode;
  }

  deleteLevelNumberNode() {
    this.levelNumberNode.destroy();
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
      case 'WallNut':
        newPlant = new WallNut({ type }, this.engine);
        break;
      case 'Chomper':
        newPlant = new Chomper({ type }, this.engine);
        break;
      case 'CherryBomb':
        newPlant = new CherryBomb({ type }, this.engine, this.zombiesArr, this.occupiedCells);
        break;
      case 'SnowPea':
        newPlant = new SnowPea({ type }, this.engine);
        break;
      case 'PotatoMine':
        newPlant = new PotatoMine({ type }, this.engine, this.zombiesArr, this.occupiedCells);
        break;
      default:
        newPlant = new Plant({ type }, this.engine);
        break;
    }
    this.plantsArr.push(newPlant);
    this.plantsPlanted += 1;
    return newPlant;
  }

  public createZombies(n: number) {
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

    let timer = 0;

    // Generate zombies
    for (let i: number = n; i < this.zombiesConfig.length; i += 1) {
      let cell: Cell;
      let row: number = null;

      timer += this.zombiesConfig[i].startDelay * MS;

      this.zombiesTimer = setTimeout(() => {
        if (!this.isEnd) {
          this.creatingZombies += 1;
          row = random.nextRandom(0, ROWS_NUM - 1);
          this.zombie = new Zombie(this.zombiesConfig[i], this.engine);
          cell = this.cells[0][row];
          this.zombie.row = row;
          this.zombie.draw(cell, this.occupiedCells);
          this.zombiesArr.push(this.zombie);
        }
      }, timer);

      this.engine.newSetTimeout(this.zombiesTimer);
    }
    return this.creatingZombies;
  }

  continueCreatingZombies() {
    this.createZombies(this.creatingZombies);
  }

  public listenGameEvents() {
    const fieldBoundary = this.cells[this.cells.length - 1][0].getRight();

    if (this.timer) clearTimeout(this.timer);

    const trackPosition = () => {
      this.zombiesArr.forEach((zombie) => {
        zombie.attack(this.occupiedCells);

        if (zombie.health <= 0) {
          this.reduceZombies();
        }

        if (zombie.position && zombie.position.x + zombie.width / 3 > fieldBoundary) return;

        this.plantsArr.forEach((plant) => {
          if (plant.isZombieInAttackArea(zombie) && !this.isEnd) {
            plant.switchState('attack', zombie);
          }
        });
      });

      this.zombiesArr = this.deleteZombie();
      this.plantsArr = this.deletePlant();

      if (!this.isEnd) this.timer = setTimeout(trackPosition, 1000);
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

  private drawMenuButton() {
    this.menuButton = new MenuToggle(this.engine);
    this.menuButton.init(this.runPause);
  }

  private createSunCount() {
    this.sunCounter = new SunCount(this.engine, this.sunCount);
    this.sunCounter.draw();
  }

  public updateSunCount(newCount: number) {
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
        type,
        index,
        this.engine,
        this.sunCount,
        this.prepareToPlant.bind(this),
      );
      card.draw();
      this.plantCards.push(card);
    });
  }

  private removePlantCards() {
    this.plantCards.forEach((card) => card.destroy());
  }

  private listenCellClicks() {
    for (let x = 0; x < this.cells.length; x += 1) {
      for (let y = 0; y < this.cells[x].length; y += 1) {
        const cell = this.cells[x][y];
        this.engine.on(cell.node, 'click', () => {
          if (this.preparedToPlant && !this.occupiedCells.has(cell)) {
            this.plant = this.createPlant(this.preparedToPlant);
            this.plant.putOnField(cell);
            this.plant.cell = cell;

            this.occupiedCells.set(cell, this.plant);

            this.updateSunCount(this.sunCount.suns - this.plant.cost);

            this.preparedToPlant = null;
          }
        });
      }
    }
  }

  stopListenCellClicks() {
    for (let x = 0; x < this.cells.length; x += 1) {
      for (let y = 0; y < this.cells[x].length; y += 1) {
        const cell = this.cells[x][y];
        cell.node.removeAllEvents();
      }
    }
  }

  placeLawnCleaners() {
    this.cells[0].forEach((cell, index) => {
      const lawnCleaner = new LawnCleaner(this.engine, cell, index);
      lawnCleaner.draw();
      this.lawnCleaners.push(lawnCleaner);
    });
  }

  clearLawnCleaners() {
    this.lawnCleaners.forEach((cleaner) => {
      if (cleaner && cleaner.node) cleaner.node.destroy();
    });
    this.lawnCleaners = [];
  }

  dropSuns() {
    this.sunFall = new FallingSun(
      this.engine,
      this.sunCount,
      this.cells,
      this.updateSunCount.bind(this),
    );
    this.sunFall.init();
  }

  addShovel(): void {
    const shovel: any = new Shovel(
      this.engine,
      this.occupiedCells,
      this.cells,
      this.deletePlant.bind(this),
      this.plantsArr,
    );
  }
}
