"use strict";

// Title, author order, and collection URL verified against manuscript (35).
// Replace the three collection URLs independently as repositories are released.
const PROJECT_META = {
  title: "Scaling Agentic Data for Long-Horizon Terminal Intelligence",
  authors: ["Shun Zou", "Ziyu Ma", "Yi Zou", "Yong Wang", "Lin Chen", "Zehui Chen", "Guanghua Chen", "Xiangxiang Chu", "Feng Zhao"],
  resources: {
    environments: "https://huggingface.co/collections/shunzou05/terminalhorizon",
    trajectories: "https://huggingface.co/collections/shunzou05/terminalhorizon",
    models: "https://huggingface.co/collections/shunzou05/terminalhorizon",
    paper: "",
  },
  citation: {key: "zou_terminalhorizon", year: "", eprint: "", archivePrefix: "", primaryClass: "", url: ""},
};

function buildBibTeX(meta = PROJECT_META) {
  const c = meta.citation;
  const fields = {
    title: meta.title,
    author: meta.authors.join(" and "),
    year: c.year,
    eprint: c.eprint,
    archivePrefix: c.archivePrefix || (c.eprint ? "arXiv" : ""),
    primaryClass: c.primaryClass,
    url: c.url || meta.resources.paper,
  };
  return `@misc{${c.key},\n${Object.entries(fields).map(([key, value]) => `  ${key} = {${value}}`).join(",\n")}\n}`;
}

if (typeof document !== "undefined") {
  for (const link of document.querySelectorAll("[data-resource]")) {
    const url = PROJECT_META.resources[link.dataset.resource];
    if (!url) continue;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.removeAttribute("aria-disabled");
    link.removeAttribute("tabindex");
    if (link.dataset.resource === "paper") {
      link.querySelector(".resource-soon")?.remove();
      link.title = "Read the paper on arXiv";
    }
  }
  const code = document.querySelector("#bibtex");
  const button = document.querySelector("#copy-citation");
  const status = document.querySelector("#citation-status");
  code.textContent = buildBibTeX();
  let copying = false, reset;
  button.addEventListener("click", async () => {
    if (copying) return;
    copying = true;
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = "Copied!";
      status.textContent = "BibTeX copied to clipboard.";
    } catch {
      const selection = getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Select & copy";
      status.textContent = "Clipboard access unavailable. BibTeX selected; press Command-C or Control-C to copy.";
    } finally {
      copying = false;
      reset = setTimeout(() => { button.textContent = "Copy BibTeX"; }, 3000);
    }
  });
}
if (typeof module !== "undefined") module.exports = {PROJECT_META, buildBibTeX};
