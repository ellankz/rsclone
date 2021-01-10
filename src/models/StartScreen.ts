import Engine from '../engine';
import Vector from '../engine/core/Vector';
import { ScreenCreator } from './ScreenCreator';
import { LoginScreen } from './LoginScreen';
import { SettingsScreen } from './SettingsScreen';

const BACKGROUND_SRC = require('../assets/images/interface/SelectorBackground.png');
const START_GAME_BUTTON_SRC = require('../assets/images/interface/startScreen-button-notActive2.png');
const START_GAME_BUTTON_SRC_ACTIVE = require('../assets/images/interface/startScreen-button-Active2.png');
const SETTINGS_BUTTON_SRC = require('../assets/images/interface/startScreen-button_settings-notActive.png');
const SETTINGS_BUTTON_SRC_ACTIVE = require('../assets/images/interface/startScreen-button_settings-Active.png');
const AUTORIZATION_CARD_IMG = require('../assets/images/interface/autorization-card.png');
const AUTORIZATION_BUTTON_IMG = require('../assets/images/interface/Button2.png');

const START_SCREEN_LAYERS: Array<string> = ['start-screen_background', 'start-screen_buttons'];
const START_SCREEN_SCREEN_NAME: string = 'startScreen';
const START_SCREEN_SCENE_NAME: string = 'startScreen';
// const START_GAME_BUTTON_POSITION: {x: number, y: number} = { x: 485, y: 90 };
// const SETTINGS_BUTTON_POSITION: {x: number, y: number} = { x: 485, y: 210 };
// const AUTORIZATION_BACKGROUND_POSITION: {x: number, y: number} = { x: 20, y: 0 };
// const AUTORIZATION_BUTTON_POSITION: {x: number, y: number} = { x: 25, y: 94 };
const USER_NAME_POSITION: {x: number, y: number} = { x: 70, y: 60 };

export class StartScreen extends ScreenCreator {
  public userName: string = 'Guest';

  private loginScreen: any = new LoginScreen(this.engine);

  private settingsScreen: any = new SettingsScreen(this.engine);

  constructor(engine: Engine, userName?: string) {
    super(engine);
    if (userName) {
      this.userName = userName;
    }
    this.createLayers(START_SCREEN_LAYERS);
    this.createNodes();
    this.engine.createScreen(START_SCREEN_SCREEN_NAME, START_SCREEN_LAYERS);
    this.engine.createScene(START_SCREEN_SCENE_NAME);
  }

  public openScreen(): void {
    super.openScreen(START_SCREEN_SCREEN_NAME, START_SCREEN_SCENE_NAME);
  }

  private createNodes(): void {
    // BACKGROUND
    const backgroundImgElem: HTMLImageElement = StartScreen.createImg(BACKGROUND_SRC.default);
    const backgroundImg: any = this.engine.createNode({
      type: 'ImageNode',
      // position: this.engine.vector(0, 0),
      position: this.engine.vector(
        (this.engine.size.x / 2) - (backgroundImgElem.width / 2),
        (this.engine.size.y / 2) - (backgroundImgElem.height / 2),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: START_SCREEN_LAYERS[0],
      img: backgroundImgElem,

    });

    // ADVENTURE BUTTON
    const startImgButton: HTMLImageElement = StartScreen.createImg(START_GAME_BUTTON_SRC.default);
    const startGameButton: any = this.engine.createNode({
      type: 'ImageNode',
      // position: this.engine.vector(START_GAME_BUTTON_POSITION.x, START_GAME_BUTTON_POSITION.y),
      position: this.engine.vector(
        backgroundImgElem.width - 1.25 * startImgButton.width,
        backgroundImgElem.height - 3.55 * startImgButton.height,
      ),
      size: this.engine.vector(330, 143),
      layer: START_SCREEN_LAYERS[1],
      img: startImgButton,
    });

    this.engine.on(startGameButton, 'click', () => {
      this.engine.stop();
      this.engine.setScreen('first');
      this.engine.start('scene');
    });

    // SETTINGS BUTTON
    const settingsGameButtonImg: HTMLImageElement = StartScreen.createImg(
      SETTINGS_BUTTON_SRC.default,
    );
    const settingsGameButton: any = this.engine.createNode({
      type: 'ImageNode',
      // position: this.engine.vector(SETTINGS_BUTTON_POSITION.x, SETTINGS_BUTTON_POSITION.y),
      position: this.engine.vector(
        backgroundImgElem.width - 1.33 * settingsGameButtonImg.width,
        backgroundImgElem.height - 2.8 * settingsGameButtonImg.height,
      ),
      size: this.engine.vector(312, 131),
      layer: START_SCREEN_LAYERS[1],
      img: settingsGameButtonImg,
    });
    this.setEvent(settingsGameButton, 'click', () => {
      this.settingsScreen.openScreen();
    });

    // USERNAME TEXT
    const userName: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(USER_NAME_POSITION.x, USER_NAME_POSITION.y),
      text: this.userName,
      layer: START_SCREEN_LAYERS[0],
      fontSize: 20,
      color: 'black',
    });

    // USERNAME BACKGROUND
    const autorizationBackgroundImg: HTMLImageElement = StartScreen.createImg(
      AUTORIZATION_CARD_IMG.default,
    );
    const autorizationBackground: any = this.engine.createNode({
      type: 'ImageNode',
      // position: this.engine.vector(
      //   AUTORIZATION_BACKGROUND_POSITION.x,
      //   AUTORIZATION_BACKGROUND_POSITION.y,
      // ),
      position: this.engine.vector(
        backgroundImg.position.x + 20,
        backgroundImg.position.y,
      ),
      size: this.engine.vector(287, 150),
      layer: START_SCREEN_LAYERS[0],
      img: autorizationBackgroundImg,
      dh: 100,
    });

    // LOGIN BUTTON
    const autorizationButton: any = this.engine.createNode({
      type: 'ImageNode',
      // position: this.engine.vector(
      //   AUTORIZATION_BUTTON_POSITION.x,
      //   AUTORIZATION_BUTTON_POSITION.y,
      // ),
      position: this.engine.vector(
        backgroundImg.position.x + 25,
        backgroundImg.position.y + autorizationBackground.dh - 7,
      ),
      size: this.engine.vector(290, 70),
      layer: START_SCREEN_LAYERS[1],
      img: StartScreen.createImg(AUTORIZATION_BUTTON_IMG.default),
      dh: 45,
    });
    this.setEvent(autorizationButton, 'click', () => {
      this.loginScreen.openScreen();
    });
  }
}
