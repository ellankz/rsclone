import { ZombieConfig, ZombiePreset, ZombiesStatesPreset } from '../types';
import zombiePresets from '../data/zombies.json';

import Engine from '../engine';
import Cell from '../game/Cell';
import Plant from './Plant';
import { ISpriteNode } from '../engine/types';
import Vector from '../engine/core/Vector';

require.context('../assets/sprites/zombies', true, /\.(png|jpg)$/);

export default class Zombie {
  private zombiePresets: {[dymanic: string]: ZombiePreset} = zombiePresets;

  public speed: number;

  public health: number;

  public width: number;

  public height: number;

  public image: string;

  public name: string;

  public frames: number;

  public startDelay: number;

  private zombieSpeed: number;

  private engine: Engine;

  public node: ISpriteNode;

  private states: {[dynamic: string]: ZombiesStatesPreset};

  constructor(config: ZombieConfig, engine: Engine) {
    this.speed = this.zombiePresets[config.type].speed;
    this.health = this.zombiePresets[config.type].health;
    this.width = this.zombiePresets[config.type].width;
    this.height = this.zombiePresets[config.type].height;
    this.image = this.zombiePresets[config.type].image;
    this.name = this.zombiePresets[config.type].name;
    this.frames = this.zombiePresets[config.type].frames;
    this.states = this.zombiePresets[config.type].states;
    this.engine = engine;
  }

  reduceHealth(num: number) {
    this.health -= num;
  }

  draw(cell: Cell, occupiedCells: Map<Cell, Plant>) {
    const X_AXIS = 1000;
    const Y_AXIS = 5;
    const X_HOME = 150;

    this.zombieSpeed = 0.15;
    let i = 0;

    const image = new Image();
    image.src = this.image;

    // improve
    const generateStates = () => {
      const statesArr = Object.entries(this.states).map((state) => {
        const img = new Image();
        img.src = state[1].image;
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

    const update = () => {
      i += this.zombieSpeed;
      this.node.position = this.engine.vector(
        X_AXIS - i, (cell.getBottom() - this.height - Y_AXIS),
      );
    };

    this.node = this.engine.createNode({
      type: 'SpriteNode',
      position: this.engine.vector(X_AXIS, (cell.getBottom() - this.height - Y_AXIS)),
      size: this.engine.vector(this.width * this.frames, this.height),
      layer: 'main',
      img: image,
      frames: this.frames,
      startFrame: 0,
      speed: this.speed,
      dh: this.height,
      states: this.states ? generateStates() : undefined,
    }, update)
      .addTo('scene') as ISpriteNode;
  }

  attack(occupiedCells: Map<Cell, Plant>) {
    occupiedCells.forEach((plant, cell) => {
      if (this.node.position.x - plant.position.x < -20 && this.node.position.x - plant.position.x > -60 &&
        this.node.position.y - plant.position.y < -5 && this.node.position.y - plant.position.y > -70) {
        this.node.switchState('attack');
        this.zombieSpeed = 0;
        // plant.health = 0;

        setTimeout(() => {
          this.node.switchState('walking');
          this.zombieSpeed = 0.15;
          occupiedCells.delete(cell);
          plant.node.destroy();
        }, 4000);
      }
    });
  }

  stop() {
    this.node.switchState('stop');
    this.zombieSpeed = 0;
  }

  removeZombie() {
    if (this.health <= 0) {
      this.node.destroy();
    }
  }
}
