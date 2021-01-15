import { time } from 'console';
import Engine from '../../engine';

export default class WinScene {
  private engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  public init() {
    this.engine.audioPlayer.stopSound('menu');
    this.engine.audioPlayer.playSound('win');
    this.createAnimation();
    return this;
  }

  private createAnimation() {
    const INTERVAL = 0.005;
    let opacity = 0;
    const timeInterval = INTERVAL;

    const bg: any = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: 'window',

      color: `rgba(255, 255, 255, ${opacity})`,
    }, () => {
      opacity += timeInterval;
      bg.color = `rgba(255, 255, 255, ${opacity})`;

      if (opacity >= 1.1) {
        // opacity = 1;
        // timeInterval = -(INTERVAL);
        bg.destroy();
      }
      // if (opacity < 0.001) {
      //   timeInterval = INTERVAL;
      //   bg.destroy();
      //   //bg.clearLayer();
      // }
    }).addTo('scene');
  }
}
