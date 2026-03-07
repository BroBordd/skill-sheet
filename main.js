fetch("skills.json")
  .then(r => r.json())
  .then(categories => {
    const container = document.getElementById("skills-container");

    categories.forEach((cat, ci) => {
      const section = document.createElement("section");
      section.className = "category";
      section.style.setProperty("--ci", ci); // stagger animation

      const heading = document.createElement("h2");
      heading.className = "category-heading";
      heading.innerHTML = `<span class="cat-icon">${cat.icon}</span>${cat.category}`;
      section.appendChild(heading);

      const grid = document.createElement("div");
      grid.className = "skill-grid";

      cat.items.forEach((skill, si) => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.style.setProperty("--si", si); // stagger within category

        card.innerHTML = `
          <div class="skill-name">${skill.name}</div>
          ${skill.note ? `<div class="skill-note">${skill.note}</div>` : ""}
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  })
  .catch(err => {
    document.getElementById("skills-container").innerHTML =
      `<p class="error">Could not load skills.json: ${err.message}</p>`;
  });
