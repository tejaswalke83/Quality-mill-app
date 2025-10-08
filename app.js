// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBpQRge5ZLaNx_mM_vwQrwmm1f2LkyhOyY",
  authDomain: "qualityattamills.firebaseapp.com",
  projectId: "qualityattamills",
  messagingSenderId: "737428044643",
  appId: "1:737428044643:web:a0f9ecfae3794e11e57156"
});

const messaging = firebase.messaging();

// Ask for permission and get FCM token
async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await messaging.getToken({
        vapidKey: 'YOUR_VAPID_KEY_FROM_FIREBASE_CLOUD_MESSAGING'
      });
      console.log('User FCM Token:', token);
      // You can store this token in Supabase for sending notifications later
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error getting permission or token', error);
  }
}

requestPermission();

 
