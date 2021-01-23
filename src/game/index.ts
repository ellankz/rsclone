import Engine from '../engine';
import Level from '../models/Level';
import Cell from './Cell';

import { COLS_NUM, ROWS_NUM } from '../constats';
import LoaderScreen from './screens/LoaderScreen';
import { DataService } from '../api-service/DataService';
import WinScene from '../models/scenes/WinScene';
import LooseScene from '../models/scenes/LooseScene';
import Pause from '../models/scenes/Pause';
import { StartScreen } from './screens/StartScreen';
import sounds from '../data/audio.json';

const X_HOME = 150;

export default class Game {
  private engine: Engine;

  private cells: Cell[][];

  private win: WinScene;

  private loose: LooseScene;

  public currentLevel: Level;

  public pause: Pause;

  private timer: any;

  private isEnd: boolean;

  dataService: DataService;

  public restZombies: number;

  private menuOpen: boolean = false;

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
      () => this.engine.addAudio(sounds),
    );
  }

  setupGame() {
    const { engine } = this;
    engine.createView(['back', 'main', 'top']);
    engine.createScene('scene', function Scene() {
      this.init = () => {
        engine.events.click.eventBubbling = true;
      };
      this.exit = () => {
        engine.events.click.eventBubbling = false;
      };
    });
    this.engine.start('scene');
  }

  runFirstScreen(): void {
    const startGameScreen = new StartScreen(
      this.engine,
      this.startGame.bind(this),
      this.dataService,
    );
    this.engine.setScreen('startScreen');
  }

  startGame(levelNumber: number) {
    // this.engine.audioPlayer.playSound('menu');
    this.createCells();
    this.addPause();
    this.currentLevel = this.createLevel(levelNumber);
    this.engine.setScreen('first');
    this.engine.stop();
    this.engine.start('scene');
  }

  createCells() {
    if (this.cells.length < 9) {
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
  }

  createLevel(levelIndex: number) {
    this.isEnd = false;
    this.currentLevel = new Level(
      levelIndex, this.engine, this.cells, this.dataService, this.runPause,
    );
    this.currentLevel.init();
    this.endGame();
    return this.currentLevel;
  }

  endGame() {
    const trackPosition = () => {
      if (this.currentLevel) {
        this.restZombies = this.currentLevel.getRestZombies();
        if (this.restZombies <= 0) {
          this.endWin();
        }

        this.currentLevel.zombiesArr.forEach((zombie) => {
          if (zombie.position && zombie.name === 'pole' && zombie.position.x < 50) {
            const lawnCleanerWorked = this.currentLevel.handleZombieNearHome(zombie);
            if (!lawnCleanerWorked) this.endLoose();
          } else if (zombie.position && zombie.name !== 'pole' && zombie.position.x < X_HOME) {
            const lawnCleanerWorked = this.currentLevel.handleZombieNearHome(zombie);
            if (!lawnCleanerWorked) this.endLoose();
          }
        });
      }
      if (!this.isEnd) this.timer = setTimeout(trackPosition, 1000);
    };
    trackPosition();
  }

  endWin() {
    this.isEnd = true;
    this.reducePlantsHealth();
    this.engine.clearAllTimeouts();
    const hasWon = true;
    this.currentLevel.stopLevel(hasWon);
    this.currentLevel.clearZombieArray();
    this.currentLevel.clearPlantsArray();

    setTimeout(() => {
      this.createWinScene(() => {
        this.currentLevel.updateSunCount(0);
        this.destroySun();
        this.destroyPlants();
        this.engine.clearAllTimeouts();
        this.clearLevel();
        // this.engine.setScreen('startScreen');
        this.engine.setScreen('levelSelectionScreen');
        this.engine.stop();
        this.engine.start('levelSelectionScreen');
        document.removeEventListener('visibilitychange', this.runPause);
      });
    }, 3000);

    clearTimeout(this.timer);
  }

  endLoose() {
    this.isEnd = true;
    const hasWon = false;
    this.currentLevel.stopLevel(hasWon);
    this.destroySun();
    this.reducePlantsHealth();
    this.destroyPlants();
    this.engine.clearAllTimeouts();
    this.createLooseScene();
    this.currentLevel.clearZombieArray();
    this.currentLevel.clearPlantsArray();
    clearTimeout(this.timer);
  }

  clearLevel() {
    let allNodes = this.engine.getSceneNodes('scene');
    allNodes = allNodes.filter((el) => el.type === 'SpriteNode');

    allNodes.forEach((node) => {
      node.destroy();
    });

    this.engine.clearAllTimeouts();
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
      plant.stop();
    });
  }

  continueCreatingSuns() {
    const plants = this.currentLevel.getPlants();
    for (let i = 0; i < plants.length; i += 1) {
      setTimeout(() => {
        plants[i]?.continue();
      }, i * 2000);
    }
  }

  reducePlantsHealth() {
    const plants = this.currentLevel.getPlants();
    plants.forEach((plant) => {
      plant.reduceAllHealth();
      plant.stop();
    });
  }

  createWinScene(afterAnimationCallback: () => void) {
    this.win = new WinScene(this.engine, () => {
      this.win = null;
    });
    this.win.init(afterAnimationCallback);
  }

  public createLooseScene() {
    this.loose = new LooseScene(this.engine);
    this.loose.init();

    this.loose.restartLevel(() => {
      this.clearLevel();
      this.createLevel(this.currentLevel.levelNumber);
      this.currentLevel.updateSunCount(200);
    }, () => {
      this.clearLevel();
      document.removeEventListener('visibilitychange', this.runPause);
      this.exitGame(false);
    });
  }

  createPauseScene() {
    this.pause = new Pause(this.engine);
    this.pause.init();
  }

  stopGame() {
    this.engine.stop();
    this.engine.clearAllTimeouts();
    this.createPauseScene();
    this.stopCreatingSuns();
  }

  resumeGame() {
    this.engine.start('scene');
    this.currentLevel.resumeSunFall();
    this.currentLevel.continueCreatingZombies();
    this.continueCreatingSuns();
  }

  exitGame(hasWon: boolean) {
    this.isEnd = true;
    this.currentLevel.stopLevel(hasWon);
    this.destroySun();
    this.reducePlantsHealth();
    this.destroyPlants();
    this.engine.clearAllTimeouts();
    this.clearLevel();
    this.currentLevel.clearZombieArray();
    this.currentLevel.clearPlantsArray();
    clearTimeout(this.timer);
    this.engine.stop();
    this.engine.start('levelSelectionScreen');
    this.engine.setScreen('levelSelectionScreen');
  }

  runPause = (event: KeyboardEvent) => {
    if (!this.isEnd && (event.type === 'visibilitychange' || event.key === 'Escape' || event.type === 'click')) {
      if (!this.menuOpen) {
        this.engine.audioPlayer.playSound('pause');
        this.menuOpen = true;
        this.stopGame();

        this.pause.resumeGame(() => {
          this.menuOpen = false;
          this.resumeGame();
        }, () => {
          this.menuOpen = false;
          this.exitGame(false);
          document.removeEventListener('visibilitychange', this.runPause);
        });
      }
    }
  };

  addPause() {
    document.addEventListener('visibilitychange', this.runPause);

    if (!this.menuOpen) {
      window.addEventListener('keydown', this.runPause);
    }
  }
}
