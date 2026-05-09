const CACHE_NAME = 'hotmart-notif-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Recebe mensagem do index.html e mostra a notificação real
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, tag, data } = event.data;

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon,
        badge: icon,
        tag: tag || ('hotmart-' + Date.now()),
        renotify: true,
        vibrate: [200, 100, 200, 100, 400],
        data: data || {},
        requireInteraction: false,
      })
    );
  }
});

// Clique na notificação abre/foca o app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow('./');
    })
  );
});

