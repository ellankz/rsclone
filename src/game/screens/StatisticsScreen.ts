import { ScreenCreator } from './ScreenCreator';
import Engine from '../../engine';

const STATISTICS_SCREEN_LAYERS: Array<string> = ['statistics-screen_background', 'statistics-screen_elements'];
const STATISTIC_SCREEN_SCREEN_NAME: string = 'statisticsScreen';
const STATISTIC_SCREEN_SCENE_NAME: string = 'statisticsScreen';

export class StatisticsScreen extends ScreenCreator {
  constructor(engine: Engine) {
    super(engine);
    this.createLayers(STATISTICS_SCREEN_LAYERS);
    this.createNodes();
    this.engine.createScreen(STATISTIC_SCREEN_SCREEN_NAME, STATISTICS_SCREEN_LAYERS);
    this.engine.createScene(STATISTIC_SCREEN_SCENE_NAME);
  }

  public openScreen(): void {
    super.openScreen(STATISTIC_SCREEN_SCREEN_NAME, STATISTIC_SCREEN_SCENE_NAME);
  }

  private createNodes(): void {
    const background = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: STATISTICS_SCREEN_LAYERS[0],
      color: '#8B4513',
    });

    const BACKGROUND_IMG = this.engine
      .loader.files['assets/images/interface/settingBackground.jpg'] as HTMLImageElement;

    const backgroundImg = this.engine.createNode({
      type: 'ImageNode',
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BACKGROUND_IMG.width / 2),
        (this.engine.size.y / 2) - (BACKGROUND_IMG.height / 2),
      ),
      layer: STATISTICS_SCREEN_LAYERS[0],
      img: BACKGROUND_IMG,
    });

    const BUTTON_IMG = this.engine
      .loader.files['assets/images/interface/Button.png'] as HTMLImageElement;

    const buttonClose: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BUTTON_IMG.width / 2),
        (this.engine.size.y) - (BUTTON_IMG.width / 2),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: STATISTICS_SCREEN_LAYERS[1],
      img: BUTTON_IMG,
    });

    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonClose.position.x + 16,
        buttonClose.position.y + 10,
      ),
      text: 'CLOSE',
      layer: STATISTICS_SCREEN_LAYERS[1],
      fontSize: 25,
      color: '#333',
    });

    this.setActive(
      buttonClose,
      'assets/images/interface/ButtonActive.png',
      'assets/images/interface/Button.png',
    );
    this.setEvent(buttonClose, 'click', () => {
      this.engine.audioPlayer.playSound('bleep');
      this.engine.setScreen('startScreen');
    });
  }
}
