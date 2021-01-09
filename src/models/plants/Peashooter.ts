import Engine from '../../engine';
import { PlantConfig } from '../../types';
import Plant from '../Plant';
import Shot from '../Shot';

export class Peashooter extends Plant {
  public shotType?: string;

  public shooting: number | null = null;

  constructor(config: PlantConfig, engine: Engine) {
    super(config, engine);
    this.shotType = this.plantPresets[config.type].shotType;
  }

  startShooting() {
    if (this.shotType && this.shooting === null) {
      const shoot = () => {
        const shot = new Shot(this.position, this.engine, this.shotType);
        shot.draw();
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
    if (this.shotType && this.shooting) {
      window.clearInterval(this.shooting);
      this.shooting = null;
    }
  }

  switchState(state: string) {
    super.switchState(state);
    this.startShooting();
    setTimeout(() => {
      this.node.switchState('basic');
      this.stopShooting();
    }, 3000);
  }
}
