// Контент курса ИБ. Каждый модуль лежит в modules/mNN.js;
// PLAN — программа целиком: модули, которых ещё нет в MODULES, показываются как «скоро».
// Структура и привязка к roadmap.sh: docs/cyber-security/structure.json.
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
  id: 0,
  title: "Введение в безопасность",
  short: "CIA-триада, риск, глубокая защита, профессия и этика"
 },
 {
  id: 1,
  title: "IT-фундамент и операционные системы",
  short: "Железо, ОС, права, CLI, виртуализация и лаборатория"
 },
 {
  id: 2,
  title: "Сети глазами защитника",
  short: "Адресация, устройства, протоколы, порты и инструменты диагностики"
 },
 {
  id: 3,
  title: "Аутентификация и управление доступом",
  short: "Кто вы и что вам можно: MFA, SSO, Kerberos, LDAP, привилегии"
 },
 {
  id: 4,
  title: "Криптография на практике",
  short: "Хеши, соль, ключи, PKI, TLS и защищённые версии протоколов"
 },
 {
  id: 5,
  title: "Социальная инженерия",
  short: "Фишинг во всех вариантах, офлайн-приёмы и атаки через сайты"
 },
 {
  id: 6,
  title: "Сетевые и беспроводные атаки",
  short: "MITM, спуфинг, DoS, атаки на Wi-Fi и VLAN"
 },
 {
  id: 7,
  title: "Атаки на приложения и вредоносное ПО",
  short: "OWASP Top 10, инъекции, CSRF, ошибки памяти, малварь"
 },
 {
  id: 8,
  title: "Защита инфраструктуры",
  short: "Харденинг, патчи, межсетевые экраны, IDS/IPS, EDR, бэкапы"
 },
 {
  id: 9,
  title: "Мониторинг и обнаружение",
  short: "Логи, SIEM, ложные срабатывания, threat intel и проверка индикаторов"
 },
 {
  id: 10,
  title: "Реагирование на инциденты и форензика",
  short: "Процесс IR от подготовки до разбора, ранбуки, сбор улик"
 },
 {
  id: 11,
  title: "Взгляд атакующего",
  short: "Kill Chain, ATT&CK, пентест, инструменты и управление уязвимостями"
 },
 {
  id: 12,
  title: "Управление ИБ: стандарты и комплаенс",
  short: "ISO 27001, NIST, CIS, CSF, RMF, аудит и работа с бизнесом"
 },
 {
  id: 13,
  title: "Безопасность в облаке",
  short: "Модели облака, разделённая ответственность, IaC, serverless и хранилища"
 }
];
export const UPCOMING = PLAN.filter(p => !MODULES.some(m => m.id === p.id));
