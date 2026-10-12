// ====== КАТАЛОГ КУРСОВ ======
// Чтобы добавить курс: создайте папку courses/<id>/ по образцу существующих и допишите запись сюда.
// lessons и modules нужны главной странице, чтобы считать прогресс, не загружая контент курса;
// движок курса обновляет их в Store при каждом открытии (см. engine.js), так что опечатка здесь не критична.
const COURSES = [
  {
    id: 'network',
    title: 'Сети для разработчиков',
    short: 'От кабеля до HTTP/3: модели OSI/TCP-IP, адресация, маршрутизация, TCP, DNS, HTTP, TLS, CDN и диагностика.',
    path: 'courses/network/',
    lessons: 63, modules: 13,
    color: '#0b7a63', colorDark: '#3cc4a0',
    icon: '🌐',
    tags: ['TCP/IP', 'DNS', 'HTTP', 'TLS']
  },
  {
    id: 'ai-agents',
    title: 'AI-агенты для разработчиков',
    short: 'От токенов и сэмплинга до агентов с инструментами, памятью, MCP, оценкой качества и защитой от prompt injection.',
    path: 'courses/ai-agents/',
    lessons: 59, modules: 13,
    color: '#a8500a', colorDark: '#f0a33a',
    icon: '🤖',
    tags: ['LLM', 'RAG', 'MCP', 'Tools']
  }
];
const findCourse = id => COURSES.find(c => c.id === id);
