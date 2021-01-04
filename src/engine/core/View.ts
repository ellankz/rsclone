import Vector from './Vector';
import { IView, ILayer, IVector } from '../types';

export default class View implements IView {
  position: IVector;

  layers: ILayer[];

  constructor(layers: ILayer[]) {
    this.position = new Vector();
    this.layers = layers;
    this.layers.forEach((layer) => {
      const targetLayer = layer;
      targetLayer.view = this;
    });
  }

  move(v: IVector) {
    this.position.plus(v);

    this.layers.forEach((layer) => {
      layer.clear();
      layer.update();
    });
  }

  getPosition = (v: IVector) => v.minus(this.position);
}
