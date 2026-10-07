"use strict";
// Decorative motion only: no experiment, task, or trajectory data is synthesized.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.querySelector(".horizon-canvas");
  const ctx = canvas.getContext("2d");
  let width = 0, height = 0, frame = 0, last = 0, elapsed = 3.5;
  let visible = false, pointer = 0, targetPointer = 0;

  function draw(t) {
    if (!width || !height) return;
    HorizonLine.scene(ctx, width, height, t, pointer);
  }

  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    if (now - last >= 15) {
      elapsed += Math.min((now - last) / 1000, .06);
      last = now;
      pointer += (targetPointer - pointer) * .035;
      draw(elapsed);
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (reduced.matches) draw(3.5);
    else if (visible && !document.hidden) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(elapsed || 3.5);
  }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, {threshold: .05}).observe(canvas);
  document.querySelector(".hero").addEventListener("pointermove", e => {
    targetPointer = (e.clientX / Math.max(innerWidth, 1) - .5) * 2;
  }, {passive: true});
  document.querySelector(".hero").addEventListener("pointerleave", () => { targetPointer = 0; });
  reduced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);

  // A guided taxonomy tour. The five families are categories, not a time axis.
  const overview = document.querySelector(".pattern-overview");
  const rows = [...document.querySelectorAll(".pattern-families > li")];
  const group = document.querySelector(".pattern-orbit-arcs");
  const NS = "http://www.w3.org/2000/svg";
  const traces = [], signals = [];
  const polar = degrees => {
    const a = degrees * Math.PI / 180;
    return [584 + 506 * Math.cos(a), 508 + 506 * Math.sin(a)];
  };
  rows.forEach((row, i) => {
    const start = polar(-88 + 72 * i), end = polar(-20 + 72 * i);
    const d = `M ${start.join(" ")} A 506 506 0 0 1 ${end.join(" ")}`;
    for (const kind of ["orbit-guide", "orbit-trace"]) {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("pathLength", "100");
      path.setAttribute("class", kind);
      path.setAttribute("data-family", String(i));
      group.append(path);
      if (kind === "orbit-trace") traces.push(path);
    }
    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("cx", end[0]);
    dot.setAttribute("cy", end[1]);
    dot.setAttribute("r", "4.5");
    dot.setAttribute("class", "orbit-signal");
    dot.setAttribute("data-family", String(i));
    group.append(dot);
    signals.push(dot);
  });
  let current = 0, timer = 0, tourVisible = false, hover = false, focus = false;
  function select(i) {
    current = i;
    rows.forEach((row, j) => {
      const expanded = reduced.matches || i === j;
      row.classList.toggle("is-lit", i === j);
      row.querySelector("button").setAttribute("aria-expanded", String(expanded));
      row.querySelector(".family-reveal").inert = !expanded;
    });
    traces.forEach((trace, j) => trace.classList.toggle("is-lit", i === j));
    signals.forEach((signal, j) => signal.classList.toggle("is-lit", i === j));
  }
  function tourSync() {
    clearInterval(timer);
    if (tourVisible && !document.hidden && !reduced.matches && !hover && !focus) {
      if (current < 0) select(0);
      timer = setInterval(() => select((current + 1) % rows.length), 7600);
    }
  }
  let lastFamilyPointer = null;
  rows.forEach((row, i) => {
    // A header moving under a stationary pointer must not select another family.
    // Animate the list text, not panel height; only real pointer movement selects.
    row.querySelector("button").addEventListener("pointermove", e => {
      if (e.pointerType === "touch") return;
      if (lastFamilyPointer?.x === e.clientX && lastFamilyPointer?.y === e.clientY) return;
      lastFamilyPointer = { x:e.clientX, y:e.clientY };
      if (current !== i) select(i);
    });
    row.querySelector("button").addEventListener("click", () => { select(i); tourSync(); });
    row.querySelector("button").addEventListener("focus", () => { focus = true; select(i); tourSync(); });
  });
  // Hold the entire panel steady while reading; expansion must not chase the pointer.
  const familyList = document.querySelector(".pattern-families");
  // Reserve all five headers plus the tallest list, including wrapped names.
  // The outer grid height stays invariant throughout interrupted/rapid switches.
  const familyItems = [...familyList.querySelectorAll(".family-items")];
  function sizeFamilies() {
    const size = Math.max(202, ...familyItems.map(list => list.scrollHeight)) + 12;
    const headers = rows.reduce((sum, row) => {
      const style = getComputedStyle(row);
      return sum + row.querySelector("h3").getBoundingClientRect().height
        + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    }, 0);
    for (const [name, value] of [["--family-space", `${size}px`], ["--family-total", `${Math.ceil(headers + size)}px`]]) {
      if (familyList.style.getPropertyValue(name) !== value) familyList.style.setProperty(name, value);
    }
  }
  const familySizer = new ResizeObserver(sizeFamilies);
  familyItems.forEach(list => familySizer.observe(list));
  rows.forEach(row => familySizer.observe(row.querySelector("h3")));
  sizeFamilies();
  familyList.addEventListener("pointerenter", () => { hover = true; tourSync(); });
  familyList.addEventListener("pointerleave", () => { hover = false; lastFamilyPointer = null; tourSync(); });
  familyList.addEventListener("focusout", e => {
    focus = familyList.contains(e.relatedTarget);
    tourSync();
  });
  select(0);
  new IntersectionObserver(([entry]) => { tourVisible = entry.isIntersecting; tourSync(); }, {threshold: .25}).observe(overview);
  reduced.addEventListener("change", () => { select(current); tourSync(); });
  document.addEventListener("visibilitychange", tourSync);
})();
