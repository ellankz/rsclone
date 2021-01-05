import Vector from '../../engine/core/Vector';
import Engine from '../../engine';

const sunImage = require('../../assets/sprites/sun.png');

export class Sun {
  type: string;

  position: Vector;

  size: Vector;

  layer: string;

  img: HTMLImageElement;

  frames: number;

  speed?: number;

  dh?: number;

  engine: Engine;

  constructor(engine: Engine,
    layerName: string,
    posCoordinates?: Array<number>,
    dh?: number, speed?: number) {
    this.type = 'SpriteNode';
    this.position = engine.vector(posCoordinates[0] || 0, posCoordinates[1] || 0);
    this.size = engine.vector(1716, 78);
    this.layer = layerName;

    this.img = new Image();
    this.img.src = sunImage.default;

    this.frames = 22;

    this.engine = engine;
    if (speed) {
      this.speed = speed;
    }

    if (dh) {
      this.dh = dh;
    }
  }
}
