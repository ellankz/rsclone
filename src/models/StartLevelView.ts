import Engine from '../engine';

const ZOMBIES_COUNT: number = 10;

export class StartLevelView {
  private engine: Engine;

  private startLevel: () => void;

  private zombies: Array<any> = [];

  private zombiesTypes: Set<string>;

  constructor(engine: Engine, startLevel: () => void, types: Array<string>) {
    this.engine = engine;
    this.startLevel = startLevel;
    this.zombiesTypes = new Set<string>(types);
    this.createNodes();
    this.init();
  }

  private createNodes(): void {
    const randomInteger = (min: number, max: number): number => Math
      .floor(min + Math.random() * (max + 1 - min));

    const type : Array<string> = Array.from(this.zombiesTypes);

    for (let i: number = 0; i < ZOMBIES_COUNT; i += 1) {
      const typeIndex: number = randomInteger(0, type.length - 1);
      const zombieImg = this.engine
        .loader.files[`assets/sprites/zombies/${type[typeIndex]}/stop.png`] as HTMLImageElement;

      let frames: number = 11;
      let speed: number = 1;

      switch (type[typeIndex]) {
        case 'basic':
        case 'basic_2':
          frames = 11;
          speed = 130;
          break;
        case 'bucket':
          frames = 6;
          speed = 30;
          break;
        case 'cone':
          frames = 8;
          speed = 30;
          break;
        default:
          break;
      }

      const zombieInstance: any = this.engine
        .createNode({
          type: 'SpriteNode',
          position: this.engine.vector(
            1100 - randomInteger(-30, 70),
            randomInteger(70, 450),
          ),
          size: this.engine.vector(166 * frames, 144),
          dh: 130,
          frames,
          speed: 130,
          layer: 'top',
          img: zombieImg,
        })
        .addTo('scene');
      this.zombies.push(zombieInstance);
    }
  }

  private init(): void {
    this.engine.start('scene');
    let running = false;

    const viewAnimation = (node: any) => {
      const { view } = node.layer;
      running = true;

      const copyNode: any = node;
      copyNode.update = () => {
        if (view.position.x >= 130) {
          if (view.position.x >= 200) {
            setTimeout(() => {
              copyNode.update = () => {
                if (view.position.x >= 130) {
                  view.move(this.engine.vector(-1.5, 0));
                } else {
                  if (view.position.x <= 0) {
                    delete copyNode.update;
                    view.position.x = 0;
                    running = false;
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
      if (running === false) {
        this.zombies.forEach((zombie) => {
          zombie.destroy();
        });
        this.engine.audioPlayer.playSound('zombie-comming');
        this.startLevel();
      }
    };
  }
}
