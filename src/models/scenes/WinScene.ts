import Engine from '../../engine';

export default class WinScene {
  private engine: Engine;

  selfDelete: () => void;

  constructor(engine: Engine, selfDelete: () => void) {
    this.engine = engine;
    this.selfDelete = selfDelete;
  }

  public init(afterAnimationCallback: () => void) {
    this.engine.audioPlayer.stopSound('menu');
    this.engine.audioPlayer.playSound('win');
    this.createAnimation(afterAnimationCallback);
    return this;
  }

  private createAnimation(afterAnimationCallback: () => void) {
    const INTERVAL = 0.005;
    let opacity = 0;
    const timeInterval = INTERVAL;

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
          opacity += timeInterval;
          bg.color = `rgba(255, 255, 255, ${opacity})`;

          if (opacity >= 1.1) {
            afterAnimationCallback();
            bg.destroy();
            this.selfDelete();
          }
        },
      )
      .addTo('scene');
  }
}
