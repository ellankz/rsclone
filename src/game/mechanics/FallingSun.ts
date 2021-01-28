import Cell from '../models/Cell';
import Engine from '../../engine';
import Vector from '../../engine/core/Vector';
import { SunCreator } from './SunCreator';

const SUN_MOVING_SPEED = 1.8;
const SUN_INITIAL_POSITION = -80;

export class FallingSun {
  delay: number = 7000;

  engine: Engine;

  layer: string;

  isStopped: boolean;

  scene: string;

  sunCount: { suns: number };

  cells: Cell[][];

  name: string;

  sun: any;

  updateSunCountInLevel: (count: number) => void;

  constructor(
    engine: Engine,
    sunCount: { suns: number },
    cells: Cell[][],
    updateSunCountInLevel: (count: number) => void,
  ) {
    this.engine = engine;
    this.layer = 'top';
    this.scene = 'scene';
    this.name = 'sun';
    this.isStopped = false;
    this.sunCount = sunCount;
    this.cells = cells;
    this.updateSunCountInLevel = updateSunCountInLevel;
  }

  init(): void {
    this.isStopped = false;
    const start = (): void => {
      this.sun = this.createSun();
      this.sun.instance.addTo(this.scene);
    };

    const interval = this.engine.interval(() => start(), this.delay);

    this.engine.getTimer('levelTimer')?.add(interval);
  }

  createSun(): any {
    const coordinates: Vector = this.getCenter(
      FallingSun.randomInteger(0, 8),
      FallingSun.randomInteger(0, 4),
    );
    const sunPositionCoordinates: Array<number> = [coordinates.x, SUN_INITIAL_POSITION];
    const sun: any = new SunCreator(
      this.engine,
      sunPositionCoordinates,
      this.layer,
      this.name,
      this.updateSunCountInLevel,
      this.sunCount,
      () => this.updateSun(sun.instance, coordinates.y),
    );

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

    const randX = FallingSun.randomInteger(1, 2);
    const randY = FallingSun.randomInteger(1, 2);
    const centerY: number = position[1] - (position[1] - position[0]) / randX;
    const centerX: number = position[3] - (position[3] - position[2]) / randY;

    return this.engine.vector(centerX, centerY);
  }

  private updateSun(node: any, centerY: number): void {
    if (this.isStopped) return;
    if (node.position.y <= centerY) {
      node.move(this.engine.vector(0, SUN_MOVING_SPEED));
    }
  }

  pause(): void {
    this.isStopped = true;
  }

  static randomInteger(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
