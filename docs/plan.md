# Piano — Portfolio multilingue v1

> Historical document: the implementation plan drafted with Claude Code in plan mode and approved by me on 2026-11-23. Some details changed during the build (for example, the CV download is postponed). The current state is in the README and in docs/maintaining.md.

> Update 2026-11-23: HTML, CSS and JavaScript are written by Claude; João provides the text and reviews each step. The TODO(human) column no longer applies.

## Contesto
Il repo contiene solo `CLAUDE.md`, `README.md` e `docs/spec.md`: non c'è ancora codice.
Obiettivo: sito statico su GitHub Pages che in 30 secondi dica a un recruiter chi sei, cosa e dove studi, e mostri i progetti.
Decisioni prese: una pagina HTML per lingua (EN, IT, FR), cambio lingua solo con link (niente JS), inglese alla radice, IT e FR alla fine, testi forniti da te nella fase Build.

---

## 1. Struttura di file e cartelle

```
/
├── index.html                       Pagina inglese (lingua di default)
├── it/index.html                    Pagina italiana (copia tradotta dell'inglese)
├── fr/index.html                    Pagina francese (copia tradotta dell'inglese)
├── css/style.css                    Unico foglio di stile, mobile-first, condiviso da tutte le lingue
├── js/greeting.js                   Unico script: il saluto animato nella Hero
├── assets/
│   ├── img/photo.jpg                Foto della Hero (lato lungo 1000 px, senza metadati)
│   ├── img/favicon.svg              Icona della scheda del browser
│   └── cv/Joao-Lorenzo-Rebaudo-CV.pdf   CV in inglese, scaricabile dalla Hero
├── README.md                        Cos'è il sito, avvio locale, come aggiungere progetto/lingua
└── docs/
    ├── spec.md                      Specifica v1.0 (esiste già)
    ├── plan.md                      Questo piano
    └── retro.md                     Retrospettiva finale (Definition of done)
```

- Niente cartelle vuote: ogni cartella nasce nel commit del suo primo file.
- Niente template né componenti: senza build tool ogni pagina HTML è completa e autonoma.

---

## 2. Inglese alla radice — deciso (opzione A)

- Inglese in `/`, italiano in `/it/`, francese in `/fr/`.
- L'URL sul CV apre subito il contenuto, senza redirect.
- L'asimmetria dei percorsi si risolve con percorsi assoluti dalla radice (§3).

---

## 3. CSS e JavaScript condivisi senza duplicazione

- Un solo `css/style.css` e un solo `js/greeting.js`, inclusi da ogni pagina con **percorsi assoluti dalla radice**: `/css/style.css`, `/js/greeting.js`.
  - Perché funziona: è un sito GitHub Pages "utente", quindi `/` è sempre la radice del repo, online e con `python3 -m http.server` lanciato dalla radice.
  - Limite: aprire il file con doppio clic (`file://`) rompe i percorsi. Si usa sempre il server locale.
