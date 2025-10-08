/* =========================
   common.js
   - Include on every HTML page:
       <script defer src="/common.js"></script>
   - Purpose:
       ✅ PWA Install button
       ✅ Toast notifications
       ✅ Update flow (when new version deployed)
       ✅ Register firebase-messaging-sw.js (for push + PWA)
   ========================= */

(function () {
  // --- Create Install Button ---
  const installBtn = document.createElement('button');
  installBtn.id = 'pwa-install-btn';
  installBtn.innerHTML = '📲 Install App';
  Object.assign(installBtn.style, {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 99999,
    display: 'none',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '10px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
    cursor: 'pointer',
    fontSize: '15px',
  });
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(installBtn);
  });

  // --- Toast helper ---
  function showToast(text, timeout = 3000) {
    let toast = document.getElementById('pwa-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pwa-toast';
      Object.assign(toast.style, {
        position: 'fixed',
        right: '20px',
        bottom: '90px',
        zIndex: 99999,
        display: 'none',
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
        fontSize: '14px',
      });
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.display = 'block';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => (toast.style.display = 'none'), timeout);
  }

  // --- Helper to convert UTC to IST (used elsewhere) ---
  window.convertUTCToIST = function (utcString) {
    if (!utcString) return "";
    const utcDate = new Date(utcString);
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
    return istDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // --- Install button flow ---
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    try {
      installBtn.disabled = true;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        showToast('App installed ✅');
      } else {
        showToast('Install dismissed');
      }
      deferredPrompt = null;
      installBtn.style.display = 'none';
    } catch (err) {
      console.error('Install prompt error', err);
    } finally {
      installBtn.disabled = false;
    }
  });

  // Hide installBtn if already installed
  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    showToast('App installed');
  });

  // --- Hide if in standalone mode ---
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  if (isStandalone()) installBtn.style.display = 'none';

  // --- Register only Firebase Messaging SW ---
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((reg) => {
        console.log("[PWA] Firebase SW registered ✅", reg.scope);

        // If new version waiting, show update toast
        if (reg.waiting) showUpdateButton();

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateButton();
            }
          });
        });
      })
      .catch((err) => {
        console.error("[PWA] Firebase SW register failed ❌", err);
      });

    // Reload when SW activates
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!window.__pwa_reloading) {
        window.__pwa_reloading = true;
        window.location.reload();
      }
    });
  }

  // --- Update button (when new deploy is detected) ---
  function showUpdateButton() {
    if (document.getElementById('pwa-update-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'pwa-update-btn';
    btn.innerText = '🔄 New update available — Tap to refresh';
    Object.assign(btn.style, {
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '20px',
      zIndex: 99999,
      padding: '10px 14px',
      borderRadius: '10px',
      background: '#ff9800',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
      fontSize: '14px',
    });
    document.body.appendChild(btn);

    btn.addEventListener('click', async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg || !reg.waiting) return;
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      btn.style.display = 'none';
      showToast("Refreshing to new version…");
      setTimeout(() => window.location.reload(), 1000);
    });
  }

  // Expose toast globally
  window.pwaShowToast = showToast;

  // Hide install button if standalone on load
  document.addEventListener('DOMContentLoaded', () => {
    if (isStandalone()) installBtn.style.display = 'none';
  });
})();
