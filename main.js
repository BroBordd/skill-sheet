const tabList   = document.getElementById("tab-list");
const grid      = document.getElementById("card-grid");
const titleEl   = document.getElementById("content-title");
const iconEl    = document.getElementById("content-icon");
const countEl   = document.getElementById("content-count");
const totalEl   = document.getElementById("skill-count");

let active = 0;

function render(categories, idx) {
  const cat = categories[idx];

  // update header
  titleEl.textContent = cat.category;
  iconEl.textContent  = cat.icon;
  countEl.textContent = `${cat.items.length} ${cat.items.length === 1 ? "skill" : "skills"}`;

  // update active tab
  tabList.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === idx));

  // render cards
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

  // scroll content to top
  document.getElementById("content").scrollTop = 0;
}

fetch("skills.json")
  .then(r => r.json())
  .then(raw => {
    const meta = raw.find(e => e._meta === true);
    const categories = raw.filter(e => e._meta !== true && Array.isArray(e.items));

    // apply meta
    if (meta) {
      document.querySelector(".avatar").textContent        = meta.initial  || "?";
      document.querySelector(".sidebar-name").textContent  = meta.name     || "";
      document.querySelector(".sidebar-sub").textContent   = meta.subtitle || "";
      document.title = meta.name ? `${meta.name} — Skills` : "Skills";
    }
    // total count
    const total = categories.reduce((s, c) => s + c.items.length, 0);
    totalEl.textContent = `${total} skills total`;

    // build tabs
    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "tab-btn" + (i === 0 ? " active" : "");
      btn.innerHTML = `
        <span class="tab-icon">${cat.icon}</span>
        <span class="tab-label">${cat.category}</span>
        <span class="tab-count">${cat.items.length}</span>
      `;
      btn.addEventListener("click", () => { active = i; render(categories, i); });
      tabList.appendChild(btn);
    });

    render(categories, 0);
  })
  .catch(err => {
    grid.innerHTML = `<p class="error">Could not load skills.json: ${err.message}</p>`;
  });
