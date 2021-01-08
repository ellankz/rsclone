import Vector from '../../engine/core/Vector';
import Engine from '../../engine';
import { SpriteStatesConfig } from '../../engine/types';

const sunImage = require('../../assets/sprites/sun.png');
const sunOpacityImage = require('../../assets/sprites/sun-opacity.png');
const sunAppearImage = require('../../assets/sprites/sun-appearance.png');

const SPEED_APPEARANCE = 1;
const SPEED_LIVE = 35;
const SPEED_DISAPPEAR = 35;

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
    const sunAppear: HTMLImageElement = new Image();
    sunAppear.src = sunAppearImage.default;
    this.frames = 22;
    this.states = {
      live: {
        img: this.img,
        frames: this.frames,
        speed: SPEED_LIVE,
        startFrame: 0,
        size: this.size,
        dh: this.dh,
        positionAdjust: new Vector(0, 0),
      },
      disappear: {
        img: sunOpacity,
        frames: 22,
        speed: SPEED_DISAPPEAR,
        startFrame: 0,
        size: this.size,
        dh: this.dh,
        positionAdjust: new Vector(0, 0),
      },
      appearance: {
        img: sunAppear,
        frames: 22,
        speed: SPEED_APPEARANCE,
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
