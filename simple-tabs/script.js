const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    button.setAttribute("aria-selected", "true");
    document.getElementById(`tab-${target}`).classList.add("active");
  });
});