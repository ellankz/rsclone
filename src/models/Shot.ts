import Engine from '../engine';
import Vector from '../engine/core/Vector';

const SHOT_OFFSET_X = 52;
const SHOT_OFFSET_Y = 5;
const SHOT_SPEED = 3;

require.context('../assets/images/shot', true, /\.(png|jpg)$/);

export default class Shot {
  position: Vector;

  engine: Engine;

  type: string;

  constructor(position: Vector, engine: Engine, type: string) {
    this.position = position;
    this.engine = engine;
    this.type = type;
  }

  draw() {
    const image = new Image();
    image.src = `assets/images/shot/${this.type}.png`;

    const update = (node: any) => {
      node.move(this.engine.vector(SHOT_SPEED, 0));
      if (node.position.x >= this.engine.size.x) {
        node.destroy();
      }
    };

    image.addEventListener('load', () => {
      this.engine.createNode({
        type: 'ImageNode',
        position: this.engine.vector(
          this.position.x + SHOT_OFFSET_X, this.position.y + SHOT_OFFSET_Y,
        ),
        size: this.engine.vector(image.width, image.height),
        layer: 'main',
        img: image,
        dh: image.height,
      }, update)
        .addTo('scene');
    });
  }
}
