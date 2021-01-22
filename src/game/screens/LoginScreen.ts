import Engine from '../../engine';
import { ScreenCreator, TEXT_BUTTONS_COLOR, TEXT_BUTTONS_FONT } from './ScreenCreator';
import { DataService } from '../../api-service/DataService';
import { User } from '../../types';
import { ISpriteNode, ITextNode, IInputNode } from '../../engine/types';

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
      layer: LOGIN_SCREEN_LAYERS[2],
      img: BUTTON_CLOSE,
    });

    const textButtonClose: any = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonClose.position.x + 30,
        buttonClose.position.y + 10,
      ),
      text: 'CLOSE',
      layer: LOGIN_SCREEN_LAYERS[2],
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
      layer: LOGIN_SCREEN_LAYERS[2],
      img: BUTTON_SUBMIT,
    });
    this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonSubmit.position.x + 30,
        buttonSubmit.position.y + 10,
      ),
      text: 'Sign in',
      layer: LOGIN_SCREEN_LAYERS[2],
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
      layer: LOGIN_SCREEN_LAYERS[2],
      img: BUTTON_REGISTER,
    });
    this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonRegister.position.x + 25,
        buttonRegister.position.y + 10,
      ),
      text: 'Sing up',
      layer: LOGIN_SCREEN_LAYERS[2],
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

    const onModalFinish = (name: string) => {
      if (name !== this.userName) this.setUserName(name);
      this.closeScreen();
      usernameNode.input.value('');
      passwordNode.input.value('');
      this.setErrorMessage('');
    };

    this.setEvent(buttonClose, 'click', () => {
      this.engine.audioPlayer.playSound('bleep');
      onModalFinish(this.userName);
    });

    this.setEvent(buttonRegister, 'click', async () => {
      this.engine.audioPlayer.playSound('bleep');
      const name = usernameNode.input.value();
      const pass = passwordNode.input.value();
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
      this.engine.audioPlayer.playSound('bleep');
      const name = usernameNode.input.value();
      const pass = passwordNode.input.value();
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
