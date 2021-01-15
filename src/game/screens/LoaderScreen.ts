/* eslint-disable prefer-destructuring */
import Engine from '../../engine';
import { IImageNode, ISpriteNode } from '../../engine/types';

const loaderBG = require('../../assets/images/interface/background0.jpg');
const rollUrl = require('../../assets/sprites/Roll.png');
const rollStaticUrl = require('../../assets/sprites/RollStatic.png');

require.context('../../assets/images/interface', true, /^LoadBar/);

const ROLL_WIDTH = 70;
const BOTTOM_ROLL_OFFSET = 50;

export default class LoaderScreen {
  engine: Engine;

  rollBarImages: Array<HTMLImageElement>;

  bg: HTMLImageElement;

  roll: HTMLImageElement;

  rollStatic: HTMLImageElement;

  rollNode: ISpriteNode;

  barNode: IImageNode;

  lastUpdateTime: Date;

  lastPercent: number;

  startGame: () => void;

  constructor(engine: Engine, startGameCB: () => void) {
    this.engine = engine;
    this.rollBarImages = [];
    this.lastUpdateTime = new Date();
    this.lastPercent = 0;
    this.startGame = startGameCB;
  }

  async create() {
    await this.loadFiles();
    this.drawBackground('loader-back', this.bg, 0);
    this.drawBar('loader');
    this.drawRoll('loader');
  }

  async loadFiles() {
    const images: Array<HTMLImageElement> = [];

    this.bg = new Image();
    this.bg.src = loaderBG.default;
    images.push(this.bg);

    this.roll = new Image();
    this.roll.src = rollUrl.default;
    images.push(this.roll);

    this.rollStatic = new Image();
    this.rollStatic.src = rollStaticUrl.default;
    images.push(this.rollStatic);

    for (let i = 0; i < 6; i += 1) {
      const bar = new Image();
      bar.src = `assets/images/interface/LoadBar${i}.png`;
      images.push(bar);
      this.rollBarImages[i] = bar;
    }

    await Promise
      .all(images.filter((img) => !img.complete)
        .map((img) => new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        })));
  }

  update(percent: number) {
    const animateBarAndRoll = () => {
      if (percent === 1) {
        this.rollNode.switchState('stop');
        this.listenBarCLick();
      }
      const startX = this.engine.size.x / 2 - this.rollBarImages[0].width / 2;
      const startY = this.engine.size.y - BOTTOM_ROLL_OFFSET - this.roll.height;
      this.rollNode.position = this.engine.vector(
        startX + (this.rollBarImages[0].width - ROLL_WIDTH) * percent,
        startY,
      );
      if (percent >= 0.6 && percent < 0.23) {
        this.barNode.img = this.rollBarImages[1];
      } else if (percent >= 0.23 && percent < 0.47) {
        this.barNode.img = this.rollBarImages[2];
      } else if (percent >= 0.47 && percent < 0.61) {
        this.barNode.img = this.rollBarImages[3];
      } else if (percent >= 0.61 && percent < 0.73) {
        this.barNode.img = this.rollBarImages[4];
      } else if (percent >= 0.73) {
        this.barNode.img = this.rollBarImages[5];
      }
    };

    if (percent - this.lastPercent > 0.01 || percent === 1) {
      this.lastPercent = percent;
      const newUpdateTime = new Date();
      const diff = newUpdateTime.getTime() - this.lastUpdateTime.getTime();
      this.lastUpdateTime = newUpdateTime;
      if (diff < 1000) {
        window.setTimeout(() => animateBarAndRoll(), 1000);
      } else {
        animateBarAndRoll();
      }
    }
  }

  listenBarCLick() {
    this.engine.on(this.barNode, 'click', () => {
      this.startGame();
    });
  }

  drawBackground(layer: string, image: HTMLImageElement, xOffset: number) {
    this.engine
      .createNode(
        {
          type: 'ImageNode',
          position: this.engine.vector(0, 0),
          size: this.engine.vector(this.engine.size.x + xOffset, this.engine.size.y),
          layer,
          img: image,
          dh: this.engine.size.y,
        },
      );
  }

  drawRoll(layer: string) {
    this.rollNode = this.engine.createNode(
      {
        type: 'SpriteNode',
        position: this.engine.vector(
          this.engine.size.x / 2 - this.rollBarImages[0].width / 2,
          this.engine.size.y - BOTTOM_ROLL_OFFSET - this.roll.height,
        ),
        size: this.engine.vector(this.roll.width, this.roll.height),
        layer,
        img: this.roll,
        dh: this.roll.height,
        frames: 12,
        startFrame: 0,
        speed: 200,
        states: {
          stop: {
            img: this.rollStatic,
            size: this.engine.vector(this.rollStatic.width, this.rollStatic.height),
            frames: 1,
            speed: 1000,
            dh: this.rollStatic.height * 0.9,
          },
        },
      },
    )
      .addTo('scene') as ISpriteNode;
  }

  drawBar(layer: string) {
    this.barNode = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        this.engine.size.x / 2 - this.rollBarImages[0].width / 2,
        this.engine.size.y - this.rollBarImages[0].height,
      ),
      size: this.engine.vector(this.rollBarImages[0].width, this.rollBarImages[0].height),
      layer,
      img: this.rollBarImages[0],
      dh: this.rollBarImages[0].height,
    })
      .addTo('scene') as IImageNode;
  }
}
