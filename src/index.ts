import './style/main.scss';

import Game from './game/index';
import Engine from './engine';

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const engine = new Engine(container, {
  first: ['back', 'main', 'top', 'window'],
  loader: ['loader-back', 'loader'],
});
const game = new Game(engine);
game.init();
