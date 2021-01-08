# Game engine

## Содержание

- [Engine](#engine)
- [Core](#vector)
  - [Vector](#vector)
  - [Layer](#layer)
  - [Scene](#scene)
  - [View](#view)
  - [Event](#event)
- [Nodes](#nodes)
  - [RectNode](#rectnode)
  - [CircleNode](#circlenode)
  - [TextNode](#textnode)
  - [ImageNode](#imagenode)
  - [SpriteNode](#spritenode)
- [Notes](#notes)
- [Examples](#examples)

---

## Engine

Главный класс создающий движок и регулирующий все методы.

#### Cвойства

```javascript
{
  size: Vector,  // размер контейнера
  canvasOffset: Vector,  // отступ контейнера от границ окна
  layers: { layerName: Layer },
  container: HTMLElement
}
```

#### Параметры

```javascript
(_box: string | HTMLElement, layersArray?: [...layersNames])
```

`_box` - id или ссылка на сам элемент

`layersArray` - необязательный, но желательный параметр - массив уникальных имен для слоев, которые создадутся сразу при инициализации

#### Создание

```javascript
const engine = new Engine(container, ['back', 'main']);
```

#### Методы

```javascript
vector: (x?: number, y?: number) => Vector;

start: (name: string) => void; // запускает сцену по имени
stop: () => void; // останавливает активную сцену

createLayer: (name: string, index: number) => void;
getLayer: (name: string) => ILayer;

createScene: (name: string, Construct?) => void;
getSceneNodes: (name: string) => Nodes[];

createNode: (params: any, update?: () => void) => Node;
createView: (layersNames: string[]) => View; // создает камеру для выбраных слоев
```

Все элементы и методы подробно описаны ниже.

## Vector

Создает объект по заданным координатам, и добавляет дополнительные методы к нему. Пропущеные координаты заменяются на ноль. Требуется для большинства методов.

#### Cвойства

```javascript
{
    x: number,
    y: number,
}
```

#### Параметры

```javascript
(x?: number, y?: number)
```

#### Создание

```javascript
engine.vector(50, 100);
```

#### Методы

- `minus` - принимает Vector, возвращает вызываемый вектор с отнятыми координатами переданого вектора
- `plus` - аналогично minus, только добавляет

```javascript
const vector = engine.vector(); // {x: 0; y: 0}

vector.minus(engine.vector(10)); // {x: 0 - 10; y: 0 - 0} => {x: -10; y: 0}
vector.plus(engine.vector(20, -10)); // {x: - 10 + 20; y: 0 + -10} => {x: 10; y: -10}
```

## Layer

Создает новый канвас, отрисовывает нужные элементы и хранит в себе все его узлы.

#### Cвойства

```javascript
{
  canvas: canvasElement,
  ctx: canvasContext2D,
  size: Vector,         // размеры родительского контейнера
  offset: Vector,       // позиция родительского контейнера
  view: View;           // текущая камера
  nodes: [...nodes]     // список узлов находящихся на слою
}
```

#### Создание

! Если при инициализации не передавались слои, автоматически создается слой 'main'

1. При инициализации (рекомендуется)
   - вторым параметром в движок передаем массив строк с уникальными именами слоев
   - самый последний слой будет самым верхним
   ```javascript
   const engine = new Engine('container', ['back', 'main', 'top']);
   ```
2. Отдельно (при надобности), ничего не возвращает
   - можно задать вторым параметром zIndex, если не задан - задается по очередности
   ```javascript
   const engine = new Engine('container')
   engine.createLayer("name", index?: number);
   ```

#### Получение слоя

```javascript
const engine = new Engine('container', ['main']);
const layer = engine.getLayer('main');
```

#### Методы

1. Методы прямой отрисовки (не рекомендуются). Не сохраняются в памяти, полностью статичны, нет возможности вернуть после очистки canvas.

   - drawRect

   ```javascript
   x: number; //position left of canvas
   y: number; //position top of canvas
   width: number;
   height: number;
   color?: string;
   border?: string;
   ```

   - drawСircle

   ```javascript
   x: number; //position left of canvas
   y: number; //position top of canvas
   radius: number;
   color?: string;
   border?: string;
   ```

   - drawText

   ```javascript
   x: number; //position left of canvas
   y: number; //position top of canvas
   text: string;
   font?: string; // font family
   size?: number; // font size
   color?: string;
   border?: string;
   ```

   - drawImage

   ```javascript
   x: number; //position left of canvas
   y: number; //position top of canvas
   width: number;
   height: number;
   img: HTMLImageElement; // !(объект, а не ссылка)
   srcX: number; //position left of source image
   srcY: number; //position top of source image
   dh: number; //desired height
   dw: number; //desired width
   border?: string;
   ```

2. Дополнительные методы !(только при необходимости)
   - clear - очищает канвас !(не удаляет узлы)
   - update - очищает канвас и рисует все узлы заново
   ```javascript
   const engine = new Engine('container', ['main']);
   engine.getLayer('main').clear();
   engine.getLayer('main').update();
   ```

## Scene

Создает объект, который хранит информацию об обновляемых узлах и обновляет их вызывая коллбеки. К сцене и ее свойствам нет прямого доступа, манипуляции с ней происходят за счет передачи уникального имени, которое создается при инициализации.

#### Создание

`createScene(name, Construct?)` - принимает уникальное имя сцены и вторым необязательным аргументом конструктор !(не объект) с коллбеками, ничего не возвращает

В конструкторе сразу можно можно создавать узлы, или использовать уже созданные, так как после вызова конструктора останутся только методы. Все коллбеки как и конструктор не обязательные.

Формат конструктора

```javascript
function MyScene () {
 this.init? = () => void; // когда сцена стартует
 this.update? = () => void; // каждый раз когда обновляется
 this.draw? = () => void; // каждый раз когда отрисовывается
 this.exit? = () => void; // когда происходит смена сцены
 }
```

Примеры

```javascript
engine.createScene('main');
engine.createScene('scene', function MyScene() {
  this.init = () => console.log('init');
  this.update = () => engine.getLayer('back').view.move(engine.vector(0.3, 0.5)); // перемещает камеру
  this.exit = () => console.log('exit');
});
```

#### Запуск и остановка сцены

- `engine.start('name')` - запускает сцену, в параметры передается имя сцены, _перед запуском убедитесь что другие сцены остановлены_
- `engine.stop()` - не принимает параметры, так как активная сцена может быть только одна

#### Порядок

- сцена инициализируется, можно добавить коллбеки для событий - `init, draw, update, exit`
- добавляются узлы на сцену, у каждого из узлов может быть свой коллбек для обновления
- вызывается метод `start`, который начинает обновлять сцену
- для того чтобы остановить сцену вызывается метод `stop`

Узлы можно добавлять:

- в конструкторе при создании сцены
- до старта сцены
- после старта сцены

Играть может только одна сцена, если сцена уже играет перед тем как запустить другую сцену необходимо вызвать метод `stop`.

#### Получение всех узлов сцены

`getSceneNodes(name) => [...nodes]` - принимает имя сцены и возвращает массив всех узлов на текущий момент или null если ничего не найдено

```javascript
engine.getSceneNodes('sceneName');
```

## View

Создает камеру привязанную к слоям, относительно которой расчитывается расположение узлов.

#### Cвойства

```javascript
{
  position: Vector; // current position
  layers: [...layers]; // tracked layers
}
```

#### Создание и получение

По умолчанию для каждого слоя создается отдельная камера. К ней можно обратиться через `layer.view`

Можно создать камеру отслеживающую несколько слоев (например, слои являются частью одного экрана или их нужно перемещать одновременно). В этом случае прошлая камера перезатирается. При создании координаты камеры равны `{x: 0; y: 0}`

`createView([...layersNames]) => View` - принимает массив из имен слоев, создает и возращает камеру, если параметры правильные, иначе возвращает null

```javascript
engine.createLayer('layer1');
engine.createLayer('layer2');

engine.createView(['layer1', 'layer2']);
```

#### Методы

- move - принимает `vector` координаты которого добавляет к позиции камеры, и смещает все элементы на отслеживаемых слоях

```javascript
// переместит камеру и все элементы по горизонтали и вертикали на 10px
engine.getLayer('main').view.move(engine.vector(10, 10));
```

- getPosition - принимает `vector` - позицию на канвасе и возвращает этот же вектор со смещением относительно позиции камеры !(чтобы просто получить позицию камеры используйте `view.position`)

## Event

Добавляет события на элементы

#### События

- click

#### Использование

! узел должен находиться на верхнем слою

`on` - принимает узел, название события, коллбек, в который будет передан event

```javascript
engine.on(node, 'click', (e) => console.log(e.pageX));
```

---

## Nodes

Cоздает узлы, с которыми можно работать (обновлять, отрисовывать заново, удалять и тд.)

#### Создание

При создании возвращается узел или null при неправильных параметрах.

Узел сразу отрисовывается на слою при создании.

`createNode(params, update?: (node) => void)` - принимает объект с параметрами необходимые для вида узла, второй необязательный аргумент - функция обновления, в которую передается узел и которая вызывается при обновлении сцены, если узел находится на ней

```javascript
engine.createNode({
  type: 'RectNode',
  position: engine.vector(), // {x: 0; y: 0}
  size: engine.vector(150, 100),
  layer: 'main',
});
```

#### Методы

- `addTo: (sceneName) => node` - принимает имя сцены и добавляет туда узел (узел может находится только на одной сцене), возвращяет этот же узел
- `move: (Vector) => void` - принимает Vector и смещает позицию элемента на это растояние
- `destroy: () => void` - удаляет узел из слоев и сцены
- `clearLayer: () => void` - очищает слой на котором находится узел и обновляет все узлы

Пример

```javascript
/* Будет двигать квадрат на 0.5px по горизонтали и 1px по вертикали,
   затем через секунду удалит квадрат и остановит сцену */

const rect = engine
  .createNode(
    {
      type: 'RectNode',
      position: engine.vector(100, 50),
      size: engine.vector(50, 100),
      layer: 'main',
      color: 'red',
    },
    (node) => node.move(engine.vector(0.5, 1)),
  )
  .addTo('scene');

engine.start('scene');

setTimeout(() => {
  engine.stop();
  rect.destroy();
}, 1000);
```

#### Общие параметры

- обязательные
  - `type` - тип узла
  - `position` - (Vector) позиция элемента относительно канваса, отрисовывается взависимости от положения камеры
  - `size` - (Vector) размер элемента (кроме TextNode и CircleNode)
  - `layer` - имя слоя на котором будет отрисовываться элемент
- дополнительные
  - `border` - добавляет границу, записывается в формате `'10px #cecece'`

#### Типы узлов

##### RectNode

```javascript
{
  type: 'RectNode',
  position: Vector,
  size: Vector,
  layer: layerName,

  border?: string,
  color?: string
}
```

##### CircleNode

```javascript
{
  type: 'CircleNode',
  position: Vector,
  radius: number,
  layer: layerName,

  border?: string,
  color?: string
}
```

##### TextNode

```javascript
{
  type: 'TextNode',
  position: Vector,
  text: string, // content
  layer: layerName,

  font?: string, // font family, default 'serif'
  fontSize?: number, // default 30
  border?: string,
  color?: string
}
```

##### ImageNode

```javascript
{
  type: 'ImageNode',
  position: Vector,
  size: Vector,
  layer: layerName,
  img: HTMLImageElement, // ! объект изображения, а не путь

  dh?: number; // желаемая высота - ширина расчитывается автоматически, default size
  srcPosition?: Vector, // позиция относительно исходной картинки, default {x: 0, y: 0}
  border?: string
}
```

##### SpriteNode

! Спрайты работают только на рабочей сцене, так как им нужно обновление

! Скорость подбирается вручную и зависит от количества фреймов

! Спрайт должен быть горизонтальным в один ряд

```javascript
{
  type: 'SpriteNode',
  position: Vector,
  size: Vector, // ширина всего спрайта
  layer: layerName,
  img: HTMLImageElement, // ! объект изображения, а не путь
  frames: number,

  startFrame?: number, // начальный фрейм считая от 0, default 0
  speed?: number, // скорость задержки - чем меньше значение, тем быстрее анимация, default 0
  dh?: number, // желаемая высота - ширина расчитывается автоматически, default size
  border?: string
}
```
##### Смена состояний спрайта
Все состояния спрайта задаются в момент создания узла.

Дополнительные состояния можно задать в поле states:
``` javascript
  const statesToCreate = {
   attack: {
        img, // HTMLImageElement 
        frames: 3,
        speed: 100,
        size: new Vector(70, 70),
        dh: 80,
        positionAdjust: new Vector(-10, 0)
      }
    };

  const node = this.engine.createNode({
    type: 'SpriteNode',
    position: new Vector(600, 700),
    size: new Vector(this.width * this.frames, this.height),
    layer: 'main',
    img: image, // HTMLImageElement 
    frames: this.frames,
    startFrame: 0,
    speed: this.speed,
    dh: this.height,
    states: statesToCreate,
  }).addTo('scene') as ISpriteNode;
```
Поле states принимает объект с ключем - название состояния ('attack') и значением - объект типа SpriteStatesConfig:

``` javascript
interface SpriteStatesConfig {
  [dynamic: string]: { // название состояния, изначальное состояние сохранается с ключем basic
    img: HTMLImageElement;
    frames: number; 
    speed?: number;
    dh?: number;
    startFrame?: number;
    positionAdjust?: IVector; // отклонение позиции от изначальной
    size?: IVector;
  }
}
```
---

## Notes

1. Обновление происходит достаточно быстро, около 60 кадров в секунду

2. Элементы сцены и статические узлы лучше хранить на разных слоях

3. Не стоит задавать слоям и сценам целочиленные имена как '1', чтобы объекты перебирались в правильном порядке

4. Обновление сцены дорогостоящая операция, поэтому если на даный момент на сцене ничего не отрисовывается или она закрыта другим слоем необходимо остановить ее (при запуске снова, она будет отрисовываться с того же места)

5. Не забывайте указывать слой при создании узлов

6. Размер текста в TextNode задается параметром fontSize

7. Стоит внимательно следить за тем что в нужные значения попадают имменно вектора, а так же за выполняемыми ими методами, так как они изменяют исходный объект. Поэтому если, например, необходимо узнать позицию элемента относительно камеры, но при этом не двигать сам объект, стоит создать новый вектор и передать в параметры позицию элемента:
   ```javascript
   view.getPosition(engine.vector(node.position.x, node.position.y));
   ```

---

## Examples

1. Demo: https://engine-demo1.netlify.app/

   Простой пример работы со сценой

```javascript
// будет двигать прямоугольник при каждом обновлении влево на 1px и 0.3px вниз
/* после того как он достигнет левой границы канваса удалит его,
	затем выведет в консоль 'rect was deleted' и остановит сцену */

const engine = new Engine(container, ['main']);

engine.createScene('scene', function Scene() {
  this.update = () => {
    if (engine.getSceneNodes('scene').length === 0) {
      console.log('rect was deleted');
      engine.stop();
    }
  };
});

function update(node: any) {
  node.move(engine.vector(-1, 0.3));
  if (node.position.x <= 0) {
    node.destroy();
  }
}

const rect = engine
  .createNode(
    {
      type: 'RectNode',
      position: engine.vector(engine.size.x - 150, 100),
      size: engine.vector(150, 100),
      layer: 'main',
      color: 'blue',
    },
    update,
  )
  .addTo('scene');

engine.start('scene');
```

2. Demo: https://engine-demo2.netlify.app/

   Простая игра с интересной анимацией. Пример изменения функции update у узлов, и отслеживания кликов.

```javascript
const engine = new Engine(container, ['main']);

const colors = ['pink', 'lightblue'];

// random number with negatives integers
const getNumber = (max: number) => Math.random() * max * (Math.random() < 0.5 ? -1 : 1);

const nodes: any[] = []; // to save all nodes

engine.createScene('scene', function Scene() {
  this.update = () => {
    if (engine.getSceneNodes('scene').length === 0) {
      console.log('scene is clear');
      engine.stop(); // if there is no nodes on the scene, stop scene
      engine.createNode({
        // win message
        type: 'TextNode',
        fontSize: 60,
        border: '1px white', // add weight to text
        position: engine.vector(engine.size.x / 2 - 150, engine.size.y / 2 - 50), // center text
        text: 'You won!',
        font: 'Roboto, sans-serif',
        color: '#fff',
        layer: 'main',
      });
    }
  };
});

for (let i = 0; i < 60; i++) {
  const node = engine
    .createNode({
      type: 'CircleNode',
      position: engine.vector(
        Math.abs(getNumber(engine.size.x - 100)), // select random size from positive integers with some distation
        Math.abs(getNumber(engine.size.y - 100)),
      ),
      radius: Math.floor(Math.random() * 28) + 12, // random positive radius
      color: colors[Math.floor(Math.random() * 2)], // select random color
      layer: 'main',
    })
    .addTo('scene');
  nodes.push(node);
}

nodes.forEach((node) => {
  let direct = engine.vector(getNumber(2), getNumber(2)); // get random direct
  let callback: () => void = null; // to save click callback

  engine.on(node, 'click', () => {
    // when click callback rewrite
    callback = () => {
      // reduce circle and destroy
      node.radius -= 0.4;
      if (node.radius < 1) node.destroy();
    };
  });

  node.update = (node: any) => {
    // change direction to opposite if node out of the borders
    if (node.position.x <= 0 && direct.x < 0) {
      direct.x *= -1;
    } else if (node.position.x + node.size.x > engine.size.x && direct.x > 0) {
      direct.x *= -1;
    }
    if (node.position.y <= 0 && direct.y < 0) {
      direct.y *= -1;
    } else if (node.position.y + node.size.y > engine.size.y && direct.y > 0) {
      direct.y *= -1;
    }
    node.move(direct); // move node in select direction
    if (callback) callback(); // on click callback will run
  };
});

engine.start('scene');
```

3. Demo: https://engine-demo3.netlify.app/

Пример детально показывающий работу камеры, а также работу сцены с узлами на разных слоях
