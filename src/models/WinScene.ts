import Engine from '../engine';

const audioUrl = require('../assets/audio/winmusic.mp3');

export default class WinScene {
  private engine: Engine;

  private winSound: HTMLAudioElement;

  constructor(engine: Engine) {
    this.engine = engine;
    this.winSound = new Audio();
  }

  public init() {
    this.createWinSound();
    this.createAnimation();
    return this;
  }

  private createAnimation() {
    this.engine.createScene('animation');
    let opacity = 0;
    let timeInterval = 0.003;

    const bg: any = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: 'top',

      color: `rgba(255, 255, 255, ${opacity})`,
    }, () => {
      opacity += timeInterval;
      bg.color = `rgba(255, 255, 255, ${opacity})`;
      if (opacity > 1) timeInterval *= -2;
    }).addTo('animation');

    if (timeInterval < 0) {
        timeInterval = 0;
        this.engine.stop();
    } else {
        this.engine.stop();
        this.engine.start('animation');    
    }
  }

  private createWinSound() {
    this.winSound.src = audioUrl.default;
    this.winSound.load();
    this.winSound.play();
  }
}
