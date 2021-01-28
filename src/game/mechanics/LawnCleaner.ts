import Engine from '../../engine';
import { IImageNode } from '../../engine/types';
import Cell from '../models/Cell';
import Zombie from '../models/Zombie';

const SPEED = 18;
const RIGHT_OFFSET = -10;
const TOP_OFFSET = 40;

export default class LawnCleaner {
  private cell: Cell;

  public row: number;

  private engine: Engine;

  public node: IImageNode;

  private image: HTMLImageElement;

  public positionX: number;

  constructor(engine: Engine, cell: Cell, row: number) {
    this.engine = engine;
    this.cell = cell;
    this.row = row;
  }

  draw() {
    this.image = this.engine.loader.files[
      'assets/images/interface/LawnCleaner.png'
    ] as HTMLImageElement;
    const position = this.engine.vector(
      this.cell.getLeft() - this.image.width + RIGHT_OFFSET,
      this.cell.getTop() + TOP_OFFSET,
    );

    this.node = this.engine.createNode({
      type: 'ImageNode',
      position,
      size: this.engine.vector(this.image.width, this.image.height),
      layer: `row-${this.row + 1}`,
      img: this.image,
      shadow: '45, 55, 30, 10',
    }) as IImageNode;
  }

  run(zombies: Zombie[], deleteCB: () => void) {
    this.node.addTo('scene');
    this.engine.audioPlayer.playSound('lawncleaner');
    this.node.update = () => {
      this.node.move(this.engine.vector(SPEED, 0));
      this.positionX = this.node.position.x + this.image.width / 2;
      zombies.forEach((zombie) => {
        if (zombie.health > 0 && zombie.name === 'pole') {
          zombie.reduceHealth(1000000);
          zombie.remove();
          zombie.node.destroy();
          deleteCB();
        } else if (zombie.health > 0 && this.positionX >= zombie.position.x && zombie.name !== 'pole') {
          zombie.reduceHealth(1000000);
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
