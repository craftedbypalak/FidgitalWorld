/*
  Shared by every page: tracking, the lead form, and filling prices/dates from js/site-config.js.
  Load after site-config.js:
    <script src="js/site-config.js"></script>
    <script src="js/site.js" defer></script>

  In the HTML:
    <a href="#" data-lead="fun-with-ai" data-source="hero">Book a seat</a>   opens the lead form
    <span data-fw="price" data-product="fun-with-ai"></span>                  price | priceOld | nextBatch | seats | cta
    data-fw-hide-empty                                                        hides the element when that value is empty
    <div data-fw-status="fun-with-ai:open,preorder">…</div>                   shown only for those statuses
    <div data-fw-testimonials></div>, <div data-fw-stats></div>              rendered from the config lists
    data-fw-needs="testimonials" (or "stats")                                 hides a whole section while the list is empty
*/
(function () {
  "use strict";

  const SITE = window.FW_SITE || { products: {}, testimonials: [], stats: [] };
  const FW = (window.FW = window.FW || {});

  /* ── Tracking ─────────────────────────────────────────── */

  function loadScript(src) {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  if (SITE.ga4Id) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", SITE.ga4Id);
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(SITE.ga4Id));
  }
  if (SITE.clarityId) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    loadScript("https://www.clarity.ms/tag/" + encodeURIComponent(SITE.clarityId));
  }

  function track(name, params) {
    try {
      if (window.gtag) window.gtag("event", name, params || {});
      if (window.clarity) window.clarity("event", name);
    } catch (e) { /* tracking must never break the page */ }
  }

  // Remember where the visitor came from (ads, Instagram, WhatsApp), so each lead carries it.
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  function storage() { try { return window.sessionStorage; } catch (e) { return null; } }
  (function saveUtm() {
    const q = new URLSearchParams(location.search);
    const found = {};
    UTM_KEYS.forEach(k => { if (q.get(k)) found[k] = q.get(k); });
    const ss = storage();
    if (ss && Object.keys(found).length) ss.setItem("fw_utm", JSON.stringify(found));
  })();
  function utm() {
    const ss = storage();
    try { return JSON.parse((ss && ss.getItem("fw_utm")) || "{}"); } catch (e) { return {}; }
  }

  /* ── Product helpers ──────────────────────────────────── */

  function product(id) { return (SITE.products && SITE.products[id]) || null; }

  // What the main button says for a product, based on its status.
  function ctaLabel(p) {
    if (!p) return "Get in touch";
    if (p.status === "open" && typeof p.seatsLeft === "number" && p.seatsLeft <= 0) return "Sold out · join the waitlist";
    switch (p.status) {
      case "open": return p.paymentUrl ? (p.price ? "Book now · " + p.price : "Book now") : "Join the list";
      case "preorder": return p.price ? "Pre-order · " + p.price : "Pre-order";
      case "soldout": return "Sold out · join the waitlist";
      default: return "Join the list for the next batch";
    }
  }

  function payUrl(p) {
    if (!p) return "";
    if (p.status === "open") return p.paymentUrl || "";
    if (p.status === "preorder") return p.preorderUrl || p.paymentUrl || "";
    return "";
  }

  function fieldValue(p, field) {
    if (!p) return "";
    if (field === "seats") {
      if (typeof p.seatsLeft !== "number" || p.status === "waitlist") return "";
      if (p.seatsLeft <= 0) return "Sold out";
      const unit = p === product("play-kit") ? (p.seatsLeft === 1 ? "kit" : "kits") : (p.seatsLeft === 1 ? "seat" : "seats");
      return "Only " + p.seatsLeft + " " + unit + " left";
    }
    if (field === "cta") return ctaLabel(p);
    return p[field] || "";
  }

  function fill(root) {
    root.querySelectorAll("[data-fw][data-product]").forEach(el => {
      const value = fieldValue(product(el.dataset.product), el.dataset.fw);
      if (value) el.textContent = value;
      if (el.hasAttribute("data-fw-hide-empty")) el.hidden = !value;
    });
    root.querySelectorAll("[data-fw-status]").forEach(el => {
      const [id, list] = el.dataset.fwStatus.split(":");
      const p = product(id);
      el.hidden = !p || !(list || "").split(",").map(s => s.trim()).includes(p.status);
    });
    root.querySelectorAll("[data-fw-needs]").forEach(el => {
      const list = SITE[el.dataset.fwNeeds];
      el.hidden = !Array.isArray(list) || list.length === 0;
    });
    root.querySelectorAll("[data-fw-testimonials]").forEach(el => {
      el.innerHTML = (SITE.testimonials || []).map(t =>
        '<figure class="fwl-quote"><blockquote>“' + esc(t.quote) + '”</blockquote>' +
        '<figcaption><strong>' + esc(t.name) + '</strong>' + (t.detail ? " · " + esc(t.detail) : "") + "</figcaption></figure>"
      ).join("");
    });
    root.querySelectorAll("[data-fw-stats]").forEach(el => {
      el.innerHTML = (SITE.stats || []).map(s =>
        '<div class="fwl-stat"><div class="fwl-stat-value">' + esc(s.value) + '</div><div class="fwl-stat-label">' + esc(s.label) + "</div></div>"
      ).join("");
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ── Lead form ────────────────────────────────────────── */

  const CSS = `
  [hidden]{display:none!important}
  .fwl-backdrop,.fwl-backdrop *{box-sizing:border-box}
  .fwl-backdrop{position:fixed;inset:0;z-index:1000;background:rgba(45,52,54,.55);display:flex;align-items:flex-end;justify-content:center;padding:0;font-family:'DM Sans',sans-serif}
  @media(min-width:560px){.fwl-backdrop{align-items:center;padding:16px}}
  .fwl-box{background:#FFFDF0;width:100%;max-width:440px;max-height:92vh;overflow:auto;border-radius:20px 20px 0 0;padding:24px 20px 20px;color:#2D3436;box-shadow:0 20px 60px rgba(0,0,0,.25)}
  @media(min-width:560px){.fwl-box{border-radius:20px;padding:28px}}
  .fwl-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px}
  .fwl-kicker{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#E8A838}
  .fwl-title{font-size:22px;font-weight:800;line-height:1.2;margin-top:2px}
  .fwl-sub{font-size:14px;color:#4A4A4A;margin:6px 0 16px;line-height:1.5}
  .fwl-close{background:none;border:none;font-size:26px;line-height:1;cursor:pointer;color:#7A7A72;padding:2px 6px}
  .fwl-field{display:block;margin-bottom:12px}
  .fwl-field span{display:block;font-size:13px;font-weight:700;margin-bottom:5px}
  .fwl-field small{font-weight:500;color:#7A7A72}
  .fwl-field input,.fwl-field select{width:100%;font:inherit;font-size:16px;padding:11px 12px;border:1.5px solid #e0dccf;border-radius:10px;background:#fff;color:#2D3436}
  .fwl-field input:focus,.fwl-field select:focus{outline:none;border-color:#2A96C0}
  .fwl-err{color:#B54708;font-size:13px;font-weight:600;min-height:18px;margin-bottom:8px}
  .fwl-btn{display:flex;width:100%;align-items:center;justify-content:center;gap:8px;padding:14px 20px;border-radius:50px;border:none;cursor:pointer;font:inherit;font-size:16px;font-weight:800;background:#E8A838;color:#2D3436;text-decoration:none}
  .fwl-btn[disabled]{opacity:.6;cursor:wait}
  .fwl-btn-wa{background:#25D366;color:#fff;margin-top:12px}
  .fwl-note{font-size:12px;color:#7A7A72;text-align:center;margin-top:10px}
  .fwl-quote{background:#fff;border:1px solid #e8e4dc;border-radius:16px;padding:20px;margin:0}
  .fwl-quote blockquote{font-size:15px;line-height:1.6;color:#2D3436;margin:0 0 10px}
  .fwl-quote figcaption{font-size:13px;color:#7A7A72}
  .fwl-stat{text-align:center}
  .fwl-stat-value{font-size:32px;font-weight:800;color:#2D3436}
  .fwl-stat-label{font-size:13px;font-weight:600;color:#7A7A72}
  `;

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function remembered() {
    try { return JSON.parse(localStorage.getItem("fw_lead") || "{}"); } catch (e) { return {}; }
  }

  function send(data) {
    if (!SITE.leadEndpoint) {
      console.warn("Fidgital World: leadEndpoint is empty in js/site-config.js, so this lead was not saved.");
      return Promise.resolve();
    }
    // text/plain keeps this a "simple" request, which Google Apps Script accepts without CORS setup.
    const req = fetch(SITE.leadEndpoint, {
      method: "POST", mode: "no-cors", keepalive: true,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    }).catch(() => {});
    // Never keep a parent waiting on the sheet: move on after 2.5 s either way.
    return Promise.race([req, new Promise(r => setTimeout(r, 2500))]);
  }

  function openLeadForm(productId, source) {
    const p = product(productId) || { name: "Fidgital World", status: "waitlist" };
    const url = payUrl(p);
    const goingToPay = !!url;
    const soldOut = p.status === "soldout" || (typeof p.seatsLeft === "number" && p.seatsLeft <= 0 && p.status === "open");
    const last = remembered();

    const title = goingToPay && !soldOut ? (p.status === "preorder" ? "Pre-order " + p.name : "Book " + p.name) : "Get notified: " + p.name;
    const sub = goingToPay && !soldOut
      ? "Tell us who's joining. Next you'll go to the secure Razorpay page to pay, then we'll welcome you on WhatsApp."
      : "We'll message you on WhatsApp as soon as the next batch opens. No spam.";
    const ages = Array.from({ length: 11 }, (_, i) => i + 6)
      .map(a => `<option value="${a}"${String(last.childAge) === String(a) ? " selected" : ""}>${a}</option>`).join("");

    const backdrop = el(`
      <div class="fwl-backdrop" role="dialog" aria-modal="true" aria-labelledby="fwl-title">
        <form class="fwl-box" novalidate>
          <div class="fwl-head">
            <div>
              <div class="fwl-kicker">${esc(p.nextBatch || (goingToPay ? "Almost there" : "Free to join"))}</div>
              <div class="fwl-title" id="fwl-title">${esc(title)}</div>
            </div>
            <button type="button" class="fwl-close" aria-label="Close">×</button>
          </div>
          <p class="fwl-sub">${esc(sub)}</p>
          <label class="fwl-field"><span>Parent's name</span>
            <input name="parentName" autocomplete="name" required value="${esc(last.parentName)}"></label>
          <label class="fwl-field"><span>WhatsApp number</span>
            <input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="98765 43210" required value="${esc(last.phone)}"></label>
          <label class="fwl-field"><span>Email <small>(optional)</small></span>
            <input name="email" type="email" autocomplete="email" value="${esc(last.email)}"></label>
          <label class="fwl-field"><span>Child's age</span>
            <select name="childAge" required><option value="">Choose</option>${ages}</select></label>
          <div class="fwl-err" aria-live="polite"></div>
          <button type="submit" class="fwl-btn">${goingToPay && !soldOut ? "Continue to payment →" : "Notify me"}</button>
          <p class="fwl-note">${goingToPay && !soldOut ? "🔒 Payments are handled by Razorpay." : "We only use this to tell you about Fidgital World."}</p>
        </form>
      </div>`);

    const form = backdrop.querySelector("form");
    const err = backdrop.querySelector(".fwl-err");
    const prevFocus = document.activeElement;

    function close() {
      backdrop.remove();
      document.removeEventListener("keydown", onKey);
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    }
    function onKey(e) { if (e.key === "Escape") close(); }

    backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });
    backdrop.querySelector(".fwl-close").addEventListener("click", close);
    document.addEventListener("keydown", onKey);

    form.addEventListener("submit", e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(form).entries());
      const digits = (f.phone || "").replace(/\D/g, "");
      if (!f.parentName.trim()) { err.textContent = "Please add your name."; return; }
      if (digits.length < 10 || digits.length > 13) { err.textContent = "Please check the WhatsApp number (10 digits)."; return; }
      if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { err.textContent = "That email doesn't look right. You can also leave it empty."; return; }
      if (!f.childAge) { err.textContent = "Please choose your child's age."; return; }
      err.textContent = "";

      const lead = {
        parentName: f.parentName.trim(), phone: f.phone.trim(), email: (f.email || "").trim(), childAge: f.childAge,
        product: productId, intent: goingToPay && !soldOut ? (p.status === "preorder" ? "preorder" : "buy") : "waitlist",
        source: source || "", page: location.pathname, referrer: document.referrer || "",
        submittedAt: new Date().toISOString(), ...utm()
      };
      try { localStorage.setItem("fw_lead", JSON.stringify({ parentName: lead.parentName, phone: lead.phone, email: lead.email, childAge: lead.childAge })); } catch (x) {}

      const btn = form.querySelector(".fwl-btn");
      btn.disabled = true;
      btn.textContent = "Saving…";
      track("generate_lead", { product: productId, intent: lead.intent, source: lead.source });

      send(lead).then(() => {
        if (lead.intent !== "waitlist") {
          track("begin_checkout", { product: productId });
          location.href = url;
          return;
        }
        form.innerHTML = `
          <div class="fwl-head"><div><div class="fwl-kicker">You're on the list</div>
          <div class="fwl-title" id="fwl-title">Thank you, ${esc(lead.parentName.split(" ")[0])}!</div></div>
          <button type="button" class="fwl-close" aria-label="Close">×</button></div>
          <p class="fwl-sub">We'll message you on WhatsApp when ${esc(p.name)} opens.${SITE.whatsappUrl ? " Want to ask something now? Say hi:" : ""}</p>
          ${SITE.whatsappUrl ? `<a class="fwl-btn fwl-btn-wa" href="${esc(SITE.whatsappUrl)}" target="_blank" rel="noopener">Chat on WhatsApp</a>` : ""}`;
        form.querySelector(".fwl-close").addEventListener("click", close);
        const wa = form.querySelector(".fwl-btn-wa");
        if (wa) wa.addEventListener("click", () => track("whatsapp_click", { product: productId }));
      });
    });

    document.body.appendChild(backdrop);
    track("lead_form_open", { product: productId, source: source || "" });
    const first = form.querySelector("input");
    if (first) first.focus();
  }

  /* ── Wire up ──────────────────────────────────────────── */

  function init() {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    fill(document);

    document.addEventListener("click", e => {
      const trigger = e.target.closest("[data-lead]");
      if (!trigger) return;
      e.preventDefault();
      openLeadForm(trigger.dataset.lead, trigger.dataset.source);
    });
  }

  FW.site = { config: SITE, product, ctaLabel, track, openLeadForm, fill };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
