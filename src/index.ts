import Game from './game/index';
import Engine from './engine';

import './style/main.scss';

require.context('./assets/favicon', true, /\.(png|svg|xml|ico|webmanifest)$/);

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const engine = new Engine(container, {
  first: ['back', 'main', 'top'],
  loader: ['loader-back', 'loader'],
});

// engine.fullscreen = true;

const game = new Game(engine);

game.init();
