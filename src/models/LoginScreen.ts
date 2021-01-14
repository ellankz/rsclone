import Engine from '../engine';
import { ScreenCreator } from './ScreenCreator';
import '../../node_modules/canvasinput/CanvasInput';
import { DataService } from '../api-service/DataService';
import { User } from '../types';
import { ISpriteNode, ITextNode } from '../engine/types';

const { CanvasInput } = window as any;

const LOGIN_SCREEN_LAYERS: Array<string> = ['login-screen_background', 'login-screen-text', 'login-screen_inputs'];
const LOGIN_SCREEN_SCREEN_NAME: string = 'loginScreen';
const LOGIN_SCREEN_SCENE_NAME: string = 'loginScreen';

export class LoginScreen extends ScreenCreator {
  dataService: DataService;

  error: { message: string; node: ITextNode };

  isLoading: boolean = false;

  setUserName: (name: string) => void;

  userName: string;

  loadingNode: ISpriteNode;

  constructor(
    engine: Engine,
    dataService: DataService,
    setUserNameCB: (name: string) => void,
    userName: string,
  ) {
    super(engine);
    this.dataService = dataService;
    this.createLayers(LOGIN_SCREEN_LAYERS);
    this.createNodes();
    this.createErrorMessage();
    this.engine.createScreen(LOGIN_SCREEN_SCREEN_NAME, LOGIN_SCREEN_LAYERS);
    this.engine.createScene(LOGIN_SCREEN_SCENE_NAME);
    this.setUserName = setUserNameCB;
    this.userName = userName;
  }

  public openScreen(): void {
    super.openScreen(LOGIN_SCREEN_SCREEN_NAME, LOGIN_SCREEN_SCENE_NAME);
  }

