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