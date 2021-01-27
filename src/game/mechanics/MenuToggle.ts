import Engine from '../../engine';
import ImageNode from '../../engine/nodes/ImageNode';
import TextNode from '../../engine/nodes/TextNode';

export default class MenuToggle {
  engine: Engine;

  buttonNode: ImageNode;

  textNode: TextNode;

  bg: HTMLImageElement;

  constructor(engine: Engine) {
    this.engine = engine;
    this.bg = this.engine.loader.files['assets/images/interface/Button.png'] as HTMLImageElement;
  }

  init(openMenu: (event: KeyboardEvent) => void) {
    this.draw();
    this.listen(openMenu);
  }

  listen(openMenu: (event: KeyboardEvent) => void) {
    const active = this.engine.loader.files['assets/images/interface/ButtonActive.png'] as HTMLImageElement;

    this.engine.on(this.buttonNode, 'mousedown', () => {
      this.buttonNode.img = active;
      this.buttonNode.clearLayer();
    });

    this.engine.on(this.buttonNode, 'mouseup', () => {
      this.buttonNode.img = this.bg;
      this.buttonNode.clearLayer();
    });

    this.engine.on(this.buttonNode, 'click', openMenu);
  }

  draw() {
    this.buttonNode = this.engine.createNode(
      {
        type: 'ImageNode',
        position: this.engine.vector(this.engine.size.x - 100, 5),
        size: this.engine.vector(113, 41),
        layer: 'main',
        img: this.bg,
        dh: 32,
      },
    ) as ImageNode;

    this.textNode = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(this.engine.size.x - 75, 10),
      text: 'menu',
      layer: 'main',
      font: 'Samdan',
      fontSize: 24,
      color: '#0daf1b',
    }) as TextNode;
  }

  destroy() {
    this.buttonNode.destroy();
    this.textNode.destroy();
  }
}
