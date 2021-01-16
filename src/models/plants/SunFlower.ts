import Plant from '../Plant';
import Engine from '../../engine';
import { SunCreator } from '../../game/mechanics/SunCreator';
import Cell from '../../game/Cell';

const SUN_REPRODUCTION = 18000;
const SUN_APPEARANCE_STATE = 350;
const SUN_POSITION_SHIFT = 30;
const SUNFLOWER_GENERATE_STATE = 600;

export class SunFlower extends Plant {
  isDestroyedFlag: boolean;

  updateSunFunc?: (sun: number) => void;

  sunCount?: { suns: number };

  start: () => void;

  constructor(engine: Engine, updateSunFunc?: (sun: number) => void, sunCount?: { suns: number }) {
    super({ type: 'SunFlower' }, engine);
    this.isDestroyedFlag = false;
    if (updateSunFunc && sunCount) {
      this.updateSunFunc = updateSunFunc;
      this.sunCount = sunCount;
    }
  }

  init(cell: Cell) {
    this.start = () => {
      if (this.health <= 0) {
        clearInterval(this.timer);
      } else {
        this.switchState('generate');
        const position = this.engine.vector(
          cell.getLeft() + (cell.cellSize.x - this.width) / 2 + SUN_POSITION_SHIFT,
          cell.getBottom() - this.height - (cell.cellSize.y - this.height) / 2 - SUN_POSITION_SHIFT,
        );
        const sun: any = new SunCreator(
          this.engine,
          [position.x, position.y],
          'top',
          'sun',
          this.updateSunFunc,
          this.sunCount,
        ).instance;
        sun.addTo('scene');
        sun.switchState('appearance');

        setTimeout(() => {
          sun.switchState('live');
        }, SUN_APPEARANCE_STATE);
      }
    };
    this.timer = window.setInterval(this.start, SUN_REPRODUCTION);
  }

  draw(cell: Cell): void {
    super.draw(cell);
    this.init(cell);
  }

  switchState(state: string) {
    this.node.switchState(state);
    setTimeout(() => this.node.switchState('basic'), SUNFLOWER_GENERATE_STATE);
  }

  stop(): void {
    super.stop();
    this.isDestroyedFlag = true;
    window.clearInterval(this.timer);
  }

  continue(): void {
    super.continue();
    this.isDestroyedFlag = false;
    this.timer = window.setInterval(this.start, SUN_REPRODUCTION);
  }
}
