// ✅ Toast helper
function showToast(msg, type = "success", time = 3500) {
  const t = document.getElementById('toast');
  if (!t) return;

  t.textContent = msg;

  // Set color based on type
  t.className =
    "fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-2 rounded-lg shadow-md transition-opacity duration-300 " +
    (type === "error" ? "bg-red-600 text-white"
      : type === "warning" ? "bg-yellow-600 text-white"
      : "bg-green-600 text-white");

  t.classList.remove("hidden", "opacity-0");
  setTimeout(() => {
    t.classList.add("opacity-0");
    setTimeout(() => t.classList.add("hidden"), 300);
  }, time);
}

// ✅ Global Supabase client (so you don’t repeat it everywhere)
const supabase = window.supabase.createClient(
  "https://odczzymxgjsjhbufffxm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kY3p6eW14Z2pzamhidWZmZnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjY2NDIsImV4cCI6MjA2OTkwMjY0Mn0.T2ZT6U11taDH7vNTUJgI9xvqEZ1YEfBrNx28QV7jJvI"
);

// ✅ Helper to convert UTC → IST
window.convertUTCToIST = function (utcDate) {
  const date = new Date(utcDate + "Z");
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};
