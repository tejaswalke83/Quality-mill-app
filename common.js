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

  // Load Firebase SDKs
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

  try {
    console.log("🔔 Asking for notification permission...");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("🚫 Notification permission denied");
      return;
    }

    const vapidKey = "BJlixsNsTwpDpLenlmNUh1ySVNLM9woE2i5SkDPxlLHUy_iZM4HEN1gRv2NGNQ20AUrqqss1WIz4QCjhpE-uXKc";
    const token = await messaging.getToken({ vapidKey });

    if (token) {
      console.log("✅ FCM Token:", token);
      localStorage.setItem("fcm_token", token);
    } else {
      console.warn("⚠️ No FCM token received");
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

  // ✅ Expose helper globally to save token once phone is known
  window.saveFcmTokenToSupabase = async function (phone) {
    const token = localStorage.getItem("fcm_token");
    if (!token) {
      console.warn("⚠️ No FCM token found in localStorage yet.");
      return;
    }

    console.log(`📤 Attempting to save FCM token for phone: ${phone}`);

    try {
      const response = await fetch(
        `https://msoykugvymbybdjkilab.supabase.co/rest/v1/orders?token_number=eq.${phone}&order=created_at.desc&limit=1`,
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

      if (response.ok) {
        console.log("✅ FCM token saved/updated successfully for phone:", phone);
        showToast("🔔 Notifications enabled successfully!");
      } else {
        console.error("❌ Failed to save token:", await response.text());
      }
    } catch (err) {
      console.error("❌ Error saving FCM token to Supabase:", err);
    }
  };
})();
