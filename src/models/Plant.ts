import { PlantConfig, PlantPreset, PlantStatesPreset } from '../types';
import plantPresets from '../data/plants.json';
import Engine from '../engine';
import Cell from '../game/Cell';
import { ISpriteNode } from '../engine/types';
import Shot from './Shot';
import Vector from '../engine/core/Vector';

require.context('../assets/sprites/plants', true, /\.(png|jpg)$/);
const x = require('../assets/sprites/plants/Peashooter/1.png');

export default class Plant {
  private plantPresets: {[dymanic: string]: PlantPreset} = plantPresets;

  public cost: number;

  public damage: number;

  public recharge: number;

  public health: number;

  public sunProduction: number;

  public image: string;

  public width: number;

  public height: number;

  public name: string;

  public position: Vector;

  private engine: Engine;

  private frames: number;

  private speed: number;

  private node: ISpriteNode;

  private states: {[dynamic: string]: PlantStatesPreset};

  public shotType?: string;

  public shooting: number | null = null;

  constructor(config: PlantConfig, engine: Engine) {
    this.cost = this.plantPresets[config.type].cost;
    this.damage = this.plantPresets[config.type].damage;
    this.recharge = this.plantPresets[config.type].recharge;
    this.sunProduction = this.plantPresets[config.type].sunProduction;
    this.health = this.plantPresets[config.type].health;
    this.image = this.plantPresets[config.type].image;
    this.height = this.plantPresets[config.type].height;
    this.width = this.plantPresets[config.type].width;
    this.frames = this.plantPresets[config.type].frames;
    this.speed = this.plantPresets[config.type].speed;
    this.states = this.plantPresets[config.type].states;
    this.shotType = this.plantPresets[config.type].shotType;
    this.engine = engine;
  }

  reduceHealth(num: number) {
    this.health -= num;
  }

  draw(cell: Cell) {
    const image = new Image();
    image.src = this.image;

    const generateStates = () => {
      const statesArr = Object.entries(this.states).map((state) => {
        const img = new Image();
        img.src = state[1].image;
        img.src = x.default;
        const size = new Vector(state[1].width * state[1].frames, state[1].height);
        const {
          frames, speed, dh, positionAdjust,
        } = state[1];
        return [state[0], {
          img, frames, speed, size, dh, positionAdjust,
        }];
      });
      return Object.fromEntries(statesArr);
    };

    this.position = this.engine.vector(
      cell.getLeft() + (cell.cellSize.x - this.width) / 2,
      (cell.getBottom() - this.height) - (cell.cellSize.y - this.height) / 2,
    );
    this.node = this.engine.createNode({
      type: 'SpriteNode',
      position: this.position,
      size: this.engine.vector(this.width * this.frames, this.height),
      layer: 'main',
      img: image,
      frames: this.frames,
      startFrame: 0,
      speed: this.speed,
      dh: this.height,
      states: this.states ? generateStates() : undefined,
    }).addTo('scene') as ISpriteNode;
  }

  switchState(state: string) {
    this.node.switchState(state);
    this.startShooting();
    setTimeout(() => {
      this.node.switchState('basic');
      this.stopShooting();
    }, 3000);
  }

  startShooting() {
    if (this.shotType && this.shooting === null) {
      const shoot = () => {
        const shot = new Shot(this.position, this.engine, this.shotType);
        shot.draw();
      };
      setTimeout(() => {
        if (this.shooting === null) {
          shoot();
          this.shooting = window.setInterval(shoot, 1800);
        }
      }, 600);
    }
  }

  stopShooting() {
    if (this.shotType && this.shooting) {
      window.clearInterval(this.shooting);
      this.shooting = null;
    }
  }
}
