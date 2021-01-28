import Engine from '../../engine';

export default class WinScene {
  private engine: Engine;

  selfDelete: () => void;

  constructor(engine: Engine, selfDelete: () => void) {
    this.engine = engine;
    this.selfDelete = selfDelete;
  }

  public init(callback: () => void) {
    this.createAnimation(callback);
    return this;
  }

  private createAnimation(callback: () => void) {
    this.engine.audioPlayer.playSound('win');
    const INTERVAL = 0.005;
    let opacity = 0;

    const bg: any = this.engine
      .createNode(
        {
          type: 'RectNode',
          position: this.engine.vector(0, 0),
          size: this.engine.vector(this.engine.size.x, this.engine.size.y),
          layer: 'window',

          color: `rgba(255, 255, 255, ${opacity})`,
        },
        () => {
          opacity += INTERVAL;
          bg.color = `rgba(255, 255, 255, ${opacity})`;
          if (opacity >= 1.1) {
            bg.destroy();
            this.selfDelete();
            callback();
          }
        },
      )
      .addTo('scene');
  }
}
