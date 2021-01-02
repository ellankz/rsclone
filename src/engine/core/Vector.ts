import { IVector } from '../types';

export default class Vector implements IVector {
  x: number;

  y: number;

  constructor(x?: number, y?: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  plus(v: IVector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  minus(v: IVector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
}
