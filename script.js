const projectData = {
  echo: {
    format: "Interactive installation",
    title: "Echo Garden",
    description: "A responsive indoor garden where proximity sensors turn movement into layered natural sound. The installation invites visitors to slow down, listen, and shape a shared soundscape.",
    details: { "Tools": "Sensors, spatial audio, projection", "Audience": "Students and community visitors", "Purpose": "Explore the relationship between technology and calm public spaces" }
  },
  pantry: {
    format: "Mobile application",
    title: "Pocket Pantry",
    description: "A friendly food-inventory prototype that uses visual reminders and simple planning to help households use ingredients before they are wasted.",
    details: { "Tools": "Mobile UX, icons, notifications", "Audience": "Students, families, and shared households", "Purpose": "Make lower-waste habits easier to maintain" }
  },
  rain: {
    format: "Animated short film",
    title: "After Rain",
    description: "A hand-painted animated story about two friends waiting for a ride after a storm. Small gestures, environmental sound, and changing light carry the narrative.",
    details: { "Tools": "2D animation, sound design, digital painting", "Audience": "Students and community audiences", "Purpose": "Tell a local, emotionally clear story without dialogue" }
  },
  motion: {
    format: "Immersive experience",
    title: "Mind in Motion",
    description: "A student VR concept where slow breathing changes the surrounding color, sound, and movement to create a short guided reset between classes.",
    details: { "Tools": "VR, spatial sound, motion graphics", "Audience": "College students", "Purpose": "Explore accessible, calming interaction in immersive media" }
  }
};

const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".product-tabs");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
  menu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open && window.innerWidth < 744);
}

menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (event) => { if (event.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuButton.focus();
  }
});
window.addEventListener("resize", () => { if (window.innerWidth >= 744) setMenu(false); });

const cards = [...document.querySelectorAll(".project-card")];
const categories = [...document.querySelectorAll(".category")];
const formatSelect = document.querySelector("#format-select");
const audienceSelect = document.querySelector("#audience-select");
const topicSearch = document.querySelector("#topic-search");
const resultStatus = document.querySelector("#results-status");
const emptyState = document.querySelector("#empty-state");
let activeCategory = "all";

function applyFilters() {
  const requestedFormat = formatSelect.value === "all" ? activeCategory : formatSelect.value;
  const audience = audienceSelect.value;
  const query = topicSearch.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach((card) => {
    const formatMatch = requestedFormat === "all" || card.dataset.format === requestedFormat;
    const audienceMatch = audience === "all" || card.dataset.audience.includes(audience);
    const textMatch = !query || card.dataset.search.includes(query) || card.querySelector("h3").textContent.toLowerCase().includes(query);
    const show = formatMatch && audienceMatch && textMatch;
    card.hidden = !show;
    if (show) visible += 1;
  });

  resultStatus.textContent = `${visible} ${visible === 1 ? "project" : "projects"} available`;
  emptyState.hidden = visible !== 0;
}

document.querySelector("#showcase-search").addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
  document.querySelector("#projects").scrollIntoView({ behavior: "smooth" });
});
topicSearch.addEventListener("input", applyFilters);
formatSelect.addEventListener("change", applyFilters);
audienceSelect.addEventListener("change", applyFilters);

categories.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    formatSelect.value = activeCategory;
    categories.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    applyFilters();
  });
});

document.querySelector("#reset-filters").addEventListener("click", () => {
  activeCategory = "all";
  formatSelect.value = "all";
  audienceSelect.value = "all";
  topicSearch.value = "";
  categories.forEach((item) => {
    const active = item.dataset.category === "all";
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  applyFilters();
  topicSearch.focus();
});

const saved = new Set(JSON.parse(localStorage.getItem("citDiscoverSaved") || "[]"));
document.querySelectorAll(".heart-button").forEach((button) => {
  const id = button.dataset.save;
  const label = button.querySelector(".sr-only");
  function render() {
    const isSaved = saved.has(id);
    button.setAttribute("aria-pressed", String(isSaved));
    label.textContent = `${isSaved ? "Remove" : "Save"} ${projectData[id].title}${isSaved ? " from favorites" : ""}`;
  }
  render();
  button.addEventListener("click", () => {
    saved.has(id) ? saved.delete(id) : saved.add(id);
    localStorage.setItem("citDiscoverSaved", JSON.stringify([...saved]));
    render();
  });
});

const dialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogFormat = document.querySelector("#dialog-format");
const dialogDescription = document.querySelector("#dialog-description");
const dialogDetails = document.querySelector("#dialog-details");

document.querySelectorAll(".details-link").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.closest(".project-card").dataset.project;
    const project = projectData[id];
    dialogTitle.textContent = project.title;
    dialogFormat.textContent = project.format;
    dialogDescription.textContent = project.description;
    dialogDetails.replaceChildren();
    Object.entries(project.details).forEach(([term, value]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = term;
      dd.textContent = value;
      dialogDetails.append(dt, dd);
    });
    dialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