- Un file si collega solo quando esiste: il `<link>` al CSS arriva con il passo del CSS, lo `<script>` con il passo del saluto.
- **CSS mobile-first:** gli stili base sono per schermi piccoli; le regole per schermi larghi vanno dentro `@media (min-width: …)`. Così il telefono, il caso più comune per un recruiter, non dipende da nessuna media query.
- **Variabili CSS** in `:root`:
  - `--color-bg: #FFFFFF`, `--color-text: #1F2937`, `--color-text-muted: #6B7280`, `--color-border: #E5E7EB`, `--color-accent: #1E3A8A` (solo link e bottoni).
  - Font di sistema (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`): nessuna richiesta esterna.
- **Foto:** il file resta rettangolare; il ritaglio lo fa il CSS con dimensioni fisse e `object-fit: cover`.
- **Saluto:**
  - Lo script si carica con `defer`: parte quando l'HTML è pronto, senza bloccare la pagina.
  - La lista delle 5 parole sta solo nello script, nell'ordine della spec: Ciao → Olá → Bonjour → Hello → Hola.
  - La parola statica nell'HTML è quella della lingua della pagina (EN "Hello", IT "Ciao", FR "Bonjour"). Lo script la legge, ne trova la posizione nella lista e parte da lì. Non serve nessuna configurazione per pagina.
  - Cambia ogni 2,5 secondi e si ferma dopo un giro (circa 12 s), di nuovo sulla parola della pagina, per limitare la distrazione.
  - Senza JS resta la parola statica. Con `prefers-reduced-motion` il saluto resta fermo. La parola che cambia non viene annunciata ogni volta dagli screen reader.

---

## 4. Come funziona il link per cambiare lingua

- Nell'`<header>` ci sono due gruppi di link:
  - nav interna: Projects, Background, Contact (ancore `#projects`, `#background`, `#contact`, tradotte nelle altre lingue solo nel testo, non negli id);
  - selettore di lingua: `English · Italiano · Français`.
- Il selettore nasce **insieme alla pagina italiana** (passo 11): non ci sono mai link verso pagine che non esistono.
- Ogni nome è scritto nella sua lingua e il link porta gli attributi `lang` e `hreflang` corretti.
- La lingua corrente non è un link: è testo marcato con `aria-current`.
- I link portano alla home dell'altra lingua: `/`, `/it/`, `/fr/`.
- Nel `<head>`: `<html lang="…">` corretto e `<link rel="alternate" hreflang="…">` verso le altre lingue.
- Nessun riconoscimento automatico della lingua del browser.

---

## 5. Aggiungere un progetto (< 10 min) e una lingua (< 30 min)

**Nuovo progetto**
1. Copia un blocco `<article class="project-card">` nella pagina EN e cambia titolo, descrizione, link, tag.
2. Ripeti in `it/` e `fr/` traducendo solo la descrizione (titolo, link e tag restano uguali).
3. Verifica a 375 px e su desktop, commit `feat: add project <nome>`.
- Il CSS non si tocca: la griglia delle card si adatta al numero di card. Solo testo e tag, nessuna immagine.

**Nuova lingua (es. PT in v1.1)**
1. Copia `it/` in `pt/`.
2. Cambia `<html lang="pt">`, `<title>`, la meta description, i testi e la parola statica del saluto ("Olá").
3. Aggiungi `Português` al selettore di lingua e il `<link rel="alternate">` in **tutte** le pagine (oggi 4 file).
4. Verifica i link, commit `feat: add Portuguese version`.
- I 30 minuti presuppongono che la traduzione sia già pronta.
- Se la parola della nuova lingua non è tra le 5 della spec, va aggiunta alla lista in `greeting.js`.
- Snippet della card e queste due checklist vanno nel README.

---

## 6. Passi di build (un passo = un commit)

Ogni passo: ti mostro cosa faccio, aspetto il tuo OK, modifico, ti chiedo l'approvazione del commit. Ogni passo con CSS si verifica anche a 375 px.

| # | Commit | Tu (TODO(human)) | Io |
|---|--------|------------------|-----|
| 0 | `docs: add implementation plan` | Approvi il piano | Salvo `docs/plan.md` |
| 1 | `feat: add English page skeleton` | Struttura semantica in `index.html`: `header` con nav (Projects, Background, Contact), `main` con le 4 `section` e i loro id, `footer` | `<head>`: charset, viewport, `lang="en"`, title, meta description; rivedo la struttura con te |
| — | (nessun commit) | Attivi GitHub Pages: Settings → Pages → `main` / root | Ti guido; controlliamo che `index.html` sia online |
| 2 | `feat: add base styles` | Rivedi le variabili | Creo `css/style.css`: variabili di colore, font di sistema, reset, tipografia, layout base mobile-first; aggiungo il `<link>` a `/css/style.css` |
| 3 | `feat: add hero section` | Testi e markup della Hero; mi dici dov'è la foto | Copio la foto in `assets/img/photo.jpg` e il CV in `assets/cv/`; CSS della Hero (foto con `object-fit`, bottoni) |
| 4 | `feat: add favicon` | Scegli il contenuto (es. iniziali "JL") | `assets/img/favicon.svg` nel colore accento, `<link rel="icon">` |
| 5 | `feat: add animated greeting` | La funzione che passa alla parola successiva (~5 righe, TODO(human)) | Creo `js/greeting.js` (lista, lettura della parola iniziale, timer 2,5 s, `prefers-reduced-motion`), transizione CSS, `<script defer>` |
| 6 | `feat: add projects section` | Testo e markup della card di questo sito | CSS delle card e dei tag |
| 7 | `feat: add background section` | Testi di formazione, esperienze, lingue | CSS della sezione |
| 8 | `feat: add contact section and footer` | Testi e link (`mailto:`, LinkedIn, GitHub) | CSS di contatti e footer |
| 9 | `style: fix responsive issues` | Provi su un telefono vero | Controllo finale a 375 / 768 / 1280 px, contrasti e focus; commit solo se c'è qualcosa da correggere |
| 10 | `docs: write README` | Rivedi e correggi i testi | Bozza: descrizione, avvio locale, checklist progetto/lingua |
| 11 | `feat: add Italian version and language switcher` | Traduzione dei testi; markup del selettore (logica di cambio lingua = tua) | Copio la pagina in `it/index.html`, `lang="it"`, parola statica "Ciao", `hreflang` in entrambe le pagine, CSS del selettore |
| 12 | `feat: add French version` | Traduzione dei testi | `fr/index.html`, `lang="fr"`, "Bonjour", aggiungo Français al selettore e `hreflang` in tutte e 3 le pagine |
| 13 | `docs: add retrospective` | Test dei 30 secondi con 2 persone; scrivi la retro | Domande per il test e schema della retro |

---

## 7. Come verifichi ogni passo

- **Sempre:** `python3 -m http.server` dalla radice, apri `http://localhost:8000`, ricarica con Cmd+Shift+R.
- **Sempre (dal passo 2):** DevTools in modalità dispositivo a 375 px: niente scroll orizzontale, testo leggibile; poi a larghezza desktop.
- **Sempre (dopo il deploy):** stessa verifica sull'URL GitHub Pages.
- **HTML (passi 1, 3–8, 11–12):** validatore W3C (validator.w3.org, "Validate by File Upload"): zero errori. Con Tab raggiungi tutti i link e bottoni nell'ordine giusto.
- **Passo 1:** i link della nav portano alla sezione giusta.
- **Passo 2:** online, DevTools → Network: `/css/style.css` risponde 200 (nessun 404).
- **Passo 3:**
  - il bottone CV scarica `Joao-Lorenzo-Rebaudo-CV.pdf`; il link LinkedIn si apre;
  - il PDF non contiene telefono né indirizzo: aprilo e cerca (Cmd+F) "+39", "+352", "Via", "Rue", il CAP; controlla anche le proprietà del documento (Anteprima → Strumenti → Mostra impostazioni);
  - la foto non ha metadati EXIF, in particolare GPS: `mdls assets/img/photo.jpg | grep -i -E "latitude|longitude"` non restituisce nulla, e in Anteprima → Strumenti → Mostra impostazioni non c'è la scheda GPS;
  - la foto è ritagliata bene a 375 px e su desktop.
- **Passo 4:** l'icona compare nella scheda del browser.
- **Passo 5:** online, `/js/greeting.js` risponde 200; parte da "Hello" e segue Hola → Ciao → Olá → Bonjour → Hello ogni 2,5 s e si ferma su "Hello"; con DevTools → Rendering → "prefers-reduced-motion: reduce" resta fermo; con JS disattivato si vede "Hello".
- **Passi 11–12:** da ogni pagina ogni link di lingua porta alla pagina giusta, nessun 404; `lang` corretto; il saluto parte dalla parola della pagina; CSS e JS caricati anche da `/it/` e `/fr/`.
- **Finale:** Lighthouse in Chrome (Accessibilità e SEO ≥ 90) + test dei 30 secondi.

---

## 8. Decisioni

| # | Domanda | Decisione |
|---|---------|-----------|
| 1 | Inglese: radice o `/en/` | Radice; IT in `/it/`, FR in `/fr/` |
| 2 | Font | Font di sistema, nessun font esterno |
| 3 | Colori | Sfondo #FFFFFF, testo #1F2937, secondario #6B7280, bordi #E5E7EB, accento #1E3A8A; variabili CSS |
| 4 | Saluto | Parte dalla parola della lingua della pagina, ordine della spec, ogni 2,5 s |
| 5 | Email | Link `mailto:` |
| 6 | CV | `assets/cv/Joao-Lorenzo-Rebaudo-CV.pdf` |
| 7 | Nav | Link interni: Projects, Background, Contact |
| 8 | Card progetto | Solo testo e tag, niente immagini |
| 9 | Extra | Favicon sì, pagina 404 no |
| — | Foto | La prepari tu (1000 px, senza metadati); ritaglio con `object-fit`; la copio al passo 3 |

**Rimaste aperte (si decidono nel passo indicato):**
- Forma della foto ritagliata: cerchio o rettangolo arrotondato? (passo 3)
- Contenuto della favicon (passo 4).

---

## Dopo l'approvazione
1. Salvo questo piano in `docs/plan.md`.
2. Ti mostro il commit `docs: add implementation plan` e aspetto la tua approvazione.
3. Mi fermo.
