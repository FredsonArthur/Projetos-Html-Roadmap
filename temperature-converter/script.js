const form = document.getElementById("converter-form");
const temperatureInput = document.getElementById("temperature-input");
const fromUnitSelect = document.getElementById("from-unit");
const toUnitSelect = document.getElementById("to-unit");
const convertBtn = document.getElementById("convert-btn");
const resultEl = document.getElementById("result");

// Nomes legíveis para exibir no resultado final
const unitLabels = {
  celsius: "Celsius",
  fahrenheit: "Fahrenheit",
  kelvin: "Kelvin",
};

// Converte qualquer unidade para Celsius primeiro (unidade "base")
function toCelsius(value, unit) {
  switch (unit) {
    case "celsius":
      return value;
    case "fahrenheit":
      return ((value - 32) * 5) / 9;
    case "kelvin":
      return value - 273.15;
  }
}

// Converte de Celsius para a unidade de destino desejada
function fromCelsius(value, unit) {
  switch (unit) {
    case "celsius":
      return value;
    case "fahrenheit":
      return (value * 9) / 5 + 32;
    case "kelvin":
      return value + 273.15;
  }
}

function convertTemperature(value, fromUnit, toUnit) {
  const celsiusValue = toCelsius(value, fromUnit);
  return fromCelsius(celsiusValue, toUnit);
}

// Habilita o botão Convert só quando os três campos estão preenchidos
function updateConvertButtonState() {
  const hasValue = temperatureInput.value.trim() !== "";
  const hasFromUnit = fromUnitSelect.value !== "";
  const hasToUnit = toUnitSelect.value !== "";

  convertBtn.disabled = !(hasValue && hasFromUnit && hasToUnit);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = parseFloat(temperatureInput.value);
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  const converted = convertTemperature(value, fromUnit, toUnit);

  // Arredonda para até 2 casas decimais, sem casas desnecessárias (ex: 93.2 em vez de 93.20)
  const roundedValue = Math.round(converted * 100) / 100;

  resultEl.textContent = `${value} ${unitLabels[fromUnit]} is ${roundedValue} ${unitLabels[toUnit]}`;
});

temperatureInput.addEventListener("input", updateConvertButtonState);
fromUnitSelect.addEventListener("change", updateConvertButtonState);
toUnitSelect.addEventListener("change", updateConvertButtonState);