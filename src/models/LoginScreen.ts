import Engine from '../engine';
import { ScreenCreator } from './ScreenCreator';

import '../../node_modules/canvasinput/CanvasInput';

const windowCopy: any = window;
const { CanvasInput } = windowCopy;

const BACKGROUND_SRC = require('../assets/images/interface/register.png');
const BUTTON_SRC = require('../assets/images/interface/Button.png');

const LOGIN_SCREEN_LAYERS: Array<string> = ['login-screen_background', 'login-screen_inputs'];
const LOGIN_SCREEN_SCREEN_NAME: string = 'loginScreen';
const LOGIN_SCREEN_SCENE_NAME: string = 'loginScreen';

export class LoginScreen extends ScreenCreator {
  constructor(engine: Engine) {
    super(engine);
    this.createLayers(LOGIN_SCREEN_LAYERS);
    this.createNodes();
    this.engine.createScreen(LOGIN_SCREEN_SCREEN_NAME, LOGIN_SCREEN_LAYERS);
    this.engine.createScene(LOGIN_SCREEN_SCENE_NAME);
  }

  public openScreen(): void {
    super.openScreen(LOGIN_SCREEN_SCREEN_NAME, LOGIN_SCREEN_SCENE_NAME);
  }

  private createNodes(): void {
    // BACKGROUND
    const bgImage: HTMLImageElement = LoginScreen.createImg(BACKGROUND_SRC.default);
    const background: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (bgImage.width / 2),
        (this.engine.size.y / 2) - (bgImage.height / 2),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: LOGIN_SCREEN_LAYERS[0],
      img: bgImage,
    });

    // BUTTON CLOSE
    const buttonImg: HTMLImageElement = LoginScreen.createImg(BUTTON_SRC.default);
    const buttonClose: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (background.position.x) + (bgImage.width / 2.7),
        (background.position.y) + (bgImage.height / 1.18),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: LOGIN_SCREEN_LAYERS[1],
      img: buttonImg,
    });
    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(buttonClose.position.x, buttonClose.position.y),
      text: 'CLOSE',
      layer: LOGIN_SCREEN_LAYERS[1],
      fontSize: 20,
      color: 'grey',
    });
    this.setEvent(buttonClose, 'click', () => {
      this.engine.setScreen('startScreen');
    });

    // BUTTON SUBMIT
    const buttonSubmit: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (background.position.x) + (bgImage.width / 2.7),
        (background.position.y) + (bgImage.height / 1.5),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: LOGIN_SCREEN_LAYERS[1],
      img: buttonImg,
    });
    const textButtonSubmit: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(buttonSubmit.position.x, buttonSubmit.position.y),
      text: 'Submit',
      layer: LOGIN_SCREEN_LAYERS[1],
      fontSize: 20,
      color: 'grey',
    });
    this.setEvent(buttonSubmit, 'click', () => {
      this.engine.setScreen('startScreen');
    });
    // INPUTS

    const input = new CanvasInput({
      canvas: this.engine.getLayer(LOGIN_SCREEN_LAYERS[1]).canvas,
      fontSize: 18,
      // fontFamily: 'Arial',
      fontColor: '#212121',
      fontWeight: 'bold',
      width: 200,
      padding: 5,
      x: (this.engine.size.x / 2) - (200 / 2),
      y: (this.engine.size.x / 3),
      // borderWidth: 1,
      borderColor: '#FFF',
      borderRadius: 0,
      boxShadow: 'none',
      innerShadow: 'none',
      placeHolder: 'Enter you password',
    });
    const input2 = new CanvasInput({
      canvas: this.engine.getLayer(LOGIN_SCREEN_LAYERS[1]).canvas,
      fontSize: 18,
      // fontFamily: 'Arial',
      fontColor: '#212121',
      fontWeight: 'bold',
      width: 200,
      padding: 5,
      x: (this.engine.size.x / 2) - (200 / 2),
      y: (this.engine.size.x / 4),
      // borderWidth: 1,
      borderColor: '#FFF',
      borderRadius: 0,
      boxShadow: 'none',
      innerShadow: 'none',
      placeHolder: 'Enter you login',
    });
  }
}
