

const messaging = firebase.messaging();

// Register the service worker
navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then(async (registration) => {
    console.log('✅ Service Worker registered:', registration);

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await messaging.getToken({
        vapidKey: 'BJlixsNsTwpDpLenlmNUh1ySVNLM9woE2i5SkDPxlLHUy_iZM4HEN1gRv2NGNQ20AUrqqss1WIz4QCjhpE-uXKc',
        serviceWorkerRegistration: registration
      });
      console.log('✅ User FCM Token:', token);
    } else {
      console.log('❌ Notification permission denied');
    }
  })
  .catch((err) => console.error('SW registration failed:', err));


 
