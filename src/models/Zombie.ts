import { ZombieConfig, ZombiePreset, ZombiesStatesPreset, ZombieHeadPreset } from '../types';
import zombiePresets from '../data/zombies.json';
import zombieHeadPresets from '../data/zombies_head.json'

import Engine from '../engine';
import Cell from '../game/Cell';
import Plant from './Plant';
import { ISpriteNode } from '../engine/types';
import Vector from '../engine/core/Vector';
import { time } from 'console';

require.context('../assets/sprites/zombies', true, /\.(png|jpg)$/);

const X_MIN = -20;
const X_MAX = -60;
const Y_MIN = -5;
const Y_MAX = -100;

const X_AXIS = 1000;
const Y_AXIS = 5;

const SPEED = {
  'slow': 0.11,
  'normal': 0.22,
  'fast': 0.33,
  'superFast': 0.55
}
//const SPEED = 0;

export default class Zombie {
  private zombiePresets: {[dymanic: string]: ZombiePreset} = zombiePresets;

  private zombieHeadPresets: {[dymanic: string]: ZombieHeadPreset} = zombieHeadPresets;

  private speed: number;

  public health: number;

  public damage: number;

  private width: number;

  private height: number;

  private image: string;

  public name: string;

  private frames: number;

  private head: string;

  private headWidth: number;

  private headHeight: number;

  private headFrames: number;

  private headSpeed: number;

  private headDh: number;

  public startDelay: number;

  private zombieSpeed: number;

  public position: Vector;

  public row: number;

  private engine: Engine;

  public node: ISpriteNode;

  private spotlight: ISpriteNode;

  private spotlightShade: ISpriteNode;

  public opacity: number;

  private timer: any;

