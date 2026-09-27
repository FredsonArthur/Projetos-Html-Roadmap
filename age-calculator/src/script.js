const { DateTime } = luxon;

const form = document.getElementById("age-form");
const birthdateInput = document.getElementById("birthdate");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");

let selectedDate = null;

// Inicializa o datepicker (js-datepicker) no input de nascimento.
const picker = datepicker("#birthdate", {
  formatter: (input, date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    input.value = `${day}/${month}/${year}`;
  },
  onSelect: (instance, date) => {
    selectedDate = date;
    errorEl.textContent = "";
  },
});

function parseTypedDate(value) {
  // Aceita também uma data digitada manualmente no formato dd/mm/yyyy,
  // caso o usuário não use o datepicker.
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  const isValid =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return isValid ? date : null;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorEl.textContent = "";
  resultEl.textContent = "";

  const dateToUse = selectedDate || parseTypedDate(birthdateInput.value.trim());

  if (!dateToUse) {
    errorEl.textContent = "Por favor, informe uma data de nascimento válida (dd/mm/aaaa).";
    return;
  }

  const birth = DateTime.fromJSDate(dateToUse);
  const now = DateTime.now();

  if (birth > now) {
    errorEl.textContent = "A data de nascimento não pode estar no futuro.";
    return;
  }

  const diff = now.diff(birth, ["years", "months", "days"]).toObject();

  const years = Math.floor(diff.years);
  const months = Math.floor(diff.months);
  const days = Math.floor(diff.days);

  resultEl.innerHTML = `You are <strong>${years} years ${months} months</strong> and ${days} days old`;
});