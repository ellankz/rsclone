import Engine from '../../engine';
import Cell from '../../game/Cell';
import { PlantConfig } from '../../types';
import Plant from '../Plant';
import Zombie from '../Zombie';

const MS = 1000;
const POSITION_ADJUST_X = 17;
const POSITION_ADJUST_Y = -20;
const ATTACK_OFFSET_X = -15;
const SLEEPING_TIME = 40 * MS;
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
  }

  attack(zombie: Zombie) {
    setTimeout(() => {
      if (this.sleeping) return;
      super.attack(zombie);
      zombie.node.destroy();
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