  private states: {[dynamic: string]: ZombiesStatesPreset};

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
    this.head = this.zombieHeadPresets[config.type].image;
    this.headWidth = this.zombieHeadPresets[config.type].width;
    this.headHeight = this.zombieHeadPresets[config.type].height;
    this.headFrames = this.zombieHeadPresets[config.type].frames;
    this.headSpeed = this.zombieHeadPresets[config.type].speed;
    this.headDh = this.zombieHeadPresets[config.type].dh;
    this.engine = engine;
  }

  private setSpeed() {
    if (this.name === 'dancer' || this.name === 'dancer_2' || this.name === 'dancer_3') {
      this.zombieSpeed = SPEED.fast;
    } else if(this.name === 'newspaper') {
      this.zombieSpeed = SPEED.slow;
    } else if (this.name === 'football') {
      this.zombieSpeed = SPEED.superFast;
    } else {
      this.zombieSpeed = SPEED.normal;
    }
    return this.zombieSpeed;
  }

  public draw(cell: Cell, occupiedCells: Map<Cell, Plant>) {

    this.zombieSpeed = this.setSpeed();
    
    let start = 0;

    const image = new Image();
    image.src = this.image;

    const generateStates = () => {
      const statesArr = Object.entries(this.states).map((state) => {
        const img = new Image();
        img.src = state[1].image;
        const size = new Vector(state[1].width * state[1].frames, state[1].height);
        const {
          frames, speed, dh
        } = state[1];
        return [state[0], {
          img, frames, speed, size, dh, 
        }];
      });
      return Object.fromEntries(statesArr);
    };


    const update = () => {
      start += this.zombieSpeed;
      this.node.position = this.engine.vector(
        X_AXIS - start, (cell.getBottom() - this.height - Y_AXIS),
      );
   
      this.trackPosition();
    };

    const updateSpotlight = () => {
        if (this.spotlight) {
        this.spotlight.position = this.engine.vector(
        X_AXIS - start - 25, (cell.getBottom() - this.height * 3 - 70),
        )

        this.spotlightShade.position = this.engine.vector(
          X_AXIS - start - 35, (cell.getBottom() - this.height + 110),
          )
      }
    }

    this.node = this.engine.createNode({
      type: 'SpriteNode',
      position: this.engine.vector(X_AXIS, (cell.getBottom() - this.height - Y_AXIS)),
      size: this.engine.vector(this.width * this.frames, this.height),
      layer: 'top',
      img: image,
      frames: this.frames,
      startFrame: 0,
      speed: this.speed,
      dh: this.height,
      states: this.states ? generateStates() : undefined,
    }, update)
      .addTo('scene') as ISpriteNode;

      if (this.name === 'dancer_2') {
        setTimeout(() => {
          this.addSpotlight(updateSpotlight);
        }, 100) 
      }
      
    this.updateZombieState();

      this.engine.on(this.node, 'click', () => {
        //this.node.switchState('death');
        this.remove();
      })
  }

  public attack(occupiedCells: Map<Cell, Plant>) {
    occupiedCells.forEach((plant, cell) => {
      if (this.node.position.x - plant.position.x < 10 // for all other -20
        && this.node.position.x - plant.position.x > X_MAX
        && this.node.position.y - plant.position.y < Y_MIN
        && this.node.position.y - plant.position.y > Y_MAX) {
        this.node.switchState('attack');
        this.zombieSpeed = 0;
        this.makeDamage(plant);

        if (plant.health <= 0) {
          this.eatThePlant(plant);
          occupiedCells.delete(cell);
          this.node.switchState('walking');
          this.zombieSpeed = this.setSpeed();
        }
      }
    });
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
    clearTimeout(this.timer);
    this.node.switchState('stop');
    this.zombieSpeed = 0;
  }

  public reduceHealth(num: number) {
    if (this.health >= 0) {
      this.health -= num;
    }

    this.node.opacity = 0.85;
    setTimeout(() => {
      this.node.opacity = 1;
    }, 150);
  }

  private lostHead() {
    this.node.switchState('lost_head');

    if (this.head) {
      let image = this.engine.loader.files[this.head] as HTMLImageElement; 

      const head = this.engine.createNode({
        type: 'SpriteNode',
        position: this.engine.vector(this.position.x + 60, this.position.y),
        size: this.engine.vector(this.headWidth * this.headFrames, this.headHeight),
        layer: 'top',
        img: image,
        frames: this.headFrames,
        width: this.headWidth,
        height: this.headHeight,
        startFrame: 0,
        speed: this.headSpeed,
        dh: this.headDh,
      }).addTo('scene') as ISpriteNode;
  
      setTimeout(() => {
        head.destroy();
      }, 600);
    }
  }

  public remove() {
    clearTimeout(this.timer);
    this.lostHead();
    setTimeout(() => {
      this.zombieSpeed = 0;
      this.node.switchState('death');
    }, 200);
    setTimeout(() => {
      this.node.switchState('end');
      this.node.opacity = 0.7;
    }, 800);
    setTimeout(() => {
      this.node.destroy();
      if(this.spotlight) {
        this.spotlight.destroy();
        this.spotlightShade.destroy();
      }
    }, 1300);
  }

  public boom() {
    clearTimeout(this.timer);
    this.node.switchState('boom');
    setTimeout(() => {
      this.node.destroy();
    }, 2400);
  }
 
  private trackPosition() {
    if (this.node.position) {
      this.position = this.node.position;
    }
    return this.position;
  }

  
  private updateZombieState() {
    const update = () => {
      let timer;
      if (this.name === 'dancer') {
        timer = 5800;
      } else {
        timer = 6800;
      }
      
      setTimeout(() => {
        this.node.switchState('dance');
      }, 5000)
      setTimeout(() => {
        this.node.switchState('walking');
      }, timer)


      this.timer = setTimeout(update, 5000)
    }
    if (this.name === 'dancer' || this.name === 'dancer_2' || this.name === 'dancer_3') {
      update();
    }
  }

  private addSpotlight(update: () => void) {
    const spotlight = this.engine.loader.files['assets/sprites/zombies/dancer/spotlight.png'] as HTMLImageElement;
    const spotlightShade = this.engine.loader.files['assets/sprites/zombies/dancer/spotlight2.png'] as HTMLImageElement;;

    this.spotlight = this.engine.createNode({
      type: 'SpriteNode',
      position: this.engine.vector(0,0),
      size: this.engine.vector(50 * 5, 155),
      layer: 'main',
      img: spotlight,
      frames: 5,
      width: 50,
      height: 155,
      startFrame: 0,
      speed: 480,
      dh: 600,
    }, update).addTo('scene') as ISpriteNode;

    this.spotlightShade = this.engine.createNode({
      type: 'SpriteNode',
      position: this.engine.vector(0,0),
      size: this.engine.vector(50 * 5, 155),
      layer: 'main',
      img: spotlightShade,
      frames: 5,
      width: 50,
      height: 20,
      startFrame: 0,
      speed: 480,
      dh: 600,
    }, update).addTo('scene') as ISpriteNode;
  }
}
