// Короткие конструкторы вопросов и блоков урока. В вариантах правильный ответ пишем первым: движок перемешивает их при показе.
export const S = (id, prompt, options, explanation, difficulty = 2) => ({ id, type: 'single', prompt, options, answer: 0, explanation, difficulty });
export const M = (id, prompt, options, answer, explanation, difficulty = 2) => ({ id, type: 'multiple', prompt, options, answer, explanation, difficulty });
export const O = (id, prompt, options, explanation, difficulty = 2) => ({ id, type: 'order', prompt, options, answer: options.map((_, i) => i), explanation, difficulty });
export const P = (id, prompt, pairs, explanation, difficulty = 2) => ({ id, type: 'match', prompt, pairs, explanation, difficulty });
export const I = (id, prompt, answer, explanation, difficulty = 2) => ({ id, type: 'input', prompt, answer, explanation, difficulty });
export const A = (id, prompt, code, options, explanation, difficulty = 2) => ({ id, type: 'analyze', prompt, code, options, answer: 0, explanation, difficulty });
export const lab = id => `<div data-widget="${id}"></div>`;
// Блок технического английского: короткий фрагмент в духе документации и разбор терминов
export const en = (text, terms, meaning) => `<div class="note"><b>Технический английский.</b> <i>${text}</i><br><br><b>Термины:</b> ${terms}<br><b>Смысл:</b> ${meaning}</div>`;
