import Engine from '../../engine';
import { ScreenCreator, TEXT_BUTTONS_COLOR, TEXT_BUTTONS_FONT } from './ScreenCreator';
import ImageNode from '../../engine/nodes/ImageNode';
import { IImageNode } from '../../engine/types';

const LEVEL_SELECTION_SCREEN_LAYERS: Array<string> = ['levelSelection-screen_background', 'levelSelection-screen_inputs'];
const LEVEL_SELECTION_SCREEN_SCREEN_NAME: string = 'levelSelectionScreen';
const LEVEL_SELECTION_SCREEN_SCENE_NAME: string = 'levelSelectionScreen';

export class LevelSelectionScreen extends ScreenCreator {
  private startLevel: (levelNumber: number) => void;

  private levelCards: Array<ImageNode> = [];

  private numberOfLevels: number = 10;

  private numberOfActiveLevels: number = 10;

  constructor(engine: Engine, func: (levelNumber: number) => void) {
    super(engine);
    this.startLevel = func;
    this.createLayers(LEVEL_SELECTION_SCREEN_LAYERS);
    this.createNodes();
    this.createNavigationButtons();
    this.engine.createScreen(LEVEL_SELECTION_SCREEN_SCREEN_NAME, LEVEL_SELECTION_SCREEN_LAYERS);
    this.engine.createScene(LEVEL_SELECTION_SCREEN_SCENE_NAME);
    this.startLevel = func;
  }

  public openScreen(): void {
    super.openScreen(LEVEL_SELECTION_SCREEN_SCREEN_NAME, LEVEL_SELECTION_SCREEN_SCENE_NAME);
  }

