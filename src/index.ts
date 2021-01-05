import './style/main.scss';

import Game from './game/index';
import Engine from './engine';

import { FallingSun } from './game-mechanics/falling-sun/FallingSun';

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const engine = new Engine(container, ['back', 'main']);
const game = new Game(engine);
game.init();

//----------------------------------------------
engine.createScene('scene', function Scene() {
  this.update = () => {
    if (engine.getSceneNodes('scene').length === 0) {
      console.log('scene is clear');
      engine.stop(); // if there is no nodes on the scene, stop scene
    }
  };
});

engine.start('scene');

const timer = new FallingSun(engine, game, 2000, 'main', 'scene');
timer.init();
setTimeout(timer.stop, 21000);
