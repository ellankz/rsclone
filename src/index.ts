import './style/main.scss';

import Game from './Game';
import Engine from './engine';

const game = new Game();

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const engine = new Engine(container, ['main']);

game.sayName();