  private createLevelCard(backgroundImg: any, disabled: boolean, i: number) {
    const LEVEL_CARD = this.engine
      .loader.files['assets/images/interface/selectLevelIcon_notActive.png'] as HTMLImageElement;

    const LEVEL_CARD_NIGHT = this.engine
      .loader.files['assets/images/interface/levelDarkCard_notActive.png'] as HTMLImageElement;

    const LEVEL_CARD_DISABLED = this.engine
      .loader.files['assets/images/interface/selectLevelIcon_disabled.png'] as HTMLImageElement;

    const LEVEL_CARD_ZOMBIE = this.engine
      .loader.files[`assets/images/levels/${i}.png`] as HTMLImageElement;

    const img = i < 6 ? LEVEL_CARD : LEVEL_CARD_NIGHT;

    const levelcardPosition = this.engine.vector(
      (this.engine.size.x * i) / 3 + 65,
      (backgroundImg.position.y / 2) + 0.4 * (LEVEL_CARD.height),
    );

    const levelCard = this.engine.createNode({
      type: 'ImageNode',
      position: levelcardPosition,
      size: this.engine.vector(338, 402),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      img: (disabled) ? LEVEL_CARD_DISABLED : img,
      dh: 250,
    });

    const cardZombie = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(levelcardPosition.x + 30, levelcardPosition.y + 10),
      size: this.engine.vector(201, 175),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      img: LEVEL_CARD_ZOMBIE,
      dh: 125,
    });

    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        levelCard.position.x + LEVEL_CARD.width / 4.5,
        levelCard.position.y + LEVEL_CARD.height / 2.2,
      ),
      text: `LEVEL ${i + 1}`,
      layer: LEVEL_SELECTION_SCREEN_LAYERS[1],
      fontSize: 25,
      font: TEXT_BUTTONS_FONT,
      color: '#fff',
    });
    return { levelCard, cardZombie };
  }

  private createNavigationButtons(): void {
    const BUTTON_RIGHT = this.engine
      .loader.files['assets/images/interface/buttonRight.png'] as HTMLImageElement;

    const BUTTON_LEFT = this.engine
      .loader.files['assets/images/interface/buttonLeft.png'] as HTMLImageElement;

    const buttonLeft: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        150,
        (this.engine.size.y) - (BUTTON_LEFT.height * 2),
      ),
      size: this.engine.vector(50, 41),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[0],
      img: BUTTON_LEFT,
    });

    const buttonRight: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x - 189),
        (this.engine.size.y) - (BUTTON_RIGHT.height * 2),
      ),
      size: this.engine.vector(50, 41),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[0],
      img: BUTTON_RIGHT,
    });

    this.setActive(
      buttonRight,
      'assets/images/interface/buttonRight_Active.png',
      'assets/images/interface/buttonRight.png',
    );

    this.setActive(
      buttonLeft,
      'assets/images/interface/buttonLeft_Active.png',
      'assets/images/interface/buttonLeft.png',
    );

    const levelsView = this.engine.createView([LEVEL_SELECTION_SCREEN_LAYERS[1]]);

    let isButtonFree: boolean = true;

    const moveCards = (direction: boolean): void => {
      isButtonFree = false;
      let fieldSize: number = this.engine.size.x;
      const moveDirection: number = direction ? 10 : -10;
      const animation: any = this.engine.interval(() => {
        levelsView.move(this.engine.vector(moveDirection));
        fieldSize -= 10;
        if (fieldSize === 0) {
          animation.destroy();
          isButtonFree = true;
        }
      }, 5).start();
    };

    this.engine.on(buttonRight, 'click', () => {
      if ((levelsView.position.x <= this.engine.size.x * (this.numberOfLevels / 3 - 1))
        && isButtonFree === true) {
        this.engine.audioPlayer.playSound('bleep');
        moveCards(true);
      }
    });

    this.engine.on(buttonLeft, 'click', () => {
      if ((levelsView.position.x - this.engine.size.x >= 0) && isButtonFree === true) {
        this.engine.audioPlayer.playSound('bleep');
        moveCards(false);
      }
    });
  }

  private createNodes(): void {
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

    for (let i = 0; i < this.numberOfLevels; i += 1) {
      let card: IImageNode;
      if (i < this.numberOfActiveLevels) {
        const { levelCard, cardZombie } = this.createLevelCard(backgroundImg, false, i);
        card = levelCard as IImageNode;
        const img = i < 6 ? 'assets/images/interface/selectLevelIcon_Active.png' : 'assets/images/interface/levelDarkCard_Active.png';
        const imgDis = i < 6 ? 'assets/images/interface/selectLevelIcon_notActive.png' : 'assets/images/interface/levelDarkCard_notActive.png';
        this.setActive(card, img, imgDis);
        const clickHandler = () => {
          this.engine.audioPlayer.playSound('tap');
          this.startLevel(i);
          this.engine.stop();
          this.engine.start('scene');
        };
        this.setEvent(card, 'click', clickHandler);
        this.setEvent(cardZombie, 'click', clickHandler);
      } else {
        const { levelCard } = this.createLevelCard(backgroundImg, true, i);
        card = levelCard as IImageNode;
      }
      this.levelCards.push(card);
    }

    const BUTTON_IMG = this.engine
      .loader.files['assets/images/interface/Button.png'] as HTMLImageElement;

    const buttonClose: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BUTTON_IMG.width / 2),
        (this.engine.size.y) - (BUTTON_IMG.width / 2),
      ),
      size: this.engine.vector(113, 41),
      layer: LEVEL_SELECTION_SCREEN_LAYERS[0],
      img: BUTTON_IMG,
    });

    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonClose.position.x + 36,
        buttonClose.position.y + 10,
      ),
      text: 'CLOSE',
      layer: LEVEL_SELECTION_SCREEN_LAYERS[0],
      fontSize: 25,
      color: TEXT_BUTTONS_COLOR,
      font: TEXT_BUTTONS_FONT,
    });

    buttonClose.addTo(LEVEL_SELECTION_SCREEN_SCENE_NAME);
    textButtonClose.addTo(LEVEL_SELECTION_SCREEN_SCENE_NAME);

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
