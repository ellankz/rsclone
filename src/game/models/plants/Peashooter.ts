import Engine from '../../../engine';
import Vector from '../../../engine/core/Vector';
import Cell from '../Cell';
import { PlantConfig } from '../../../types';
import Plant from '../Plant';
import Shot from '../Shot';
import Zombie from '../Zombie';

export class Peashooter extends Plant {
  public shot: Shot;

  public shotType?: string;

  public shooting: any = null;

  public shotPosition: Vector;

  constructor(config: PlantConfig, engine: Engine) {
    super(config, engine);
    this.shotType = this.plantPresets[config.type].shotType;
  }

  draw(cell: Cell) {
    super.draw(cell);
    this.shotPosition = this.position;
  }

  startShooting(zombie: Zombie) {
    if (!this.shotType || this.shooting !== null) return;
    this.isShooting = true;

    const shoot = () => {
      if (zombie.health <= 0 || zombie.isDestroyedFlag) {
        this.stopAttack();
        return;
      }
      this.node.switchState('attack');
      this.node.then(() => {
        this.switchState('basic');
      });
      const timeout = this.engine.timeout(() => {
        timeout.destroy();
        this.engine.audioPlayer.playSoundRand(['pea2', 'pea']);
        this.shot = new Shot(this.shotPosition, this.engine, this.shotType);
        this.shot.draw(zombie, this);
      }, 500);

      this.engine.getTimer('levelTimer')?.add(timeout);
    };

    this.shooting = this.engine.interval(() => {
      shoot();
    }, 1800);
    shoot();

    if (this.shooting) this.engine.getTimer('levelTimer')?.add(this.shooting);
  }

  stopShooting() {
    super.stopShooting();
    if (this.shot) this.shot.destroy();
    this.shooting.destroy();
    this.shooting = null;
  }

  attack(zombie: Zombie) {
    this.startShooting(zombie);
  }

  public switchState(state: string, zombie?: Zombie) {
    if (state === 'attack') {
      this.attack(zombie);
      return;
    }
    super.switchState(state, zombie);
  }
}
