# Plants vs Zombies

Демо: [https://plants-vs-zombies-rsclone.netlify.app/](https://plants-vs-zombies-rsclone.netlify.app/)

Документация движка: https://github.com/ellankz/rsclone/blob/develop/src/engine/docs.md

Для запуска игры:

` $ git clone https://github.com/ellankz/rsclone `

` $ cd rsclone `

` $ git fetch `

` $ git checkout develop `

` $ npm install `

` $ npm run start `

Игра запустится локально, но за данными пользователей будет обращаться на удаленный сервер.

Репозиторий серверной части кода находится [здесь](https://github.com/ellankz/rsclone-be).

## Стек технологий

![стэк технологий](https://user-images.githubusercontent.com/70816049/107280288-947cfd00-6a71-11eb-896f-bab65ec1ff4a.png)

Игра написана на TypeScript для более прозрачного кода и избежания ошибок.

Для сборки проекта используется Webpack и разного плана загрузчики для картинок, музыки, трансформации SCSS в CSS.

Для отлова ошибок ESLint с конфигурацией airbnb-typescript/base. Эта настройка позволяет использовать TypeScript в полной мере в отличие от airbnb-base.

Для хранения данных игра обращается к LocalStorage и к серверу https://rs-plants-vs-zombies.herokuapp.com/

Для отрисовки всех элементов игры задействован HTML5 элемент canvas. Он позволяет содавать анимации при помощи покадровой отрисовки на canvas-элементе.

В данной игре используется кастомный движок на основе canvas. Документация к движку с примерами находится [здесь](https://github.com/ellankz/rsclone/blob/develop/src/engine/docs.md)

Для добавления полей ввода на canvas использован [canvasinput](https://www.npmjs.com/package/canvasinput)
