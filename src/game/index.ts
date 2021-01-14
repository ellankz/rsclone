import Engine from '../engine';
import Level from '../models/Level';
import Cell from './Cell';
import { LevelConfig } from '../types';
import levels from '../data/levels.json';
import { COLS_NUM, ROWS_NUM } from '../constats';
import LoaderScreen from './screens/LoaderScreen';
import { StartScreen } from './screens/StartScreen';
import { DataService } from '../api-service/DataService';
import WinScene from '../models/scenes/WinScene';
import LooseScene from '../models/scenes/LooseScene';
import ModalWindow from './ModalWindow';

import sounds from '../data/audio.json';

const X_HOME = 150;

export default class Game {
  private engine: Engine;

  private cells: Cell[][];

  private win: WinScene;

  private loose: LooseScene;

  private modalWindow: ModalWindow;

  public currentLevel: Level;

  private timer: any;

  private isEnd: boolean;

  dataService: DataService;

  constructor(engine: Engine, dataService: DataService) {
    this.engine = engine;
    this.cells = [];
    this.dataService = dataService;
  }

  public init() {
    this.setupGame();
    const loaderScreen = new LoaderScreen(this.engine, this.runFirstScreen.bind(this));
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
        // code;
      };
    });
    this.engine.start('scene');
  }

  runFirstScreen(): void {
    const startGameScreen = new StartScreen(
      this.engine, this.startGame.bind(this), this.dataService,
    );
    this.engine.setScreen('startScreen');
  }

  startGame() {
    this.engine.audioPlayer.playSound('menu');
    this.createCells();
    this.currentLevel = this.createLevel(0);
    this.engine.setScreen('first');
  }

  endGame() {
    let count = 0;
    const trackPosition = () => {
      if (this.currentLevel) {
        count = this.currentLevel.getRestZombies();

        if (count <= 0) {
          this.endWin();
        }

        this.currentLevel.zombiesArr.forEach((zombie) => {
          if (zombie.position && zombie.position.x < X_HOME) {
            this.endLoose();
          }
        });
      }
      if (!this.isEnd) this.timer = setTimeout(trackPosition, 1000);
    };
    trackPosition();
  }

  stop() {
    this.isEnd = true;
    this.currentLevel.stopLevel();
    this.currentLevel.clearZombieArray();
    this.currentLevel.clearPlantsArray();
  }

  endWin() {
    this.stop();
    setTimeout(() => {
      this.createWinScene();
      this.currentLevel.updateSunCount(500);
    }, 3000);

    setTimeout(() => {
      this.clearLevel();
      this.currentLevel.destroyPlants();
    }, 6000);

    setTimeout(() => {
      this.createLevel(0);
    }, 10000);

    clearTimeout(this.timer);
  }

  endLoose() {
    this.stop();
    this.createLooseScene();
    this.currentLevel.destroyPlants();
    clearTimeout(this.timer);
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
    this.isEnd = false;
    this.currentLevel = new Level(levels[levelIndex] as LevelConfig, this.engine, this.cells);
    this.currentLevel.init();
    this.endGame();
    return this.currentLevel;
  }

  clearLevel() {
    let allNodes = this.engine.getSceneNodes('scene');
    allNodes = allNodes.filter((el) => el.type === 'SpriteNode');

    allNodes.forEach((node) => {
      node.destroy();
    });
  }

  createWinScene() {
    this.win = new WinScene(this.engine);
    this.win.init();
  }

  public createLooseScene() {
    this.loose = new LooseScene(this.engine);
    this.loose.init();

    this.loose.restartLevel(() => {
      this.clearLevel();
      this.createLevel(0);
      this.currentLevel.updateSunCount(500);
    });
  }

  createPauseScene() {
    this.engine.stop();
    this.modalWindow = new ModalWindow(this.engine, 'game paused', 'resume game');
    this.modalWindow.draw();
  }

  addPause() {
    document.addEventListener('visibilitychange', () => {
      this.currentLevel.pause();
      if (document.visibilityState === 'hidden') {
        this.createPauseScene();
      }
    });
  }
}
