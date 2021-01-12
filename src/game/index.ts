import Engine from '../engine';
import Level from '../models/Level';
import Cell from './Cell';
import { LevelConfig } from '../types';
import levels from '../data/levels.json';
import { COLS_NUM, ROWS_NUM } from '../constats';
import LoaderScreen from './screens/LoaderScreen';
import { DataService } from '../api-service/DataService';
import { StartScreen } from '../models/StartScreen';

export default class Game {
  private engine: Engine;

  private cells: Cell[][];

  private currentLevel: Level;

  dataService: DataService;

  constructor(engine: Engine, dataService: DataService) {
    this.engine = engine;
    this.cells = [];
    this.dataService = dataService;
  }

  public init() {
    this.setupGame();
    // const loaderScreen = new LoaderScreen(this.engine, this.startGame.bind(this));
    const loaderScreen = new LoaderScreen(this.engine, this.runFirstScreen.bind(this));
    this.engine.preloadFiles(
      () => loaderScreen.create(),
      (percent: number) => loaderScreen.update(percent),
    );
    this.dataService.login({ login: 'string', password: 'string' })
      .then(() => this.dataService.getStats())
      .then((res) => console.log(res));
  }

  setupGame() {
    const { engine } = this;
    engine.createView(['back', 'main']);
    engine.getLayer('main').view.move(engine.vector(0, 0));
    engine.createScene('scene', function Scene() {
      this.update = () => {
        // code
      };
    });
    this.engine.start('scene');
  }

  runFirstScreen(): void {
    const startGameScreen = new StartScreen(this.engine, this.startGame.bind(this));
    this.engine.setScreen('startScreen');
  }

  startGame() {
    this.createCells();
    this.createLevel(0);
    this.engine.setScreen('first');
  }

  createCells() {
    for (let x = 0; x < COLS_NUM; x += 1) {
      const row: Cell[] = [];
      for (let y = 0; y < ROWS_NUM; y += 1) {
        const cell = new Cell({ x, y }, this.engine);
        cell.draw();
        row.push(cell);
      }
      this.cells.push(row);
    }
  }

  createLevel(levelIndex: number) {
    this.currentLevel = new Level(levels[levelIndex] as LevelConfig, this.engine, this.cells);
    this.currentLevel.init();
  }
}
