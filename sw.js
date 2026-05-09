const CACHE_NAME = 'hotmart-notif-v3';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

// Ícone Hotmart: chama laranja em base64 (não depende de URL externa)
const HOTMART_ICON = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="40" fill="#FF4B00"/>
  <text x="96" y="140" font-size="110" text-anchor="middle" font-family="sans-serif">🔥</text>
</svg>`);

const METODOS = [
  'Pix Hotmart',
  'Cartão de Crédito',
  'Boleto Bancário',
  'Cartão de Débito',
];

function randMetodo() {
  return METODOS[Math.floor(Math.random() * METODOS.length)];
}

function gerarCodHP() {
  // Gera código estilo HP2801507622
  return 'HP' + Math.floor(1000000000 + Math.random() * 9000000000);
}

self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'SHOW_NOTIFICATION') return;

  const { comissao, metodo, codigo } = event.data;

  // Formato EXACTO do app Hotmart
  const title = `Venda realizada com ${metodo}`;
  const body  = `Sua comissão: R$ ${comissao} - ${codigo}`;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: HOTMART_ICON,
      badge: HOTMART_ICON,
      tag: 'hotmart-' + Date.now(),
      renotify: true,
      vibrate: [200, 100, 200],
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
