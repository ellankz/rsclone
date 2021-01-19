import { ZombieConfig, ZombiePreset, ZombiesStatesPreset } from '../types';
import zombiePresets from '../data/zombies.json';

import Engine from '../engine';
import Cell from '../game/Cell';
import Plant from './Plant';
import { ISpriteNode } from '../engine/types';
import Vector from '../engine/core/Vector';

require.context('../assets/sprites/zombies', true, /\.(png|jpg)$/);

const X_MIN = -20;
const X_MAX = -90;

const X_AXIS = 960;
const Y_AXIS = 5;

const SPEED = 0.2;

export default class Zombie {
  private zombiePresets: { [dymanic: string]: ZombiePreset } = zombiePresets;

  private speed: number;

  public health: number;

  public damage: number;

  readonly width: number;

  readonly height: number;

  private image: string;

  private name: string;

  private frames: number;

  public startDelay: number;

  private zombieSpeed: number;

  public position: Vector;

  public row: number;

  private engine: Engine;

  public node: ISpriteNode;

  public opacity: number;

  private states: { [dynamic: string]: ZombiesStatesPreset };

  private attackedPlant: Plant;

  private isSlow: boolean;

  private slowTimeout: number;

  public isDestroyedFlag: boolean;

  constructor(config: ZombieConfig, engine: Engine) {
    this.speed = this.zombiePresets[config.type].speed;
    this.health = this.zombiePresets[config.type].health;
    this.damage = this.zombiePresets[config.type].damage;
    this.width = this.zombiePresets[config.type].width;
    this.height = this.zombiePresets[config.type].height;
    this.image = this.zombiePresets[config.type].image;
    this.name = this.zombiePresets[config.type].name;
    this.frames = this.zombiePresets[config.type].frames;
    this.states = this.zombiePresets[config.type].states;
    this.engine = engine;
  }

  public draw(cell: Cell, occupiedCells: Map<Cell, Plant>) {
    this.zombieSpeed = SPEED;
    let start = 0;

    const image = this.engine.loader.files[this.image];

    const generateStates = () => {
      const statesArr = Object.entries(this.states).map((state) => {
        const img = this.engine.loader.files[state[1].image];
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
      start += this.zombieSpeed;
      this.node.position = this.engine.vector(
        X_AXIS - start,
        cell.getBottom() - this.height - Y_AXIS,
      );

      this.trackPosition();
    };

    this.node = this.engine
      .createNode(
        {
          type: 'SpriteNode',
          position: this.engine.vector(X_AXIS, cell.getBottom() - this.height - Y_AXIS),
          size: this.engine.vector(this.width * this.frames, this.height),
          layer: `row-${this.row + 1}`,
          img: image,
          frames: this.frames,
          startFrame: 0,
          speed: this.speed,
          dh: this.height,
          states: this.states ? generateStates() : undefined,
        },
        update,
      )
      .addTo('scene') as ISpriteNode;
  }

  public attack(occupiedCells: Map<Cell, Plant>) {
    if (this.isDestroyedFlag) return;
    occupiedCells.forEach((plant, cell) => {
      if (this.node.position.x - plant.position.x < X_MIN
        && this.node.position.x - plant.position.x > X_MAX
        && this.row === plant.cell.position.y
      ) {
        this.node.switchState('attack');
        this.zombieSpeed = 0;
        this.makeDamage(plant);
        this.attackedPlant = plant;

        if (plant.health <= 0) {
          this.eatThePlant(plant);
          occupiedCells.delete(cell);
          this.attackedPlant = null;
          this.walk();
        }
      }
    });

    const isPlantDestroyed = this.attackedPlant && this.attackedPlant.isDestroyedFlag;

    if (isPlantDestroyed && this.node.currentState === 'attack') {
      this.walk();
    }
  }

  public walk() {
    if (this.isDestroyedFlag) return;
    this.node.switchState('walking');
    this.zombieSpeed = SPEED;
  }

  private makeDamage(plant: any) {
    plant.reduceHealth(this.damage);
    this.engine.audioPlayer.playSound('eat');
  }

  private eatThePlant(plant: any) {
    plant.destroy();
    return this;
  }

  public stop() {
    if (this.isDestroyedFlag) return;
    this.node.switchState('stop');
    this.zombieSpeed = 0;
  }

  public reduceHealth(num: number) {
    if (this.health >= 0) {
      this.health -= num;
    }
    if (this.health < 0) this.health = 0;

    this.node.opacity = 0.85;
    setTimeout(() => {
      this.node.opacity = 1;
    }, 150);
  }

  private lostHead() {
    this.node.switchState('lost_head');

    const image = this.engine.loader.files['assets/sprites/zombies/basic/lost_head.png'];

    const head = this.engine
      .createNode({
        type: 'SpriteNode',
        position: this.engine.vector(this.position.x + 60, this.position.y),
        size: this.engine.vector(150 * 12, 186),
        layer: `row-${this.row + 1}`,
        img: image,
        frames: 12,
        width: 150,
        height: 186,
        startFrame: 0,
        speed: 80,
        dh: 180,
        filter: this.isSlow ? 'hue-rotate(145deg) saturate(1.5)' : '',
      })
      .addTo('scene') as ISpriteNode;

    setTimeout(() => {
      head.destroy();
    }, 800);
  }

  public remove() {
    if (this.isDestroyedFlag) return;
    this.isDestroyedFlag = true;
    this.lostHead();
    setTimeout(() => {
      this.zombieSpeed = 0;
      this.node.switchState('death');
    }, 1200);
    setTimeout(() => {
      this.node.switchState('end');
      this.node.opacity = 0.8;
    }, 2000);
    setTimeout(() => {
      this.node.destroy();
    }, 2800);
  }

  public burn() {
    if (this.isDestroyedFlag) return;
    this.isDestroyedFlag = true;
    this.zombieSpeed = 0;
    this.node.switchState('burn');
    setTimeout(() => {
      this.node.destroy();
    }, 2200);
  }

  public slow() {
    if (this.isDestroyedFlag) return;

    if (!this.isSlow) {
      this.node.filter = 'hue-rotate(145deg) saturate(1.5)';
      this.zombieSpeed -= 0.07;
      this.isSlow = true;
      this.node.speed += 40;
    }

    if (this.slowTimeout) clearTimeout(this.slowTimeout);

    this.slowTimeout = window.setTimeout(() => {
      this.zombieSpeed = SPEED;
      this.node.filter = '';
      this.isSlow = false;
      this.node.speed = this.speed;
    }, 5000);
  }

  private trackPosition() {
    if (this.node.position) {
      this.position = this.node.position;
    }
    return this.position;
  }
}
