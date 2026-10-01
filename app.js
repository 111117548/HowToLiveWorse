import { categories, entries } from "./data/entries.js";

const categoryMap = new Map(categories.map((item) => [item.id, item]));
const riskLabels = {
  5: "灾难级损失",
  4: "很昂贵",
  3: "慢性亏损"
};
const effortLabels = {
  1: "5 分钟止损",
  2: "本周可做",
  3: "持续调整"
};

const state = {
  category: "all",
  risk: "all",
  query: "",
  sort: "risk"
};

const elements = {
  grid: document.querySelector("#entry-grid"),
  template: document.querySelector("#entry-template"),
  search: document.querySelector("#search"),
  risk: document.querySelector("#risk-filter"),
  sort: document.querySelector("#sort-order"),
  categories: document.querySelector("#category-filters"),
  count: document.querySelector("#result-count"),
  empty: document.querySelector("#empty-state"),
  reset: document.querySelector("#reset-filters"),
  random: document.querySelector("#random-entry"),
  theme: document.querySelector("#theme-toggle")
};

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const risk = params.get("risk");
  const query = params.get("q");
  const sort = params.get("sort");

  if (categoryMap.has(category)) state.category = category;
  if (["3", "4", "5"].includes(risk)) state.risk = risk;
  if (query) state.query = query.slice(0, 80);
  if (["risk", "effort", "category"].includes(sort)) state.sort = sort;

  elements.search.value = state.query;
  elements.risk.value = state.risk;
  elements.sort.value = state.sort;
}

function writeUrlState() {
  const params = new URLSearchParams();
  if (state.category !== "all") params.set("category", state.category);
  if (state.risk !== "all") params.set("risk", state.risk);
  if (state.query) params.set("q", state.query);
  if (state.sort !== "risk") params.set("sort", state.sort);
  const query = params.toString();
  const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", next);
}

function buildCategoryFilters() {
  const allButton = makeFilterButton("all", "全部", entries.length);
  elements.categories.append(allButton);

  for (const category of categories) {
    const count = entries.filter((entry) => entry.category === category.id).length;
    elements.categories.append(
      makeFilterButton(category.id, `${category.icon} ${category.name}`, count)
    );
  }
  updateCategoryButtons();
}

function makeFilterButton(id, label, count) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-chip";
  button.dataset.category = id;
  button.textContent = `${label} · ${count}`;
  button.addEventListener("click", () => {
    state.category = id;
    updateCategoryButtons();
    update();
  });
  return button;
}

function updateCategoryButtons() {
  for (const button of elements.categories.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
  }
}

function searchableText(entry) {
  return [
    entry.title,
    entry.temptation,
    entry.loss,
    entry.stop,
    entry.sourceLabel,
    categoryMap.get(entry.category)?.name,
    ...entry.tags
  ].join(" ").toLocaleLowerCase("zh-CN");
}

function selectEntries() {
  const query = state.query.trim().toLocaleLowerCase("zh-CN");
  const selected = entries.filter((entry) => {
    if (state.category !== "all" && entry.category !== state.category) return false;
    if (state.risk !== "all" && entry.risk !== Number(state.risk)) return false;
    if (query && !searchableText(entry).includes(query)) return false;
    return true;
  });

  selected.sort((a, b) => {
    if (state.sort === "effort") return a.effort - b.effort || b.risk - a.risk;
    if (state.sort === "category") {
      return categories.findIndex((item) => item.id === a.category)
        - categories.findIndex((item) => item.id === b.category)
        || b.risk - a.risk;
    }
    return b.risk - a.risk || a.effort - b.effort;
  });

  return selected;
}

function renderCard(entry) {
  const fragment = elements.template.content.cloneNode(true);
  const card = fragment.querySelector("article");
  const category = categoryMap.get(entry.category);
  card.id = `entry-${entry.id}`;
  card.dataset.category = entry.category;
  card.dataset.risk = String(entry.risk);

  fragment.querySelector(".category-badge").textContent = `${category.icon} ${category.name}`;
  fragment.querySelector(".risk-badge").textContent = `${"●".repeat(entry.risk - 2)} ${riskLabels[entry.risk]}`;
  fragment.querySelector("h3").textContent = entry.title;
  fragment.querySelector(".temptation").textContent = `“${entry.temptation}”`;
  fragment.querySelector(".loss").textContent = entry.loss;
  fragment.querySelector(".stop").textContent = entry.stop;
  fragment.querySelector(".evidence").textContent = `证据 ${entry.evidence}`;
  fragment.querySelector(".evidence").title = entry.evidence === "A"
    ? "权威指南、法规或综合证据"
    : entry.evidence === "B"
      ? "研究与机构建议较一致"
      : "经验性原则，依情境判断";
  fragment.querySelector(".effort").textContent = effortLabels[entry.effort];

  const source = fragment.querySelector(".source");
  source.href = entry.sourceUrl;
  source.textContent = `${entry.sourceLabel} ↗`;
  source.setAttribute("aria-label", `查看来源：${entry.sourceLabel}`);

  const share = fragment.querySelector(".share-button");
  share.setAttribute("aria-label", `复制“${entry.title}”的链接`);
  share.addEventListener("click", async () => {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = card.id;
    try {
      await navigator.clipboard.writeText(url.toString());
      share.textContent = "✓";
      setTimeout(() => { share.textContent = "#"; }, 1400);
    } catch {
      window.location.hash = card.id;
    }
  });
  return fragment;
}

function render() {
  const selected = selectEntries();
  elements.grid.replaceChildren(...selected.map(renderCard));
  elements.count.textContent = `显示 ${selected.length} / ${entries.length} 条`;
  elements.grid.hidden = selected.length === 0;
  elements.empty.hidden = selected.length !== 0;
}

function update() {
  writeUrlState();
  render();
}

function reset() {
  state.category = "all";
  state.risk = "all";
  state.query = "";
  state.sort = "risk";
  elements.search.value = "";
  elements.risk.value = "all";
  elements.sort.value = "risk";
  updateCategoryButtons();
  update();
}

function setupEvents() {
  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value.slice(0, 80);
    update();
  });

  elements.risk.addEventListener("change", (event) => {
    state.risk = event.target.value;
    update();
  });

  elements.sort.addEventListener("change", (event) => {
    state.sort = event.target.value;
    update();
  });

  elements.reset.addEventListener("click", reset);

  elements.random.addEventListener("click", () => {
    reset();
    const entry = entries[Math.floor(Math.random() * entries.length)];
    const target = document.querySelector(`#entry-${entry.id}`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.history.replaceState(null, "", `${window.location.pathname}#entry-${entry.id}`);
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      elements.search.focus();
    }
    if (event.key === "Escape" && document.activeElement === elements.search) {
      elements.search.blur();
    }
  });
}

function setupTheme() {
  const stored = localStorage.getItem("how-to-live-worse-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = stored || preferred;

  elements.theme.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("how-to-live-worse-theme", next);
  });
}

function updateStats() {
  document.querySelector("#stat-total").textContent = `${entries.length} 条`;
  document.querySelector("#stat-categories").textContent = `${categories.length} 类`;
}

readUrlState();
buildCategoryFilters();
setupEvents();
setupTheme();
updateStats();
render();

if (window.location.hash.startsWith("#entry-")) {
  requestAnimationFrame(() => {
    document.querySelector(window.location.hash)?.scrollIntoView({ block: "center" });
  });
}
