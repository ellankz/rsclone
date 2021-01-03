import Engine from '../engine';
import Cell from './Cell';

const backgroundUrl = require('../assets/images/interface/background1.jpg');

const ROWS_NUM = 5;
const COLS_NUM = 9;

export default class Game {
  engine: Engine;

  cells: Cell[][];

  constructor(engine: Engine) {
    this.engine = engine;
    this.cells = [];
  }

  init() {
    const { engine } = this;
    engine.createScene('scene', function Scene() {
      this.update = () => {
        // code
      };
    });

    this.addBackground();
    this.createCells();

    this.engine.start('scene');
  }

  addBackground() {
    const image = new Image();
    image.src = backgroundUrl.default;

    this.engine
      .createNode(
        {
          type: 'ImageNode',
          position: this.engine.vector(0, 0),
          size: this.engine.vector(this.engine.size.x + 400, this.engine.size.y),
          layer: 'back',
          img: image,
          dh: this.engine.size.y,
        },
      );
  }

  createCells() {
    for (let x = 0; x < COLS_NUM; x += 1) {
      const row: Cell[] = [];
      for (let y = 0; y < ROWS_NUM; y += 1) {
        const cell = new Cell({ x, y }, this.engine);
        cell.draw();
        row.push(cell);
      }
      this.cells.push(row);
    }
  }
}
