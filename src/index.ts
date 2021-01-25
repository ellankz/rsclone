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

game.init();
