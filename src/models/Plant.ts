import { PlantConfig, PlantPreset } from '../types';

import plantPresets from '../data/plants.json';

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

  constructor(config: PlantConfig) {
    this.cost = this.plantPresets[config.type].cost;
    this.damage = this.plantPresets[config.type].damage;
    this.recharge = this.plantPresets[config.type].recharge;
    this.sunProduction = this.plantPresets[config.type].sunProduction;
    this.health = this.plantPresets[config.type].health;
    this.width = this.plantPresets[config.type].width;
    this.height = this.plantPresets[config.type].height;
    this.image = this.plantPresets[config.type].image;
    this.name = this.plantPresets[config.type].name;
    this.positionX = undefined;
    this.positionY = undefined;
  }

  reduceHealth(num: number) {
    this.health -= num;
  }

  placeOnField(positionX: number, positionY: number) {
    this.positionX = positionX;
    this.positionY = positionY;
  }
}
