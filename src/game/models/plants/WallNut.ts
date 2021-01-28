import Engine from '../../../engine';
import Cell from '../Cell';
import { PlantConfig } from '../../../types';
import Plant from '../Plant';

const CRACKED1_HEALTH = 600;
const CRACKED2_HEALTH = 200;

export class WallNut extends Plant {
  private currentState: string;

  constructor(config: PlantConfig, engine: Engine) {
    super(config, engine);
    this.currentState = 'basic';
  }

  checkState() {
    let state = 'basic';
    if (this.health <= CRACKED2_HEALTH) {
      state = 'cracked2';
    } else if (this.health <= CRACKED1_HEALTH) {
      state = 'cracked1';
    }

    if (this.currentState !== state) {
      this.currentState = state;
      this.switchState(state);
    }
  }

  draw(cell: Cell): void {
    super.draw(cell);
    this.node.update = this.checkState.bind(this);
  }

  switchState(state: string) {
    super.switchState(state);
  }
}
