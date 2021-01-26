import Engine from '../../engine';
import Cell from '../../game/Cell';
import { PlantConfig } from '../../types';
import Plant from '../Plant';
import Zombie from '../Zombie';

const ATTACK_OFFSET_RIGHT = 70;
const ATTACK_OFFSET_LEFT = 120;
const READY_TIME = 15000;
const POSITION_ADJUST_Y = 10;

export class PotatoMine extends Plant {
  private isAttack: boolean;

  private isReady: boolean;

  private occupiedCells: Map<Cell, Plant>;

  zombies: Zombie[];

  constructor(
    config: PlantConfig,
    engine: Engine,
    zombies: Zombie[],
    occupiedCells: Map<Cell, Plant>,
  ) {
    super(config, engine);
    this.occupiedCells = occupiedCells;
    this.zombies = zombies;
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

  isZombieInAttackArea(zombie: Zombie, offset?: number) {
    if (zombie.row !== this.cell.position.y || !zombie.position) return false;
    const areaOffset = offset || 0;

    if (zombie.row === this.cell.position.y && zombie.column === this.cell.position.x) return true;
    return false;
  }

  attack(zombie: Zombie) {
    if (this.isDestroyedFlag) return;
    if (this.isAttack || !this.isReady) return;

    this.node.then(() => {
      this.health = 0;
      this.destroy();
      this.occupiedCells.delete(this.cell);
    });

    this.isAttack = true;
    this.engine.audioPlayer.playSound('potato-mine');
    this.zombies.forEach((targetZombie) => {
      if (targetZombie.health > 0 && this.isZombieInAttackArea(targetZombie, 20)) {
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
