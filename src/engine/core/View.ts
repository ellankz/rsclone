import Vector from './Vector';
import Layer from './Layer';
import Scene from './Scene';
import { IView } from '../types';

export default class View implements IView {
  position: Vector;

  layers: { [key: string]: Layer };

  scenes: { [key: string]: Scene };

  constructor(layers: { [key: string]: Layer }, scenes: { [key: string]: Scene }) {
    this.position = new Vector();
    this.layers = layers;
    this.scenes = scenes;
  }

  move(v: Vector) {
    this.position.plus(v);

    [...Object.values(this.layers)].forEach((layer) => layer.clear());
    [...Object.values(this.scenes)].forEach((scene) => scene.init());
  }

  getPosition = (v: Vector) => v.minus(this.position);
}
