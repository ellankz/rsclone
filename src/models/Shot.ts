import { time } from 'console';
import { LEFT_CAMERA_OFFSET_COEF } from '../constats';
import Engine from '../engine';
import Vector from '../engine/core/Vector';
import Zombie from './Zombie';
import Plant from './Plant';

const SHOT_OFFSET_X = 52;
const SHOT_OFFSET_Y = 5;
const SHOT_SPEED = 3.5;

require.context('../assets/images/shot', true, /\.(png|jpg)$/);

export default class Shot {
  position: Vector;

  engine: Engine;

  type: string;

  shoot: any;

  constructor(position: Vector, engine: Engine, type: string) {
    this.position = position;
    this.engine = engine;
    this.type = type;
  }

  draw(zombie: Zombie, plant: Plant) {
    const image = new Image();
    image.src = `assets/images/shot/${this.type}.png`;

    let SHOOT_LENGTH = 0;

    if (zombie.name === 'dancer' || zombie.name === 'dancer_2' || zombie.name === 'dancer_3') {
      SHOOT_LENGTH = -50;
    } else {
      SHOOT_LENGTH = -80;
    }

    const update = (node: any) => {
      node.move(this.engine.vector(SHOT_SPEED, 0));
      if (node.position.x >= this.engine.size.x + (LEFT_CAMERA_OFFSET_COEF * this.engine.size.x)) {
        node.destroy();
      }
      if (zombie && zombie.position && zombie.position.x - node.position.x < SHOOT_LENGTH
      && zombie.position.x - node.position.x > -100 && plant.health > 0) {
        node.destroy();
        zombie.reduceHealth(plant.damage);
        this.engine.audioPlayer.playSound('shot');
      }
    };

    image.addEventListener('load', () => {
      this.shoot = this.engine.createNode({
        type: 'ImageNode',
        position: this.engine.vector(
          this.position.x + SHOT_OFFSET_X, this.position.y + SHOT_OFFSET_Y,
        ),
        size: this.engine.vector(image.width, image.height),
        layer: 'top',
        img: image,
        dh: image.height,
      }, update)
        .addTo('scene');
    });
  }

  destroy() {
    this.shoot.destroy();
  }
}
