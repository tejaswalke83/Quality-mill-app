// Initialize Firebase
// firebase.initializeApp({
//   apiKey: "AIzaSyBpQRge5ZLaNx_mM_vwQrwmm1f2LkyhOyY",
//   authDomain: "qualityattamills.firebaseapp.com",
//   projectId: "qualityattamills",
//   messagingSenderId: "737428044643",
//   appId: "1:737428044643:web:a0f9ecfae3794e11e57156"
// });
// Get the initialized Firebase app (already done in index.html)
const messaging = firebase.messaging();

// Register your service worker (very important!)
navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then((registration) => {
    console.log('Service Worker registered:', registration);

    // Tell Firebase to use this service worker
    messaging.useServiceWorker(registration);

    // Ask for permission
    requestPermission();
  })
  .catch((err) => {
    console.error('Service Worker registration failed:', err);
  });

async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await messaging.getToken({
        vapidKey: 'BJlixsNsTwpDpLenlmNUh1ySVNLM9woE2i5SkDPxlLHUy_iZM4HEN1gRv2NGNQ20AUrqqss1WIz4QCjhpE-uXKc'
      });
      console.log('✅ User FCM Token:', token);

      // 👉 Save this token in Supabase under the user's record
      // so you can later send notifications to specific users.
    } else {
      console.log('❌ Notification permission denied');
    }
  } catch (error) {
    console.error('⚠️ Error getting permission or token:', error);
  }
}

 
