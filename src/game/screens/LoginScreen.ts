import Engine from '../../engine';
import { ScreenCreator, TEXT_BUTTONS_COLOR, TEXT_BUTTONS_FONT } from './ScreenCreator';
import { IInputNode } from '../../engine/types';

const LOGIN_SCREEN_LAYERS: Array<string> = ['login-screen_background', 'login-screen_inputs'];
const LOGIN_SCREEN_SCREEN_NAME: string = 'loginScreen';
const LOGIN_SCREEN_SCENE_NAME: string = 'loginScreen';

export class LoginScreen extends ScreenCreator {
  private username: string;

  private password: string;

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
    const backgroundColor = this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: LOGIN_SCREEN_LAYERS[0],
      color: '#323649',
    });

    const BACKGROUND = this.engine
      .loader.files['assets/images/interface/register.png'] as HTMLImageElement;

    const background: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BACKGROUND.width / 2),
        (this.engine.size.y / 2) - (BACKGROUND.height / 2),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: LOGIN_SCREEN_LAYERS[0],
      img: BACKGROUND,
    });

    const BUTTON_CLOSE = this.engine
      .loader.files['assets/images/interface/Button.png'] as HTMLImageElement;

    const buttonClose: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (background.position.x) + (BACKGROUND.width / 2.7),
        (background.position.y) + (BACKGROUND.height / 1.18),
      ),
      size: this.engine.vector(113, 41),
      layer: LOGIN_SCREEN_LAYERS[1],
      img: BUTTON_CLOSE,
    });

    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonClose.position.x + 30,
        buttonClose.position.y + 10,
      ),
      text: 'CLOSE',
      layer: LOGIN_SCREEN_LAYERS[1],
      fontSize: 25,
      color: TEXT_BUTTONS_COLOR,
      font: TEXT_BUTTONS_FONT,
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

    const BUTTON_SUBMIT = this.engine
      .loader.files['assets/images/interface/Button.png'] as HTMLImageElement;

    const buttonSubmit: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (background.position.x) + (BACKGROUND.width / 4.6),
        (background.position.y) + (BACKGROUND.height / 1.5),
      ),
      size: this.engine.vector(113, 41),
      layer: LOGIN_SCREEN_LAYERS[1],
      img: BUTTON_SUBMIT,
    });
    const textButtonSubmit: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonSubmit.position.x + 30,
        buttonSubmit.position.y + 10,
      ),
      text: 'Log in',
      layer: LOGIN_SCREEN_LAYERS[1],
      fontSize: 25,
      color: TEXT_BUTTONS_COLOR,
      font: TEXT_BUTTONS_FONT,
    });

    this.setActive(
      buttonSubmit,
      'assets/images/interface/ButtonActive.png',
      'assets/images/interface/Button.png',
    );

    const BUTTON_REGISTER = this.engine
      .loader.files['assets/images/interface/Button.png'] as HTMLImageElement;

    const buttonRegister: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (background.position.x) + (BACKGROUND.width / 1.95),
        (background.position.y) + (BACKGROUND.height / 1.5),
      ),
      size: this.engine.vector(113, 41),
      layer: LOGIN_SCREEN_LAYERS[1],
      img: BUTTON_REGISTER,
    });
    const textButtonRegister: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonRegister.position.x + 25,
        buttonRegister.position.y + 10,
      ),
      text: 'Sing up',
      layer: LOGIN_SCREEN_LAYERS[1],
      fontSize: 25,
      color: TEXT_BUTTONS_COLOR,
      font: TEXT_BUTTONS_FONT,
    });

    this.setActive(
      buttonRegister,
      'assets/images/interface/ButtonActive.png',
      'assets/images/interface/Button.png',
    );

    const usernameNode = this.engine.createNode({
      type: 'InputNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (200 / 2),
        (this.engine.size.y / 2.5),
      ),
      layer: LOGIN_SCREEN_LAYERS[1],
      size: this.engine.vector(200, 30),
      placeholder: 'Enter username',
    }) as IInputNode;

    const passwordNode = this.engine.createNode({
      type: 'InputNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (200 / 2),
        (this.engine.size.x / 3.5),
      ),
      layer: LOGIN_SCREEN_LAYERS[1],
      size: this.engine.vector(200, 30),
      placeholder: 'Enter password',
    }) as IInputNode;

    this.engine.on(usernameNode, 'click', () => {
      usernameNode.input.focus();
    });

    this.engine.on(passwordNode, 'click', () => {
      passwordNode.input.focus();
    });

    usernameNode.input.onsubmit(() => {
      passwordNode.input.focus();
    });
    passwordNode.input.onsubmit(() => {
      passwordNode.input.blur();
    });

    this.setEvent(buttonRegister, 'click', () => {
      this.engine.audioPlayer.playSound('bleep');

      if (usernameNode.input.value() && passwordNode.input.value()) {
        console.log('Sing up');
        passwordNode.input.value('');
        // SING UP REQUEST

        // const formData = new FormData();
        // formData.append('login', username.value());
        // formData.append('password', password.value());
        // const xhr = new XMLHttpRequest();
        // xhr.open('POST', '/url'); // url
        // xhr.send(formData);
      } else {
        console.log('Enter data');
      }
    });

    this.setEvent(buttonSubmit, 'click', () => {
      this.engine.audioPlayer.playSound('bleep'); // sound ---------
      if (usernameNode.input.value() && passwordNode.input.value()) {
        console.log('Log in');
        // LOG IN REQUEST

        // const formData = new FormData();
        // formData.append('login', username.value());
        // formData.append('password', password.value());
        // const xhr = new XMLHttpRequest();
        // xhr.open('POST', '/url'); // url
        // xhr.send(formData);
      } else {
        console.log('Enter data');
      }
    });
  }
}
