export interface ZombiePreset {
  speed: number;
  health: number;
  width: number;
  height: number;
  image: string;
  name: string;
}

export type zombieType = 'basic' | 'cone' | 'bucket';

export interface ZombieConfig {
  type: zombieType;
  startDelay: number;
  row: number;
}

export interface PlantPreset {
  cost: number;
  damage: number;
  recharge: number;
  sunProduction: number;
  health: number;
  width: number;
  height: number;
  image: string;
  name: string;
}

export type plantType = 'sunflower' | 'peashooter';

export interface PlantConfig {
  type: plantType;
}

export interface LevelConfig {
  zombies: ZombieConfig[];
  plantTypes: plantType[];
}
