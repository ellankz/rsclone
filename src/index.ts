import './style/main.scss';
import Game from './game/index';
import Engine from './engine';
import { StartScreen } from './models/StartScreen';

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const engine = new Engine(container, {
  first: ['back', 'main'],
  loader: ['loader-back', 'loader'],
});
const game = new Game(engine);
game.init();

// setTimeout(() => {
//   const startGameScreen = new StartScreen(engine);
//   startGameScreen.openScreen();
// }, 1000);
