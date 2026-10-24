# Fidgital World: site redesign and kit codes (v1 plan)

Agreed with the owner on 2026-10-24. This is the source of truth for everyone building it.

## Why
The site gets visits but few leads. The causes we found:
- No analytics, so nothing can be measured.
- Learn with AI has no way to book or sign up.
- Fun with AI asks for payment but says "Pricing announced when this session opens".
- No way to capture parents who aren't ready to buy yet.
- No proof (testimonials, numbers). The kids' showcase pages (Robo Chef, Papaya, Strawberry) are buried.
- Inconsistent and broken details: `robo-chef.html` says "6 days. ₹500" and links to `index.html#pricing`, which doesn't exist. `ai-survival-guide.html` is linked but missing.
- The Fidgital Play game kit isn't on the site at all.

## The brand: one ladder, three doors
| Door | Who | What | Where |
|---|---|---|---|
| Fidgital Play | younger kids (game is designed around age 8) | Physical kit (5×5 board + fidget cubes) with an online game | `play.html` on the site; game at `play.fidgitalworld.com` |
| Create with AI | 10+ | Fun with AI and Learn with AI (live) | `fun-with-ai.html`, `learn-with-ai.html` |
| AI Course | 10+ | Self-paced video course (later, needs Supabase) | waitlist only for now |

"Fidgital" = physical + digital. Hands-on, safe, kids make real things.

