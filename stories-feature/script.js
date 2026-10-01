const STORAGE_KEY = "stories";
const STORY_DURATION_MS = 3000; // 3 segundos por story
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas
const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1920;

const storyBar = document.getElementById("story-bar");
const addStoryBtn = document.getElementById("add-story-btn");
const fileInput = document.getElementById("file-input");

const storyViewer = document.getElementById("story-viewer");
const progressTrack = document.getElementById("progress-track");
const closeBtn = document.getElementById("close-btn");
const prevZone = document.getElementById("prev-zone");
const nextZone = document.getElementById("next-zone");
const viewerImage = document.getElementById("viewer-image");

// Índice do story atualmente aberto no viewer, e o timer do progresso
let currentIndex = 0;
let progressTimer = null;
let progressStartTime = null;

// --- LocalStorage ---

function loadStories() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const stories = JSON.parse(raw);
    // Remove stories com mais de 24 horas sempre que a lista é lida
    const now = Date.now();
    return stories.filter((story) => now - story.createdAt < EXPIRY_MS);
  } catch {
    return [];
  }
}

function saveStories(stories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

// --- Redimensiona a imagem para no máximo 1080x1920 antes de salvar ---

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calcula a proporção necessária para caber dentro de 1080x1920
        const widthRatio = MAX_WIDTH / width;
        const heightRatio = MAX_HEIGHT / height;
        const ratio = Math.min(1, widthRatio, heightRatio);

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };

      img.onerror = reject;
      img.src = event.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Renderização da barra de stories ---

function renderStoryBar() {
  const stories = loadStories();

  // Remove bolhas antigas, mantendo o botão de +
  document.querySelectorAll(".story-bubble").forEach((el) => el.remove());

  stories.forEach((story, index) => {
    const bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = story.viewed
      ? "story-bubble viewed"
      : "story-bubble";
    bubble.setAttribute("aria-label", `View story ${index + 1}`);

    const img = document.createElement("img");
    img.src = story.image;
    img.alt = "";

    bubble.appendChild(img);
    bubble.addEventListener("click", () => openViewer(index));

    storyBar.appendChild(bubble);
  });
}

// --- Upload de nova imagem ---

addStoryBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const base64Image = await resizeImage(file);

  const stories = loadStories();
  stories.push({
    id: Date.now().toString(),
    image: base64Image,
    createdAt: Date.now(),
    viewed: false,
  });

  saveStories(stories);
  renderStoryBar();

  // Limpa o input para permitir selecionar o mesmo arquivo de novo no futuro
  fileInput.value = "";
});

// --- Viewer em tela cheia ---

function buildProgressBars(count) {
  progressTrack.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const barBg = document.createElement("div");
    barBg.className = "progress-bar-bg";

    const barFill = document.createElement("div");
    barFill.className = "progress-bar-fill";

    barBg.appendChild(barFill);
    progressTrack.appendChild(barBg);
  }
}

function getProgressFillAt(index) {
  return progressTrack.children[index]?.querySelector(".progress-bar-fill");
}

function openViewer(index) {
  const stories = loadStories();
  if (stories.length === 0) return;

  buildProgressBars(stories.length);
  currentIndex = index;

  storyViewer.classList.remove("hidden");
  showStory(currentIndex);
}

function closeViewer() {
  stopProgress();
  storyViewer.classList.add("hidden");
  renderStoryBar(); // atualiza os anéis "viewed" na barra
}

function showStory(index) {
  const stories = loadStories();

  // Chegou ao fim ou voltou antes do início: fecha o viewer
  if (index < 0 || index >= stories.length) {
    closeViewer();
    return;
  }

  currentIndex = index;
  const story = stories[currentIndex];

  viewerImage.src = story.image;

  // Marca como visto e persiste
  if (!story.viewed) {
    story.viewed = true;
    saveStories(stories);
  }

  // Marca barras anteriores como preenchidas, zera as seguintes
  for (let i = 0; i < stories.length; i++) {
    const fill = getProgressFillAt(i);
    if (!fill) continue;

    if (i < currentIndex) {
      fill.classList.add("filled");
      fill.style.width = "100%";
    } else if (i === currentIndex) {
      fill.classList.remove("filled");
      fill.style.width = "0%";
    } else {
      fill.classList.remove("filled");
      fill.style.width = "0%";
    }
  }

  startProgress();
}

function startProgress() {
  stopProgress();

  const fill = getProgressFillAt(currentIndex);
  if (!fill) return;

  progressStartTime = performance.now();

  function animate(now) {
    const elapsed = now - progressStartTime;
    const percentage = Math.min((elapsed / STORY_DURATION_MS) * 100, 100);
    fill.style.width = `${percentage}%`;

    if (elapsed < STORY_DURATION_MS) {
      progressTimer = requestAnimationFrame(animate);
    } else {
      goToNext();
    }
  }

  progressTimer = requestAnimationFrame(animate);
}

function stopProgress() {
  if (progressTimer) {
    cancelAnimationFrame(progressTimer);
    progressTimer = null;
  }
}

function goToNext() {
  showStory(currentIndex + 1);
}

function goToPrevious() {
  showStory(currentIndex - 1);
}

closeBtn.addEventListener("click", closeViewer);
prevZone.addEventListener("click", goToPrevious);
nextZone.addEventListener("click", goToNext);

// Fecha com a tecla Esc
document.addEventListener("keydown", (event) => {
  if (storyViewer.classList.contains("hidden")) return;

  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowRight") goToNext();
  if (event.key === "ArrowLeft") goToPrevious();
});

// --- Swipe no mobile (toque horizontal) ---

let touchStartX = 0;

storyViewer.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
});

storyViewer.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  const deltaX = touchEndX - touchStartX;
  const SWIPE_THRESHOLD = 50;

  if (deltaX > SWIPE_THRESHOLD) {
    goToPrevious(); // swipe para a direita = story anterior
  } else if (deltaX < -SWIPE_THRESHOLD) {
    goToNext(); // swipe para a esquerda = próximo story
  }
});

// --- Verificação periódica de expiração (sem precisar recarregar a página) ---

setInterval(() => {
  renderStoryBar();
}, 60 * 1000); // checa a cada minuto

// --- Inicialização ---

renderStoryBar();