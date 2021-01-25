import Engine from '../../engine';
import { ScreenCreator, TEXT_BUTTONS_FONT } from './ScreenCreator';
import { LoginScreen } from './LoginScreen';
import { StatisticsScreen } from './StatisticsScreen';
import { LevelSelectionScreen } from './LevelSelectionScreen';
import { DataService } from '../../api-service/DataService';
import { ITextNode } from '../../engine/types';

const START_SCREEN_LAYERS: Array<string> = ['start-screen_background', 'start-screen_buttons'];
const START_SCREEN_SCREEN_NAME: string = 'startScreen';
const START_SCREEN_SCENE_NAME: string = 'startScreen';
const FOOTER_FONT_SIZE: number = 13;

export class StartScreen extends ScreenCreator {
  public userName: string = 'Guest';

  private loginScreen: any;

  private settingsScreen: any;

  private levelSelectionScreen: any;

  dataService: DataService;

  userNameNode: ITextNode;

  constructor(engine: Engine, func: () => void, dataService: DataService, userName?: string) {
    super(engine);
    if (userName) {
      this.userName = userName;
    }
    this.dataService = dataService;
    this.createLayers(START_SCREEN_LAYERS);
    this.createNodes();
    this.createFooter();
    this.engine.createScreen(START_SCREEN_SCREEN_NAME, START_SCREEN_LAYERS);
    this.engine.createScene(START_SCREEN_SCENE_NAME);
    this.loginScreen = new LoginScreen(
      this.engine,
      this.dataService,
      this.setUserName.bind(this),
      this.userName,
    );
    this.settingsScreen = new StatisticsScreen(this.engine, this.dataService);
    this.levelSelectionScreen = new LevelSelectionScreen(this.engine, func);
    this.engine.audioPlayer.playSound('menuMain', true);
  }

  public openScreen(): void {
    super.openScreen(START_SCREEN_SCREEN_NAME, START_SCREEN_SCENE_NAME);
  }