  private createNodes(): void {
    // BACKGROUND COLOR
    this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: LOGIN_SCREEN_LAYERS[0],
      color: '#323649',
    });

    // BACKGROUND IMAGE
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

    // BUTTON CLOSE
    const BUTTON_CLOSE = this.engine
      .loader.files['assets/images/interface/Button.png'] as HTMLImageElement;

    const buttonClose = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (background.position.x) + (BACKGROUND.width / 2.7),
        (background.position.y) + (BACKGROUND.height / 1.18),
      ),
      size: this.engine.vector(113, 41),
      layer: LOGIN_SCREEN_LAYERS[2],
      img: BUTTON_CLOSE,
    });
    const textButtonClose = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonClose.position.x + 20,
        buttonClose.position.y + 10,
      ),
      text: 'CLOSE',
      layer: LOGIN_SCREEN_LAYERS[2],
      fontSize: 25,
      color: '#333',
    });

    buttonClose.addTo(LOGIN_SCREEN_SCENE_NAME);
    textButtonClose.addTo(LOGIN_SCREEN_SCENE_NAME);

    this.setEvent(buttonClose, 'click', () => {
      console.log('CLOSE');
      this.engine.setScreen('startScreen');
    });

    // BUTTON SIGN IN
    const buttonSubmit = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (background.position.x) + (BACKGROUND.width / 4.6),
        (background.position.y) + (BACKGROUND.height / 1.5),
      ),
      size: this.engine.vector(113, 41),
      layer: LOGIN_SCREEN_LAYERS[2],
      img: BUTTON_CLOSE,
    });
    this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonSubmit.position.x + 20,
        buttonSubmit.position.y + 10,
      ),
      text: 'Sign in',
      layer: LOGIN_SCREEN_LAYERS[2],
      fontSize: 25,
      color: '#333',
    });

    // BUTTON REGISTER
    const buttonRegister: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (background.position.x) + (BACKGROUND.width / 1.95),
        (background.position.y) + (BACKGROUND.height / 1.5),
      ),
      size: this.engine.vector(113, 41),
      layer: LOGIN_SCREEN_LAYERS[2],
      img: BUTTON_CLOSE,
    });
    this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonRegister.position.x + 15,
        buttonRegister.position.y + 10,
      ),
      text: 'Sing up',
      layer: LOGIN_SCREEN_LAYERS[2],
      fontSize: 25,
      color: '#333',
    });

    // INPUTS
    const username = new CanvasInput({
      canvas: this.engine.getLayer(LOGIN_SCREEN_LAYERS[2]).canvas,
      fontSize: 18,
      fontColor: '#212121',
      fontWeight: 'bold',
      width: 200,
      padding: 5,
      x: (this.engine.size.x / 2) - (200 / 2),
      y: (this.engine.size.y / 2.5),
      borderColor: '#FFF',
      borderRadius: 0,
      boxShadow: 'none',
      innerShadow: 'none',
      placeHolder: 'Enter login',
    });
    const password = new CanvasInput({
      canvas: this.engine.getLayer(LOGIN_SCREEN_LAYERS[2]).canvas,
      fontSize: 18,
      fontColor: '#212121',
      fontWeight: 'bold',
      width: 200,
      padding: 5,
      x: (this.engine.size.x / 2) - (200 / 2),
      y: (this.engine.size.x / 3.5),
      borderColor: '#FFF',
      borderRadius: 0,
      boxShadow: 'none',
      innerShadow: 'none',
      placeHolder: 'Enter password',
    });
    username.onsubmit(() => {
      password.focus();
    });
    password.onsubmit(() => {
      password.blur();
    });

    const onModalFinish = (name: string) => {
      if (name !== this.userName) this.setUserName(name);
      this.closeScreen();
      username.value('');
      password.value('');
      this.setErrorMessage('');
    };

    this.setEvent(buttonClose, 'click', () => {
      onModalFinish(this.userName);
    });

    this.setEvent(buttonRegister, 'click', async () => {
      const name = username.value();
      const pass = password.value();
      if (name && pass) {
        this.setLoading(true);
        const res = await this.dataService.signup({ login: name, password: pass } as User);
        this.setLoading(false);
        if (!res) {
          this.setErrorMessage('Username is taken');
        } else {
          onModalFinish(name);
        }
      } else {
        this.setErrorMessage('Enter data');
      }
    });

    this.setEvent(buttonSubmit, 'click', async () => {
      const name = username.value();
      const pass = password.value();
      if (name && pass) {
        this.setLoading(true);
        const res = await this.dataService.login({ login: name, password: pass } as User);
        this.setLoading(false);
        if (!res) {
          this.setErrorMessage('Sign in failed');
        } else {
          onModalFinish(name);
        }
      } else {
        this.setErrorMessage('Enter data');
      }
    });
  }

  private setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    if (isLoading) {
      const frames = 12;
      const size = 100;
      const speed = 100;
      const dh = 30;
      const img = this.engine.loader.files['assets/sprites/loading.png'] as HTMLImageElement;
      const pos = this.engine.vector(
        (this.engine.size.x / 2) - (30 / 2),
        (this.engine.size.x / 3),
      );
      this.loadingNode = this.engine.createNode({
        type: 'SpriteNode',
        position: pos,
        size: this.engine.vector(size * frames, size),
        layer: LOGIN_SCREEN_LAYERS[1],
        img,
        frames,
        startFrame: 0,
        speed,
        dh,
      }).addTo(LOGIN_SCREEN_SCENE_NAME) as ISpriteNode;
    } else {
      this.loadingNode.destroy();
    }
  }

  private createErrorMessage() {
    const { engine } = this;
    this.error = {
      message: '',
      node: engine.createNode({
        type: 'TextNode',
        position: engine.vector(
          (engine.size.x / 2) - (200 / 2),
          (engine.size.y / 3),
        ),
        text: '',
        layer: LOGIN_SCREEN_LAYERS[1],
        fontSize: 25,
        color: '#d20707',
      }) as ITextNode,
    };
  }

  private setErrorMessage(message: string) {
    this.error.message = message;
    this.error.node.text = message;
    this.error.node.clearLayer();
  }

  private closeScreen() {
    this.engine.setScreen('startScreen');
  }
}
