import Plant from '../Plant';
import Engine from '../../../engine';
import { SunCreator } from '../../mechanics/SunCreator';
import Cell from '../Cell';

const SUN_REPRODUCTION = 18000;
const SUN_APPEARANCE_STATE = 350;
const SUN_POSITION_SHIFT = 30;

export class SunFlower extends Plant {
  isDestroyedFlag: boolean;

  updateSunFunc?: (sun: number) => void;

  sunCount?: { suns: number };

  interval: any;

  constructor(engine: Engine, updateSunFunc?: (sun: number) => void, sunCount?: { suns: number }) {
    super({ type: 'SunFlower' }, engine);
    this.isDestroyedFlag = false;
    if (updateSunFunc && sunCount) {
      this.updateSunFunc = updateSunFunc;
      this.sunCount = sunCount;
    }
  }

  init(cell: Cell) {
    const levelTimer = this.engine.getTimer('levelTimer');

    const start = () => {
      if (this.health <= 0) {
        this.interval.destroy();
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
        sun.then(() => sun.switchState('live'));
      }
    };

    this.interval = this.engine.interval(start, SUN_REPRODUCTION);
    levelTimer?.add(this.interval);
  }

  draw(cell: Cell): void {
    super.draw(cell);
    this.init(cell);
  }

  switchState(state: string) {
    this.node.switchState(state);
    this.node.then(() => this.node.switchState('basic'));
  }
}
