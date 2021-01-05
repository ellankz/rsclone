import { Sun } from '../sun/Sun';
import { NodesType } from '../../../engine/types';
import Cell from '../../Cell';
import Engine from '../../../engine';
import Vector from '../../../engine/core/Vector';

export class FallingSun {
  delay: number = 5000;

  engine: Engine;

  layer: string;

  isStopped: boolean;

  sunFallingTimer: any;

  scene: string;

  sunCount: { suns: number; };

  cells: Cell[][];

  updateSunCountInLevel: (count: number) => void;

  constructor(
    engine: Engine,
    sunCount: {suns: number},
    cells: Cell[][],
    updateSunCountInLevel: (count: number) => void,
  ) {
    this.engine = engine;
    this.layer = 'main';
    this.scene = 'scene';
    this.isStopped = false;
    this.sunCount = sunCount;
    this.cells = cells;
    this.updateSunCountInLevel = updateSunCountInLevel;
  }

  init(): void {
    // FallingSun.isStopped = false;
    // let timer = this.sunFallingTimer;
    // const { delay } = this;
    // const currentInstance: FallingSun = this;
    // function start(): any {
    //   timer = setTimeout(start, delay);
    //   console.log('sun fall! +25');
    //   const sun: ISpriteNode | IRectNode = currentInstance.createSun(78, 35);
    //   sun.addTo(currentInstance.scene);
    //
    //   if (FallingSun.isStopped) {
    //     clearTimeout(timer);
    //     console.log('Stop sun falling');
    //   }
    //   return timer;
    // }
    let timer = this.sunFallingTimer;
    this.isStopped = false;
    const start = (): void => {
      timer = setTimeout(start, this.delay);
      console.log('sun fall! +25');
      const sun: NodesType = this.createSun(78, 35);
      sun.addTo(this.scene);

      if (this.isStopped) {
        clearTimeout(timer);
        console.log('Stop sun falling');
      }
      this.sunFallingTimer = timer;
      return timer;
    };
    setTimeout(start, this.delay);
  }

  createSun(dh?: number, speed?: number):NodesType {
    const coordinates: Vector = this.getCenter(
      FallingSun.randomInteger(0, 8),
      FallingSun.randomInteger(0, 4),
    );
    const sunPositionCoordinates: Array<number> = [coordinates.x, 0];
    const sun = this.engine
      .createNode(new Sun(
        this.engine, this.layer, sunPositionCoordinates, dh || 78, speed || 35,
      ), () => this.updateSun(sun, coordinates.y));
    this.engine.on(sun, 'click', () => {
      // I need to redo it!!!!!!!------------------------------------------------{
      this.updateSunCountInLevel(this.sunCount.suns + 25);
      // ---------------------------------}
      sun.destroy();
      console.log('collect');
    });
    return sun;
  }

  private getCenter(row: number, column: number): Vector {
    const currentCell = this.cells[row][column];
    const position: Array<number> = [
      currentCell.getTop(),
      currentCell.getBottom(),
      currentCell.getLeft(),
      currentCell.getRight(),
    ];
    const centerY: number = position[1]
      - ((position[1] - position[0]) / FallingSun.randomInteger(1, 2));
    const centerX: number = position[3]
      - ((position[3] - position[2]) / FallingSun.randomInteger(1, 2));

    return this.engine.vector(centerX, centerY);
  }

  private updateSun(node: any, centerY: number): void {
    if (node.position.y <= centerY) {
      node.move(this.engine.vector(0, 1.8));
    }
  }

  stop(): void {
    this.isStopped = true;
  }

  static randomInteger(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
