const banner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("accept-btn");
const closeBtn = document.getElementById("close-btn");

const CONSENT_KEY = "cookieConsentAccepted";

function hideBanner() {
  banner.classList.add("hidden");
}

function acceptConsent() {
  localStorage.setItem(CONSENT_KEY, "true");
  hideBanner();
}

// Ao carregar a página, só mostra o banner se o consentimento
// ainda não tiver sido dado anteriormente.
if (localStorage.getItem(CONSENT_KEY) === "true") {
  hideBanner();
}

acceptBtn.addEventListener("click", acceptConsent);
closeBtn.addEventListener("click", hideBanner);