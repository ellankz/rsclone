import Engine from '../../engine';
import { LEFT_CAMERA_OFFSET_COEF, PLANT_CARD_WIDTH_COEF, TOP_OFFSET_COEF } from '../../constats';
import Cell from '../models/Cell';
import Plant from '../models/Plant';
import { SunFlower } from '../models/plants/SunFlower';
import PlantCard from './PlantCard';

const LAYER_NAME: string = 'main';
const SCENE_NAME: string = 'scene';

export class Shovel {
  private engine: Engine;

  private shovelNode: any;

  private isActive: boolean = false;

  private occupiedCells: Map<Cell, Plant>;

  private cells: Cell[][];

  private deletePlant: () => Array<any>;

  private plantsArr: Array<any>;

  private plantCards: PlantCard[];

  constructor(engine:Engine,
    occupiedCells: Map<Cell, Plant>,
    cells: Cell[][],
    deletePlant: () => Array<any>,
    plantsArr: Array<any>,
    plantCards: PlantCard[]) {
    this.engine = engine;
    this.occupiedCells = occupiedCells;
    this.cells = cells;
    this.deletePlant = deletePlant;
    this.plantsArr = plantsArr;
    this.plantCards = plantCards;
    this.shovelNode = this.createShovel();
    this.setEvent();
  }

  private createShovel(): any {
    const shovelImg = this.engine
      .loader.files['assets/images/interface/Shovel.png'] as HTMLImageElement;

    const shovel: any = this.engine.createNode({
      type: 'ImageNode',
      position: this.engine.vector(
        this.engine.size.x * (PLANT_CARD_WIDTH_COEF + LEFT_CAMERA_OFFSET_COEF) * 1.7 + 150,
        this.engine.size.y * TOP_OFFSET_COEF,
      ),
      size: this.engine.vector(77, 55),
      layer: LAYER_NAME,
      img: shovelImg,
    });

    shovel.addTo(SCENE_NAME);
    return shovel;
  }

  private setEvent(): void {
    const cellsFlat: Array<Cell> = this.cells.flat();
    const functionsArr: Array<(ev: any) => void> = [];

    const cellClick = (event: any, cell: Cell): void => {
      if (this.occupiedCells.has(cell)) {
        const plant: any = this.occupiedCells.get(cell);
        if (plant instanceof SunFlower) {
          plant.stop();
        }
        plant.stopAttack();
        plant.health = 0;
        plant.isDestroyedFlag = true;
        this.plantsArr = this.deletePlant();
        plant.destroy();
        this.occupiedCells.delete(cell);
        this.engine.audioPlayer.playSound('dig');
      }

      this.toggleState();
      cellsFlat.forEach((_cell, index) => {
        this.engine.off(_cell.node, 'click', functionsArr[index]);
      });
      this.engine.audioPlayer.playSound('shovel');
    };

    const event = (e: any): void => {
      if (e instanceof MouseEvent || (e instanceof KeyboardEvent && e.code === 'KeyS')) {
        this.engine.audioPlayer.playSound('shovel');
        this.toggleState();
        this.plantCards.forEach((card) => card.removeSelect());
        if (this.isActive) {
          cellsFlat.forEach((cell: Cell) => {
            const f = (ev: any): void => {
              cellClick.call(cell.node, ev, cell);
            };
            functionsArr.push(f);
          });

          cellsFlat.forEach((cell, index) => {
            this.engine.on(cell.node, 'click', functionsArr[index]);
          });
        } else {
          cellsFlat.forEach((cell, index) => {
            this.engine.off(cell.node, 'click', functionsArr[index]);
          });
        }
      }
    };

    window.addEventListener('keypress', event);
    this.engine.on(this.shovelNode, 'click', event);
  }

  private toggleState(): void {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.shovelNode.opacity = 0.5;
    } else {
      this.shovelNode.opacity = 1;
    }
  }
}
