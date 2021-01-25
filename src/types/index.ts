export interface ZombiePreset {
  speed: number;
  health: number;
  damage: number;
  width: number;
  height: number;
  image: string;
  name: string;
  frames: number;
  head?: string;
  shadow?: string;
  states?: { [dynamic: string]: ZombiesStatesPreset };
}

export interface ZombiesStatesPreset {
  image: string;
  frames: number;
  speed: number;
  width: number;
  height: number;
  dh: number;
  repeat?: number;
  positionAdjust?: {
    x: number;
    y: number;
  };
}

export interface ZombieHeadPreset {
  speed: number;
  width: number;
  height: number;
  image: string;
  frames: number;
  dh: number;
}

export type ZombieType =
  | 'basic'
  | 'basic_2'
  | 'cone'
  | 'bucket'
  | 'dancer'
  | 'dancer_2'
  | 'dancer_3'
  | 'flag'
  | 'newspaper'
  | 'door'
  | 'football'
  | 'pole';

export interface ZombieConfig {
  type: ZombieType;
  startDelay: number;
  row?: number;
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
  shadow?: string;
  repeat?: number;
  states?: { [dynamic: string]: PlantStatesPreset };
}

export interface PlantStatesPreset {
  image: string;
  frames: number;
  speed: number;
  width: number;
  height: number;
  dh: number;
  repeat?: number;
  positionAdjust: {
    x: number;
    y: number;
  };
}

export type PlantType =
  | 'SunFlower'
  | 'Peashooter'
  | 'WallNut'
  | 'Chomper'
  | 'CherryBomb'
  | 'SnowPea'
  | 'PotatoMine';

export interface PlantConfig {
  type: PlantType;
}

export interface LevelConfig {
  background: string;
  zombies: ZombieConfig[];
  plantTypes: PlantType[];
}

export interface User {
  login: string;
  password: string;
}

export interface Game {
  id?: string;
  level: number;
  win: boolean;
  zombiesKilled: number;
  plantsPlanted: number;
}

export interface Stats {
  gamesPlayed: number;
  highestLevel: number;
  gamesWon: number;
  gamesLost: number;
  percentWon: number;
  killedZombies: number;
  plantedPlants: number;
}
