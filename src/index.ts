import './style/main.scss';
import Game from './game';
import Engine from './engine';
import { DataService } from './api-service/DataService';

require.context('./assets/favicon', true, /\.(png|svg|xml|ico|webmanifest)$/);

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const engine = new Engine(container, {
  first: ['back', 'main', 'top', 'window'],
  loader: ['loader-back', 'loader'],
});
const dataService = new DataService();
// engine.fullscreen = true;
const game = new Game(engine, dataService);

game.init();
