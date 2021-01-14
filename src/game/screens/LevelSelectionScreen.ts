import Engine from '../../engine';
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

  private createLevelCard(backgroundImg: any, disabled: boolean, i: number): any {
    const LEVEL_CARD = this.engine
      .loader.files['assets/images/interface/selectLevelIcon_notActive.png'] as HTMLImageElement;
    const LEVEL_CARD_DISABLED = this.engine
      .loader.files['assets/images/interface/selectLevelIcon_disabled.png'] as HTMLImageElement;

    const levelCard: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (backgroundImg.position.x) + 75 + i * LEVEL_CARD.width,
        (backgroundImg.position.y / 2) + 0.4 * (LEVEL_CARD.height),
      ),
      size: this.engine.vector(338, 402),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      img: (disabled) ? LEVEL_CARD_DISABLED : LEVEL_CARD,
      dh: 250,
    });

    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        levelCard.position.x + LEVEL_CARD.width / 6.25,
        levelCard.position.y + LEVEL_CARD.height / 2.2,
      ),
      text: `LEVEL ${i + 1}`,
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      fontSize: 25,
      color: '#fff',
    });
    return levelCard;
  }

  private createNodes(): void {
    // BACKGROUND IMG
    const BACKGROUND_IMG = this.engine
      .loader.files['assets/images/interface/settingBackground2L.png'] as HTMLImageElement;

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

    // LEVEL CARDS
    const levelCards: Array<any> = [];

    for (let i = 0; i < 3; i += 1) {
      let card: any;
      if (i === 0) {
        card = this.createLevelCard(backgroundImg, false, i);
        this.setActive(card,
          'assets/images/interface/selectLevelIcon_Active.png',
          'assets/images/interface/selectLevelIcon_notActive.png');
        this.setEvent(card, 'click', () => {
          this.engine.audioPlayer.playSound('tap'); // sound ---------
          this.startLevel();
          this.engine.stop();
          this.engine.start('scene');
        });
      } else {
        card = this.createLevelCard(backgroundImg, true, i);
      }
      levelCards.push(card);
    }

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

    buttonClose.addTo(LEVEL_SELECTION_SCREEN_SCENE_NAME);
    textButtonClose.addTo(LEVEL_SELECTION_SCREEN_SCENE_NAME);

    this.setActive(
      buttonClose,
      'assets/images/interface/ButtonActive.png',
      'assets/images/interface/Button.png',
    );
    this.setEvent(buttonClose, 'click', () => {
      this.engine.audioPlayer.playSound('bleep'); // sound ---------
      this.engine.setScreen('startScreen');
    });
  }
}
