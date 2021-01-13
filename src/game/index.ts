import Engine from '../engine';
import Level from '../models/Level';
import Cell from './Cell';
import { LevelConfig } from '../types';
import levels from '../data/levels.json';
import { COLS_NUM, ROWS_NUM } from '../constats';
import LoaderScreen from './screens/LoaderScreen';

import sounds from '../data/audio.json';

export default class Game {
  private engine: Engine;

  private cells: Cell[][];

  public currentLevel: Level;

  constructor(engine: Engine) {
    this.engine = engine;
    this.cells = [];
  }

  public init() {
    this.setupGame();
    const loaderScreen = new LoaderScreen(this.engine, this.startGame.bind(this));
    this.engine.preloadFiles(
      () => loaderScreen.create(),
      (percent: number) => loaderScreen.update(percent),
      () => this.engine.addAudio(sounds),
    );
  }

  setupGame() {
    const { engine } = this;
    engine.createView(['back', 'main', 'top']);
    engine.getLayer('main').view.move(engine.vector(0, 0));
    engine.createScene('scene', function Scene() {
      this.update = () => {
        // code
      };
    });
    this.engine.start('scene');
  }

  startGame() {
    this.createCells();
    this.createLevel(0);
    this.engine.audioPlayer.playSound('menu');
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
    return this.currentLevel;
  }
}
