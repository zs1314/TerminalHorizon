/* Display-only explorers. No task code, solver, or external service is executed. */
(() => {
  "use strict";
  const D = EXPLORER_DATA;
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
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Environment previews live in showcase.js; this file owns RSI final-output viewers.

  const modelLabels = ["Qwen3.5-27B", "TerminalHorizon-27B", "Reference"];
  function canvasesHtml(kind) {
    return `<div class="science-views ${kind}">${modelLabels.map((label, i) => `<figure><figcaption><strong>${label}</strong><span data-metric="${i}"></span></figcaption><canvas data-view="${i}" tabindex="0" aria-label="${label} ${kind === "cloud" ? "point cloud. Drag or use arrow keys to rotate." : "tidal field."}"></canvas></figure>`).join("")}</div>`;
  }
  function viewContext(canvas) {
    const w = canvas.clientWidth,
      h = canvas.clientHeight,
      dpr = Math.min(devicePixelRatio || 1, 2);
    if (
      canvas.width !== Math.round(w * dpr) ||
      canvas.height !== Math.round(h * dpr)
    ) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx, w, h };
  }
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const color = (v, stops) => {
    v = Math.max(0, Math.min(1, v));
    const p = v * (stops.length - 1),
      i = Math.min(stops.length - 2, Math.floor(p));
    return `rgb(${mix(stops[i], stops[i + 1], p - i).join(",")})`;
  };
  const errorStops = [
    [38, 143, 179],
    [116, 196, 205],
    [227, 224, 179],
    [216, 137, 119],
  ];
  const errorRamp = "linear-gradient(90deg,#268fb3,#74c4cd,#e3e0b3,#d88977)";

  function mountCloud(host) {
host.innerHTML = `<div class="science-toolbar"><label>Scene <select id="cloud-scene" aria-label="Point-cloud scene">${D.clouds.map((c, i) => `<option value="${i}">${String(i + 1).padStart(2, "0")}</option>`).join("")}</select></label><div class="viewer-actions"><span class="viewer-hint">Drag to rotate · Views stay synchronized</span><button id="cloud-play">${reduced ? "Rotate" : "Pause rotation"}</button><button id="cloud-reset">Reset view</button></div></div>${canvasesHtml("cloud")}<div class="science-bottom"><div class="color-key"><span>Point-to-reference error</span><i style="background:${errorRamp}"></i><div><span>0</span><span>≥ 0.05</span></div></div><label class="zoom-control">Zoom<input id="cloud-zoom" type="range" min="0.65" max="1.5" step="0.01" value="1"></label><span class="viewer-hint">Scene units · F-score ×100</span></div><details class="science-details"><summary>About this comparison</summary><p>All nine hidden scenes, in ID order. Coordinates are cached offline reconstructions from the unchanged final submitted solvers. All points are shown, including outliers, with a shared orthographic camera, scale and error mapping. No post-hoc alignment, smoothing or point removal. Reference geometry is used only for post-hoc evaluation; it was not available to the agents.</p></details>`;
    const cvs = [...host.querySelectorAll("canvas")];
    let scene = 0,
      yaw = 0.65,
      pitch = -0.3,
      zoom = 1,
      spin = !reduced,
      alive = true,
      visible = false,
      drag = null,
      last = 0,
      frame;
    let prepared;
    const prepare = () => {
      const c = D.clouds[scene],
        sets = [c.models.baseline.points, c.models.ours.points, c.truth];
      const all = sets.flat();
      let lo = [Infinity, Infinity, Infinity],
        hi = [-Infinity, -Infinity, -Infinity];
      all.forEach((p) =>
        p.forEach((v, i) => {
          lo[i] = Math.min(lo[i], v);
          hi[i] = Math.max(hi[i], v);
        }),
      );
      const center = lo.map((v, i) => (v + hi[i]) / 2);
      let radius = 0;
      all.forEach(
        (p) =>
          (radius = Math.max(
            radius,
            Math.hypot(...p.map((v, i) => v - center[i])),
          )),
      );
      prepared = {
        sets: sets.map((s, i) =>
          s.map((p, j) => ({
            p: p.map((v, k) => v - center[k]),
            color:
              i === 2
                ? "#6c829a"
                : color(
                    c.models[i === 0 ? "baseline" : "ours"]
                      .reconstruction_error[j] / 0.05,
                    errorStops,
                  ),
          })),
        ),
        radius,
      };
      host.querySelector('[data-metric="0"]').textContent =
        `F-score ${(100 * c.models.baseline.fscore).toFixed(2)}`;
      host.querySelector('[data-metric="1"]').textContent =
        `F-score ${(100 * c.models.ours.fscore).toFixed(2)}`;
      host.querySelector('[data-metric="2"]').textContent =
        `${c.truth.length} points`;
    };
    function draw() {
      const cs = Math.cos(yaw),
        sn = Math.sin(yaw),
        cp = Math.cos(pitch),
        sp = Math.sin(pitch);
      cvs.forEach((canvas, i) => {
        const { ctx, w, h } = viewContext(canvas);
        const scale = ((Math.min(w, h) * 0.43) / prepared.radius) * zoom;
        const dots = prepared.sets[i]
          .map(({ p, color }) => {
            const x = p[0] * cs + p[2] * sn,
              z = -p[0] * sn + p[2] * cs;
            return {
              x: w / 2 + x * scale,
              y: h / 2 - (p[1] * cp - z * sp) * scale,
              z: p[1] * sp + z * cp,
              color,
            };
          })
          .sort((a, b) => a.z - b.z);
        dots.forEach((p) => {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, 2.35, 0, Math.PI * 2);
          ctx.fill();
        });
        const len = 0.5 * scale;
        ctx.strokeStyle = "#8097aa";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w - 20 - len, h - 20);
        ctx.lineTo(w - 20, h - 20);
        ctx.stroke();
        ctx.font = "12px system-ui";
        ctx.textAlign = "center";
        ctx.fillStyle = "#718498";
        ctx.fillText("0.5", w - 20 - len / 2, h - 27);
      });
    }
    prepare();
    const resize = new ResizeObserver(draw);
    cvs.forEach((c) => resize.observe(c));
    const visibility = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
    });
    visibility.observe(host);
    const tick = (t) => {
      if (!alive) return;
      if (visible && !document.hidden && spin && !drag && t - last > 30) {
        yaw += 0.004;
        draw();
        last = t;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const updatePlay = () => {
      host.querySelector("#cloud-play").textContent = spin
        ? "Pause rotation"
        : "Rotate";
    };
    host.querySelector("#cloud-play").onclick = () => {
      spin = !spin;
      updatePlay();
    };
    host.querySelector("#cloud-reset").onclick = () => {
      yaw = 0.65;
      pitch = -0.3;
      zoom = 1;
      host.querySelector("#cloud-zoom").value = "1";
      draw();
    };
    host.querySelector("#cloud-zoom").oninput = (e) => {
      zoom = Number(e.target.value);
      draw();
    };
    host.querySelector("#cloud-scene").onchange = (e) => {
      scene = Number(e.target.value);
      zoom = 1;
      host.querySelector("#cloud-zoom").value = "1";
      prepare();
      draw();
    };
    cvs.forEach((canvas) => {
      canvas.onpointerdown = (e) => {
        drag = { x: e.clientX, y: e.clientY };
        canvas.setPointerCapture(e.pointerId);
        spin = false;
        updatePlay();
      };
      canvas.onpointermove = (e) => {
        if (!drag) return;
        yaw += (e.clientX - drag.x) * 0.008;
        pitch = Math.max(
          -1.5,
          Math.min(1.5, pitch + (e.clientY - drag.y) * 0.008),
        );
        drag = { x: e.clientX, y: e.clientY };
        draw();
      };
      canvas.onpointerup = canvas.onpointercancel = () => {
        drag = null;
      };
      canvas.onkeydown = (e) => {
        if (
          !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        )
          return;
        e.preventDefault();
        spin = false;
        updatePlay();
        yaw += e.key === "ArrowLeft" ? -0.1 : e.key === "ArrowRight" ? 0.1 : 0;
        pitch += e.key === "ArrowUp" ? -0.1 : e.key === "ArrowDown" ? 0.1 : 0;
        draw();
      };
    });
    draw();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
    };
  }

  function mountTidal(host) {
host.innerHTML = `<div class="science-toolbar"><label>Basin <select id="tidal-basin" aria-label="Tidal basin">${D.basins.map((c, i) => `<option value="${i}">${String(c.number).padStart(2, "0")}</option>`).join("")}</select></label><div class="viewer-actions"><div class="view-modes" role="group" aria-label="Tidal visualization"><button id="tidal-cycle" aria-pressed="true">Tidal cycle</button><button id="tidal-error" aria-pressed="false">Prediction error</button></div><div class="viewer-playback-slot"><button id="tidal-play">${reduced ? "Play cycle" : "Pause cycle"}</button></div></div></div>${canvasesHtml("tidal")}<div class="science-bottom"><div class="color-key" id="tidal-key"></div><label class="phase-control">Phase <input id="tidal-phase" type="range" min="0" max="360" step="1" value="0"><output id="tidal-phase-value">0°</output></label></div><p class="viewer-explanation" id="tidal-explanation"></p><details class="science-details"><summary>About these fields</summary><p>All eight hidden basins are shown in ID order on the native 24 × 24 grid, without smoothing. These are cached, offline replays of the final solvers—not new experiments. The cycle is Re(η exp(iφ)); phase is a visualization control, not research time. Field error is |η prediction − η reference|, not the gauge RMSE used for evaluation. Displayed model scores use the original verifier. The baseline replay in basin 06 differs from its archived gauge RMSE by 0.0002254; other baseline basins agree to approximately 1e−14, and the maximum ours difference is 9.06e−7.</p></details>`;
    const cvs = [...host.querySelectorAll("canvas")];
    let basin = 0,
      phase = 0,
      mode = "cycle",
      playing = !reduced,
      alive = true,
      visible = false,
      last = 0,
      frame;
    const cycleStops = [
        [42, 122, 184],
        [162, 219, 239],
        [248, 252, 255],
        [181, 230, 225],
        [37, 163, 169],
      ],
      errStops = [
        [245, 250, 255],
        [150, 206, 231],
        [47, 135, 189],
      ];
    let maxAmplitude = 0;
    D.basins.forEach((c) =>
      Object.values(c.fields).forEach((f) =>
        f.re.forEach((row, y) =>
          row.forEach((v, x) => {
            maxAmplitude = Math.max(maxAmplitude, Math.hypot(v, f.im[y][x]));
          }),
        ),
      ),
    );
    const limit = Math.ceil(maxAmplitude * 10) / 10;
    function draw() {
      const c = D.basins[basin];
      cvs.forEach((canvas, i) => {
        canvas.closest("figure").hidden = mode === "error" && i === 2;
        if (mode === "error" && i === 2) return;
        const f = c.fields[["baseline", "ours", "truth"][i]],
          { ctx, w, h } = viewContext(canvas),
          size = Math.min(w - 24, h - 24),
          ox = (w - size) / 2,
          oy = (h - size) / 2,
          cell = size / 24;
        for (let y = 0; y < 24; y++)
          for (let x = 0; x < 24; x++) {
            const value =
              mode === "error"
                ? f.error[y][x]
                : f.re[y][x] * Math.cos(phase) - f.im[y][x] * Math.sin(phase);
            ctx.fillStyle = color(
              mode === "error" ? value / 0.13 : (value + limit) / (2 * limit),
              mode === "error" ? errStops : cycleStops,
            );
            ctx.fillRect(
              ox + x * cell,
              oy + (23 - y) * cell,
              cell + 0.25,
              cell + 0.25,
            );
          }
        ctx.strokeStyle = "#cedfe9";
        ctx.strokeRect(ox, oy, size, size);
        host.querySelector(`[data-metric="${i}"]`).textContent =
          i === 2
            ? "Reference field"
            : `Gauge RMSE ${f.archived_rmse.toFixed(4)}`;
      });
      host.querySelector("#tidal-phase-value").value =
        `${Math.round((phase * 180) / Math.PI) % 360}°`;
    }
    function modeUI() {
      host
        .querySelector(".science-views")
        .classList.toggle("two-views", mode === "error");
      host
        .querySelector("#tidal-cycle")
        .setAttribute("aria-pressed", String(mode === "cycle"));
      host
        .querySelector("#tidal-error")
        .setAttribute("aria-pressed", String(mode === "error"));
      host.querySelector(".phase-control").hidden = mode === "error";
      host.querySelector("#tidal-play").hidden = mode === "error";
      host.querySelector("#tidal-key").innerHTML =
        mode === "cycle"
          ? `<span>Elevation · Model units</span><i style="background:linear-gradient(90deg,#2a7ab8,#a2dbef,#f8fcff,#b5e6e1,#25a3a9)"></i><div><span>−${limit}</span><span>0</span><span>${limit}</span></div>`
          : `<span>Complex-elevation error</span><i style="background:linear-gradient(90deg,#f5faff,#96cee7,#2f87bd)"></i><div><span>0</span><span>≥ 0.13</span></div>`;
      host.querySelector("#tidal-explanation").textContent =
        mode === "cycle"
          ? "Play or scrub a shared phase to compare the reconstructed tidal fields. The color scale is fixed across models and basins."
          : "Darker cells indicate larger prediction error. Both models and all basins share the same 0–0.13 scale.";
      draw();
    }
    const resize = new ResizeObserver(draw);
    cvs.forEach((c) => resize.observe(c));
    const visibility = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
    });
    visibility.observe(host);
    const tick = (t) => {
      if (!alive) return;
      if (
        visible &&
        !document.hidden &&
        mode === "cycle" &&
        playing &&
        t - last > 40
      ) {
        phase = (phase + 0.015) % (2 * Math.PI);
        host.querySelector("#tidal-phase").value = String(
          Math.round((phase * 180) / Math.PI),
        );
        draw();
        last = t;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    host.querySelector("#tidal-basin").onchange = (e) => {
      basin = Number(e.target.value);
      draw();
    };
    host.querySelector("#tidal-play").onclick = (e) => {
      playing = !playing;
      e.target.textContent = playing ? "Pause cycle" : "Play cycle";
    };
    host.querySelector("#tidal-phase").oninput = (e) => {
      phase = (Number(e.target.value) * Math.PI) / 180;
      playing = false;
      host.querySelector("#tidal-play").textContent = "Play cycle";
      draw();
    };
    host.querySelector("#tidal-cycle").onclick = () => {
      mode = "cycle";
      modeUI();
    };
    host.querySelector("#tidal-error").onclick = () => {
      mode = "error";
      modeUI();
    };
    modeUI();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
    };
  }
  window.Explorers = { mountCloud, mountTidal };
})();
