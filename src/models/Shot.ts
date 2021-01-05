import Engine from '../engine';
import Vector from '../engine/core/Vector';

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
      node.move(this.engine.vector(2.4, 0));
      if (node.position.x >= this.engine.size.x) {
        node.destroy();
      }
    };

    image.addEventListener('load', () => {
      this.engine.createNode({
        type: 'ImageNode',
        position: this.engine.vector(this.position.x + 52, this.position.y + 5),
        size: this.engine.vector(image.width, image.height),
        layer: 'main',
        img: image,
        dh: image.height * 1,
      }, update)
        .addTo('scene');
    });
  }
}
