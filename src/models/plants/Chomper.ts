import Engine from '../../engine';
import Cell from '../../game/Cell';
import { PlantConfig } from '../../types';
import Plant from '../Plant';
import Zombie from '../Zombie';

const MS = 1000;
const POSITION_ADJUST_X = 17;
const POSITION_ADJUST_Y = -20;
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
    if (zombie.row !== this.cell.position.y) return false;
    if (this.cell.position.x === zombie.column) return true;
    return false;
  }

  attack(zombie: Zombie) {
    setTimeout(() => {
      if (this.sleeping) return;
      this.engine.audioPlayer.playSound('chomper');
      super.attack(zombie);
      if (zombie.health <= 0) {
        zombie.node.destroy();
      }
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
