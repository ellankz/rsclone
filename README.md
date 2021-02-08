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

Игра написана на TypeScript.

Для сборки проекта используется Webpack.
Для отлова ошибок ESLint с конфигурацией airbnb-typescript/base.

Для хранения данных игра обращается к LocalStorage и к серверу https://rs-plants-vs-zombies.herokuapp.com/

Для отрисовки всех элементов игры задействован HTML5 элемент canvas. 

Для добавления полей ввода на canvas использован [canvasinput](https://www.npmjs.com/package/canvasinput)
