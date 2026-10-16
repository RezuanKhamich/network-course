// Контент курса Frontend. Каждый модуль лежит в modules/mNN.js;
// PLAN — программа целиком: модули, которых ещё нет в MODULES, показываются как «скоро».
// Структура и привязка к roadmap.sh: docs/frontend/structure.json.
// IMPORTS
import m00 from './modules/m00.js';
import m01 from './modules/m01.js';
import m02 from './modules/m02.js';
import m03 from './modules/m03.js';
import m04 from './modules/m04.js';
import m05 from './modules/m05.js';
import m06 from './modules/m06.js';
import m07 from './modules/m07.js';
import m08 from './modules/m08.js';
import m09 from './modules/m09.js';
import m10 from './modules/m10.js';
import m11 from './modules/m11.js';
import m12 from './modules/m12.js';
import m13 from './modules/m13.js';
export { GLOSSARY } from './glossary.js';
export { RES } from './resources.js';

export const MODULES = [m00, m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13];
export const PLAN = [
 {
  "id": 0,
  "title": "Как устроен веб",
  "short": "Абстракции фронтенда, путь запроса, браузер как платформа"
 },
 {
  "id": 1,
  "title": "HTML и DOM",
  "short": "Документ как дерево: парсинг, семантика, события"
 },
 {
  "id": 2,
  "title": "CSS: как браузер вычисляет стиль",
  "short": "Каскад, вычисленные значения, алгоритмы раскладки"
 },
 {
  "id": 3,
  "title": "Рендеринг и производительность",
  "short": "Конвейер пикселей, Web Vitals, профилирование"
 },
 {
  "id": 4,
  "title": "JavaScript: движок и рантайм",
  "short": "Как исполняется код: движок, event loop, память, модули"
 },
 {
  "id": 5,
  "title": "Веб-платформа: API браузера",
  "short": "Хранилища, воркеры, PWA, веб-компоненты, сеть"
 },
 {
  "id": 6,
  "title": "Инструменты: от исходников к бандлу",
  "short": "Git, пакеты, бандлеры, транспиляция, линтеры, TypeScript"
 },
 {
  "id": 7,
  "title": "Фреймворки: UI = f(state)",
  "short": "Декларативность, реконсиляция, реактивность"
 },
 {
  "id": 8,
  "title": "Состояние, данные и маршрутизация",
  "short": "Где живёт состояние, клиентский роутинг, API"
 },
 {
  "id": 9,
  "title": "Рендеринг на сервере и мета-фреймворки",
  "short": "CSR, SSR, SSG, гидратация, серверные компоненты"
 },
 {
  "id": 10,
  "title": "Безопасность фронтенда",
  "short": "Same-origin, CORS, XSS, CSP, аутентификация"
 },
 {
  "id": 11,
  "title": "Качество: тесты, доступность, дизайн-системы",
  "short": "Как проверить, что всё работает и всем доступно"
 },
 {
  "id": 12,
  "title": "Доставка и за пределами браузера",
  "short": "Деплой, мобильные и десктопные приложения"
 },
 {
  "id": 13,
  "title": "AI в работе фронтендера",
  "short": "Как работают LLM, ассистенты в разработке, AI в продукте"
 }
];
export const UPCOMING = PLAN.filter(p => !MODULES.some(m => m.id === p.id));
