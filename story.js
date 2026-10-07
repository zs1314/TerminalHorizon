"use strict";
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  // Condensed observable actions from the reviewed annotation reports.
  // The highlight tour is editorial pacing, never a recorded-time replay.
  const patternCases = [
    {
      id: "neutron", label: "Adaptive experiments",
      title: "Adaptive neutron-scattering experiments",
      lead: "Locate a magnetic transition, then test whether warming and cooling follow the same response.",
      top: 1092, height: 635,
      outcome: "13 runs linked to the submitted fit. Campaign closed within the beam budget.",
      insight: "Earlier measurements determine the next temperature; changing the thermal path tests the competing explanation.",
      scope: "Synthetic instrument. The report establishes native acceptance, not an external evaluation score.",
      episodes: [
        {title:"Locate the transition", text:"Reduce the pilot measurements using the instrument calibration, then sample the region where the signal falls.", next:"Each measured signal narrows the next choice of temperature.", patterns:[0,1,2]},
        {title:"Change the thermal path", text:"Switch from warming to cooling and collect nearby-temperature measurements to test the path dependence.", next:"Different responses under warming and cooling become evidence for the model comparison.", patterns:[0,6,20,26]},
        {title:"Compare explanations", text:"Fit continuous and hysteretic models to all 13 runs. The lower BIC supports the hysteretic model.", next:"The selected model and the measured run identities form the submitted inference.", patterns:[2,3,12]},
        {title:"Commit and verify", text:"Submit the fit and transition interval, close the campaign, and confirm its final native state.", next:"The campaign is closed with the fit recorded and the beam budget respected.", patterns:[16,17,21]}
      ]
    },
    {
      id: "care", label: "Rolling care coverage",
      title: "Care coverage under changing conditions",
      lead: "Keep a six-band coverage plan valid as staff leave and resident needs change.",
      top: 1890, height: 635,
      outcome: "All six bands committed, with the event updates active and the final validation passing.",
      insight: "A failed load check sends the agent back to earlier assignments before the next plan can be accepted.",
      scope: "Observed in a synthetic care environment; no real-world care outcome is claimed.",
      episodes: [
        {title:"Establish coverage", text:"Read staff skills, resident needs, and coverage rules. Fill the missing assignments and validate the first band.", next:"A committed band allows the environment to advance and release the next event.", patterns:[1,2,12]},
        {title:"Respond to change", text:"Transfers, new needs, admissions, and staff departure require new owners, handoffs, and task assignments.", next:"Earlier commitments and remaining staff availability constrain the next plan.", patterns:[20,24,26]},
        {title:"Repair the final plan", text:"The last band fails with two overloaded panels and a missing task. Check the loads, reassign residents, and revalidate.", next:"A separate SQL calculation confirms the loads before the targeted corrections pass validation.", patterns:[5,10,18]},
        {title:"Confirm delivery", text:"Commit the final band and check that all six bands are committed and all six events remain active.", next:"Native status confirms the complete six-band operational schedule.", patterns:[16,20,21]}
      ]
    },
    {
      id: "tls", label: "End-to-end TLS repair",
      title: "End-to-end TLS service repair",
      lead: "Recover the entire client–gateway–backend chain, not just the first successful connection.",
      top: 285, height: 635,
      outcome: "Response bodies delivered. Invalid clients rejected.",
      insight: "Each successful repair exposes the next missing link, moving the investigation from routing to identity to delivery.",
      scope: "Final local regression covers the displayed paths, not every TLS requirement.",
      episodes: [
        {title:"Repair the retry path", text:"Direct handshakes pass, but retries fail. Reapply the selected route profile and repeat the same test.", next:"The retry succeeds, exposing a separate upstream client-identity problem.", patterns:[8,10,13]},
        {title:"Establish identity", text:"The backend reports a missing client certificate. Load the gateway’s client certificate and matching key.", next:"Authentication succeeds, yet the downstream response body is still missing.", patterns:[1,2,24]},
        {title:"Trace the response", text:"The gateway logs 84 bytes while the client receives no body. Read the downstream request before closing.", next:"Conflicting observations redirect the investigation from handshakes to application-data delivery.", patterns:[2,9,22]},
        {title:"Recheck the chain", text:"Rebuild and test direct and retry routes, protected response bodies, and rejection of invalid clients.", next:"The covered API and metrics paths deliver their bodies; invalid clients are rejected.", patterns:[16,17,20]}
      ]
    }
  ].sort((a,b) => ["tls","neutron","care"].indexOf(a.id)-["tls","neutron","care"].indexOf(b.id));
  $("#pattern-families").innerHTML = SITE_DATA.patterns.map((family, i) =>
    `<li class="family-group ${i === 0 ? "is-lit" : ""}">
      <h3><button class="family-trigger" aria-expanded="${i === 0}" aria-controls="family-items-${i}"><span>${family.name}</span><span>${family.items.length} patterns</span></button></h3>
      <div class="family-reveal" id="family-items-${i}" ${i ? "inert" : ""}><ul class="family-items">
        ${family.items.map((item,j) => `<li style="--item-delay:${j * 85}ms"><span>${esc(item)}</span></li>`).join("")}
      </ul></div>
    </li>`
  ).join("");
  const caseTabs = $("#behavior-cases");
  caseTabs.insertAdjacentHTML("beforebegin", '<h3 class="case-section-title">Behavioral patterns in practice</h3>');
  caseTabs.innerHTML = patternCases.map((c,i) => `<button role="tab" id="pattern-case-${c.id}" aria-controls="behavior-case-content" data-pattern-case="${i}" aria-selected="${!i}" tabindex="${i ? -1 : 0}">${c.label}</button>`).join("");
  const patternNames = SITE_DATA.patterns.flatMap(f => f.items);
  let disposeCase = () => {};
  function showPatternCase(i) {
    disposeCase();
    const c = patternCases[i];
    caseTabs.querySelectorAll("button").forEach((b,j) => {
      b.setAttribute("aria-selected", String(i === j));
      b.tabIndex = i === j ? 0 : -1;
    });
    const host = $("#behavior-case-content");
    host.setAttribute("aria-labelledby", "pattern-case-" + c.id);
    host.innerHTML = `<div class="paper-case-heading"><h3>${c.title}</h3><p>${c.lead}</p></div>
      <figure class="paper-case-figure figure-surface">
        <button class="paper-case-crop image-button" style="aspect-ratio:1800 / ${c.height}" data-figure="assets/appendix-pattern-organization.webp" aria-label="Enlarge the paper figure: ${esc(c.label)}">
          <img src="assets/appendix-pattern-organization.webp" width="1800" height="2534" style="transform:translateY(-${c.top/2534*100}%)" alt="${esc(c.title)}: five selected episodes and their linked exploration, diagnosis, construction, verification, and coordination patterns, reproduced from the paper." />
        </button>
      </figure>
      <div class="case-process">
        <ol class="case-steps" aria-label="Selected episodes in observed order">${c.episodes.map((e,j) => `<li><button data-episode="${j}" aria-pressed="${!j}"><span>0${j+1}</span><strong>${esc(e.title)}</strong></button><p>${esc(e.text)}</p></li>`).join("")}</ol>
        <div class="case-active" aria-live="off"><div><span class="case-active-label">What this makes possible</span><p id="case-next"></p></div><div class="case-patterns" id="case-patterns"></div></div>
      </div>
      <div class="case-result"><p><b>Observed outcome.</b> ${c.outcome}</p><p class="case-scope">${c.scope}</p></div>`;
    let episode = 0, inView = false, held = false, keyboardHeld = false, timer = 0;
    const steps = [...host.querySelectorAll(".case-steps li")];
    function highlight(j) {
      episode = j;
      steps.forEach((el,k) => {
        el.classList.toggle("is-current",j===k);
        el.querySelector("button").setAttribute("aria-pressed",String(j===k));
      });
      $("#case-next").textContent = c.episodes[j].next;
      $("#case-patterns").innerHTML = '<b class="case-active-label">Connected behavioral patterns</b>' + c.episodes[j].patterns.map(p => `<span>${esc(patternNames[p])}</span>`).join("");
    }
    function syncCase() {
      clearInterval(timer);
      if(inView && !document.hidden && !reduced.matches && !held && !keyboardHeld) timer = setInterval(() => highlight((episode+1)%steps.length),7200);
    }
    steps.forEach((el,j) => el.querySelector("button").addEventListener("click",() => { highlight(j);syncCase(); }));
    const hold = () => {held=true;syncCase();}, release = () => {held=false;syncCase();};
    const focusCase = () => {keyboardHeld=true;syncCase();};
    const blurCase = e => {keyboardHeld=host.contains(e.relatedTarget);syncCase();};
    host.addEventListener("pointerenter",hold);host.addEventListener("pointerleave",release);
    host.addEventListener("focusin",focusCase);host.addEventListener("focusout",blurCase);
    const caseObserver = new IntersectionObserver(([e]) => {inView=e.isIntersecting;syncCase();},{threshold:.3});
    caseObserver.observe(host);
    document.addEventListener("visibilitychange",syncCase);reduced.addEventListener("change",syncCase);
    highlight(0);
    disposeCase = () => {
      clearInterval(timer);caseObserver.disconnect();
      document.removeEventListener("visibilitychange",syncCase);reduced.removeEventListener("change",syncCase);
      host.removeEventListener("pointerenter",hold);host.removeEventListener("pointerleave",release);
      host.removeEventListener("focusin",focusCase);host.removeEventListener("focusout",blurCase);
    };
    host.classList.remove("case-enter");
    void host.offsetWidth;
    host.classList.add("case-enter");
  }
  caseTabs.addEventListener("click", e => {
    const b = e.target.closest("[data-pattern-case]");
    if (b) showPatternCase(Number(b.dataset.patternCase));
  });
  showPatternCase(0);

  // The hierarchy is literal annotation data, not a generated categorization.
  const names = [
    "Software engineering",
    "Languages & compilers",
    "Operating systems",
    "Cloud infrastructure",
    "Networking",
    "Databases & storage",
    "Data engineering",
    "Machine learning & AI",
    "Security & privacy",
    "Chips & electronics",
    "Robotics & autonomy",
    "Math & formal methods",
    "Mechanical & aerospace",
    "Earth & environment",
    "Life sciences & health",
    "Chemistry & materials",
    "Physics & astronomy",
    "Graphics & media",
    "Finance & accounting",
    "Transport & logistics",
    "Manufacturing",
    "Energy & infrastructure",
    "Knowledge & public affairs",
    "Agriculture & fisheries",
    "Education & assessment",
  ];
  const editorialOrder = [
    "education",
    "agriculture",
    "life_health",
    "operations",
    "knowledge",
    "engineering",
    "energy",
    "industry",
    "robotics",
    "hardware",
    "finance",
    "physics",
    "chemistry",
    "earth",
    "math",
    "software",
    "languages",
    "systems",
    "cloud",
    "networks",
    "databases",
    "data",
    "ml",
    "security",
    "media",
  ];
  let selectedDomain = "education";
  const domainButtons = editorialOrder.map((id) => {
      const i = STORY_DATA.domains.findIndex((d) => d.id === id),
        d = STORY_DATA.domains[i];
      return `<button class="domain-card" data-domain="${d.id}" aria-pressed="${d.id === selectedDomain}" aria-controls="subdomain-content" title="${d.count} tasks · ${d.children.length} subdomains"><strong>${esc(names[i])}</strong></button>`;
    });
  $("#domain-grid").innerHTML = Array.from({length:5}, (_,i) =>
    `<div class="domain-row">${domainButtons.slice(i*5,i*5+5).join("")}</div>`).join("");
  const subdomainItems = children => children.map((c,i) =>
    `<li style="--domain-delay:${Math.min(Math.floor(i/2),7)*35}ms" title="${c.count} ${c.count === 1 ? "task" : "tasks"}"><span>${esc(c.name)}${c.parent ? `<small>${esc(c.parent)}</small>` : ""}</span></li>`).join("");
  function animateDomain() {
    const content = $("#subdomain-content");
    content.classList.remove("domain-enter");
    void content.offsetWidth;
    content.classList.add("domain-enter");
  }
  function showDomain(id) {
    selectedDomain = id;
    document
      .querySelectorAll("[data-domain]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.domain === id)),
      );
    const d = STORY_DATA.domains.find((d) => d.id === id);
    $("#subdomain-content").innerHTML =
      `<div class="subdomain-heading"><h3>${esc(names[STORY_DATA.domains.indexOf(d)])}</h3><div class="subdomain-counts"><span><b>${d.children.length}</b>subdomains</span><span><b>${d.count}</b>tasks</span></div></div><div class="subdomain-results"><ul class="subdomain-list">${subdomainItems(d.children)}</ul></div>`;
    animateDomain();
  }
  $("#domain-grid").addEventListener("click", (e) => {
    let b = e.target.closest("[data-domain]");
    if (b) {
      $("#taxonomy-search").value = "";
      showDomain(b.dataset.domain);
    }
  });
  $("#taxonomy-search").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return showDomain(selectedDomain);
    document.querySelectorAll('[data-domain]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    const matches = STORY_DATA.domains.flatMap((d) =>
      d.children
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            d.name.toLowerCase().includes(q) ||
            names[STORY_DATA.domains.indexOf(d)].toLowerCase().includes(q),
        )
        .map((c) => ({ ...c, parent: names[STORY_DATA.domains.indexOf(d)] })),
    );
    $("#subdomain-content").innerHTML =
      `<div class="subdomain-heading"><h3>Search results</h3><div class="subdomain-counts"><span><b>${matches.length}</b>matching subdomains</span></div></div><div class="subdomain-results"><ul class="subdomain-list search-results">${subdomainItems(matches)}</ul>${matches.length ? "" : '<p class="subdomain-empty">No matching subdomains. Try a broader term.</p>'}</div>`;
    // Keep typing stable; the entrance sequence is only for deliberate domain switches.
    $("#subdomain-content").classList.remove("domain-enter");
  });
  showDomain(selectedDomain);

  // Recorded measurements and selected methods, rather than generated demos.
  const modelNames = { baseline: "Qwen3.5-27B", ours: "TerminalHorizon-27B" };
  const colors = { baseline: "#83a3c0", ours: "#19a8bc" };
  const evaluationNotes = "One run per model per case. Hidden scores are normalized rewards ×100, not task success rates. Agents did not receive hidden evaluation feedback during research.";
  const hour = (t) =>
    t < 1 ? `${(t * 60).toFixed(1)} min` : `${Math.min(t, 12).toFixed(2)} h`;
  const fmt = (v, c) =>
    v == null
      ? "—"
      : c.id === "tidal"
        ? v.toFixed(6)
        : c.id === "2048"
          ? v.toLocaleString("en-US", { maximumFractionDigits: 1 })
          : v.toFixed(2);
  let cleanup = () => {};
  const instructionStates = new Map();
  $("#research-tabs").innerHTML = STORY_DATA.research
    .map(
      (c, i) =>
        `<button role="tab" id="research-${i}" data-research="${i}" aria-controls="research-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><strong>${c.title}</strong></button>`,
    )
    .join("");

  function finalRobot(c) {
    const max =
      Math.max(...c.hidden.flatMap((d) => [d.base, d.ours]), 1) * 1.06;
    const x = (v) => 60 + (v / max) * 460,
      y = (v) => 360 - (v / max) * 310;
    return `<div class="native-outcomes robot-outcomes"><div><h4>Best trial versus final submission</h4><div class="submission-compare"><div><span>Base · Best → Submitted</span><strong>286.05 → 466.35</strong></div><div><span>Ours · Best → Submitted</span><strong>281.11 → 281.11</strong></div></div><p class="source-note">Mean public button cost, lower is better. The paired plot includes all 200 hidden instances. Missing raw scores are mapped to zero by the original grader and marked ×.</p></div><div><h4>200 hidden instances, paired</h4><svg viewBox="0 0 590 410" role="img" aria-label="Paired hidden relative scores: ours is higher on 197 instances, base on one, and two tie at zero.">${[
      0, 0.25, 0.5, 0.75, 1,
    ]
      .filter((v) => v <= max)
      .map(
        (v) =>
          `<path d="M60 ${y(v)}H520 M${x(v)} 50V360" fill="none" stroke="#e4edf3"/><text x="48" y="${y(v) + 4}" text-anchor="end">${v}</text><text x="${x(v)}" y="380" text-anchor="middle">${v}</text>`,
      )
      .join(
        "",
      )}<path d="M60 360L520 50" stroke="#aabcca" stroke-dasharray="5 5"/>${c.hidden.map((d) => (d.missing ? `<path d="M${x(d.base) - 4} ${y(d.ours) - 4}l8 8m-8 0l8 -8" stroke="#6f8b9f"><title>${d.id}: base ${d.base.toFixed(3)}, ours ${d.ours.toFixed(3)}. Missing raw score mapped to zero.</title></path>` : `<circle cx="${x(d.base)}" cy="${y(d.ours)}" r="3.5" fill="#19a8bc" opacity=".7"><title>${d.id}: base ${d.base.toFixed(3)}, ours ${d.ours.toFixed(3)}</title></circle>`)).join("")}<text x="290" y="404" text-anchor="middle">Qwen3.5-27B · Relative score</text><text x="16" y="208" transform="rotate(-90 16 208)" text-anchor="middle">TerminalHorizon-27B · Relative score</text></svg><p class="source-note">Relative score = reference length / submitted method’s cost. Above the diagonal favors ours.</p></div></div>`;
  }
  function finalGames(c) {
    return `<div class="native-outcomes games-outcomes"><div><h4>Maximum tiles on 16 hidden games</h4><p>Ours reaches a tile of at least 2048 in 13 of 16 games, including five 4096s. The base model reaches 2048 in nine games, with no 4096s.</p><p class="source-note">Each cell shows one game’s largest tile and final score. Hover for the seed.</p></div>${["base", "ours"].map((m) => `<div><h4>${m === "base" ? modelNames.baseline : modelNames.ours}</h4><div class="game-tile-grid">${c.hidden.map((g, i) => `<div tabindex="0" class="game-tile tile-${g[m + "Tile"]}" title="Seed ${g.seed} · game score ${g[m].toLocaleString("en-US")}"><span>${String(i + 1).padStart(2, "0")}</span><strong>${g[m + "Tile"]}</strong><small>${g[m].toLocaleString("en-US")} pts</small></div>`).join("")}</div></div>`).join("")}</div>`;
  }

  function mountResearch(index) {
    const previousInstruction = $("#research-panel .research-instruction");
    if (previousInstruction)
      instructionStates.set(previousInstruction.dataset.case, previousInstruction.open);
    cleanup();
    const c = STORY_DATA.research[index],
      panel = $("#research-panel");
    $("#research-tabs")
      .querySelectorAll("button")
      .forEach((b, i) => {
        b.setAttribute("aria-selected", String(i === index));
        b.tabIndex = i === index ? 0 : -1;
      });
    panel.setAttribute("aria-labelledby", "research-" + index);
    panel.innerHTML = `<div class="research-case-intro"><div><h3>${c.title}</h3><p>${c.subtitle}</p></div><span class="recorded-badge"><i></i> Recorded research</span></div><div class="research-timeline"><div class="timeline-top"><div><h4>Research progression</h4><p>${c.metric}</p></div><div class="model-legend"><span class="base-key">□ ${modelNames.baseline}</span><span class="ours-key">● ${modelNames.ours}</span></div></div><div class="timeline-layout"><div><div id="research-chart"></div><div class="replay-controls"><button id="research-play" class="play-research">Replay research</button><label for="research-scrub" class="sr-only">Research time in hours</label><input id="research-scrub" type="range" min="0" max="12" step="0.001" value="12"><output id="research-clock">12.00 h</output><select id="research-zoom" aria-label="Research time window"><option value="12">Full 12 hours</option><option value="1">First hour</option></select></div><p class="playback-note">Recorded time · event-paced replay. Lines: best so far. Hollow points: other trials. ×: invalid, unscored. Rings: submissions. Pale marks: later records.</p></div><div id="research-live" class="research-live"></div></div><p class="research-protocol">${c.protocol}</p></div><div class="research-reading"><p>${c.takeaway}</p><div class="reward-pair"><span>Final hidden reward ×100</span><strong><span>${c.models.baseline.reward.toFixed(2)}</span> <i>→</i> ${c.models.ours.reward.toFixed(2)}</strong></div></div><div class="milestone-columns">${Object.entries(
      c.models,
    )
      .map(
        ([m, d]) =>
          `<div class="milestone-column ${m}"><h4>${modelNames[m]}</h4><ol>${d.events.map((e, i) => `<li data-milestone="${m}-${i}"><time>${hour(e.t)}</time><div><strong>${esc(e.title)}</strong><p>${esc(e.detail)}</p></div></li>`).join("")}</ol></div>`,
      )
      .join(
        "",
      )}</div><div class="final-result-heading"><h4>${({pointcloud:"Final reconstructions",tidal:"Recovered tidal fields",robot:"Final routing results","2048":"Final game results"})[c.id]}</h4></div><div id="science-explorer" class="science-explorer"></div>`;
    // The original task specification is inert text, separate from the results.
    // Reuse the environment showcase disclosure and retain its state per case.
    const instruction = document.createElement("details");
    instruction.className = "environment-instruction research-instruction";
    instruction.dataset.case = c.id;
    instruction.open = instructionStates.get(c.id) ?? false;
    const summary = document.createElement("summary");
    summary.textContent = "Task instruction";
    summary.setAttribute("aria-label", `Task instruction: ${c.title}`);
    const taskText = document.createElement("pre");
    taskText.className = "environment-instruction-text";
    taskText.textContent = RESEARCH_TASK_INPUTS[c.id];
    taskText.tabIndex = 0;
    taskText.setAttribute("role", "region");
    taskText.setAttribute("aria-label", `Original task specification: ${c.title}`);
    instruction.append(summary, taskText);
    instruction.addEventListener("toggle", () => instructionStates.set(c.id, instruction.open));
    panel.querySelector(".research-timeline").before(instruction);
    // Keep recorded research and milestones first, followed by the final output.
    // The final hidden reward belongs with that output, not the research-time metric.
    panel.querySelector('.final-result-heading').append(panel.querySelector('.reward-pair'));
    let disposeView = () => {};
    if (c.id === "pointcloud")
      disposeView = window.Explorers.mountCloud($("#science-explorer"));
    else if (c.id === "tidal")
      disposeView = window.Explorers.mountTidal($("#science-explorer"));
    else
      $("#science-explorer").innerHTML =
        c.id === "robot" ? finalRobot(c) : finalGames(c);
    // Keep one provenance note, rather than repeating rendering and trial caveats.
    // Scores, scales, model labels, and interaction controls remain directly visible.
    const explorer = $("#science-explorer");
    let notes = explorer.querySelector(".science-details");
    if (!notes) {
      explorer.insertAdjacentHTML("beforeend", '<details class="science-details"><summary>Evaluation notes</summary></details>');
      notes = explorer.querySelector(".science-details");
    }
    notes.querySelector("summary").textContent = "Evaluation notes";
    notes.insertAdjacentHTML("beforeend", `<p>${esc(c.protocol)}</p><p>${evaluationNotes}</p>`);
    panel.querySelector(".research-protocol").remove();

    let time = 12,
      windowHours = 12,
      playing = false,
      frame = 0,
      previous = 0,
      lastPaint = 0,
      progress = 0,
      visible = false,
      started = false;
    const checkpoints = [
      ...new Set([
        0,
        ...Object.values(c.models).flatMap((d) => [
          ...d.events.map((e) => Math.min(12, e.t)),
          ...d.points
            .filter(
              (p, i, a) =>
                p.valid &&
                !a
                  .slice(0, i)
                  .some(
                    (q) =>
                      q.valid &&
                      (c.id === "robot" || c.id === "tidal"
                        ? q.value <= p.value
                        : q.value >= p.value),
                  ),
            )
            .map((p) => Math.min(12, p.t)),
          Math.min(12, d.end),
        ]),
        12,
      ]),
    ].sort((a, b) => a - b);
    function chart() {
      const width = 800,
        height = 440,
        l = 70,
        r = 773,
        top = 16,
        bottom = height - 47;
      const x = (t) => l + (Math.min(t, windowHours) / windowHours) * (r - l);
      const [low, high] = c.limits;
      const y = (v) =>
        bottom -
        (c.scale === "log"
          ? (Math.log(v) - Math.log(low)) / (Math.log(high) - Math.log(low))
          : (v - low) / (high - low)) *
          (bottom - top);
      const tickLabel = (v) => (v >= 1000 ? `${v / 1000}k` : v);
      let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${c.title}: recorded measurements and best-so-far curves. ${c.protocol}"><defs><clipPath id="research-plot-clip"><rect x="${l - 8}" y="8" width="${r - l + 16}" height="${bottom - top + 24}"/></clipPath></defs>`;
      c.ticks.forEach(
        (v) =>
          (svg += `<line x1="${l}" x2="${r}" y1="${y(v)}" y2="${y(v)}" stroke="#e5edf3"/><text x="${l - 14}" y="${y(v) + 4}" text-anchor="end">${tickLabel(v)}</text>`),
      );
      const ticks =
        windowHours === 12 ? [0, 3, 6, 9, 12] : [0, 0.25, 0.5, 0.75, 1];
      ticks.forEach(
        (t) =>
          (svg += `<text x="${x(t)}" y="${bottom + 23}" text-anchor="middle">${windowHours === 12 ? t + " h" : t * 60 + " min"}</text>`),
      );
      svg += `<g clip-path="url(#research-plot-clip)">`;
      Object.entries(c.models).forEach(([m, d]) => {
        const points = d.points.filter((p) => p.t <= windowHours && p.valid);
        function line(cut) {
          let ps = points.filter((p) => p.t <= cut),
            best = null,
            path = "";
          ps.forEach((p) => {
            let b =
              best === null
                ? p.value
                : c.id === "robot" || c.id === "tidal"
                  ? Math.min(best, p.value)
                  : Math.max(best, p.value);
            path += best === null ? `M${x(p.t)} ${y(b)}` : `H${x(p.t)}V${y(b)}`;
            best = b;
          });
          if (best !== null) path += `H${x(Math.min(cut, d.end, windowHours))}`;
          return path;
        }
        svg += `<path d="${line(12.001)}" fill="none" stroke="${colors[m]}" stroke-opacity=".17" stroke-width="2.5" ${m === "baseline" ? 'stroke-dasharray="6 4"' : ""}/><path d="${line(time)}" fill="none" stroke="${colors[m]}" stroke-width="2.6" ${m === "baseline" ? 'stroke-dasharray="6 4"' : ""}/>`;
        d.points
          .filter((p) => p.t <= windowHours)
          .forEach((p) => {
            const xx = x(p.t),
              yy = p.valid ? y(p.value) : bottom - 4,
              opacity = p.t <= time ? 1 : 0.2;
            const title = `${hour(p.t)} · ${modelNames[m]} · ${p.valid ? fmt(p.value, c) : "Invalid version; no score assigned"}`;
            if (!p.valid)
              svg += `<path d="M${xx - 4} ${yy - 4}l8 8m-8 0l8 -8" stroke="${colors[m]}" opacity="${opacity}"><title>${title}</title></path>`;
            else
              svg +=
                m === "baseline"
                  ? `<rect x="${xx - 3}" y="${yy - 3}" width="6" height="6" fill="white" stroke="${colors[m]}" opacity="${opacity}"><title>${title}</title></rect>`
                  : `<circle cx="${xx}" cy="${yy}" r="3.1" fill="white" stroke="${colors[m]}" opacity="${opacity}"><title>${title}</title></circle>`;
          });
        if (d.end <= windowHours + 0.001)
          svg += `<circle cx="${x(d.end)}" cy="${y(d.final)}" r="7" fill="white" stroke="${colors[m]}" stroke-width="2" opacity="${time >= Math.min(d.end, 12) ? 1 : 0.2}"><title>Submitted: ${fmt(d.final, c)}. Source-matched result, not a new measurement.</title></circle>`;
      });
      svg += `</g><line x1="${x(time)}" x2="${x(time)}" y1="10" y2="${bottom}" stroke="#50bace" stroke-dasharray="3 4"/><circle cx="${x(time)}" cy="10" r="4" fill="#28b0c5"/></svg>`;
      $("#research-chart").innerHTML = svg;
    }
    let lastLive = "";
    function update() {
      chart();
      $("#research-clock").textContent = hour(time);
      $("#research-scrub").value = time;
      $("#research-play").textContent = playing
        ? "Pause replay"
        : time >= windowHours
          ? "Replay research"
          : "Continue replay";
      const liveMarkup = Object.entries(c.models)
        .map(([m, d]) => {
          const seen = d.points.filter((p) => p.t <= time && p.valid),
            latest = seen[seen.length - 1];
          const best = seen.length
            ? c.id === "robot" || c.id === "tidal"
              ? Math.min(...seen.map((p) => p.value))
              : Math.max(...seen.map((p) => p.value))
            : null;
          let e = d.events.filter((e) => e.t <= time + 0.0001).slice(-1)[0];
          const ended = time >= Math.min(d.end, 12);
          return `<article class="live-model ${m}"><header><span>${modelNames[m]}</span><b>${ended ? "Submitted" : seen.length + " valid records"}</b></header><strong>${ended ? fmt(d.final, c) : fmt(best, c)}</strong><span class="live-metric">${ended ? "Submitted version" : c.id === "pointcloud" ? "Best snapshot in post-hoc replay" : "Best public measurement"}</span><h5>${esc(e?.title || "Before the first recorded measurement")}</h5><p>${esc(e?.detail || "Research time includes inspection, implementation, testing, and waiting. No intermediate score is inferred.")}</p>${latest && !ended ? `<small>Latest valid record: ${fmt(latest.value, c)} at ${hour(latest.t)}</small>` : ""}</article>`;
        })
        .join("");
      if(liveMarkup !== lastLive) {
        $("#research-live").innerHTML = liveMarkup;
        lastLive = liveMarkup;
      }
      panel.querySelectorAll("[data-milestone]").forEach((el) => {
        const [m, i] = el.dataset.milestone.split("-");
        el.classList.toggle(
          "milestone-seen",
          c.models[m].events[+i].t <= time + 0.001,
        );
        const events = c.models[m].events;
        el.classList.toggle("milestone-current", events[+i].t <= time + .001 && (!events[+i+1] || events[+i+1].t > time + .001));
      });
    }
    function tick(now) {
      if (!playing) return;
      if (!document.hidden && visible) {
        progress += (Math.min(now - previous, 100) / 1000) * 0.9;
        const i = Math.min(Math.floor(progress), checkpoints.length - 2),
          f = Math.min(1, progress - i);
        // Time between recorded events is compressed, never score-interpolated.
        time = checkpoints[i] + (checkpoints[i + 1] - checkpoints[i]) * f;
        if (time >= windowHours || progress >= checkpoints.length - 1) {
          time = windowHours;
          playing = false;
        }
        if(now-lastPaint > 90 || !playing) {
          update();
          lastPaint = now;
        }
      }
      previous = now;
      if (playing) frame = requestAnimationFrame(tick);
    }
    function play() {
      started = true;
      playing = !playing;
      if (playing) {
        if (time >= windowHours) time = 0;
        let i = Math.max(0, checkpoints.findIndex((v) => v > time) - 1);
        progress =
          i + (time - checkpoints[i]) / (checkpoints[i + 1] - checkpoints[i]);
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      } else cancelAnimationFrame(frame);
      update();
    }
    $("#research-play").addEventListener("click", play);
    // A manual seek takes priority over the first-visibility auto-play.
    ["pointerdown", "keydown"].forEach((type) =>
      $("#research-scrub").addEventListener(type, () => {
        started = true;
      }),
    );
    $("#research-scrub").addEventListener("input", (e) => {
      started = true;
      playing = false;
      cancelAnimationFrame(frame);
      time = +e.target.value;
      update();
    });
    $("#research-zoom").addEventListener("change", (e) => {
      started = true;
      windowHours = +e.target.value;
      playing = false;
      cancelAnimationFrame(frame);
      time = windowHours;
      $("#research-scrub").max = windowHours;
      update();
    });
    update();
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !started) {
          started = true;
          if (!reduced.matches) play();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe($(".research-timeline", panel));
    cleanup = () => {
      playing = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      disposeView();
    };
  }
  $("#research-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-research]");
    if (b) mountResearch(+b.dataset.research);
  });
  mountResearch(0);
})();
