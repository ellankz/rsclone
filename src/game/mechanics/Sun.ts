import Vector from '../../engine/core/Vector';
import Engine from '../../engine';
import { SpriteStatesConfig } from '../../engine/types';

const sunImage = require('../../assets/sprites/sun.png');
const sunOpacityImage = require('../../assets/sprites/sun-opacity.png');

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

  states: SpriteStatesConfig;

  constructor(engine: Engine,
    layerName: string,
    posCoordinates?: Array<number>,
    dh?: number,
    speed?: number) {
    this.type = 'SpriteNode';
    this.position = engine.vector(posCoordinates[0] || 0, posCoordinates[1] || 0);
    this.size = engine.vector(1716, 78);
    this.layer = layerName;

    this.img = new Image();
    this.img.src = sunImage.default;
    const sunOpacity: HTMLImageElement = new Image();
    sunOpacity.src = sunOpacityImage.default;
    this.frames = 22;
    this.states = {
      live: {
        img: this.img, // HTMLImageElement
        frames: this.frames,
        speed: this.speed,
        startFrame: 0,
        size: this.size,
        dh: this.dh,
        positionAdjust: new Vector(0, 0),
      },
      disappear: {
        img: sunOpacity, // HTMLImageElement
        frames: 22,
        speed: this.speed,
        startFrame: 0,
        size: this.size,
        dh: this.dh,
        positionAdjust: new Vector(0, 0),
      },
    };

    this.engine = engine;
    if (speed) {
      this.speed = speed;
    }

    if (dh) {
      this.dh = dh;
    }
  }

  opacitySprite() {
    this.img = sunOpacityImage.default;
  }
}
