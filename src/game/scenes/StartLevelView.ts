import Engine from '../../engine';
import zombiePresets from '../../data/zombies.json';
import { ZombieType } from '../../types';
import Cell from '../models/Cell';
import { ROWS_NUM } from '../../constats';

const ZOMBIES_COUNT: number = 10;
const VIEW_SHIFT: number = 350;
const SCREEN_SIZE: number = 1030;
const VIEW_SLOW_MODE_X: number = 150;
const MIN_ZOMBIE_SHIFT_X: number = 10;
const MAX_ZOMBIE_SHIFT_X: number = 100;
const MIN_ZOMBIE_SHIFT_Y: number = 70;
const MAX_ZOMBIE_SHIFT_Y: number = 400;

export class StartLevelView {
  private engine: Engine;

  private startLevel: () => void;

  private zombies: Array<any> = [];

  private zombiesTypes: Set<ZombieType>;

  private running: boolean;

  constructor(engine: Engine, startLevel: () => void, types: Array<string>, cells: Cell[][]) {
    this.engine = engine;
    this.startLevel = startLevel;
    this.zombiesTypes = new Set<any>(types);
    this.createNodes(cells);
    this.init();
  }

  private createNodes(cells: Cell[][]): void {
    const randomInteger = (min: number, max: number) => {
      const num = min + Math.random() * (max + 1 - min);
      return Math.floor(num);
    };

    const type: ZombieType[] = Array.from(this.zombiesTypes);

    for (let i: number = 0; i < ZOMBIES_COUNT; i += 1) {
      const typeIndex: number = randomInteger(0, type.length - 1);
      const zombieImg = this.engine.loader.files[
        `assets/sprites/zombies/${type[typeIndex]}/stop.png`
      ] as HTMLImageElement;

      const zombieType: ZombieType = type[typeIndex];
      const stateObj: any = zombiePresets[zombieType].states.stop;

      const row = i % 5;

      const X = [100, -20, 60, 190, 14, 25, 160, 140, 24, 97];
      const cell = cells[0][row];

      const zombieInstance: any = this.engine
        .createNode({
          type: 'SpriteNode',
          position: this.engine.vector(SCREEN_SIZE + X[i], cell.getBottom() - stateObj.height),
          size: this.engine.vector(stateObj.width * stateObj.frames, stateObj.height),
          dh: stateObj.dh,
          frames: stateObj.frames,
          speed: stateObj.speed,
          layer: `row-${row + 1}`,
          img: zombieImg,
        })
        .addTo('scene');
      this.zombies.push(zombieInstance);
    }
  }

  private init(): void {
    this.engine.audioPlayer.playSound('level');
    this.running = false;

    const viewAnimation = (node: any) => {
      const { view } = node.layer;
      this.running = true;

      const copyNode: any = node;
      copyNode.update = () => {
        if (view.position.x >= VIEW_SLOW_MODE_X) {
          if (view.position.x >= VIEW_SHIFT) {
            this.engine
              .timeout(() => {
                copyNode.update = () => {
                  if (view.position.x >= VIEW_SLOW_MODE_X) {
                    view.move(this.engine.vector(-1.5, 0));
                  } else {
                    if (view.position.x <= 0) {
                      delete copyNode.update;
                      view.position.x = 0;
                      this.running = false;
                      return;
                    }
                    view.move(this.engine.vector(-2.5, 0));
                  }
                };
              }, 100)
              .start();
          } else {
            view.move(this.engine.vector(1.5, 0));
          }
        } else {
          view.move(this.engine.vector(3.5, 0));
        }
      };
    };
    const rowsLayers = new Array(ROWS_NUM + 1).fill(0).map((elem, idx) => `row-${idx}`);

    const view = this.engine.createView(['back', 'main', ...rowsLayers, 'top']);
    viewAnimation(this.zombies[0]);

    this.zombies[1].update = () => {
      if (this.running === false) {
        this.zombies.forEach((zombie) => {
          zombie.destroy();
        });
        this.engine.audioPlayer.stopSound('level');
        this.engine.audioPlayer.playSound('readysetplant');
        const zombieComming = this.engine.audioPlayer.getSound('zombie-comming');
        zombieComming.play();
        zombieComming.addEventListener('ended', () => {
          this.engine.audioPlayer.playSound('levelMain', true);
        });
        this.startLevel();
      }
    };
  }
}
