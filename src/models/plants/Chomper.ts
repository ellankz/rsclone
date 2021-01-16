import Engine from '../../engine';
import Cell from '../../game/Cell';
import { PlantConfig } from '../../types';
import Plant from '../Plant';
import Zombie from '../Zombie';

const POSITION_ADJUST_X = 17;
const POSITION_ADJUST_Y = -20;
const ATTACK_OFFSET_X = -15;
const SLEEPING_TIME = 40 * 1000;
const ATTACK_TIME = 1000;

export class Chomper extends Plant {
  private sleeping: boolean;

  constructor(config: PlantConfig, engine: Engine) {
    super(config, engine);
    this.sleeping = false;
  }

  draw(cell: Cell) {
    super.draw(cell);
    this.node.position.plus(this.engine.vector(POSITION_ADJUST_X, POSITION_ADJUST_Y));
  }

  isZombieInAttackArea(zombie: Zombie) {
    const isInFront = super.isZombieInAttackArea(zombie);
    if (!isInFront) return false;
    if (this.cell.getRight() + ATTACK_OFFSET_X >= zombie.position.x) {
      return true;
    }
    return false;
    //  if (this.cells) {
    //    const xOffset = ATTACK_OFFSET_X;
    //    const yOffset = ATTACK_OFFSET_Y;
    //    const x = this.cell.position.x;
    //    const y = this.cell.position.y;

    //    const topRow = y - yOffset >= 0 ? y - yOffset : 0;
    //    const bottomRow = y + yOffset < this.cells.length ? y + yOffset : this.cells.length - 1;

    //    let leftLimit = this.cell.getLeft() + this.cell.cellSize.x * xOffset;
    //    let rightLimit = this.cell.getRight() + this.cell.cellSize.x * xOffset;

    //    const rightBoundary = this.cells[0][this.cells[0].length - 1].getRight();

    //    if (leftLimit < 0) leftLimit = 0;
    //    if (rightLimit > rightBoundary) rightLimit = rightBoundary;

    //    if (zombie.row >= topRow && zombie.row <= bottomRow) {
    //      if (zombie.node.position.x + zombie.node.size.x >= rightLimit) {
    //        if (zombie.node.position.x <= leftLimit) return true;
    //      }
    //    }
    //  }
    //  return false;
  }

  attack(zombie: Zombie) {
    setTimeout(() => {
      if (this.sleeping) return;
      super.attack(zombie);
    }, ATTACK_TIME);
  }

  stopAttack() {
    if (this.sleeping) return;
    this.sleeping = true;
    this.switchState('sleep');

    setTimeout(() => {
      this.switchState('basic');
      this.sleeping = false;
    }, SLEEPING_TIME);
  }

  switchState(state: string, zombie?: Zombie) {
    if (state === 'attack' && this.sleeping) return;
    super.switchState(state, zombie);
    if (state === 'basic') {
      this.node.position.plus(this.engine.vector(POSITION_ADJUST_X, POSITION_ADJUST_Y));
    }
  }
}
