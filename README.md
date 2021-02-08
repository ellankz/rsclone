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

Игра написана на TypeScript для более прозрачного кода и избежания ошибок.

Для сборки проекта используется Webpack и разного плана загрузчики для картинок, музыки, трансформации SCSS в CSS.

Для отлова ошибок ESLint с конфигурацией airbnb-typescript/base. Эта настройка позволяет использовать TypeScript в полной мере в отличие от airbnb-base.

Для хранения данных игра обращается к LocalStorage и к серверу https://rs-plants-vs-zombies.herokuapp.com/

Для отрисовки всех элементов игры задействован HTML5 элемент canvas. Он позволяет содавать анимации при помощи покадровой отрисовки на canvas-элементе.

Для добавления полей ввода на canvas использован [canvasinput](https://www.npmjs.com/package/canvasinput)
