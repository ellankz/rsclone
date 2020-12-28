import { ZombieConfig, ZombiePreset } from '../types';

import zombiePresets from '../data/zombies.json';

export default class Zombie {
  private zombiePresets: {[dymanic: string]: ZombiePreset} = zombiePresets;

  public speed: number;

  public health: number;

  public width: number;

  public height: number;

  public image: string;

  public name: string;

  public startDelay: number;

  public row: number;

  constructor(config: ZombieConfig) {
    this.speed = this.zombiePresets[config.type].speed;
    this.health = this.zombiePresets[config.type].health;
    this.width = this.zombiePresets[config.type].width;
    this.height = this.zombiePresets[config.type].height;
    this.image = this.zombiePresets[config.type].image;
    this.name = this.zombiePresets[config.type].name;
    this.startDelay = config.startDelay;
    this.row = config.row;
  }

  reduceHealth(num: number) {
    this.health -= num;
  }
}
