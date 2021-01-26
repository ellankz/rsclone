import Engine from '../../../engine';
import Cell from '../Cell';
import { PlantConfig } from '../../../types';
import Plant from '../Plant';
import Zombie from '../Zombie';

import { ROWS_NUM } from '../../../constats';

const ATTACK_RADIUS = 1;
const ATTACK_OFFSET_LEFT = 40;
const ATTACK_OFFSET_RIGHT = 80;

export class CherryBomb extends Plant {
  zombies: Zombie[];

  private occupedCells: Map<Cell, Plant>;

  public name: string = 'CherryBomb';

  constructor(
    config: PlantConfig,
    engine: Engine,
    zombies: Zombie[],
    occupiedCells: Map<Cell, Plant>,
  ) {
    super(config, engine);
    this.zombies = zombies;
    this.occupedCells = occupiedCells;
  }

  putOnField(cell: Cell) {
    super.putOnField(cell);

    this.node.then(() => {
      this.switchState('boom');
      this.explode();

      this.node.then(() => {
        this.health = 0;
        this.destroy();
        this.occupedCells.delete(this.cell);
      });
    });
  }

  explode() {
    this.zombies.forEach((zombie) => {
      if (this.isZombieInAttackArea(zombie)) {
        zombie.reduceHealth(this.damage);
        if (zombie.health <= 0) {
          zombie.burn();
        }
      }
    });
    this.engine.audioPlayer.playSound('cherrybomb');
  }

  isZombieInAttackArea(zombie: Zombie) {
    if (!zombie.position) return false;

    const { y } = this.cell.position;

    const topRow = Math.max(y - ATTACK_RADIUS, 0);
    const bottomRow = Math.min(y + ATTACK_RADIUS, ROWS_NUM - 1);

    const destination = this.cell.cellSize.x * ATTACK_RADIUS;

    const leftLimit = Math.max(this.cell.getLeft() - destination, 0) + ATTACK_OFFSET_LEFT;
    const rightLimit = this.cell.getRight() + destination - ATTACK_OFFSET_RIGHT;

    if (zombie.row >= topRow && zombie.row <= bottomRow) {
      if (zombie.position.x <= rightLimit) {
        if (zombie.position.x + zombie.width >= leftLimit) return true;
      }
    }

    return false;
  }
}
