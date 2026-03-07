const tabList   = document.getElementById("tab-list");
const grid      = document.getElementById("card-grid");
const titleEl   = document.getElementById("content-title");
const iconEl    = document.getElementById("content-icon");
const countEl   = document.getElementById("content-count");
const totalEl   = document.getElementById("skill-count");
const topbarTitle = document.getElementById("topbar-title");
const sidebar   = document.getElementById("sidebar");
const overlay   = document.getElementById("overlay");
const hamburger = document.getElementById("hamburger");

function openDrawer() {
  sidebar.classList.add("open");
  overlay.classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  sidebar.classList.contains("open") ? closeDrawer() : openDrawer();
});
overlay.addEventListener("click", closeDrawer);

function render(categories, idx) {
  const cat = categories[idx];

  titleEl.textContent   = cat.category;
  iconEl.textContent    = cat.icon;
  topbarTitle.textContent = cat.category;
  countEl.textContent   = `${cat.items.length} ${cat.items.length === 1 ? "skill" : "skills"}`;

  tabList.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === idx));

  grid.innerHTML = "";
  cat.items.forEach((skill, si) => {
    const card = document.createElement("div");
    card.className = "skill-card";
    card.style.setProperty("--si", si);
    card.innerHTML = `
      <div class="skill-name">${skill.name}</div>
      ${skill.note ? `<div class="skill-note">${skill.note}</div>` : ""}
    `;
    grid.appendChild(card);
  });

  document.getElementById("content").scrollTop = 0;
  closeDrawer();
}

fetch("skills.json")
  .then(r => r.json())
  .then(raw => {
    const meta       = raw.find(e => e._meta === true);
    const categories = raw.filter(e => e._meta !== true && Array.isArray(e.items));

    if (meta) {
      document.querySelector(".avatar").textContent       = meta.initial  || "?";
      document.querySelector(".sidebar-name").textContent = meta.name     || "";
      document.querySelector(".sidebar-sub").textContent  = meta.subtitle || "";
      document.title = meta.name ? `${meta.name} — Skills` : "Skills";
    }

    const total = categories.reduce((s, c) => s + c.items.length, 0);
    totalEl.textContent = `${total} skills total`;

    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "tab-btn" + (i === 0 ? " active" : "");
      btn.innerHTML = `
        <span class="tab-icon">${cat.icon}</span>
        <span class="tab-label">${cat.category}</span>
        <span class="tab-count">${cat.items.length}</span>
      `;
      btn.addEventListener("click", () => render(categories, i));
      tabList.appendChild(btn);
    });

    render(categories, 0);
  })
  .catch(err => {
    grid.innerHTML = `<p class="error">Could not load skills.json: ${err.message}</p>`;
  });
