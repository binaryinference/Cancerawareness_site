# Sibusisiwe Cancer Care Center — website

A fast, dependency-free static site (plain HTML, CSS and a little JavaScript). No build step: open `index.html`, or host the folder on any static host (GitHub Pages, Netlify, cPanel, etc.).

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Home |
| `about.html` | Who we are, mission, vision, values, community model, team |
| `services.html` | Transport, home-based psychosocial support, family support, navigation, impact |
| `awareness.html` | Cancer awareness work, channels, topics, photo gallery |
| `get-involved.html` | Donate (bank details), partner, volunteer |
| `request-support.html` | How to request support + request form |
| `contact.html` | Contact details + message form |
| `legal.html` | Legal & transparency, medical-information notice |
| `css/styles.css` | All styling. Brand colours are the variables at the top (`--pink-*`, `--slate-*`, `--teal-*`) |
| `js/main.js` | Mobile menu, gallery lightbox, copy button, forms. The WhatsApp number is the `WHATSAPP_NUMBER` constant at the top |
| `images/` | Logo, favicon and optimised photos (each photo has a `-sm` thumbnail) |

The header and footer are repeated in each HTML file, so a change to the menu or footer needs the same edit in all eight pages.

## Hosting (GitHub Pages)

`.github/workflows/pages.yml` publishes the site on every push to the default branch (and can be run by hand from the Actions tab). It copies only the HTML, `favicon.ico`, `css/`, `js/` and `images/` into the published site.

One-time setup: in the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**. The site is then served at `https://binaryinference.github.io/Cancerawareness_site/`. All links in the pages are relative, so it works under that sub-path. When a custom domain is ready, add it under Settings → Pages and update the canonical/`og:` tags.

## Forms

A static site has no server to receive form submissions, so the request and contact forms compose a message and open WhatsApp to the organisation's number (082 812 7151). The number is also shown beside each form as a call button.

## Still to confirm with the client

- **Facebook and TikTok links** — currently search links for the organisation name. Replace `facebook.com/search/...` and `tiktok.com/search...` in every page's footer and in `contact.html`.
- **Email address** — the supplied content gives `sibusisiwecancercarecenter.org.za` with no `@`, so it is shown as the website/domain only. Add a proper email address once confirmed.
- **Bank details** — account name is shown as the legal name (Sibusisiwe Cancer Care Center NPC) and no branch code is shown. Confirm both.
- **Social-sharing image / canonical URL** — add `og:image` and canonical tags once the live domain is known.
