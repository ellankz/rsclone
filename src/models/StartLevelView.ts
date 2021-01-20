import Engine from '../engine';
import zombiePresets from '../data/zombies.json';
import { ZombieType } from '../types';

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

  constructor(engine: Engine, startLevel: () => void, types: Array<string>) {
    this.engine = engine;
    this.startLevel = startLevel;
    this.zombiesTypes = new Set<any>(types);
    this.createNodes();
    this.init();
  }

  private createNodes(): void {
    const randomInteger = (min: number, max: number): number => Math
      .floor(min + Math.random() * (max + 1 - min));

    const type: ZombieType[] = Array.from(this.zombiesTypes);

    for (let i: number = 0; i < ZOMBIES_COUNT; i += 1) {
      const typeIndex: number = randomInteger(0, type.length - 1);
      const zombieImg = this.engine
        .loader.files[`assets/sprites/zombies/${type[typeIndex]}/stop.png`] as HTMLImageElement;

      const zombieType: ZombieType = type[typeIndex];
      const stateObj: any = zombiePresets[zombieType].states.stop;

      const zombieInstance: any = this.engine
        .createNode({
          type: 'SpriteNode',
          position: this.engine.vector(
            SCREEN_SIZE + randomInteger(MIN_ZOMBIE_SHIFT_X, MAX_ZOMBIE_SHIFT_X),
            randomInteger(MIN_ZOMBIE_SHIFT_Y, MAX_ZOMBIE_SHIFT_Y),
          ),
          size: this.engine.vector(
            stateObj.width * stateObj.frames,
            stateObj.height,
          ),
          dh: stateObj.dh,
          frames: stateObj.frames,
          speed: stateObj.speed,
          layer: 'top',
          img: zombieImg,
        })
        .addTo('scene');
      this.zombies.push(zombieInstance);
    }
  }

  private init(): void {
    this.engine.start('scene');
    this.running = false;

    const viewAnimation = (node: any) => {
      const { view } = node.layer;
      this.running = true;

      const copyNode: any = node;
      copyNode.update = () => {
        if (view.position.x >= VIEW_SLOW_MODE_X) {
          if (view.position.x >= VIEW_SHIFT) {
            setTimeout(() => {
              copyNode.update = () => {
                if (view.position.x >= VIEW_SLOW_MODE_X) {
                  view.move(this.engine.vector(-1.5, 0));
                } else {
                  if (view.position.x <= 0) {
                    delete copyNode.update;
                    view.position.x = 0;
                    this.running = false;
                  }
                  view.move(this.engine.vector(-2.5, 0));
                }
              };
            }, 100);
          } else {
            view.move(this.engine.vector(1.5, 0));
          }
        } else {
          view.move(this.engine.vector(3.5, 0));
        }
      };
    };

    const view = this.engine.createView(['back', 'main', 'top', 'window']);
    view.move(this.engine.vector(0));
    viewAnimation(this.zombies[0]);

    this.zombies[1].update = () => {
      if (this.running === false) {
        this.zombies.forEach((zombie) => {
          zombie.destroy();
        });
        this.engine.audioPlayer.playSound('zombie-comming');
        this.startLevel();
      }
    };
  }
}
