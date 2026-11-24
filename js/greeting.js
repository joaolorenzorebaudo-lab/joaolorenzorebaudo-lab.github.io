// Rotating greeting in the hero. The static word in the HTML is the starting point.
(function () {
  const WORDS = [
    { text: "Ciao", lang: "it" },
    { text: "Olá", lang: "pt" },
    { text: "Bonjour", lang: "fr" },
    { text: "Hello", lang: "en" },
    { text: "Hola", lang: "es" },
  ];
  const INTERVAL_MS = 2500;
  const FADE_MS = 300; // keep in sync with the transition in style.css

  const element = document.querySelector("[data-greeting]");
  if (!element) return;

  let index = WORDS.findIndex((word) => word.text === element.textContent.trim());
  if (index === -1) return;
  const startIndex = index;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer;

  function showNextWord() {
    if (reducedMotion.matches) return;

    index = (index + 1) % WORDS.length;
    // Stop after one full cycle, back on the page's own word, so the greeting does not keep distracting the reader.
    if (index === startIndex) clearInterval(timer);

    element.classList.add("is-hidden");

    setTimeout(() => {
      element.textContent = WORDS[index].text;
      element.lang = WORDS[index].lang;
      element.classList.remove("is-hidden");
    }, FADE_MS);
  }

  timer = setInterval(showNextWord, INTERVAL_MS);
})();
