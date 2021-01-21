import './style/main.scss';
import Game from './game';
import Engine from './engine';
import { DataService } from './api-service/DataService';
import { ROWS_NUM } from './constats';

require.context('./assets/favicon', true, /\.(png|svg|xml|ico|webmanifest)$/);

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const rowsLayers = new Array(ROWS_NUM + 1).fill(0).map((elem, idx) => `row-${idx}`);

const engine = new Engine(container, {
  first: ['back', 'main', ...rowsLayers, 'top', 'window'],
  loader: ['loader-back', 'loader'],
});

engine.getLayer('window').removeEventBubbling.push('click');
engine.getLayer('top').removeEventBubbling.push('click');

const dataService = new DataService();
engine.fullscreen = true;
const game = new Game(engine, dataService);

// const timer1 = engine
//   .timeout(() => console.log(new Date().getSeconds()), 0, 4)
//   .then(() => console.log('hi'))
//   .finally(() => console.log('finish'))
//   .start();
const interval = engine
  .timeout(() => console.log(new Date().getSeconds()), 1000, 4)
  .finally(() => console.log('finally'))
  .before(() => console.log('before'))
  .then(() => console.log('then'))
  .start();

engine.timeout(() => interval.restart(), 3000).start();
// engine
//   .timeout(() => interval.destroy(), 3000)
//   .then(() => interval.start())
//   .start();

// const timeout = engine.timeout(() => console.log('time', new Date().getSeconds()), 1000, 4).start();
// const timeout2 = engine.timeout(() => timeout.resume(), 1000);

// engine
//   .timeout(() => timeout.pause(), 3000)
//   .then(() => timeout2.start())
//   .start();

game.init();
