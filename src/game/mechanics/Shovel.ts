import Engine from '../../engine';
import { LEFT_CAMERA_OFFSET_COEF, PLANT_CARD_WIDTH_COEF, TOP_OFFSET_COEF } from '../../constats';
import Cell from '../Cell';
import Plant from '../../models/Plant';

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

  constructor(engine:Engine,
    occupiedCells: Map<Cell, Plant>,
    cells: Cell[][],
    deletePlant: () => Array<any>,
    plantsArr: Array<any>) {
    this.engine = engine;
    this.occupiedCells = occupiedCells;
    this.cells = cells;
    this.deletePlant = deletePlant;
    this.plantsArr = plantsArr;
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
    const cellClick = (cell: Cell) => {
      console.log(cell);
      if (this.occupiedCells.has(cell)) {
        console.log('DESTROY');
      } else {
        console.log('empty');
      }
    };

    this.engine.on(this.shovelNode, 'click', (e) => {
      this.isActive = !this.isActive;
      this.toggleState();
      if (this.isActive) {
        this.engine.events.click.eventBubbling = true;
        this.cells.forEach((cellRow) => cellRow.forEach((cell) => {
          // this.engine.on(cell.node, 'click', cellClick(cell, this.occupiedCells));
          this.engine.on(cell.node, 'click', () => cellClick(cell));
        }));
      } else {
        this.engine.events.click.eventBubbling = false;
        this.cells.forEach((cellRow) => cellRow.forEach((cell) => {
          // this.engine.off(cell.node, 'click', cellClick(cell, this.occupiedCells));
          this.engine.off(cell.node, 'click', () => cellClick(cell));
        }));
      }
    });
  }

  private toggleState(): void {
    if (this.isActive) {
      this.shovelNode.opacity = 0.5;
    } else {
      this.shovelNode.opacity = 1;
    }
  }
}
