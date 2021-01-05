import { PlantConfig, PlantPreset } from '../types';

import plantPresets from '../data/plants.json';
import Engine from '../engine';
import Cell from '../game/Cell';

require.context('../assets/sprites/plants', true, /\.(png|jpg)$/);

export default class Plant {
  private plantPresets: {[dymanic: string]: PlantPreset} = plantPresets;

  public cost: number;

  public damage: number;

  public recharge: number;

  public health: number;

  public sunProduction: number;

  public width: number;

  public height: number;

  public image: string;

  public name: string;

  public positionX: number | undefined;

  public positionY: number | undefined;

  private engine: Engine;

  private frames: number;

  private speed: number;

  constructor(config: PlantConfig, engine: Engine) {
    this.cost = this.plantPresets[config.type].cost;
    this.damage = this.plantPresets[config.type].damage;
    this.recharge = this.plantPresets[config.type].recharge;
    this.sunProduction = this.plantPresets[config.type].sunProduction;
    this.health = this.plantPresets[config.type].health;
    this.width = this.plantPresets[config.type].width;
    this.height = this.plantPresets[config.type].height;
    this.image = this.plantPresets[config.type].image;
    this.name = this.plantPresets[config.type].name;
    this.frames = this.plantPresets[config.type].frames;
    this.speed = this.plantPresets[config.type].speed;
    this.positionX = undefined;
    this.positionY = undefined;
    this.engine = engine;
  }

  reduceHealth(num: number) {
    this.health -= num;
  }

  placeOnField(positionX: number, positionY: number) {
    this.positionX = positionX;
    this.positionY = positionY;
  }

  draw(cell: Cell) {
    const image = new Image();
    image.src = `assets/sprites/plants/${this.name}/0.png`;
    image.addEventListener('load', () => {
      const position = this.engine.vector(
        cell.getLeft() + (cell.cellSize.x - (image.width / this.frames)) / 2,
        (cell.getBottom() - image.height) - (cell.cellSize.y - image.height) / 2,
      );
      this.engine.createNode({
        type: 'SpriteNode',
        position,
        size: this.engine.vector(image.width, image.height),
        layer: 'main',
        img: image,
        frames: this.frames,
        startFrame: 0,
        speed: this.speed,
        dh: image.height * 1,
      }).addTo('scene');
    });
  }
}
