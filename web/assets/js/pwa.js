// Регистрация service worker (public/sw.js): установка на устройство и офлайн-доступ к открытым урокам.
// В dev не регистрируем, чтобы кеш не мешал горячей перезагрузке.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js', { scope: import.meta.env.BASE_URL }).catch(() => {});
  });
}
