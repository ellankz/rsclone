# Game engine

## Содержание

- [Engine](#engine)
- [Core](#vector)
  - [Vector](#vector)
  - [Screen](#screen)
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
- [TimeManager](#timemanager)
  - [Timeout, Interval](#timeout,-interval)
  - [Timer](#timer)
- [Loader](#loader)
- [Fullscreen](#fullscreen)
- [Notes](#notes)
- [Examples](#examples)

---

## Engine

Главный класс создающий движок и регулирующий все методы.

#### Cвойства

```javascript
{
  size: Vector,  // размер контейнера
  containerOffset: Vector,  // отступ контейнера от границ окна
  screens: { screenName: Layer[] },
  activeScreen: string,
  layers: { layerName: Layer },
  events: { event: { option: value } }, // опции событий
  container: HTMLElement,
  fullscreen: false,
}
```

#### Параметры

```javascript
(_box: string | HTMLElement, config?: {screenName: [...layersNames]} | [...layersNames], screenZIndex?: number);
```

`_box` - id или ссылка на сам элемент

`config` - необязательный параметр, который создадет экраны и слои сразу при инициализации. Форматы:

- объект с ключами имен экранов и значениями - массивами уникальных имен для слоев
- массив имен для слоев

`screenZIndex` - необязательный параметр, zIndex, который добаляется к слоям текущего экрана, default - 100

#### Создание

```javascript
const engine = new Engine(container, { mainScreen: ['back', 'main'], firstScreen: ['nav'] });
const engine = new Engine(container, ['back', 'main']);
```

#### Методы

```javascript
vector: (x?: number, y?: number) => Vector;

start: (name: string) => void; // запускает сцену по имени
stop: () => void; // останавливает активную сцену

createScreen: (name: string, layersNames[]) => void;
setScreen: (name: string) => void;

createLayer: (name: string, index: number) => void;
getLayer: (name: string) => ILayer;

createScene: (name: string, Construct?) => void;
getSceneNodes: (name: string) => Nodes[];

createNode: (params: any, update?: () => void) => Node;
createView: (layersNames: string[]) => View; // создает камеру для выбраных слоев

on: (node: NodesType, event: string, callback: (e: any) => void) => boolean; // добавляет событие на узел
off: (node: NodesType, event: string, callback: (e: any) => void) => boolean; // удаляет событие с узла
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

## Screen

Группирует слои в экраны.

#### Cвойства

```javascript
{
  layers: [...layersNames], // массив имен слоев
}
```

#### Создание

1. При инициализации (рекомендуется)
   - вторым параметром в движок передается объект с именами экранов и массив строк с уникальными именами слоев
   - по умолчанию устанавливается последний экран из созданых при инициализации, в остальных случаях необходимо вызывать метод setScreen
   ```javascript
   const engine = new Engine('container', { mainScreen: ['back', 'main'], firstScreen: ['nav'] });
   ```
2. Отдельно, ничего не возвращает
   - первый параметр имя экрана, второй - массив имен слоев
   ```javascript
   const engine = new Engine('container');
   engine.createScreen('name', ['main', 'back']);
   ```

#### Управление

- setScreen - принимает имя экрана и выносит его наверх, путем добавления к слоям большого zIndex

```javascript
const engine = new Engine(container, { firstScreen: ['main', 'top'] });
engine.setScreen('firstScreen');
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
  nodes: [...nodes],    // список узлов находящихся на слое
  screen: string,       // имя экрана к которому принадлежит слой, default - ''
}
```

#### Создание

! Если при инициализации не передавались слои, автоматически создается слой 'main'

1. При инициализации (рекомендуется)
   - вторым параметром в движок передается массив строк с уникальными именами слоев
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

1. Методы перемещения. Перемещают слои путем изменения zIndex. Необязательным параметром принимает число на которое необходимо увеличить zIndex.

   - toTop(n?)
   - toBack(n?)

   ```javascript
   layer.toTop();
   layer.toBack(3);
   ```

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

1. Дополнительные методы !(только при необходимости)
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

Работает с событими узла.

#### События

- click
- mouseenter
- mouseleave
- mousedown
- mouseup

#### Опции

- eventBubbling (default: false) - если true - при нажатии на узел событие отрабатывает также на узлах под ним, иначе узлы под игнорируются и событие работает только на неперекрывающихся частях узла. Есть у всех событий, кроме mouseleave. Для mouseleave значение берется из mouseenter.

#### Задание опций

Опции учитываются при каждом отрабатывании событий, поэтому в процессе их можно менять.

Опции задаются через engine.events[eventName][option].

```javascript
engine.events.click.eventBubbling = true;
```

#### Использование

! Работает с узлами на всех слоях, если установлен активный экран - только с слоями экрана
! По умолчанию событие отрабатывает только на неперекрывающихся частях узла, чтобы изменить необходимо изменить опцию eventBubbling нужного события на true

Методы `on`, `off` принимают узел, название события и коллбек, в который будет передан event, возвращают true если операция прошла успешно, иначе false.

`on` - добавляет событие на узел

`off` - удаляет событие узла !(коллбек должен равняться тому, что был задан при `on`)

```javascript
const callback = (e) => console.log(e.pageX);
engine.on(node, 'click', callback);
engine.off(node, 'click', callback);
```

---

## Nodes

Cоздает узлы, с которыми можно работать (обновлять, отрисовывать заново, удалять и тд.)

#### Создание

При создании возвращается узел или null при неправильных параметрах.

Узел сразу отрисовывается на слое при создании.

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
- `removeAllEvents: () => void` - удаляет все слушатели событий у узла

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
  - `opacity` - число от 0 до 1
  - `removeEventBubbling` - принимает массив с названиями событий, запрещает передачу события ниже узла, если у engine.events на это событие параметр eventBubbling выставлен на true

#### Типы узлов

##### RectNode

```javascript
{
  type: 'RectNode',
  position: Vector,
  size: Vector,
  layer: layerName,

  border?: string,
  color?: string,
  opacity?: number
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
  color?: string,
  opacity?: number
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
  color?: string,
  opacity?: number
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
  border?: string,
  opacity?: number
}
```

##### SpriteNode

! Спрайты работают только на рабочей сцене, так как им нужно обновление

! Скорость подбирается вручную и зависит от количества фреймов

! Спрайт должен быть горизонтальным (в один ряд)

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
  border?: string,
  opacity?: number,
  repeat?: number
}
```

`repeat` - задает количество повторений спрайта или его состояния, при смене состояния обнуляется

##### Методы
- `pause` 
- `resume`
- `then` - принимает коллбек который вызывается, после выполнения, если задан repeat. Можно вызывать много раз. Обнуляется при смене состояния.

##### Смена состояний спрайта

Все состояния спрайта задаются в момент создания узла.

Дополнительные состояния можно задать в поле states:

```javascript
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

```javascript
interface SpriteStatesConfig {
  [dynamic: string]: {
    // название состояния, изначальное состояние сохранается с ключем basic
    img: HTMLImageElement,
    frames: number,
    speed?: number,
    dh?: number,
    startFrame?: number,
    positionAdjust?: IVector, // отклонение позиции от изначальной
    size?: IVector,
  };
}
```

---

## TimeManager
Помогает регулировать время в игре.

### Timeout, Interval
Если не добавлены в таймер не начнутся до вызова start.

#### Параметры
```javascript
(callback: () => void, timeout | interval: number, repeat?: number)
```

`repeat` - количество повторений, в случае интервала он остановится после выполнения заданного количества раз

#### Создание
```javascript
const timeout = engine.timeout(() => console.log('hi'), 1000);
const interval = engine.interval(() => console.log('hi'), 1000);
```
#### Свойства
```javascript
isStarted: boolean; // изменяется один раз при первом вызове start
isPaused: boolean; 
isDestroyed: boolean;
isFinished: boolean; // изменяется после каждого повторения
parentTimer: Timer; // ссылка на родительский таймер, если есть
```

#### Методы
- Регулировка

  `start` - запускает таймаут, при повторном вызове останавливает текущий и начинает заново
  
  `pause`
  
  `resume` 
  
  `destroy`
  
- Дополнительные

  Добавляют коллбеки, которые будут вызваны в определленный период
   
  Принимают коллбек, и возвращают этот же таймаут
    
  ! Можно вызывать сколько угодно раз в любом порядке, но до первого вызова start

  `before` - добавляет коллбеки, которые будут вызваны один раз перед первым вызовом start
  
  `then` - добавляет коллбеки, которые будут вызваны после каждого повторения
  
  `finally` - добавляет коллбеки, которые будут вызваны в конце всех повторений

### Timer
Группирует между собой все виды таймеров. Можно вкладывать любые Interval, Timeout, Timer в любом порядке.

Если не добавлен в таймер не начнется до вызова start.

#### Параметры
```javascript
(timers: (string | Timeout | Interval | Timer)[], sequentially?: boolean, name?: string)
```

`timers` - массив из таймеров или их имен, интервалов или таймаутов

`sequentially` - выполнять последовательно, по умолчанию одновременно - false

`name` - если задать имя, то таймер можно будет получить так:

```javascript
const timer = engine.getTimer('name');
```

#### Создание
```javascript
const timer = engine.timer([timeout, interval]);
```
#### Свойства
```javascript
isStarted: boolean; // изменяется один раз при первом вызове start
isPaused: boolean; 
isDestroyed: boolean;
isFinished: boolean; // изменяется после каждого повторения
parentTimer: Timer; // ссылка на родительский таймер, если есть
```
#### Методы
- Добавление

  `add` - принимает timer | interval | timeout и добавляет их к таймеру (!нельзя добавлять в несколько таймеров одновременно)
  
  `remove` - удаляет timer | interval | timeout из таймера

- Регулировка

  `start`, `pause`, `resume`, `destroy` - вызывают методы для каждого элемента, в случае sequentially === true - start будет вызываться последовательно
  
- Дополнительные

  `before`, `finally` - работают также как и в Interval | Timeout
  
#### Примеры
```javascript
const timeout = engine.timeout(() => console.log('timeout'), 3000, 2);
const interval = engine.interval(() => console.log('interval'), 3000, 2);
const timer = engine.timer([interval, timeout])
    .before(() => console.log('start'))
    .finally(() => console.log('finish'))
    .start();
/*
Выведется 'start', 
затем два раза 'interval', 'timeout',
затем 'finish'
*/

const timeout = engine.timeout(() => console.log('timeout'), 3000, 2);
const interval = engine.interval(() => console.log('interval'), 2000, 2);
const timer = engine.timer([interval, timeout], true); // таймаут начнет выполнение только после окончания интервала
сonts timer2 = engine.timer([engine.timeout(() => console.log('delay'), 1000), timer], true).start();
/*
Через секунду выведется 'delay', 
затем два раза каждые три секунды 'interval' 
и затем два раза каждые две секунды 'timeout'
*/
```
---

## Loader

Загружает все mp3, png, jpg, ttf файлы из папки src/assets и создает Image и Audio элементы для каждого.

Чтобы использовать шрифт необходимо объявить его через правило font-face (!имя шрифта должно совпадать с названием файла)

Получить доступ к изображению или аудио можно таким образом:

```javascript
const image = engine.loader.files['assets/images/image1.png'] as HTMLImageElement;
const audio = engine.loader.files['assets/audio/audio.mp3'] as HTMLAudioElement;
```

---

## Fullscreen

Включить полноэкранный режим игры можно установив значение fullscreen в true. Режим можно менять сколько угодно раз.

```
engine.fullscreen = true;
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

Пример показывающий работу камеры, смену сцен с узлами на разных слоях, использование экранов

```javascript
const engine = new Engine(container, {
  level: ['back', 'main', 'nav'],
  firstScreen: ['firstScreen'],
});

let levelSceneInit: () => void = null; // резервируем переменную под коллбек

engine.createScene('levelScene', function () {
  this.init = () => {
    if (levelSceneInit) levelSceneInit();
  };
});

engine.createScene('firstScreenScene');

const bgImg = new Image();
const sunflowerImg = new Image();
const zombieImg = new Image();

bgImg.src = 'assets/images/interface/background1.jpg';
sunflowerImg.src = 'assets/sprites/plants/SunFlower/0.png';
zombieImg.src = 'assets/sprites/zombies/zombie.png';

// configs
const sunflowerConfig = {
  type: 'SpriteNode',
  position: engine.vector(),
  size: engine.vector(1314, 74),
  dh: 80,
  frames: 18,
  layer: 'main',
  img: sunflowerImg,
  speed: 50,
};

const zombieConfig = {
  type: 'SpriteNode',
  position: engine.vector(),
  size: engine.vector(2068, 126),
  dh: 130,
  frames: 22,
  speed: 50,
  layer: 'main',
  img: zombieImg,
};

const btnConfig = {
  type: 'RectNode',
  position: engine.vector(),
  size: engine.vector(155, 40),
  layer: 'nav',
  color: '#503714',
  border: '4px #604013',
};

const textConfig = {
  type: 'TextNode',
  position: engine.vector(),
  text: '',
  color: '#cfc161',
  layer: 'nav',
  fontSize: 18,
  font: 'sans-serif',
};

// levelScreen
const bgNode = engine
  .createNode({
    type: 'ImageNode',
    position: engine.vector(),
    size: engine.vector(engine.size.x + 400, engine.size.y),
    layer: 'back',
    img: bgImg,
    dh: engine.size.y,
  })
  .addTo('levelScene');

engine.createNode({ ...sunflowerConfig, position: engine.vector(500, 290) }).addTo('levelScene');
engine.createNode({ ...sunflowerConfig, position: engine.vector(580, 380) }).addTo('levelScene');

const zombie = engine // резервируем переменную, чтобы в дальнейшем повесить анимацию
  .createNode({ ...zombieConfig, position: engine.vector(1140, 240) })
  .addTo('levelScene');

// nav
const btn1 = engine.createNode({
  ...btnConfig,
  position: engine.vector(engine.size.x - btnConfig.size.x - 20, 20),
});

const btn2 = engine.createNode({
  ...btnConfig,
  position: engine.vector(engine.size.x - btnConfig.size.x - 20, 40 + btnConfig.size.y),
});

const btn3 = engine.createNode({
  ...btnConfig,
  position: engine.vector(engine.size.x - btnConfig.size.x - 20, 60 + btnConfig.size.y * 2),
});

const btnBack = engine.createNode({
  ...btnConfig,
  position: engine.vector(20, 20),
});

engine.createNode({
  ...textConfig,
  position: engine.vector(btn1.position.x + 10, btn1.position.y + 12),
  text: 'move all screens',
});

engine.createNode({
  ...textConfig,
  position: engine.vector(btn2.position.x + 10, btn2.position.y + 12),
  text: 'move 1st screen',
});

engine.createNode({
  ...textConfig,
  position: engine.vector(btn3.position.x + 10, btn3.position.y + 12),
  text: 'move 2nd screen',
});

engine.createNode({
  ...textConfig,
  position: engine.vector(btnBack.position.x + 50, btnBack.position.y + 12),
  text: 'BACK',
});

// firstScreen
engine.createNode({
  type: 'RectNode',
  position: engine.vector(),
  size: engine.vector(engine.size.x, engine.size.y),
  layer: 'firstScreen',
  color: '#1a1000',
});

engine
  .createNode({
    ...sunflowerConfig,
    position: engine.vector(engine.size.x / 2 - 40, engine.size.y / 2 - 100),
    layer: 'firstScreen',
  })
  .addTo('firstScreenScene');

const btnPlay = engine.createNode({
  ...btnConfig,
  position: engine.vector(
    engine.size.x / 2 - btnConfig.size.x / 2,
    engine.size.y / 2 - btnConfig.size.y / 2 + 40,
  ),
  layer: 'firstScreen',
});

engine.createNode({
  ...textConfig,
  position: engine.vector(btnPlay.position.x + 55, btnPlay.position.y + 12),
  text: 'PLAY',
  layer: 'firstScreen',
});

// game
engine.start('firstScreenScene');
let running = false; // флаг для отслеживания анимации

levelSceneInit = () => {
  engine.getLayer('back').view.position.x = 110; // 110 - начальная позиция фона
  engine.getLayer('main').view.position.x = 110;
};

const viewAnimation = (node: any) => {
  const view = node.layer.view;
  running = true;

  node.update = () => {
    if (view.position.x - 110 >= 200) {
      setTimeout(() => {
        node.update = () => {
          if (view.position.x <= 110) {
            delete node.update;
            view.position.x = 110;
            running = false;
          } else {
            view.move(engine.vector(-2.5, 0));
          }
        };
      }, 100);
    } else {
      view.move(engine.vector(3.5, 0));
    }
  };
};

engine.on(btnPlay, 'click', () => {
  engine.stop();
  engine.setScreen('level');
  engine.start('levelScene');
});

engine.on(btnBack, 'click', () => {
  engine.stop();
  engine.setScreen('firstScreen');
  engine.start('firstScreenScene');
});

engine.on(btn1, 'click', () => {
  if (running) return;
  const view = engine.createView(['back', 'main']);
  view.move(engine.vector(110));
  viewAnimation(zombie);
});

engine.on(btn2, 'click', () => {
  if (running) return;
  const view = engine.createView(['main']);
  view.move(engine.vector(110));
  engine.getLayer('back').view.position.x = 110; // позиция камеры уже могла измениться
  viewAnimation(bgNode);
});

engine.on(btn3, 'click', () => {
  if (running) return;
  const view = engine.createView(['back']);
  view.move(engine.vector(110));
  engine.getLayer('main').view.position.x = 110;
  viewAnimation(zombie);
});
```
