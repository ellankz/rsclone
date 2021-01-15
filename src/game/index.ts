import { platform } from 'os';
import Engine from '../engine';
import Level from '../models/Level';
import Cell from './Cell';
import { LevelConfig } from '../types';
import levels from '../data/levels.json';
import { COLS_NUM, ROWS_NUM } from '../constats';
import LoaderScreen from './screens/LoaderScreen';
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

  public restZombies: number;

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
        // code;
      };
    });
    this.engine.start('scene');
  }

  startGame() {
    // this.engine.audioPlayer.playSound('menu');
    this.createCells();
    this.currentLevel = this.createLevel(0);
    this.engine.setScreen('first');
  }

  endGame() {
    const trackPosition = () => {
      if (this.currentLevel) {
        this.restZombies = this.currentLevel.getRestZombies();
        // console.log(this.restZombies);
        if (this.restZombies <= 0) {
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

  destroySun() {
    let sun = this.engine.getSceneNodes('scene');
    sun = sun.filter((node) => node.type === 'SpriteNode');
    sun = sun.filter((node) => node.name === 'sun');
    sun.forEach((node) => node.destroy());
  }

  destroyPlants() {
    const plants = this.currentLevel.getPlants();
    plants.forEach((plant) => {
      plant.reduceAllHealth();
      plant.destroy();
    });
  }

  stopCreatingSuns() {
    const plants = this.currentLevel.getPlants();
    plants.forEach((plant) => {
      plant.reduceAllHealth();
    });
  }

  endWin() {
    this.isEnd = true;
    this.stopCreatingSuns();
    this.currentLevel.stopLevel();
    this.currentLevel.clearZombieArray();
    this.currentLevel.clearPlantsArray();
    this.engine.clearAllTimeouts();

    setTimeout(() => {
      this.createWinScene();
      this.currentLevel.updateSunCount(500);
    }, 5000)
    setTimeout(() => {
      this.clearLevel();
    }, 8000);
    setTimeout(() => {
      this.createLevel(0);
    }, 12000);

    clearTimeout(this.timer);
  }

  endLoose() {
    // this.stop();
    this.isEnd = true;
    this.currentLevel.stopLevel();
    this.destroySun();
    this.destroyPlants();
    this.engine.clearAllTimeouts();
    this.createLooseScene();
    this.currentLevel.clearZombieArray();
    this.currentLevel.clearPlantsArray();
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
    // this.addPause();
    return this.currentLevel;
  }

  clearLevel() {
    let allNodes = this.engine.getSceneNodes('scene');
    allNodes = allNodes.filter((el) => el.type === 'SpriteNode');

    allNodes.forEach((node) => {
      node.destroy();
    });

    this.engine.clearAllTimeouts();
    this.engine.clearTimeouts();
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
    let i = 0;

    document.addEventListener('visibilitychange', () => {
      i += 1;

      this.engine.clearAllTimeouts();

      if (i === 1) {
        this.createPauseScene();

        this.modalWindow.resumeGame(() => {
          this.engine.start('scene');
          // this.currentLevel.continueCreatingZombies();
          // this.engine.resumeTimeout();
          i = 0;
        });
      }
    });
  }
}
