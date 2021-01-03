import Vector from '../engine/core/Vector';
import { Engine } from '../engine/types';

const X_OFFSET_COEF = 0.243;
const Y_OFFSET_COEF = 0.127;
const X_SIZE_COEF = 0.079;
const Y_SIZE_COEF = 0.167;

export default class Cell {
  public position: {x: number, y: number};

  private engine: Engine;

  private cellOffset: Vector;

  private cellSize: Vector;

  constructor(position: {x: number, y: number}, engine: Engine) {
    this.position = position;
    this.engine = engine;
    this.cellOffset = this.engine.vector(
      X_OFFSET_COEF * this.engine.size.x,
      Y_OFFSET_COEF * this.engine.size.y,
    ); // 250, 76
    this.cellSize = this.engine.vector(
      X_SIZE_COEF * this.engine.size.x,
      Y_SIZE_COEF * this.engine.size.y,
    ); // 81 * 100
  }

  public draw() {
    this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(
        this.cellOffset.x + this.position.x * this.cellSize.x,
        this.cellOffset.y + this.position.y * this.cellSize.y,
      ),
      size: this.cellSize,
      layer: 'main',
      color: 'rgba(255, 255, 255, 0.7)',
    });
  }

  public getTop() {
    return this.cellOffset.x;
  }

  public getBottom() {
    return this.cellOffset.x + this.cellSize.x;
  }

  public getLeft() {
    return this.cellOffset.y;
  }

  public getRight() {
    return this.cellOffset.y + this.cellSize.y;
  }
}
