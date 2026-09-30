const LANGUAGES_URL =
  "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json";
const GITHUB_SEARCH_URL = "https://api.github.com/search/repositories";

const languageSelect = document.getElementById("language-select");
const resultArea = document.getElementById("result-area");
const refreshBtn = document.getElementById("refresh-btn");

// Guarda a linguagem selecionada, para o botão "Refresh" saber o que buscar de novo
let currentLanguage = null;

// --- Carrega a lista de linguagens no <select> assim que a página abre ---
async function loadLanguages() {
  try {
    const response = await fetch(LANGUAGES_URL);
    const languages = await response.json();

    languages.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang.name;
      option.textContent = lang.name;
      languageSelect.appendChild(option);
    });
  } catch (err) {
    // Se nem a lista de linguagens carregar, avisamos no próprio select
    const option = document.createElement("option");
    option.textContent = "Failed to load languages";
    languageSelect.appendChild(option);
  }
}

// --- Funções que renderizam cada estado dentro de #result-area ---

function renderPlaceholder() {
  resultArea.innerHTML = `<p class="placeholder-message">Please select a language</p>`;
  refreshBtn.classList.add("hidden");
}

function renderLoading() {
  resultArea.innerHTML = `<p class="loading-message">Loading, please wait..</p>`;
  refreshBtn.classList.add("hidden");
}

function renderError() {
  resultArea.innerHTML = `
    <div class="error-box">
      <p>Error fetching repositories</p>
    </div>
    <button type="button" class="retry-btn" id="retry-btn">Click to retry</button>
  `;
  refreshBtn.classList.add("hidden");

  // O botão de retry é recriado a cada erro, então o listener precisa
  // ser religado toda vez que essa função roda.
  document
    .getElementById("retry-btn")
    .addEventListener("click", () => fetchRandomRepo(currentLanguage));
}

function renderRepo(repo) {
  resultArea.innerHTML = `
    <div class="repo-card">
      <h2 class="repo-name">${repo.name}</h2>
      <p class="repo-description">
        ${repo.description ? repo.description : "No description available."}
      </p>
      <div class="repo-meta">
        <span>
          <span class="language-dot"></span>
          ${repo.language || "Unknown"}
        </span>
        <span>⭐ ${repo.stargazers_count.toLocaleString()}</span>
        <span>🍴 ${repo.forks_count.toLocaleString()}</span>
        <span>⚠️ ${repo.open_issues_count.toLocaleString()}</span>
      </div>
    </div>
  `;
  refreshBtn.classList.remove("hidden");
}

// --- Busca um repositório aleatório para a linguagem escolhida ---
async function fetchRandomRepo(language) {
  renderLoading();

  try {
    // Busca os 100 repositórios mais populares dessa linguagem
    const response = await fetch(
      `${GITHUB_SEARCH_URL}?q=language:${encodeURIComponent(language)}&sort=stars&order=desc&per_page=100`
    );

    if (!response.ok) {
      throw new Error("GitHub API request failed");
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("No repositories found");
    }

    // Escolhe um repositório aleatório entre os resultados retornados
    const randomIndex = Math.floor(Math.random() * data.items.length);
    const randomRepo = data.items[randomIndex];

    renderRepo(randomRepo);
  } catch (err) {
    renderError();
  }
}

// --- Eventos ---

languageSelect.addEventListener("change", (event) => {
  currentLanguage = event.target.value;

  if (!currentLanguage) {
    renderPlaceholder();
    return;
  }

  fetchRandomRepo(currentLanguage);
});

refreshBtn.addEventListener("click", () => {
  if (currentLanguage) {
    fetchRandomRepo(currentLanguage);
  }
});

// --- Inicialização ---
loadLanguages();