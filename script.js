document.addEventListener("DOMContentLoaded", () => {
  const societySelect = document.getElementById("society");
  if (societySelect) {
    const societies = JSON.parse(localStorage.getItem("societies") || "[]");
    societies.forEach(society => {
      const opt = document.createElement("option");
      opt.value = society;
      opt.textContent = society;
      societySelect.appendChild(opt);
    });
  }
});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let reg of registrations) {
      reg.unregister();
    }
  });
}
// script.js (add this)
(function () {
  /**
   * Convert a UTC timestamp (ISO string) to a nicely formatted IST string.
   * Returns a human readable string (e.g. "08 Aug 2025, 05:30 PM").
   * If input is missing/invalid it returns an empty string.
   */
  function convertUTCToIST(utcDateStr) {
    if (!utcDateStr) return '';

    try {
      // Create Date from UTC string
      const d = new Date(utcDateStr);
      // Use toLocaleString with Asia/Kolkata timezone for correct IST formatting
      return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('convertUTCToIST error:', e, utcDateStr);
      return String(utcDateStr);
    }
  }

  /**
   * Return a Date object in IST for further arithmetic (optional).
   * Use carefully — JS Date object is still in local timezone, this returns equivalent IST time Date.
   */
  function utcToISTDate(utcDateStr) {
    if (!utcDateStr) return null;
    const d = new Date(utcDateStr);
    // get UTC time + 5.5 hours = IST
    const istMillis = d.getTime() + (5.5 * 60 * 60 * 1000);
    return new Date(istMillis);
  }

  // expose to global so your module <script type="module"> can call window.convertUTCToIST(...)
  window.convertUTCToIST = convertUTCToIST;
  window.utcToISTDate = utcToISTDate;
})();


function addSociety() {
  const input = document.getElementById("newSociety");
  const name = input.value.trim();
  if (!name) return;

  let societies = JSON.parse(localStorage.getItem("societies") || "[]");
  if (!societies.includes(name)) {
    societies.push(name);
    localStorage.setItem("societies", JSON.stringify(societies));
    const li = document.createElement("li");
    li.textContent = name;
    document.getElementById("societyList").appendChild(li);
  }
  input.value = "";
}

document.getElementById("setupForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const prices = {
    wheat: document.getElementById("wheatPrice").value,
    jowar: document.getElementById("jowarPrice").value,
    bajra: document.getElementById("bajraPrice").value,
    dal: document.getElementById("dalPrice").value
  };
  localStorage.setItem("millingPrices", JSON.stringify(prices));
  alert("Setup saved.");
});
