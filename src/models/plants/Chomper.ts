import Engine from '../../engine';
import Cell from '../../game/Cell';
import { PlantConfig } from '../../types';
import Plant from '../Plant';
import Zombie from '../Zombie';

const MS = 1000;
const POSITION_ADJUST_X = 17;
const POSITION_ADJUST_Y = -20;
const ATTACK_OFFSET_RIGHT = {
  all: 70,
  pole: 160,
};
const ATTACK_OFFSET_LEFT = {
  all: 100,
  pole: 170,
};
const SLEEPING_TIME = 40 * MS;
const ATTACK_TIME = 1000;

export class Chomper extends Plant {
  private sleeping: boolean;

  private attacking: boolean;

  constructor(config: PlantConfig, engine: Engine) {
    super(config, engine);
    this.sleeping = false;
  }

  draw(cell: Cell) {
    super.draw(cell);
    this.node.position.plus(this.engine.vector(POSITION_ADJUST_X, POSITION_ADJUST_Y));
  }

  isZombieInAttackArea(zombie: Zombie) {
    const getPosition = () => {
      let right;
      let left;
      if (zombie.name === 'pole') {
        right = ATTACK_OFFSET_RIGHT.pole;
        left = ATTACK_OFFSET_LEFT.pole;
      } else {
        right = ATTACK_OFFSET_RIGHT.all;
        left = ATTACK_OFFSET_LEFT.all;
      }

      return { right, left };
    };

    const position = getPosition();
    if (zombie.row !== this.cell.position.y) return false;
    if (this.cell.getRight() - position.right >= zombie.position.x) {
      if (this.cell.getLeft() - position.left <= zombie.position.x) {
        return true;
      }
    }
    return false;
  }

  attack(zombie: Zombie) {
    this.attacking = true;
    this.node.then(() => {
      super.attack(zombie);
      this.engine.audioPlayer.playSound('chomper');
      if (zombie.health <= 0) {
        zombie.node.destroy();
      }
      this.attacking = false;
    });
  }

  stopAttack() {
    if (this.sleeping) return;
    this.sleeping = true;
    this.switchState('sleep');

    const timeout = this.engine.timeout(() => {
      timeout.destroy();
      this.switchState('basic');
      this.sleeping = false;
    }, SLEEPING_TIME);

    this.engine.getTimer('levelTimer').add(timeout);
  }

  switchState(state: string, zombie?: Zombie) {
    if (state === 'attack' && (this.sleeping || this.attacking)) return;
    super.switchState(state, zombie);
    if (state === 'basic') {
      this.node.position.plus(this.engine.vector(POSITION_ADJUST_X, POSITION_ADJUST_Y));
    }
  }
}
