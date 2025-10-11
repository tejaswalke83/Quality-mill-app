importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBpQRge5ZLaNx_mM_vwQrwmm1f2LkyhOyY",
  authDomain: "qualityattamills.firebaseapp.com",
  projectId: "qualityattamills",
  messagingSenderId: "737428044643",
  appId: "1:737428044643:web:a0f9ecfae3794e11e57156"
});

const messaging = firebase.messaging();

// Push handler — no fetch interception, no caching, no PWA
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/images/icon-192.png"
  });
});
