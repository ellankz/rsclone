import Engine from '../engine';
import Level from './models/Level';
import Cell from './models/Cell';

import { COLS_NUM, ROWS_NUM } from '../constats';
import LoaderScreen from './screens/LoaderScreen';
import { DataService } from '../api-service/DataService';
import WinScene from './scenes/WinScene';
import LooseScene from './scenes/LooseScene';
import Pause from './scenes/Pause';
import { StartScreen } from './screens/StartScreen';
import sounds from '../data/audio.json';

export default class Game {
  private engine: Engine;

  private cells: Cell[][];

  private win: WinScene;

  private loose: LooseScene;

  public currentLevel: Level;

  public pause: Pause;

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
    this.createCells();
    this.addPause();
    this.currentLevel = this.createLevel(levelNumber);
    this.engine.setScreen('first');
    this.engine.stop();
    this.engine.start('scene');
    this.engine.audioPlayer.playSound('bleep');
    this.engine.audioPlayer.stopSound('menuMain');
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
    if (this.currentLevel) this.clearLevel();
    this.currentLevel = new Level(
      levelIndex,
      this.engine,
      this.cells,
      this.dataService,
      this.runPause,
      this.endWin.bind(this),
      this.endLoose.bind(this),
    );
    this.currentLevel.init();
    return this.currentLevel;
  }

  endWin() {
    this.engine.audioPlayer.stopSound('levelMain');
    const hasWon = true;
    this.currentLevel.stopLevel(hasWon);

    this.engine
      .timeout(() => {
        this.createWinScene();
      }, 3000)
      .start();
  }

  endLoose() {
    const hasWon = false;
    this.currentLevel.stopLevel(hasWon);
    this.destroySun();
    this.reducePlantsHealth();
    this.destroyPlants();
    this.createLooseScene();
    this.currentLevel.clearZombieArray();
    this.currentLevel.clearPlantsArray();
  }

  clearLevel() {
    let allNodes = this.engine.getSceneNodes('scene');
    allNodes = allNodes.filter((el) => el.type === 'SpriteNode');

    allNodes.forEach((node) => {
      node.destroy();
    });
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

  reducePlantsHealth() {
    const plants = this.currentLevel.getPlants();
    plants.forEach((plant) => {
      plant.reduceAllHealth();
    });
  }

  createWinScene() {
    this.win = new WinScene(this.engine, () => {
      this.win = null;
    });

    this.win.init(() => {
      this.currentLevel.updateSunCount(0);
      this.exitGame(true);
      document.removeEventListener('visibilitychange', this.runPause);
    });
  }

  public createLooseScene() {
    document.removeEventListener('visibilitychange', this.runPause);

    const restartCallback = () => {
      this.clearLevel();
      this.createLevel(this.currentLevel.levelNumber);
      this.currentLevel.updateSunCount(200);
      document.addEventListener('visibilitychange', this.runPause);
    };

    const exitCallback = () => {
      this.clearLevel();
      this.exitGame(false);
    };

    this.loose = new LooseScene(this.engine, restartCallback, exitCallback);
    this.loose.init();
  }

  createPauseScene() {
    this.pause = new Pause(this.engine);
    this.pause.init();
  }

  stopGame() {
    this.engine.audioPlayer.pauseSound('zombie-comming');
    this.engine.audioPlayer.pauseSound('levelMain');
    this.engine.audioPlayer.pauseSound('level');

    this.engine.stop();
    this.currentLevel.pause();
    this.createPauseScene();
  }

  resumeGame() {
    const mainSound = this.engine.audioPlayer.getSound('levelMain');
    const viewSound = this.engine.audioPlayer.getSound('level');
    const zombieComming = this.engine.audioPlayer.getSound('zombie-comming');
    this.currentLevel.zombiesArr.forEach((zombie) => zombie.groan());

    if (mainSound.currentTime !== 0) {
      this.engine.audioPlayer.playContinue('levelMain');
    }
    if (viewSound.currentTime > 0 && viewSound.currentTime < 18) {
      this.engine.audioPlayer.playContinue('level');
    }
    if (zombieComming.currentTime > 0 && zombieComming.currentTime < 4) {
      this.engine.audioPlayer.playContinue('zombie-comming');
    }
    this.engine.start('scene');
    this.currentLevel.resume();
  }

  exitGame(hasWon: boolean) {
    this.isEnd = true;
    this.destroySun();
    this.currentLevel.stopLevel(hasWon);
    this.reducePlantsHealth();
    this.destroyPlants();
    this.clearLevel();
    this.currentLevel.clearZombieArray();
    this.currentLevel.clearPlantsArray();
    this.engine.audioPlayer.stopSound('levelMain');
    this.engine.audioPlayer.playSound('menuMain');
    this.engine.setScreen('levelSelectionScreen');
    this.engine.stop();
    const timeout = this.engine
      .timeout(() => {
        timeout.destroy();
        this.engine.start('levelSelectionScreen');
      }, 100)
      .start();
  }

  runPause = (event: KeyboardEvent) => {
    if (
      !this.isEnd
      && (event.type === 'visibilitychange' || event.key === 'Escape' || event.type === 'click')
    ) {
      if (!this.menuOpen) {
        this.engine.audioPlayer.playSound('pause');
        this.menuOpen = true;
        this.stopGame();

        this.pause.resumeGame(
          () => {
            this.menuOpen = false;
            this.resumeGame();
          },
          () => {
            this.menuOpen = false;
            this.exitGame(false);
            document.removeEventListener('visibilitychange', this.runPause);
          },
        );
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
