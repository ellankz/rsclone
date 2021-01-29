import Engine from '../../../engine';
import Cell from '../Cell';
import { PlantConfig } from '../../../types';
import Plant from '../Plant';
import Zombie from '../Zombie';
import Level from '../Level';

const READY_TIME = 15000;
const POSITION_ADJUST_Y = 10;

export class PotatoMine extends Plant {
  private isAttack: boolean;

  private isReady: boolean;

  private occupiedCells: Map<Cell, Plant>;

  private level: Level;

  constructor(config: PlantConfig, engine: Engine, level: Level, occupiedCells: Map<Cell, Plant>) {
    super(config, engine);
    this.occupiedCells = occupiedCells;
    this.level = level;
  }

  draw(cell: Cell) {
    super.draw(cell);
    this.switchState('notReady');
    const levelTimer = this.engine.getTimer('levelTimer');
    const growTimeout = this.engine.timeout(() => {
      growTimeout.destroy();
      this.grow();
    }, READY_TIME);

    levelTimer?.add(growTimeout);
  }

  grow() {
    this.switchState('grow');
    this.node.then(() => {
      this.switchState('basic');
      this.isReady = true;
    });
    this.engine.audioPlayer.playSound('potato-mine_grow');
  }

  isZombieInAttackArea(zombie: Zombie) {
    if (zombie.row !== this.cell.position.y || !zombie.position) return false;
    if (zombie.row === this.cell.position.y && zombie.column === this.cell.position.x) return true;
    return false;
  }

  attack(zombie: Zombie) {
    if (this.isDestroyedFlag) return;
    if (this.isAttack || !this.isReady) return;
    this.isAttack = true;
    this.engine.audioPlayer.playSound('potato-mine');
    this.node.then(() => {
      this.health = 0;
      this.destroy();
      this.occupiedCells.delete(this.cell);
    });
    this.level.zombiesArr.forEach((targetZombie) => {
      if (this.isZombieInAttackArea(targetZombie) && targetZombie.health > 0) {
        targetZombie.reduceHealth(this.damage);
        if (targetZombie.health <= 0) {
          targetZombie.burn();
        }
      }
    });
  }

  public switchState(state: string, zombie?: Zombie) {
    if (state === 'attack' && (this.isAttack || !this.isReady)) return;
    this.node.position.plus(this.engine.vector(0, POSITION_ADJUST_Y));
    super.switchState(state, zombie);
  }
}
