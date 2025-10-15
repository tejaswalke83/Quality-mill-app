/* =========================
   firebase-messaging-sw.js
   ========================= */

importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js");

// ✅ Initialize Firebase inside SW
firebase.initializeApp({
  apiKey: "AIzaSyBpQRge5ZLaNx_mM_vwQrwmm1f2LkyhOyY",
  authDomain: "qualityattamills.firebaseapp.com",
  projectId: "qualityattamills",
  messagingSenderId: "737428044643",
  appId: "1:737428044643:web:a0f9ecfae3794e11e57156",
});

const messaging = firebase.messaging();

// ✅ Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  const notification = payload.notification || {};
  const title = notification.title || "Quality Atta Mills";
  const options = {
    body: notification.body || "You have a new message",
    icon: notification.icon || "/images/icon-192.png",
    badge: "/images/icon-192.png",
    data: {
      url: notification.click_action || "/", // optional click action
    },
  };

  self.registration.showNotification(title, options);
});

// ✅ Optional: Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
