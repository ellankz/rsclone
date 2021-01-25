import Engine from '../../engine';
import { PlantConfig } from '../../types';
import Plant from '../Plant';
import Shot from '../Shot';
import Zombie from '../Zombie';

export class Peashooter extends Plant {
  public shot: Shot;

  public shotType?: string;

  public shooting: number | null = null;

  constructor(config: PlantConfig, engine: Engine) {
    super(config, engine);
    this.shotType = this.plantPresets[config.type].shotType;
  }

  startShooting(zombie: Zombie) {
    if (this.shotType && this.shooting === null) {
      const shoot = () => {
        if (zombie.health > 0) {
          this.engine.audioPlayer.playSoundRand(['pea2', 'pea']);
          this.shot = new Shot(this.position, this.engine, this.shotType);
          this.shot.draw(zombie, this);
        } else {
          this.stopAttack();
        }
      };
      setTimeout(() => {
        if (this.shooting === null) {
          shoot();
          this.shooting = window.setInterval(shoot, 1800);
        }
      }, 700);
    }
  }

  stopShooting() {
    super.stopShooting();
    if (this.shot) this.shot.destroy();
    if (this.shotType && this.shooting) {
      window.clearInterval(this.shooting);
      this.shooting = null;
    }
  }

  attack(zombie: Zombie) {
    this.startShooting(zombie);

    if (zombie.health <= 0) {
      zombie.remove();
      this.stopAttack();
    }
  }
}
