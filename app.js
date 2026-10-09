"use strict";
// Derive the current chapter from scroll position, rather than observer order.
// The hero clears the highlight; no navigation item is selected there.
const chapterLinks = [...document.querySelectorAll('.chapter-nav a[href^="#"]')];
const chapters = chapterLinks.map(link => ({link, section:document.querySelector(link.getAttribute('href'))})).filter(item => item.section);
let chapterFrame = 0;
function syncReadingPosition() {
  chapterFrame = 0;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty('--reading-progress',
    scrollRange > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollRange)) : 0);
  const readingLine = (document.querySelector('.site-header')?.getBoundingClientRect().height || 54) + 70;
  let active = null;
  for (const item of chapters) {
    if (item.section.getBoundingClientRect().top <= readingLine) active = item;
    else break;
  }
  for (const item of chapters) {
    if (item === active) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  }
}
function scheduleChapterPosition() {
  if (!chapterFrame) chapterFrame = requestAnimationFrame(syncReadingPosition);
}
window.addEventListener('scroll', scheduleChapterPosition, {passive:true});
window.addEventListener('resize', scheduleChapterPosition, {passive:true});
window.addEventListener('load', scheduleChapterPosition);
syncReadingPosition();

// One quiet retry for a transient asset failure; never replace research imagery.
function retryImage(img) {
  if (!(img instanceof HTMLImageElement) || !img.getAttribute('src') || img.dataset.retried) return;
  img.dataset.retried = 'true';
  const url = new URL(img.src, location.href);
  if (url.origin !== location.origin) return;
  url.searchParams.set('retry', '1');
  img.src = url.href;
}
document.addEventListener('error', event => retryImage(event.target), true);
document.querySelectorAll('img').forEach(img => {
  if (img.complete && img.currentSrc && !img.naturalWidth) retryImage(img);
});
const dialog = document.querySelector("#figure-dialog");
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-figure]");
  if (!trigger) return;
  dialog.querySelector('.dialog-title').textContent = trigger.dataset.caption ||
    trigger.closest('figure')?.querySelector('figcaption h3')?.textContent ||
    trigger.closest('#behavior-case-content')?.querySelector('.paper-case-heading h3')?.textContent ||
    'Research figure';
  const img = dialog.querySelector("img");
  img.src = trigger.dataset.figure;
  img.alt =
    trigger.dataset.alt ||
    trigger.querySelector("img")?.alt ||
    "Research figure";
  const media = dialog.querySelector('.dialog-media');
  const chart = trigger.closest('.web-chart, .trajectory-figure');
  dialog.classList.toggle('is-chart', Boolean(chart));
  const sourceImage = trigger.querySelector('img');
  dialog.style.setProperty('--figure-ratio', chart ? sourceImage.width / sourceImage.height : 1);
  const cropped = trigger.classList.contains('paper-case-crop');
  media.classList.toggle('is-cropped', cropped);
  media.style.aspectRatio = cropped ? trigger.style.aspectRatio : '';
  img.style.transform = cropped ? trigger.querySelector('img').style.transform : '';
  dialog.showModal();
});

const $ = (selector) => document.querySelector(selector);
const escapeHTML = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const animate = (el) => {
  el.classList.remove("fade-in");
  void el.offsetWidth;
  el.classList.add("fade-in");
};
const setTab = (list, selected) =>
  list.querySelectorAll("[role=tab]").forEach((button) => {
    const on = button === selected;
    button.setAttribute("aria-selected", String(on));
    button.tabIndex = on ? 0 : -1;
  });
document.addEventListener("keydown", (event) => {
  const current = event.target.closest("[role=tab]");
  if (
    !current ||
    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
  )
    return;
  const tabs = [
    ...current.closest("[role=tablist]").querySelectorAll("[role=tab]"),
  ];
  let index = tabs.indexOf(current);
  index =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
          tabs.length;
  event.preventDefault();
  tabs[index].focus();
  tabs[index].click();
});

// All benchmark groups remain visible; no tabs or hidden results.
$("#benchmark-content").innerHTML = '<table class="benchmark-table" aria-label="Results across 12 benchmarks"><thead><tr><th scope="col">Category</th><th scope="col">Benchmark</th><th scope="col">Base</th><th scope="col">Ours</th><th scope="col">Gain</th></tr></thead>' + Object.entries(SITE_DATA.benchmarks)
  .map(([key, rows]) => {
    const title = {coding: "Coding agents", agentic: "Real-world agentic tasks", reasoning: "General reasoning"}[key];
    return '<tbody class="benchmark-group" aria-label="' + title + '">' +
      rows.map(([name, base, ours, precision], i) =>
        '<tr>' + (i === 0 ? '<th scope="rowgroup" rowspan="' + rows.length + '" class="benchmark-category">' + title + '</th>' : '') + '<th scope="row">' + escapeHTML(name) + '</th><td>' +
        base.toFixed(precision) + '</td><td class="ours">' +
        ours.toFixed(precision) + '</td><td class="gain">+' +
        (ours - base).toFixed(precision) + '</td></tr>'
      ).join("") + '</tbody>';
  }).join("") + '</table>';

if ("IntersectionObserver" in window) {

  // One-time entrance motion never hides content or changes a plotted value.
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const arrivals = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add("arrived");
        arrivals.unobserve(entry.target);
      }
    }, {threshold: .12});
    document.querySelectorAll(".web-chart, .trajectory-layout, .taxonomy-figure, .method-figure, .task-feature, .task-brief")
      .forEach(el => arrivals.observe(el));
  }
}
