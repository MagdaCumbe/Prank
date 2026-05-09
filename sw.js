const CACHE_NAME = 'hotmart-notif-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'SHOW_NOTIFICATION') return;

  const { titulo, comprador, produto, valor, moeda } = event.data;

  // Formato idêntico ao app Hotmart
  const title = titulo || 'Hotmart';
  const body  = `🔥 Venda aprovada!\n${comprador} comprou ${produto} por ${moeda || 'R$'} ${valor}`;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      // Ícone oficial Hotmart (laranja com chama)
      icon: 'https://static.hotmart.com/img/hotmart-icon.png',
      badge: 'https://static.hotmart.com/img/hotmart-icon.png',
      tag: 'hotmart-venda-' + Date.now(),
      renotify: true,
      vibrate: [300, 100, 300],
      requireInteraction: false,
      silent: false,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      return clients.openWindow('./');
    })
  );
});
