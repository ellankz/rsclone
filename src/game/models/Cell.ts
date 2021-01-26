import Vector from '../../engine/core/Vector';
import { Engine, NodesType } from '../../engine/types';

const X_OFFSET_COEF = 0.246;
const Y_OFFSET_COEF = 0.127;
const X_SIZE_COEF = 0.078;
const Y_SIZE_COEF = 0.167;

export default class Cell {
  public position: {x: number, y: number};

  private engine: Engine;

  private cellOffset: Vector;

  public cellSize: Vector;

  public node: NodesType;

  constructor(position: {x: number, y: number}, engine: Engine) {
    this.position = position;
    this.engine = engine;
    this.cellOffset = this.engine.vector(
      X_OFFSET_COEF * this.engine.size.x,
      Y_OFFSET_COEF * this.engine.size.y,
    );
    this.cellSize = this.engine.vector(
      X_SIZE_COEF * this.engine.size.x,
      Y_SIZE_COEF * this.engine.size.y,
    );
  }

  public draw() {
    this.node = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(
        this.cellOffset.x + this.position.x * this.cellSize.x,
        this.cellOffset.y + this.position.y * this.cellSize.y,
      ),
      size: this.cellSize,
      layer: 'main',
      color: 'rgba(255, 255, 255, 0.0)',
    });
  }

  public getTop() {
    return this.cellOffset.y + this.position.y * this.cellSize.y;
  }

  public getBottom() {
    return this.cellOffset.y + (this.position.y + 1) * this.cellSize.y;
  }

  public getLeft() {
    return this.cellOffset.x + this.position.x * this.cellSize.x;
  }

  public getRight() {
    return this.cellOffset.x + (this.position.x + 1) * this.cellSize.x;
  }
}
