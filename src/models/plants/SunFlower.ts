import Plant from '../Plant';
import Engine from '../../engine';
import { SunCreator } from '../../game/mechanics/SunCreator';
import Cell from '../../game/Cell';

const SUN_REPRODUCTION = 11000;
const SUN_APPEARANCE_STATE = 350;
const SUN_POSITION_SHIFT = 30;
const SUN_COST = 25;
const SUNFLOWER_GENERATE_STATE = 700;

export class SunFlower extends Plant {
  sunCreatingTimer: any;

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
    const start = (): void => {
      this.switchState('generate');
      this.sunCreatingTimer = setTimeout(start, SUN_REPRODUCTION);
      const position = this.engine.vector(
        cell.getLeft() + (cell.cellSize.x - this.width) / 2 + SUN_POSITION_SHIFT,
        (cell.getBottom() - this.height) - (cell.cellSize.y - this.height) / 2 - SUN_POSITION_SHIFT,
      );
      const sun: any = new SunCreator(
        this.engine,
        [position.x, position.y],
        'main',
        this.updateSunFunc,
        this.sunCount,
      ).instance;
      sun.addTo('scene');
      sun.switchState('appearance');

      setTimeout(() => {
        sun.switchState('live');
      }, SUN_APPEARANCE_STATE);
      if (this.isDestroyedFlag) {
        clearTimeout(this.sunCreatingTimer);
      }
      return this.sunCreatingTimer;
    };
    this.timer = setTimeout(start, SUN_REPRODUCTION);
  }

  draw(cell: Cell): void {
    super.draw(cell);
    this.init(cell);
  }

  switchState(state: string) {
    this.node.switchState(state);
    setTimeout(() => this.node.switchState('basic'), SUNFLOWER_GENERATE_STATE);
  }
}
