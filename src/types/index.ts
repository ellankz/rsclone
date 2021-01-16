export interface ZombiePreset {
  speed: number;
  health: number;
  damage: number;
  width: number;
  height: number;
  image: string;
  name: string;
  frames: number;
  states?: { [dynamic: string]: ZombiesStatesPreset };
}

export interface ZombiesStatesPreset {
  image: string;
  frames: number;
  speed: number;
  width: number;
  height: number;
  dh: number;
  positionAdjust: {
    x: number;
    y: number;
  };
}

export type ZombieType = 'basic' | 'basic_2' | 'cone' | 'bucket';

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
  states?: { [dynamic: string]: PlantStatesPreset };
}

export interface PlantStatesPreset {
  image: string;
  frames: number;
  speed: number;
  width: number;
  height: number;
  dh: number;
  positionAdjust: {
    x: number;
    y: number;
  };
}

export type PlantType = 'SunFlower' | 'Peashooter' | 'WallNut' | 'Chomper';

export interface PlantConfig {
  type: PlantType;
}

export interface LevelConfig {
  zombies: ZombieConfig[];
  plantTypes: PlantType[];
}
