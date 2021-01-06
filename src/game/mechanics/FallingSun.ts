import { Sun } from './Sun';
import { IImageNode, IRectNode, NodesType } from '../../engine/types';
import Cell from '../Cell';
import Engine from '../../engine';
import Vector from '../../engine/core/Vector';

const sunOpacityImage = require('../../assets/sprites/sun-opacity.png');

const SUN_COST = 25;
const SUN_DH = 78;
const SUN_ANIMATION_SPEED = 35;
const SUN_MOVING_SPEED = 1.8;
const SUN_INITIAL_POSITION = -80;
const CHANGE_STATE_DELAY = 7100;
const DESTROY_DELAY = 3000;

export class FallingSun {
  delay: number = 5000;

  engine: Engine;

  layer: string;

  isStopped: boolean;

  scene: string;

  sunCount: { suns: number; };

  cells: Cell[][];

  updateSunCountInLevel: (count: number) => void;

  sunFallingTimer: any;

  private sunOpacity: HTMLImageElement;

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
    this.sunOpacity = new Image();
    this.sunOpacity.src = sunOpacityImage.default;
  }

  init(): void {
    this.isStopped = false;
    const start = (): void => {
      this.sunFallingTimer = setTimeout(start, this.delay);
      const sun: NodesType = this.createSun(SUN_DH, SUN_ANIMATION_SPEED);
      sun.addTo(this.scene);
      setTimeout(() => this.changeAnimation(sun), CHANGE_STATE_DELAY);
      if (this.isStopped) {
        clearTimeout(this.sunFallingTimer);
      }
      return this.sunFallingTimer;
    };
    setTimeout(start, this.delay);
  }

  createSun(dh?: number, speed?: number):NodesType {
    const coordinates: Vector = this.getCenter(
      FallingSun.randomInteger(0, 8),
      FallingSun.randomInteger(0, 4),
    );
    const sunPositionCoordinates: Array<number> = [coordinates.x, SUN_INITIAL_POSITION];
    const sunConfig: any = new Sun(
      this.engine, this.layer, sunPositionCoordinates, dh || SUN_DH, speed || SUN_ANIMATION_SPEED,
    );
    const sun = this.engine
      .createNode(sunConfig, () => this.updateSun(sun, sunConfig, coordinates.y));
    this.engine.on(sun, 'click', () => {
      this.updateSunCountInLevel(this.sunCount.suns + SUN_COST);
      sun.destroy();
      if (this.engine.getSceneNodes('scene').length === 0) {
        sun.clearLayer();
      }
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

  private updateSun(node: any, sun:any, centerY: number): void {
    if (node.position.y <= centerY) {
      node.move(this.engine.vector(0, SUN_MOVING_SPEED));
    }
  }

  changeAnimation(node: any): void {
    const newNode = node;
    setTimeout(() => {
      newNode.img = this.sunOpacity;
      newNode.startFrame = 0;
      setTimeout(() => newNode.destroy(), DESTROY_DELAY);
    }, 5000);
  }

  stop(): void {
    this.isStopped = true;
  }

  static randomInteger(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}