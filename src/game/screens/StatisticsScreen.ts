import { ScreenCreator, TEXT_BUTTONS_COLOR, TEXT_BUTTONS_FONT } from './ScreenCreator';
import Engine from '../../engine';
import { DataService } from '../../api-service/DataService';
import { IImageNode, ISpriteNode, ITextNode } from '../../engine/types';
import { Stats } from '../../types';

const STATISTICS_SCREEN_LAYERS: Array<string> = ['statistics-screen_background', 'statistics-screen_elements', 'statistics-screen-data'];
const STATISTIC_SCREEN_SCREEN_NAME: string = 'statisticsScreen';
const STATISTIC_SCREEN_SCENE_NAME: string = 'statisticsScreen';

export class StatisticsScreen extends ScreenCreator {
  dataService: DataService;

  isLoading: boolean = false;

  loadingNode: ISpriteNode;

  tableNodes: ITextNode[];

  constructor(engine: Engine, dataService: DataService) {
    super(engine);
    this.createLayers(STATISTICS_SCREEN_LAYERS);
    this.createNodes();
    this.dataService = dataService;
    this.tableNodes = [];
    this.engine.createScreen(STATISTIC_SCREEN_SCREEN_NAME, STATISTICS_SCREEN_LAYERS);
    this.engine.createScene(STATISTIC_SCREEN_SCENE_NAME);
  }

  public openScreen(): void {
    super.openScreen(STATISTIC_SCREEN_SCREEN_NAME, STATISTIC_SCREEN_SCENE_NAME);
    this.clearTable();
    this.displayTable();
  }

  clearTable() {
    this.tableNodes.forEach((node) => node.destroy());
  }

  async displayTable() {
    const data = await this.loadData() as {
      mine: Stats | undefined,
      all: Stats,
    };
    this.createColumn('All Players', data.all, this.engine.size.x * 0.2);
    this.createColumn('My Games', data.mine, this.engine.size.x * 0.6);
  }

  createColumn(title: string, data: Stats, posX: number) {
    this.tableNodes.push(this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(posX, 120),
      text: title,
      layer: STATISTICS_SCREEN_LAYERS[2],
      font: 'Samdan',
      fontSize: 30,
      color: '#333333',
    }) as ITextNode);

    if (data.gamesPlayed === 0) {
      this.tableNodes.push(this.engine.createNode({
        type: 'TextNode',
        position: this.engine.vector(posX, 160),
        text: 'There were no games played yet.',
        layer: STATISTICS_SCREEN_LAYERS[2],
        font: 'Samdan',
        fontSize: 20,
        color: '#333333',
      }) as ITextNode);
    } else {
      Object.entries(data).forEach((item, index) => {
        let itemTitle = '';
        switch (item[0]) {
          case 'gamesPlayed':
            itemTitle = 'Games Played:';
            break;
          case 'highestLevel':
            itemTitle = 'Highest Level:';
            break;
          case 'gamesWon':
            itemTitle = 'Games Won:';
            break;
          case 'gamesLost':
            itemTitle = 'Games Lost:';
            break;
          case 'percentWon':
            itemTitle = 'Percent Won (%):';
            break;
          case 'killedZombies':
            itemTitle = 'Zombies Killed:';
            break;
          case 'plantedPlants':
            itemTitle = 'Plants Planted:';
            break;
          default:
            break;
        }
        this.tableNodes.push(this.engine.createNode({
          type: 'TextNode',
          position: this.engine.vector(posX, 160 + index * 35),
          text: `${itemTitle} ${item[1].toString()}`,
          layer: STATISTICS_SCREEN_LAYERS[2],
          font: 'Samdan',
          fontSize: 25,
          color: '#333333',
        }) as ITextNode);
      });
    }
  }

  private setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    if (isLoading) {
      const frames = 12;
      const size = 100;
      const speed = 100;
      const dh = 70;
      const img = this.engine.loader.files['assets/sprites/loading.png'] as HTMLImageElement;
      const pos = this.engine.vector(
        (this.engine.size.x / 2) - (70 / 2),
        (this.engine.size.x / 4),
      );
      this.loadingNode = this.engine.createNode({
        type: 'SpriteNode',
        position: pos,
        size: this.engine.vector(size * frames, size),
        layer: STATISTICS_SCREEN_LAYERS[2],
        img,
        frames,
        startFrame: 0,
        speed,
        dh,
      }).addTo(STATISTIC_SCREEN_SCENE_NAME) as ISpriteNode;
    } else {
      this.loadingNode.destroy();
    }
  }

  async loadData() {
    this.setLoading(true);
    const res = await this.dataService.getStats();
    this.setLoading(false);
    return res;
  }

  private createNodes(): void {
    // BACKGROUND COLOR
    this.engine.createNode({
      type: 'RectNode',
      position: this.engine.vector(0, 0),
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      layer: STATISTICS_SCREEN_LAYERS[0],
      color: '#8B4513',
    });

    const BACKGROUND_IMG = this.engine
      .loader.files['assets/images/interface/settingBackground.jpg'] as HTMLImageElement;

    this.engine.createNode({
      type: 'ImageNode',
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BACKGROUND_IMG.width / 2),
        (this.engine.size.y / 2) - (BACKGROUND_IMG.height / 2),
      ),
      layer: STATISTICS_SCREEN_LAYERS[0],
      img: BACKGROUND_IMG,
    });

    // SCREEN TITLE
    const TITLE_IMG = this.engine
      .loader.files['assets/images/interface/StatsTitle.png'] as HTMLImageElement;

    this.engine.createNode({
      type: 'ImageNode',
      size: this.engine.vector(this.engine.size.x, this.engine.size.y),
      position: this.engine.vector(
        (this.engine.size.x / 2) - (TITLE_IMG.width / 2), 27,
      ),
      layer: STATISTICS_SCREEN_LAYERS[0],
      img: TITLE_IMG,
    });

    // BUTTON CLOSE
    const BUTTON_IMG = this.engine
      .loader.files['assets/images/interface/Button.png'] as HTMLImageElement;

    const buttonClose = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        (this.engine.size.x / 2) - (BUTTON_IMG.width / 2),
        (this.engine.size.y) - (BUTTON_IMG.width / 2),
      ),
      size: this.engine.vector(BUTTON_IMG.width, BUTTON_IMG.height),
      layer: STATISTICS_SCREEN_LAYERS[1],
      img: BUTTON_IMG,
    }) as IImageNode;

    this.engine.createNode({
      type: 'TextNode',
      position: this.engine.vector(
        buttonClose.position.x + 36,
        buttonClose.position.y + 10,
      ),
      text: 'CLOSE',
      layer: STATISTICS_SCREEN_LAYERS[1],
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
      this.setLoading(false);
      this.engine.audioPlayer.playSound('bleep');
      this.engine.setScreen('startScreen');
    });
  }
}
