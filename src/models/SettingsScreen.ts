import { ScreenCreator } from './ScreenCreator';
import Engine from '../engine';

const BACKGROUND_IMG_SRC = require('../assets/images/interface/settingBackground.jpg');
const BUTTON_SRC = require('../assets/images/interface/Button.png');

const SETTINGS_SCREEN_LAYERS: Array<string> = ['settings-screen_background', 'settings-screen_elements'];
const SETTINGS_SCREEN_SCREEN_NAME: string = 'settingsScreen';
const SETTINGS_SCREEN_SCENE_NAME: string = 'settingsScreen';

export class SettingsScreen extends ScreenCreator {
  constructor(engine: Engine) {
    super(engine);
    this.createLayers(SETTINGS_SCREEN_LAYERS);
    this.createNodes();
    this.engine.createScreen(SETTINGS_SCREEN_SCREEN_NAME, SETTINGS_SCREEN_LAYERS);
    this.engine.createScene(SETTINGS_SCREEN_SCENE_NAME);
  }

  public openScreen(): void {
    super.openScreen(SETTINGS_SCREEN_SCREEN_NAME, SETTINGS_SCREEN_SCENE_NAME);
  }

  private createNodes(): void {
    // BACKGROUND COLOR
    const background = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: SETTINGS_SCREEN_LAYERS[0],
      color: '#8B4513',
    });

    // BACKGROUND IMG
    const backgroundImgElem: HTMLImageElement = SettingsScreen.createImg(
      BACKGROUND_IMG_SRC.default,
    );
    const backgroundImg = this.engine.createNode({
      type: 'ImageNode',
      // position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      position: this.engine.vector(
        (this.engine.size.x / 2) - (backgroundImgElem.width / 2),
        (this.engine.size.y / 2) - (backgroundImgElem.height / 2),
      ),
      layer: SETTINGS_SCREEN_LAYERS[0],
      img: backgroundImgElem,
    });
    // BUTTON CLOSE
    const buttonImg: HTMLImageElement = SettingsScreen.createImg(BUTTON_SRC.default);
    const buttonClose: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (buttonImg.width / 2),
        (this.engine.size.y) - (buttonImg.width / 2),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: SETTINGS_SCREEN_LAYERS[1],
      img: buttonImg,
    });
    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(buttonClose.position.x, buttonClose.position.y),
      text: 'CLOSE',
      layer: SETTINGS_SCREEN_LAYERS[1],
      fontSize: 20,
      color: 'grey',
    });
    this.setEvent(buttonClose, 'click', () => {
      this.engine.setScreen('startScreen');
    });
  }
}
