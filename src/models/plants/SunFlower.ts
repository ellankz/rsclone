import { setupMaster } from 'cluster';
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

  constructor(engine: Engine,
    updateSunFunc?: (sun: number) => void,
    sunCount?: { suns:number }) {
    super({ type: 'SunFlower' }, engine);
    this.isDestroyedFlag = false;
    if (updateSunFunc && sunCount) {
      this.updateSunFunc = updateSunFunc;
      this.sunCount = sunCount;
    }
  }

  init(cell: Cell) {
    this.isDestroyedFlag = false;

    const start = () => {
      if (this.health <= 0) {
        clearTimeout(this.timer);
      } else {
        this.switchState('generate');
        const position = this.engine.vector(
          cell.getLeft() + (cell.cellSize.x - this.width) / 2 + SUN_POSITION_SHIFT,
          (cell.getBottom() - this.height) - (cell.cellSize.y - this.height) / 2
        - SUN_POSITION_SHIFT,
        );
        const sun: any = new SunCreator(
          this.engine,
          [position.x, position.y],
          'main',
          'sun',
          this.updateSunFunc,
          this.sunCount,
        ).instance;
        sun.addTo('scene');
        sun.switchState('appearance');

        setTimeout(() => {
          sun.switchState('live');
        }, SUN_APPEARANCE_STATE);

        this.timer = setTimeout(start, SUN_REPRODUCTION);
      // this.engine.newSetTimeout(this.timer);
      }
    };
    start();
  }

  draw(cell: Cell): void {
    super.draw(cell);
    if (!this.isDestroyedFlag) {
      setTimeout(() => {
        this.init(cell);
      }, SUN_REPRODUCTION);
    }
  }

  switchState(state: string) {
    this.node.switchState(state);
    setTimeout(() => this.node.switchState('basic'), SUNFLOWER_GENERATE_STATE);
  }

  stop(): void {
    this.isDestroyedFlag = true;
    clearTimeout(this.timer);
  }
}
