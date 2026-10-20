// Light and dark: every page follows the Mac's setting until you press the theme button, then
// keeps your choice (in this browser only). The pictures of the app and the live app inside the
// pages switch with it. The <head> of each page sets the saved choice before anything is drawn.
(() => {
  const root = document.documentElement, KEY = "vp-theme";
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const saved = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const shown = () => saved() || (dark.matches ? "dark" : "light");

  function apply() {
    const t = shown();
    root.dataset.theme = t;
    // crops of the app come in both looks: img/plan-dark.webp and img/plan-light.webp
    document.querySelectorAll("img[src*='-dark.webp'], img[src*='-light.webp']").forEach((img) => {
      const src = img.getAttribute("src").replace(/-(dark|light)\.webp$/, `-${t}.webp`);
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    });
    document.querySelectorAll("iframe").forEach(frame);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t === "dark" ? "#0e0f11" : "#f7f6f3");
    document.querySelectorAll(".theme").forEach((b) => {
      b.setAttribute("aria-label", t === "dark" ? "Switch to the light theme" : "Switch to the dark theme");
      b.title = b.getAttribute("aria-label");
    });
  }
  // the live app (demo-app.html, same site) takes the page's look
  function frame(f) {
    try { const d = f.contentDocument; if (d && d.documentElement) d.documentElement.dataset.theme = shown(); } catch (e) { /* not ours */ }
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest(".theme"); if (!b) return;
    const next = shown() === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch (e2) { /* this visit only */ }
    root.dataset.theme = next;
    root.classList.add("theming"); setTimeout(() => root.classList.remove("theming"), 450);
    apply();
  });
  dark.addEventListener("change", () => { if (!saved()) apply(); });
  document.addEventListener("DOMContentLoaded", () => {
    apply();
    document.querySelectorAll("iframe").forEach((f) => f.addEventListener("load", () => frame(f)));
  });
  if (document.readyState !== "loading") apply();
})();

// Phones: VibePit is a Mac app, so a Download button on a phone sends the link to your Mac instead
// (the share sheet: AirDrop, Messages, Mail), or copies it. The buttons say so.
(() => {
  if (!matchMedia("(max-width: 860px) and (hover: none)").matches) return;
  const PAGE = "https://logesh883.github.io/vibepit-app/";
  const SHARE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5M5 12v9h14v-9"/></svg>';
  const css = document.createElement("style");
  css.textContent = ".vp-toast{position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:40;transform:translate(-50%,20px);opacity:0;padding:12px 16px;background:#1b1b1d;color:#f7f6f3;font:600 15px/1.4 Geist,-apple-system,sans-serif;transition:opacity .25s,transform .3s;pointer-events:none;width:max-content;max-width:calc(100vw - 40px);text-align:center}:root[data-theme=dark] .vp-toast{background:#ededee;color:#0e0f11}.vp-toast.on{opacity:1;transform:translate(-50%,0)}";
  document.head.append(css);
  let toast;
  const say = (t) => {
    if (!toast) { toast = document.createElement("div"); toast.className = "vp-toast"; toast.setAttribute("role", "status"); document.body.append(toast); }
    toast.textContent = t; toast.classList.add("on"); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove("on"), 2600);
  };
  const label = () => document.querySelectorAll("a.btn.dl, a.dl[data-phone]").forEach((a) => {
    const words = a.dataset.phone || (a.closest(".bar") ? "Get it" : "Send the link to my Mac");
    a.innerHTML = (a.closest(".bar") ? "" : SHARE) + words;
  });
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", label) : label();
  document.addEventListener("click", async (e) => {
    const a = e.target.closest("a.btn.dl, a.dl[data-phone]"); if (!a) return;
    e.preventDefault();
    const data = { title: "VibePit for Mac", text: "Download VibePit on your Mac: the pit wall for vibe coders.", url: PAGE };
    try { if (navigator.share) { await navigator.share(data); return; } } catch (err) { if (err && err.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(PAGE); say("Link copied. Open it on your Mac to download."); }
    catch (err) { say("Open " + PAGE.replace("https://", "") + " on your Mac."); }
  });
})();
