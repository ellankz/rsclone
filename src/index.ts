import './style/main.scss';
import Game from './game/index';
import Engine from './engine';
import { StartScreen } from './models/StartScreen';
// import '../node_modules/canvasinput/CanvasInput';
//
// const windowCopy: any = window;
// const { CanvasInput } = windowCopy;

const container = document.createElement('div');
container.id = 'game';
document.body.appendChild(container);

const engine = new Engine(container, {
  first: ['back', 'main'],
  loader: ['loader-back', 'loader'],
});
const game = new Game(engine);
game.init();

const startGameScreen = new StartScreen(engine);
startGameScreen.openScreen();

// const input = new CanvasInput({
//   canvas: document.querySelectorAll('canvas')[3],
//   fontSize: 18,
//   // fontFamily: 'Arial',
//   fontColor: '#212121',
//   fontWeight: 'bold',
//   width: 200,
//   padding: 5,
//   x: (engine.size.x / 2) - (200 / 2),
//   y: (engine.size.x / 3),
//   // borderWidth: 1,
//   borderColor: '#FFF',
//   borderRadius: 0,
//   boxShadow: 'none',
//   innerShadow: 'none',
//   placeHolder: 'Enter you password',
// });
// const input2 = new CanvasInput({
//   canvas: document.querySelectorAll('canvas')[3],
//   fontSize: 18,
//   // fontFamily: 'Arial',
//   fontColor: '#212121',
//   fontWeight: 'bold',
//   width: 200,
//   padding: 5,
//   x: (engine.size.x / 2) - (200 / 2),
//   y: (engine.size.x / 4),
//   // borderWidth: 1,
//   borderColor: '#FFF',
//   borderRadius: 0,
//   boxShadow: 'none',
//   innerShadow: 'none',
//   placeHolder: 'Enter you login',
// });
