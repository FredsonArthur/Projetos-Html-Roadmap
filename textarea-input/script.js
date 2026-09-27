const textarea = document.getElementById("message");
const charCount = document.getElementById("char-count");

const MAX_LENGTH = Number(textarea.getAttribute("maxlength"));

function updateCounter() {
  const currentLength = textarea.value.length;
  charCount.textContent = `${currentLength} / ${MAX_LENGTH}`;

  const limitReached = currentLength >= MAX_LENGTH;
  textarea.classList.toggle("limit-reached", limitReached);
  charCount.classList.toggle("limit-reached", limitReached);
}

textarea.addEventListener("input", updateCounter);

// Garante que o contador já comece correto (caso o textarea
// tenha algum valor pré-preenchido).
updateCounter();