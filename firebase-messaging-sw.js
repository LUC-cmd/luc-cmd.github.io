// Service Worker pour les notifications push Firebase en arrière-plan
// Ce fichier doit être à la racine de public/ pour que Firebase le trouve

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDqVqKv7tJHu7ZvKvKvKvKvKvKvKvKvKvK",
  authDomain: "ul-smart-campus.firebaseapp.com",
  projectId: "ul-smart-campus",
  storageBucket: "ul-smart-campus.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gérer les messages push en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Message reçu en arrière-plan:', payload);

  const notificationTitle = payload.notification?.title || '🔔 Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'reuse_notification',
    requireInteraction: false,
    data: payload.data || {}
  };

  // Afficher la notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification cliquée:', event.notification.title);

  event.notification.close();

  // Ouvrir la fenêtre de l'app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Répondre aux messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
});
