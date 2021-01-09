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
      if (targetLayer.view) {
        const idx = targetLayer.view.layers.indexOf(layer);
        if (idx !== -1) targetLayer.view.layers.splice(idx, 1);
      }
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
