const REDDIT_URL = (subreddit) =>
  `https://www.reddit.com/r/${subreddit}.json?limit=15`;

const lanesContainer = document.getElementById("lanes-container");
const addLaneBtn = document.getElementById("add-lane-btn");
const modalOverlay = document.getElementById("modal-overlay");
const subredditInput = document.getElementById("subreddit-input");
const modalError = document.getElementById("modal-error");
const addSubredditBtn = document.getElementById("add-subreddit-btn");
const CORS_PROXY = "https://api.codetabs.com/v1/proxy?quest=";

const STORAGE_KEY = "reddit-client-lanes";

// Cada lane: { id, subreddit, status: 'loading' | 'ready' | 'error', posts, errorMessage }
let lanes = [];

function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
}

// --- LocalStorage: salva só o nome dos subreddits, os posts são buscados de novo ---
function saveLanesToStorage() {
  const subredditNames = lanes.map((lane) => lane.subreddit);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subredditNames));
}

function loadLanesFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

// --- Busca os posts de um subreddit ---
async function fetchSubredditPosts(subreddit) {
  const targetUrl = REDDIT_URL(subreddit);
  const response = await fetch(CORS_PROXY + encodeURIComponent(targetUrl));

  if (!response.ok) {
    throw new Error("Subreddit not found");
  }

  const data = await response.json();

  if (!data.data || !data.data.children) {
    throw new Error("Unexpected response from Reddit");
  }

  return data.data.children.map((child) => ({
    id: child.data.id,
    title: child.data.title,
    author: child.data.author,
    score: child.data.score,
    url: `https://www.reddit.com${child.data.permalink}`,
  }));
}

// --- Renderização ---

function renderLanes() {
  lanesContainer.innerHTML = "";
  lanes.forEach((lane) => {
    lanesContainer.appendChild(createLaneElement(lane));
  });
}

function createLaneElement(lane) {
  const laneEl = document.createElement("section");
  laneEl.className = "lane";
  laneEl.dataset.laneId = lane.id;

  // Cabeçalho da lane: nome do subreddit + menu de três pontos
  const header = document.createElement("div");
  header.className = "lane-header";

  const title = document.createElement("h2");
  title.textContent = `/r/${lane.subreddit}`;

  const menuBtn = document.createElement("button");
  menuBtn.type = "button";
  menuBtn.className = "lane-menu-btn";
  menuBtn.textContent = "⋮";
  menuBtn.setAttribute("aria-label", "Lane options");

  const menu = document.createElement("div");
  menu.className = "lane-menu hidden";

  const refreshBtn = document.createElement("button");
  refreshBtn.type = "button";
  refreshBtn.textContent = "Refresh";
  refreshBtn.addEventListener("click", () => {
    menu.classList.add("hidden");
    refreshLane(lane.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteLane(lane.id));

  menu.appendChild(refreshBtn);
  menu.appendChild(deleteBtn);

  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    closeAllMenus();
    menu.classList.toggle("hidden");
  });

  header.appendChild(title);
  header.appendChild(menuBtn);
  header.appendChild(menu);

  laneEl.appendChild(header);

  // Corpo da lane: loading, erro ou lista de posts
  if (lane.status === "loading") {
    const status = document.createElement("p");
    status.className = "lane-status";
    status.textContent = "Loading posts...";
    laneEl.appendChild(status);
  } else if (lane.status === "error") {
    const status = document.createElement("p");
    status.className = "lane-status error";
    status.textContent = lane.errorMessage || "Something went wrong.";
    laneEl.appendChild(status);
  } else {
    const list = document.createElement("ul");
    list.className = "post-list";

    lane.posts.forEach((post) => {
      const item = document.createElement("li");
      item.className = "post-item";

      const scoreBox = document.createElement("div");
      scoreBox.className = "post-score";
      scoreBox.innerHTML = `<span class="arrow">▲</span><span>${post.score}</span>`;

      const content = document.createElement("div");
      content.className = "post-content";

      const link = document.createElement("a");
      link.href = post.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = post.title;

      const author = document.createElement("span");
      author.className = "post-author";
      author.textContent = `by u/${post.author}`;

      content.appendChild(link);
      content.appendChild(author);

      item.appendChild(scoreBox);
      item.appendChild(content);
      list.appendChild(item);
    });

    laneEl.appendChild(list);
  }

  return laneEl;
}

function closeAllMenus() {
  document.querySelectorAll(".lane-menu").forEach((menu) => {
    menu.classList.add("hidden");
  });
}

// --- Ações sobre as lanes ---

async function fetchAndUpdateLane(laneId) {
  const lane = lanes.find((l) => l.id === laneId);
  if (!lane) return;

  lane.status = "loading";
  renderLanes();

  try {
    const posts = await fetchSubredditPosts(lane.subreddit);
    lane.status = "ready";
    lane.posts = posts;
  } catch (err) {
    lane.status = "error";
    lane.errorMessage =
      err.message === "Subreddit not found"
        ? "Subreddit not found."
        : "Failed to load posts. Try refreshing.";
  }

  renderLanes();
}

async function addLane(subredditName) {
  const newLane = {
    id: generateId(),
    subreddit: subredditName,
    status: "loading",
    posts: [],
    errorMessage: "",
  };

  lanes.push(newLane);
  renderLanes();

  await fetchAndUpdateLane(newLane.id);
  saveLanesToStorage();
}

function deleteLane(laneId) {
  lanes = lanes.filter((lane) => lane.id !== laneId);
  renderLanes();
  saveLanesToStorage();
}

function refreshLane(laneId) {
  fetchAndUpdateLane(laneId);
}

// --- Modal de adicionar subreddit ---

function openModal() {
  modalOverlay.classList.remove("hidden");
  modalError.classList.add("hidden");
  subredditInput.value = "";
  subredditInput.focus();
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

async function handleAddSubreddit() {
  const name = subredditInput.value.trim();

  if (name === "") {
    modalError.textContent = "Please enter a subreddit name.";
    modalError.classList.remove("hidden");
    return;
  }

  // Impede duas lanes do mesmo subreddit
  const alreadyExists = lanes.some(
    (lane) => lane.subreddit.toLowerCase() === name.toLowerCase()
  );
  if (alreadyExists) {
    modalError.textContent = "This subreddit is already added.";
    modalError.classList.remove("hidden");
    return;
  }

  modalError.classList.add("hidden");
  closeModal();
  await addLane(name);
}

// --- Eventos globais ---

addLaneBtn.addEventListener("click", openModal);

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) closeModal();
});

addSubredditBtn.addEventListener("click", handleAddSubreddit);

subredditInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleAddSubreddit();
});

document.addEventListener("click", closeAllMenus);

// --- Inicialização: restaura lanes salvas no localStorage ---
async function init() {
  const savedSubreddits = loadLanesFromStorage();

  for (const subredditName of savedSubreddits) {
    lanes.push({
      id: generateId(),
      subreddit: subredditName,
      status: "loading",
      posts: [],
      errorMessage: "",
    });
  }

  renderLanes();

  // Busca os posts de cada lane restaurada em paralelo
  await Promise.all(lanes.map((lane) => fetchAndUpdateLane(lane.id)));
}

init();