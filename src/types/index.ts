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
  shotType?: string;
  cost: number;
  damage: number;
  recharge: number;
  sunProduction: number;
  health: number;
  width: number;
  height: number;
  image: string;
  name: string;
  frames: number;
  speed: number;
  states?: {[dynamic: string]: PlantStatesPreset}
}

export interface PlantStatesPreset {
  image: string,
  frames: number,
  speed: number;
  width: number;
  height: number;
  dh: number;
  positionAdjust: {
    x: number, y: number
  }
}

export type PlantType = 'SunFlower' | 'Peashooter';

export interface PlantConfig {
  type: PlantType;
}

export interface LevelConfig {
  zombies: ZombieConfig[];
  plantTypes: PlantType[];
}

export interface User {
  login: string,
  password: string,
}

export interface Game {
  id: string;
  level: number;
  suns: number;
  win: boolean;
  zombiesKilled: number;
  plantsPlanted: number;
}
