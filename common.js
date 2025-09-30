/* =========================
   common.js
   - Add to /common.js and include on every HTML page:
     <script defer src="/common.js"></script>
   - Purpose: install button + SW registration + small toast + update flow
   ========================= */

(function () {
  // --- Create Install Button (auto-inserted into pages) ---
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
window.convertUTCToIST = function (utcString) {
  if (!utcString) return "";

  const utcDate = new Date(utcString);

  // Convert to IST (+5:30 offset)
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

  // Format nicely
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




  // --- Toast container (reused) ---
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

  // --- beforeinstallprompt handling (show install button when installable) ---
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent automatic prompt
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
      installBtn.disabled = false;
    } finally {
      installBtn.disabled = false;
    }
  });

  // Hide button if app already installed
  window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    showToast('App installed');
  });

  // common.js

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then(reg => console.log("✅ Service Worker registered:", reg.scope))
//       .catch(err => console.error("❌ Service Worker failed:", err));
//   });
// }
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let reg of registrations) {
      console.log("🧹 Unregistering old service worker:", reg.scope);
      reg.unregister();
    }
  });
}

  // Hide installBtn if running in standalone mode
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  if (isStandalone()) installBtn.style.display = 'none';

  // --- Service Worker registration + update flow ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('[PWA] SW registered', reg);

      // If there is an updated SW waiting, show update UI
      if (reg.waiting) {
        showUpdateButton();
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available
            showUpdateButton();
          }
        });
      });
    }).catch((err) => {
      console.error('[PWA] SW register failed', err);
    });

    // Listen for controllerchange (when skipWaiting() fired in SW)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // reload to get the new SW-controlled content (only once)
      if (!window.__pwa_reloading) {
        window.__pwa_reloading = true;
        window.location.reload();
      }
    });
  }

  // Add an update button when there's a new service worker waiting
  function showUpdateButton() {
    if (document.getElementById('pwa-update-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'pwa-update-btn';
    btn.innerText = 'Update available — Tap to reload';
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
      // Tell SW to skip waiting
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      btn.style.display = 'none';
    });
  }

  // Expose small helper to show toast (optional)
  window.pwaShowToast = showToast;

  // Clean-up / initial hide when DOM ready if standalone
  document.addEventListener('DOMContentLoaded', () => {
    if (isStandalone()) {
      installBtn.style.display = 'none';
    }
  });
})();
