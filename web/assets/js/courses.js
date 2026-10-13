// ====== КАТАЛОГ КУРСОВ ======
// Чтобы добавить курс: создайте папку courses/<id>/ по образцу существующих и допишите запись сюда.
// lessons и modules нужны главной странице, чтобы считать прогресс, не загружая контент курса;
// движок курса обновляет их в Store при каждом открытии (см. engine.js), так что опечатка здесь не критична.
export const COURSES = [
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
  },
  {
    id: 'cyber-security',
    title: 'Информационная безопасность для разработчиков',
    short: 'Как атакуют приложения, сети и людей и как защищаться: аутентификация, криптография, OWASP, мониторинг, реагирование и облако.',
    path: 'courses/cyber-security/',
    lessons: 69, modules: 14,
    color: '#6d3fc0', colorDark: '#b598ff',
    icon: '🛡️',
    tags: ['OWASP', 'IAM', 'SOC', 'Cloud']
  },
  {
    id: 'devops',
    title: 'DevOps для разработчиков',
    short: 'От коммита до продакшена: Linux, Git, CI/CD, Docker, Kubernetes, Terraform, облака, мониторинг, SRE и безопасность поставки.',
    path: 'courses/devops/',
    lessons: 52, modules: 13,
    color: '#3d4fc4', colorDark: '#8c9bff',
    icon: '🚀',
    tags: ['CI/CD', 'Docker', 'K8s', 'IaC']
  }
];
export const findCourse = id => COURSES.find(c => c.id === id);
