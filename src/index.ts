import './style/main.scss';
import Game from './game/index';
import Engine from './engine';
import { DataService } from './api-service/DataService';

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const engine = new Engine(container, {
  first: ['back', 'main'],
  loader: ['loader-back', 'loader'],
});
const dataService = new DataService();
const game = new Game(engine, dataService);
game.init();
