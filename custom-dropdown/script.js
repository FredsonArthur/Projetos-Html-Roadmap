const dropdown = document.getElementById("dropdown");
const trigger = document.getElementById("dropdown-trigger");
const label = document.getElementById("dropdown-label");
const list = document.getElementById("dropdown-list");
const items = document.querySelectorAll(".dropdown-item");

function openDropdown() {
  dropdown.classList.add("open");
  list.classList.remove("hidden");
  trigger.setAttribute("aria-expanded", "true");
}

function closeDropdown() {
  dropdown.classList.remove("open");
  list.classList.add("hidden");
  trigger.setAttribute("aria-expanded", "false");
}

function toggleDropdown() {
  const isOpen = dropdown.classList.contains("open");
  isOpen ? closeDropdown() : openDropdown();
}

function selectItem(item) {
  // Remove a seleção visual de qualquer item marcado anteriormente
  items.forEach((el) => el.classList.remove("selected"));

  // Marca o item clicado e atualiza o texto do botão
  item.classList.add("selected");
  label.textContent = item.textContent;

  closeDropdown();
}

trigger.addEventListener("click", toggleDropdown);

items.forEach((item) => {
  item.addEventListener("click", () => selectItem(item));
});

// Fecha o dropdown ao clicar fora dele
document.addEventListener("click", (event) => {
  const clickedOutside = !dropdown.contains(event.target);
  if (clickedOutside) {
    closeDropdown();
  }
});

// Fecha o dropdown ao pressionar Esc, para acessibilidade via teclado
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdown();
  }
});