import Engine from '../../engine';
import { Sun } from './Sun';

export class SunCreator {
  private engine: Engine;

  private dh: number = 78;

  private speed: number = 35;

  public instance: any;

  private posCoordinates: Array<number>;

  constructor(engine: Engine,
    posCoordinates: Array<number>,
    layer: string,
    update?: () => void) {
    this.engine = engine;
    this.posCoordinates = posCoordinates;
    this.instance = this.createNode(layer, update);

  //   this.engine.on(this.instance, 'click', () => {
  //     this.updateSunCountInLevel(this.sunCount.suns + SUN_COST);
  //     this.instance.destroy();
  //     if (this.engine.getSceneNodes('scene').length === 0) {
  //       this.instance.clearLayer();
  //     }
  //   });
  }

  private createNode(layer: string, update?: () => void): any {
    const sunConfig: any = new Sun(
      this.engine, layer, this.posCoordinates, this.dh, this.speed,
    );
    return (update) ? this.engine.createNode(sunConfig, update) : this.engine.createNode(sunConfig);
  }
}
