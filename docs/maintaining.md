# Maintaining

## Adding a project

Target: under 10 minutes. No CSS changes needed, because the grid adapts to the number of cards.

1. In `index.html`, copy an existing `<article class="project-card">` block and paste it below.
2. Change the title, the description, the tags and the link URL.
3. Change the project name in **two** places: the `<h3>` and the link's `aria-label` (`View code of <project name>`). If you forget the `aria-label`, the link still looks correct but screen readers announce the wrong project.
4. Repeat in every language page. Translate the description and the link text plus its `aria-label`. The title, tags and URL stay the same; on non-English pages, mark the title with `lang="en"`.
5. Check at 375 px and on desktop, then commit: `feat: add project <name>`.

## Adding a language

Target: under 30 minutes, assuming the translation is ready.

1. Copy `index.html` to a new folder named after the language code, for example `fr/index.html`. CSS, JavaScript and images use absolute paths, so they load from any folder.
2. Set `<html lang="…">`, then translate the `<title>`, the meta description and every text, including the attributes that are not visible: the photo's `alt`, the `title` of each language abbreviation, and every `aria-label` (monogram, main menu, language switcher, project links). Apply the language's typography rules (e.g. `&nbsp;` before `:` in French).
3. Set the static greeting word to the page's language, for example "Bonjour". If the word is not in the list in `js/greeting.js`, add it there.
4. Keep in English: project titles (marked with `lang="en"`), tags (project and skills), language codes, the contact labels and the "LinkedIn" button.
5. In the new page's language switcher, make the new language the current one: plain text with `aria-current="page"`, not a link.
6. In **every** page, add the new language to the switcher (a link with `lang` and `hreflang`) and a `<link rel="alternate" hreflang="…">` in the `<head>`. Each page lists all versions, itself included; `x-default` stays on English. In the switcher, write each language in its own language (English, Italiano, Français), in the same order on every page.
7. Check: every switcher link opens the right page with no 404, the greeting starts and stops on the page's own word, and the header has no overlaps at 375 px.
8. Update the README (Features and Project structure), then commit: `feat: add <language> version`.
