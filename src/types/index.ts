export interface ZombiePreset {
  speed: number;
  health: number;
  width: number;
  height: number;
  image: string;
  name: string;
}

export type ZombieType = 'basic' | 'cone' | 'bucket';

export interface ZombieConfig {
  type: ZombieType;
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

export type PlantType = 'sunflower' | 'peashooter';

export interface PlantConfig {
  type: PlantType;
}

export interface LevelConfig {
  zombies: ZombieConfig[];
  plantTypes: PlantType[];
}
