import { time } from 'console';
import Engine from '../engine';

// const audioUrl = require('../assets/audio/winmusic.mp3');

export default class WinScene {
  private engine: Engine;

  private winSound: HTMLAudioElement;

  constructor(engine: Engine) {
    this.engine = engine;
    this.winSound = new Audio();
  }

  public init() {
    // this.createWinSound();
    this.createAnimation();
    return this;
  }

  private createAnimation() {
    const INTERVAL = 0.005;

    this.engine.createScene('animation');
    let opacity = 0;
    let timeInterval = INTERVAL;

    const bg: any = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: 'top',

      color: `rgba(255, 255, 255, ${opacity})`,
    }, () => {
      opacity += timeInterval;
      bg.color = `rgba(255, 255, 255, ${opacity})`;

      if (opacity >= 1.1) {
        this.engine.stop();
        opacity = 1;
        timeInterval = -(INTERVAL);
        this.engine.start('animation');
      }
      if (opacity < 0.001) {
        this.engine.stop();
        timeInterval = INTERVAL;
        bg.destroy();
        bg.clearLayer();
      }
    }).addTo('animation');

    this.engine.stop();
    this.engine.start('animation');
  }

  // private createWinSound() {
  //   this.winSound.src = audioUrl.default;
  //   this.winSound.load();
  //   this.winSound.play();
  // }
}
