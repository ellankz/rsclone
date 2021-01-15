import Engine from '../engine';
import { IImageNode } from '../engine/types';
import Cell from '../game/Cell';
import Zombie from './Zombie';

export default class LawnCleaner {
  private cell: Cell;

  public row: number;

  private engine: Engine;

  private node: IImageNode;

  private image: HTMLImageElement;

  public positionX: number;

  constructor(engine: Engine, cell: Cell, row: number) {
    this.engine = engine;
    this.cell = cell;
    this.row = row;
  }

  draw() {
    this.image = this.engine.loader.files['assets/images/interface/LawnCleaner.png'] as HTMLImageElement;
    const position = this.engine.vector(
      this.cell.getLeft() - this.image.width - 10,
      this.cell.getTop(),
    );

    this.node = this.engine.createNode(
      {
        type: 'ImageNode',
        position,
        size: this.engine.vector(
          this.image.width, this.image.height,
        ),
        layer: 'main',
        img: this.image,
      },
    ) as IImageNode;
  }

  run(zombies: Zombie[], deleteCB: () => void) {
    this.node.addTo('scene');
    this.engine.audioPlayer.playSound('lawncleaner');
    this.node.update = () => {
      this.node.move(this.engine.vector(25, 0));
      this.positionX = this.node.position.x + this.image.width / 2;
      zombies.forEach((zombie) => {
        console.log(this.positionX, zombie.position.x);
        if (zombie.health > 0 && this.positionX >= zombie.position.x) {
          // eslint-disable-next-line no-param-reassign
          zombie.health = 0;
          zombie.remove();
          zombie.node.destroy();
          deleteCB();
        }
      });
      if (this.node.position.x > this.engine.size.x) {
        this.node.destroy();
      }
    };
  }
}
