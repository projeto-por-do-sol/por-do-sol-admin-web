// Service worker das notificações push (FCM). Trata o payload do FCM direto, sem carregar o SDK, então não precisa repetir a configuração do Firebase.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))

self.addEventListener('push', event => {
  let payload = {}
  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    return
  }

  const notification = payload.notification ?? {}
  const data = payload.data ?? {}

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })

    // Avisa as abas abertas para atualizarem os pedidos.
    windows.forEach(client => client.postMessage({ type: 'push-received', payload: { notification, data } }))

    // Aviso silencioso (KPIs/estatísticas): só atualiza as abas, sem notificação.
    if (!notification.title) return

    // Com o painel visível, o app mostra o aviso por conta própria.
    if (windows.some(client => client.visibilityState === 'visible')) return

    await self.registration.showNotification(notification.title ?? 'Por do Sol', {
      body: notification.body ?? '',
      icon: '/assets/images/logo.png',
      tag: data.idPedido ? `pedido-${data.idPedido}` : undefined,
      data,
    })
  })())
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const open = windows[0]

    if (open) return open.focus()
    return self.clients.openWindow('/home')
  })())
})