## Hard rules
1. **The site is live.** Work only on branches. Never push to `main`. Never deploy.
2. **Keep every existing URL working**: `index.html`, `fun-with-ai.html`, `learn-with-ai.html`, `robo-chef.html`, `papaya.html`, `strawberry.html`, image paths.
3. **Never invent facts.** No made-up testimonials, numbers of kids, prices, dates, ratings, box contents, or partner logos. Anything we don't know comes from `js/site-config.js` and hides itself while empty.
4. **No em dashes (—) in any copy**, including meta tags and JSON-LD. Use a full stop, comma, colon or parentheses. Remove the existing ones on any page you touch. (Owner's rule.)
5. **Kind, positive voice.** Speak to parents. No fear-selling in new copy.
6. Plain HTML, CSS and JS. No build step, no frameworks. Each page keeps its own inline `<style>`, like today.
7. Mobile first. Most parents arrive on a phone from WhatsApp or Instagram. No horizontal scroll at 360 px.

## Brand tokens (from the current pages)
```
--warm-bg #FFFDF0   --cool-bg #E8F4FA   --gold #FAE0A0   --gold-dark #E8A838
--teal #2A96C0      --dark #2D3436      --body #4A4A4A   --muted #7A7A72   --border #e8e4dc
Font: DM Sans (Google Fonts), weights 400 to 800. Pill buttons (border-radius 50px).
Logos: Logo-1.png (nav), Logo-2.png (footer).
```

## Shared pieces (already built, don't rewrite)
Every page includes, just before `</body>`:
```html
<script src="js/site-config.js"></script>
<script src="js/site.js" defer></script>
```
- `js/site-config.js`: the owner's single settings file: lead form endpoint, WhatsApp link, `playUrl`, GA4 and Clarity IDs, products (`fun-with-ai`, `learn-with-ai`, `play-kit`, `ai-course`) with `status`, `price`, `priceOld`, `nextBatch`, `seatsLeft`, `paymentUrl`, plus `testimonials` and `stats`.
- `js/site.js`: loads tracking, opens the lead form, fills config values into the page. The API is documented at the top of the file:
  - `data-lead="<productId>" data-source="<where>"` on any link or button opens the lead form. The form saves the lead, then goes to Razorpay (`open`/`preorder`) or shows a thank-you with WhatsApp (`waitlist`).
  - `data-fw="price|priceOld|nextBatch|seats|cta" data-product="<id>"`, plus `data-fw-hide-empty`.
  - `data-fw-status="<id>:open,preorder"` shows an element only for those statuses.
  - `data-fw-testimonials`, `data-fw-stats`, and `data-fw-needs="testimonials|stats"` on a section to hide it while empty.
- `docs/lead-form-setup.md` + `docs/lead-form-sheet.gs`: the Google Sheet setup for the owner.

**Every buy, book or sign-up button uses `data-lead`.** Give each one a distinct `data-source` (`hero`, `pricing`, `sticky`, `final`, `nav`, …) so we can see which buttons work. Keep a real `href` (e.g. `#pricing`) as the no-JS fallback.

Images already copied for the Play kit: `img/play/cube.png` (a fidget cube render) and `img/play/board.png` (the board in 3D). Put any new images in `img/`.

## Shared nav (all pages)
Logo on the left (links to `index.html`). On the right, from 640 px up: text links **AI Programs** (`index.html#programs`) and **Play Kit** (`play.html`), then one gold pill button that is the page's main action (a `data-lead` button with `data-source="nav"`). Below 640 px: logo and the pill only. Fixed to the top, the same frosted warm background as today.

## Shared footer (all pages)
Logo-2, then links: AI Programs · Fun with AI · Learn with AI · Play Kit · Free AI Safety Chat (`ai-survival-guide.html`), then © 2026 Fidgital World.

## Canonical URLs
`CNAME` is `www.fidgitalworld.com`, so every `canonical` and `og:url` must use `https://www.fidgitalworld.com/...` (today they use the bare domain, which redirects).

## Pages

### Home `index.html` (Agent C)
Goal: in 5 seconds a parent knows what Fidgital World is, finds the right door, and can act.
1. Nav.
2. Hero: what we are, for whom, two buttons: "Explore AI programs" (`#programs`) and "See the Play kit" (`play.html`). A visual collage from existing images (Robo Chef character + `img/play/cube.png`).
3. `#programs`: three door cards: Fun with AI, Learn with AI, Fidgital Play kit. Each shows its status line from config (price, next batch or seats, via `data-fw`), a link to its page, and a `data-lead` button. Then a slim strip: "AI Course (self-paced) is coming. Get notified" → `data-lead="ai-course"`.
4. Showcase: "Made by kids with AI": Robo Chef, Papaya, Strawberry cards linking to their pages (existing images).
5. Why parents choose us: hands-on, safety built in, kids keep everything (only claims already on the site).
6. Proof: stats + testimonials (`data-fw-needs`, hidden while empty).
7. Meet Palak (keep the existing bio, tighten it).
8. Free AI Safety Chat banner (keep).
9. FAQ: keep the existing six, add "What is the Fidgital Play kit?" and "How does the online game work?". Keep the FAQPage JSON-LD in sync with the visible FAQ.
10. Final CTA band + footer.

### Play kit `play.html` (Agent B, new page)
Goal: sell the first 10 kits, then take pre-orders.
1. Nav (pill: kit CTA).
2. Hero: "Build it with your hands. Play it on screen." What it is in one line, the age from config if set, price + "Only N kits in the first batch" from config, `data-lead="play-kit"` button, and a "Already have a kit? Play online →" link to `playUrl`.
3. How it works, 3 steps: pick a puzzle on screen → build it on the board with the cubes before the timer ends → check the answer and earn stars.
4. Real screenshots of the game (take them with Playwright from the game repo, see below).
5. Ways to play: Single player (levels unlock with stars), Dual player (Race, or Take Turns).
6. What's in the box: only what we know: a 5×5 board, fidget cubes, a card with your kit code for the online game. No counts or dimensions.
7. Why parents like it: hands-on screen time, spatial thinking, focus, playing together. Keep claims modest.
8. Buy box `#buy`: price, stock or pre-order shipping note (`data-fw-status`), CTA. Proof section (hidden while empty).
9. FAQ: Where's the code? (on the card in the box) Which device? (a tablet works best, laptop or phone works) Does it need internet? (yes, to load the game) Can we use it on more than one device? (yes, enter the same code) Which age? (from config).
10. Final CTA + footer. Add `play.html` to `sitemap.xml` is Agent A's job; just make sure the page has full meta, OG and canonical.

Game screenshots: serve `/home/user/fidgital-play-game` with `python3 -m http.server`, open it in Playwright at 1194×834, capture the home screen, a puzzle with the timer, the answer reveal, the level map, and dual Race. Save as compressed JPG or WebP (under 150 KB each) in `img/play/`.

### Fun with AI, Learn with AI, the showcase pages (Agent A)
- Shared nav, footer, scripts, canonical fixes. Remove em dashes from all copy.
- **Fun with AI**: replace both "Pricing announced when this session opens" badges with config values (`price`, `priceOld`, `nextBatch`, `seats`, hidden when empty). Every "Reserve / Start Building" button becomes `data-lead="fun-with-ai"`. Pricing section CTA too.
- **Learn with AI**: replace "Dates & pricing coming soon" with the config values, and add a booking section `#book` (same pattern as Fun with AI's pricing card, listing what they walk away with) with `data-lead="learn-with-ai"`. Hero gets a primary `data-lead` button plus the existing "See the 6 Stops" as secondary.
- **Both program pages**: a sticky bottom CTA bar on phones (under 768 px), shown after the hero scrolls away, `data-source="sticky"`. Add a proof section (hidden while empty).
- **robo-chef / papaya / strawberry**: replace the hard-coded "6 days. ₹500" line with config values, point the CTA at `data-lead="fun-with-ai"` (fallback href `fun-with-ai.html#pricing`).
- **`ai-survival-guide.html`**: create it. A small page with the shared nav and footer and a short intro that loads `ai-safety-widget.js` and opens the chat automatically (`window.fwOpenChat`). This fixes the broken links and gives the chat a shareable URL.
- **`sitemap.xml` and `robots.txt`**: add them, listing every page including `play.html` and `ai-survival-guide.html`.

### Tracking events (all fired by `js/site.js`)
`lead_form_open`, `generate_lead`, `begin_checkout`, `whatsapp_click`, each with `product` and `source`. Pages don't need to add their own.

## Game: kit codes (Agent D, `Fidgital-Play-Game` repo)
The owner's decision: **a kit code is needed for everything** (including Learn to Play). No logins.
- Code format: `FW-XXXXX-XXXXX` from Crockford base32 (no I, L, O, U). Input is forgiving: any case, spaces or dashes, and O→0, I/L→1.
- `content/kit-codes.json` holds `{ "version": 1, "salt": "...", "hashes": ["<sha256 hex>", …] }`, never the codes themselves (the files are public). Hash = SHA-256 of `salt + normalisedCode` (normalised = the 10 characters, uppercase, no dashes).
- `tools/make_kit_codes.py --count N [--batch NAME]` makes new random codes with `secrets`, appends their hashes to `content/kit-codes.json`, and writes the plain codes to a CSV outside the repo (default `~/fidgital-kit-codes-<batch>.csv`). `.gitignore` gets `*kit-codes*.csv`.
- `js/kit.js`: `FW.kit.isUnlocked()`, `FW.kit.redeem(code)` → `{ ok, reason }`. Unlock is remembered on the device (`FW.store`). Uses `crypto.subtle`, which works on https and localhost.
- A kid-friendly "Enter your kit code" screen right after the splash, in the game's own style on the 1194×834 stage: big input, "Find it on the card in your box", a friendly retry message ("Hmm, that code didn't open it. Check the card and try again!"), never "wrong" or "invalid". Any route reached without an unlock goes to this screen. `admin.html` is never gated.
- Leave a clear seam (one function) where a Supabase check can replace the local one later (device limits, switching off a leaked code).
- Update `README.md` and `docs/SETUP.md` with a short "Kit codes" section. Note in `docs/design.md` that codes are now in scope.
- Note for the owner: this stops casual sharing, not a determined techie. Server-side checks come with Supabase.

## File ownership (parallel work, so stay in your lane)
| Agent | Branch | Files |
|---|---|---|
| A | `site-a-pages` | `fun-with-ai.html`, `learn-with-ai.html`, `robo-chef.html`, `papaya.html`, `strawberry.html`, `ai-survival-guide.html` (new), `sitemap.xml`, `robots.txt` |
| B | `site-b-play` | `play.html` (new), `img/play/*` (new files only) |
| C | `site-c-home` | `index.html`, new images under `img/home/` |
| D | `kit-codes` (game repo) | everything in the game repo |

Nobody edits `js/site.js`, `js/site-config.js` or `ai-safety-widget.js`. If one of them needs a change, say so in your report.

## Done means
- Opens with no console errors, at 360, 390, 768 and 1280 px wide, with no horizontal scroll.
- Every buy or sign-up button opens the lead form with the right product.
- With an empty config, nothing says "undefined", "null", "₹" on its own, or "0 seats". Empty things are hidden.
- No em dashes in any copy you touched.
- Committed on your branch with a clear message. Not pushed to `main`.
