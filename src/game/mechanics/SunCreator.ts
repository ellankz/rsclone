import Engine from '../../engine';
import { Sun } from './Sun';
import Vector from '../../engine/core/Vector';

const DESTROY_DELAY = 3000;
const CHANGE_STATE_DELAY = 7100;
const FLY_DELAY = 4000;
const SUN_COST = 25;

export class SunCreator {
  private engine: Engine;

  private dh: number = 78;

  private speed: number = 35;

  public instance: any;

  private posCoordinates: Array<number>;

  public name: string;

  constructor(
    engine: Engine,
    posCoordinates: Array<number>,
    layer: string,
    name?: string,
    updateSunFunc?: (sun: number) => void,
    sunCount?: { suns: number },
    update?: () => void,
  ) {
    this.engine = engine;
    this.name = name;
    this.posCoordinates = posCoordinates;
    this.instance = update ? this.createNode(layer, update) : this.createNode(layer);
    this.changeAnimation(this.instance.position);

    this.engine.on(this.instance, 'click', () => {
      if (updateSunFunc && sunCount) {
        updateSunFunc(sunCount.suns + SUN_COST);
      }
      this.engine.audioPlayer.playSound('sun'); // sound ---------
      this.instance.destroy();
      if (this.engine.getSceneNodes('scene').length === 0) {
        this.instance.clearLayer();
      }
      this.destroySelection();
    });
  }

  private createNode(layer: string, update?: () => void): any {
    const sunConfig: any = new Sun(
      this.engine,
      layer,
      this.posCoordinates,
      this.dh,
      this.speed,
      this.name,
    );
    return update ? this.engine.createNode(sunConfig, update) : this.engine.createNode(sunConfig);
  }

  private changeAnimation(position: Vector): void {
    setTimeout(() => {
      setTimeout(() => {
        this.instance.switchState('disappear');
        this.instance.position = position;
        setTimeout(() => this.instance.destroy(), DESTROY_DELAY);
      }, FLY_DELAY);
    }, CHANGE_STATE_DELAY);
  }

  destroySelection() {
    let selection = this.engine.getSceneNodes('scene');
    selection = selection.filter((node) => node.name === 'select');
    selection.forEach((node) => node.destroy());
  }
}
