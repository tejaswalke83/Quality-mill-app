/* =========================
   common.js
   ========================= */

(async function () {
  // Toast helper
  function showToast(msg, time = 3000) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      Object.assign(el.style, {
        position: "fixed",
        bottom: "90px",
        right: "20px",
        background: "#000",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "14px",
        display: "none",
        zIndex: 9999,
      });
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => (el.style.display = "none"), time);
  }

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("✅ Firebase SW registered");
  }

  // Load Firebase
  await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
  await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js");

  const firebaseConfig = {
    apiKey: "AIzaSyBpQRge5ZLaNx_mM_vwQrwmm1f2LkyhOyY",
    authDomain: "qualityattamills.firebaseapp.com",
    projectId: "qualityattamills",
    messagingSenderId: "737428044643",
    appId: "1:737428044643:web:a0f9ecfae3794e11e57156",
  };

  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Ask permission + get FCM token
  try {
    console.log("🔔 Asking for notification permission...");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("🚫 Permission denied");
      return;
    }

    const vapidKey = "BFbgWUQTxuSUD6qva3Dr1k22kFAPFIa74KRmz18pp3yeMHJV7ZMU19L8ftevfUU61s3hZHTiFzzZYP3u89rl84I";
    const token = await messaging.getToken({ vapidKey });
    console.log("✅ FCM Token:", token);

    // Save token to Supabase orders table
    const phone = new URLSearchParams(window.location.search).get("phone");
    if (phone && token) {
      const res = await fetch(
        "https://msoykugvymbybdjkilab.supabase.co/rest/v1/orders",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zb3lrdWd2eW1ieWJkamtpbGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDQ2NjIsImV4cCI6MjA3NTQ4MDY2Mn0.Ifc7-NJ0mIc9Uw0NdMbTKBTXZ5eh3PKrVCJ1cJGTZyQ",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zb3lrdWd2eW1ieWJkamtpbGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDQ2NjIsImV4cCI6MjA3NTQ4MDY2Mn0.Ifc7-NJ0mIc9Uw0NdMbTKBTXZ5eh3PKrVCJ1cJGTZyQ",
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({ fcm_token: token }),
        }
      );
      if (res.ok) {
        console.log("✅ Token saved to Supabase");
        showToast("Notifications enabled successfully ✅");
      } else {
        console.error("❌ Failed to save token", await res.text());
      }
    } else {
      console.warn("⚠️ Missing phone param or token not generated");
    }

    // Foreground message handler
    messaging.onMessage((payload) => {
      console.log("📩 Foreground message:", payload);
      const { title, body } = payload.notification || {};
      if (title && body) showToast(`${title}: ${body}`);
    });
  } catch (err) {
    console.error("❌ Error initializing Firebase:", err);
  }
})();