  private createNodes(): void {
    const BACKGROUND = this.engine
      .loader.files['assets/images/interface/SelectorBackground.png'] as HTMLImageElement;

    const backgroundImg: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BACKGROUND.width / 2),
        (this.engine.size.y / 2) - (BACKGROUND.height / 2),
      ),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: START_SCREEN_LAYERS[0],
      img: BACKGROUND,
    });

    const START_GAME_BUTTON = this.engine
      .loader.files['assets/images/interface/startScreen-button-notActive2.png'] as HTMLImageElement;

    const startGameButton: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (backgroundImg.position.x) + 1.64 * START_GAME_BUTTON.width,
        (backgroundImg.position.y) + 0.6 * START_GAME_BUTTON.height,
      ),
      size: this.engine.vector(330, 143),
      layer: START_SCREEN_LAYERS[1],
      img: START_GAME_BUTTON,
    });

    this.setActive(
      startGameButton,
      'assets/images/interface/startScreen-button-Active2.png',
      'assets/images/interface/startScreen-button-notActive2.png',
    );

    this.setEvent(startGameButton, 'click', () => {
      this.engine.audioPlayer.playSound('menuButtonClick');
      this.levelSelectionScreen.openScreen();
    });

    const SETTINGS_BUTTON = this.engine
      .loader.files['assets/images/interface/startScreen-button_settings-notActive.png'] as HTMLImageElement;

    const settingsGameButton: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (startGameButton.position.x),
        (startGameButton.position.y) + SETTINGS_BUTTON.height,
      ),
      size: this.engine.vector(312, 131),
      layer: START_SCREEN_LAYERS[1],
      img: SETTINGS_BUTTON,
    });

    this.setActive(
      settingsGameButton,
      'assets/images/interface/startScreen-button_settings-Active.png',
      'assets/images/interface/startScreen-button_settings-notActive.png',
    );

    this.setEvent(settingsGameButton, 'click', () => {
      this.engine.audioPlayer.playSound('menuButtonClick');
      this.settingsScreen.openScreen();
    });

    const LOGIN_CARD_IMG = this.engine
      .loader.files['assets/images/interface/autorization-card.png'] as HTMLImageElement;

    const autorizationBackground: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        backgroundImg.position.x + 20,
        backgroundImg.position.y,
      ),
      size: this.engine.vector(287, 150),
      layer: START_SCREEN_LAYERS[0],
      img: LOGIN_CARD_IMG,
      dh: 100,
    });

    // USERNAME TEXT
    this.userNameNode = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        (autorizationBackground.position.x + LOGIN_CARD_IMG.width) / 3,
        autorizationBackground.position.y + LOGIN_CARD_IMG.height / 2.4,
      ),
      text: this.userName,
      layer: START_SCREEN_LAYERS[0],
      fontSize: 16,
      color: '#fff',
      font: TEXT_BUTTONS_FONT,
    }) as ITextNode;

    const LOGIN_BUTTON_IMG = this.engine
      .loader.files['assets/images/interface/Button2.png'] as HTMLImageElement;

    const autorizationButton: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        autorizationBackground.position.x + 7,
        autorizationBackground.position.y + 1.32 * LOGIN_BUTTON_IMG.height,
      ),
      size: this.engine.vector(290, 70),
      layer: START_SCREEN_LAYERS[1],
      img: LOGIN_BUTTON_IMG,
      dh: 45,
    });
    this.setEvent(autorizationButton, 'click', () => {
      this.engine.audioPlayer.playSound('bleep');
      this.loginScreen.openScreen();
    });
  }

  setUserName(name: string) {
    this.userName = name;
    this.userNameNode.text = name;
    this.userNameNode.clearLayer();
  }

  createFooter() {
    const RSS_LOGO = this.engine
      .loader.files['assets/images/interface/rssLogo.png'] as HTMLImageElement;
    const GITHUB_LOGO = this.engine
      .loader.files['assets/images/interface/githubLogo.png'] as HTMLImageElement;
    const ZOMBIE_LOGO = this.engine
      .loader.files['assets/images/interface/zombieLogo.png'] as HTMLImageElement;

    const zombieLogo: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        40,
        this.engine.size.y - 65,
      ),
      size: this.engine.vector(406, 709),
      layer: START_SCREEN_LAYERS[1],
      img: ZOMBIE_LOGO,
      dh: 60,
    });

    const rssLogo: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        10,
        this.engine.size.y - 65,
      ),
      size: this.engine.vector(553, 219),
      layer: START_SCREEN_LAYERS[1],
      img: RSS_LOGO,
      dh: 60,
    });

    const githubLena = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        this.engine.size.x - 48,
        zombieLogo.position.y,
      ),
      text: 'ellankz',
      layer: START_SCREEN_LAYERS[1],
      fontSize: FOOTER_FONT_SIZE,
      font: TEXT_BUTTONS_FONT,
      color: '#fff',
    });

    const githubLiza = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        this.engine.size.x - 55,
        githubLena.position.y + 15,
      ),
      text: 'Liza-Veis',
      layer: START_SCREEN_LAYERS[1],
      fontSize: FOOTER_FONT_SIZE,
      font: TEXT_BUTTONS_FONT,
      color: '#fff',
    });

    const githubUlyana = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        this.engine.size.x - 60,
        githubLiza.position.y + 15,
      ),
      text: 'ulyana-zh',
      layer: START_SCREEN_LAYERS[1],
      fontSize: FOOTER_FONT_SIZE,
      font: TEXT_BUTTONS_FONT,
      color: '#fff',
    });

    const githubVlad = this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        this.engine.size.x - 70,
        githubUlyana.position.y + 15,
      ),
      text: 'VVladislaVLL',
      layer: START_SCREEN_LAYERS[1],
      fontSize: FOOTER_FONT_SIZE,
      font: TEXT_BUTTONS_FONT,
      color: '#fff',
    });

    this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        githubVlad.position.x - 60,
        zombieLogo.position.y,
      ),
      size: this.engine.vector(512, 512),
      layer: START_SCREEN_LAYERS[1],
      img: GITHUB_LOGO,
      dh: 58,
    });

    this.setLink(rssLogo, 'https://rs.school/js/');
    this.setLink(githubLena, 'https://github.com/ellankz');
    this.setLink(githubLiza, 'https://github.com/Liza-Veis');
    this.setLink(githubUlyana, 'https://github.com/ulyana-zh');
    this.setLink(githubVlad, 'https://github.com/VVladislaVLL');
  }
}
