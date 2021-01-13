import Engine from '../engine';
import { ScreenCreator } from './ScreenCreator';

const LEVEL_SELECTION_SCREEN_LAYERS: Array<string> = ['levelSelection-screen_background', 'levelSelection-screen_inputs'];
const LEVEL_SELECTION_SCREEN_SCREEN_NAME: string = 'levelSelectionScreen';
const LEVEL_SELECTION_SCREEN_SCENE_NAME: string = 'levelSelectionScreen';

export class LevelSelectionScreen extends ScreenCreator {
  private startLevel: () => void;

  constructor(engine: Engine, func: () => void) {
    super(engine);
    this.startLevel = func;
    this.createLayers(LEVEL_SELECTION_SCREEN_LAYERS);
    this.createNodes();
    this.engine.createScreen(LEVEL_SELECTION_SCREEN_SCREEN_NAME, LEVEL_SELECTION_SCREEN_LAYERS);
    this.engine.createScene(LEVEL_SELECTION_SCREEN_SCENE_NAME);
    this.startLevel = func;
  }

  public openScreen(): void {
    super.openScreen(LEVEL_SELECTION_SCREEN_SCREEN_NAME, LEVEL_SELECTION_SCREEN_SCENE_NAME);
  }

  private createNodes(): void {
    // BACKGROUND COLOR
    const background = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[0],
      color: '#8B4513',
    });

    // BACKGROUND IMG
    const BACKGROUND_IMG = this.engine
      .loader.files['assets/images/interface/settingBackground.jpg'] as HTMLImageElement;

    const backgroundImg = this.engine.createNode({
      type: 'ImageNode',
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BACKGROUND_IMG.width / 2),
        (this.engine.size.y / 2) - (BACKGROUND_IMG.height / 2),
      ),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[0],
      img: BACKGROUND_IMG,
    });

    // SCREEN TITLE
    const TITLE_IMG = this.engine
      .loader.files['assets/images/interface/AdventureTitle.png'] as HTMLImageElement;

    this.engine.createNode({
      type: 'ImageNode',
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      position: this.engine.vector(
        (this.engine.size.x / 2) - (TITLE_IMG.width / 2), 27,
      ),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[0],
      img: TITLE_IMG,
    });

    // LEVEL CARDS
    const LEVEL_CARD = this.engine
      .loader.files['assets/images/interface/selectLevelIcon_notActive.png'] as HTMLImageElement;

    const LEVEL_CARD_DISABLED = this.engine
      .loader.files['assets/images/interface/selectLevelIcon_disabled.png'] as HTMLImageElement;

    const levelCard1: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (backgroundImg.position.x / 2) + 100,
        (backgroundImg.position.y / 2) + 0.4 * (LEVEL_CARD.height),
      ),
      size: this.engine.vector(338, 402),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      img: LEVEL_CARD,
      dh: 250,
    });
    this.setActive(levelCard1,
      'assets/images/interface/selectLevelIcon_Active.png',
      'assets/images/interface/selectLevelIcon_notActive.png');
    this.setEvent(levelCard1, 'click', () => {
      this.startLevel();
      this.engine.stop();
      this.engine.start('scene');
    });

    const levelCard2: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (levelCard1.position.x) + (LEVEL_CARD.width * 0.75),
        (backgroundImg.position.y / 2) + 0.4 * (LEVEL_CARD.height),
      ),
      size: this.engine.vector(338, 402),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      img: LEVEL_CARD_DISABLED,
      dh: 250,
    });

    const levelCard3: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (levelCard2.position.x) + LEVEL_CARD.width * 0.75,
        (backgroundImg.position.y / 2) + 0.4 * (LEVEL_CARD.height),
      ),
      size: this.engine.vector(338, 402),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      img: LEVEL_CARD_DISABLED,
      dh: 250,
    });

    // BUTTON CLOSE
    const BUTTON_IMG = this.engine
      .loader.files['assets/images/interface/Button.png'] as HTMLImageElement;

    const buttonClose: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BUTTON_IMG.width / 2),
        (this.engine.size.y) - (BUTTON_IMG.width / 2),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      img: BUTTON_IMG,
    });

    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonClose.position.x + 16,
        buttonClose.position.y + 10,
      ),
      text: 'CLOSE',
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      fontSize: 25,
      color: '#333',
    });

    this.setActive(
      buttonClose,
      'assets/images/interface/ButtonActive.png',
      'assets/images/interface/Button.png',
    );
    this.setEvent(buttonClose, 'click', () => {
      this.engine.setScreen('startScreen');
    });
  }
}
