import Cell from '../Cell';
import { Peashooter } from './Peashooter';

export class SnowPea extends Peashooter {
  draw(cell: Cell) {
    super.draw(cell);
    this.shotPosition = this.engine.vector(this.position.x, this.position.y - 5);
  }
}
