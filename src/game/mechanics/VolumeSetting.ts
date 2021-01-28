import Engine from '../../engine';
import RectNode from '../../engine/nodes/RectNode';
import TextNode from '../../engine/nodes/TextNode';

export default class VolumeSetting {
  engine: Engine;

  textNode: TextNode;

  rectangles: RectNode[] = [];

  volume: number;

  shiftX: number;

  constructor(engine: Engine) {
    this.engine = engine;
    this.shiftX = this.engine.getLayer('window').view.position.x;
  }

  public init() {
    this.volume = this.engine.audioPlayer.volume;
    this.draw();
    this.listen();
  }

  private draw() {
    this.drawText();
    this.drawColumns();
  }

  private drawText() {
    this.textNode = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        (this.engine.size.x / 2 - 60) + this.shiftX,
        this.engine.size.y / 1.78 + 15,
      ),
      text: 'volume',
      layer: 'window',
      font: 'Samdan',
      fontSize: 20,
      color: '#d9bc6b',
    }) as TextNode;
  }

  private drawColumns() {
    for (let i = 1; i <= 6; i += 1) {
      const opacity = this.volume >= (i - 1) * 0.2 ? 1 : 0.5;
      const rect = this.engine.createNode({
        type: 'RectNode',
        position: this.engine.vector(
          (this.engine.size.x / 2) + (i * 15) + this.shiftX,
          this.engine.size.y / 1.7 - (i * 10) + 15,
        ),
        size: this.engine.vector(10, i * 10),
        layer: 'window',
        color: '#d9bc6b',
        opacity,
      }) as RectNode;
      this.rectangles.push(rect);
    }
  }

  private listen() {
    this.rectangles.forEach((rect, index) => {
      this.engine.on(rect, 'click', () => {
        this.engine.audioPlayer.playSound('buzzer');
        this.volume = index * 0.2;
        this.engine.audioPlayer.setVolume(this.volume);
        this.updateRectangles();
      });
    });
  }

  private updateRectangles() {
    this.rectangles.forEach((rect, index) => {
      const rectangle = rect;
      rectangle.opacity = this.volume >= index * 0.2 ? 1 : 0.5;
      rectangle.clearLayer();
    });
  }

  public destroyNodes() {
    if (this.textNode) this.textNode.destroy();
    this.rectangles.forEach((rect) => rect.destroy());
  }
}
