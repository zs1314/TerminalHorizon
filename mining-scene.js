(() => {
  const mascot = document.querySelector('.hero-mascot');
  const heading = document.querySelector('.hero-heading');
  const lead = document.querySelector('.hero-title-lead');
  if (!mascot || !heading || !lead) return;

  const sprite = mascot.querySelector('.miner-sprite');
  const button = mascot.querySelector('.mascot-motion');
  const lightCanvas = mascot.querySelector('.miner-light');
  const effectsCanvas = mascot.querySelector('.miner-effects');
  const light = lightCanvas.getContext('2d');
  const effects = effectsCanvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let visible = true;
  let request = null;
  let lastTime = null;
  let elapsed = 0;
  let step = 0;
  let cycles = 0;
  let impactAge = Infinity;
  let particles = [];

  // The original four poses share a ground plane. Reusing them on the downstroke
  // avoids swapping in a different rock, feet or baked-in debris at impact.
  const poses = [
    { cell: 0, x: 0, lamp: [65.4, 41.0], angle: 1.10 },
    { cell: 1, x: -.4, lamp: [61.3, 37.6], angle: .97 },
    { cell: 2, x: -1, lamp: [41.7, 30.9], angle: .70 },
    { cell: 3, x: -1, lamp: [37.3, 30.6], angle: .64 },
  ];
  const frames = [
    { pose: 0, duration: .72 },
    { pose: 1, duration: .17 },
    { pose: 2, duration: .20 },
    { pose: 3, duration: .30 },
    { pose: 2, duration: .085 },
    { pose: 1, duration: .065 },
    { pose: 0, duration: .10, impact: true },
    { pose: 0, duration: .32 },
  ];
  const contact = { x: 79.7, y: 86.2 };
  const floor = 96.4;
  const gravity = 190;

  function drawPose() {
    const pose = poses[frames[step].pose];
    sprite.style.backgroundPosition = `${pose.cell * 100 / 3}% 0%`;
    sprite.style.setProperty('--frame-x', `${pose.x}%`);
    sprite.style.setProperty('--frame-y', '0%');
  }

  function strike() {
    impactAge = 0;
    const velocities = [[-30,-48],[-20,-62],[-9,-43],[7,-57],[14,-39],[18,-49]];
    const colors = ['#526c77','#7a969b','#3e6570','#779d9d','#4f737c','#84b5ad'];
    particles = velocities.map(([vx, vy], i) => ({
      x: contact.x, y: contact.y, vx, vy,
      radius: [1.35, 1.6, 1.05, 1.4, 1.05, 1.2][i],
      angle: i * 1.8, spin: (i % 2 ? 1 : -1) * (5 + i),
      color: colors[i], bounces: 0, settled: false,
    }));
  }

  function advanceParticles(dt) {
    impactAge += dt;
    for (const p of particles) {
      if (p.settled) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt + .5 * gravity * dt * dt;
      p.vy += gravity * dt;
      p.angle += p.spin * dt;
      if (p.y + p.radius >= floor && p.vy > 0) {
        p.y = floor - p.radius;
        p.vx *= .48;
        p.vy *= -.20;
        p.spin *= .35;
        p.bounces += 1;
        if (p.bounces >= 2 || Math.abs(p.vy) < 8) p.settled = true;
      }
    }
    if (impactAge > 1.5) particles = [];
  }

  function glow(ctx, x, y, radius, rgb, alpha) {
    const fill = ctx.createRadialGradient(x, y, 0, x, y, radius);
    fill.addColorStop(0, `rgba(${rgb},${alpha})`);
    fill.addColorStop(.35, `rgba(${rgb},${alpha * .6})`);
    fill.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = fill;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function drawLamp() {
    if (!light || !effects) return;
    const { lamp: [x, y], angle } = poses[frames[step].pose];
    const length = 65;
    const spread = .22;
    const tipX = x + Math.cos(angle) * length;
    const tipY = y + Math.sin(angle) * length;
    const beam = light.createLinearGradient(x, y, tipX, tipY);
    const dust = impactAge < .65 ? Math.sin(Math.PI * impactAge / .65) : 0;
    beam.addColorStop(0, `rgba(255,211,132,${.13 + dust * .09})`);
    beam.addColorStop(.6, `rgba(247,201,119,${.06 + dust * .06})`);
    beam.addColorStop(1, 'rgba(247,201,119,0)');
    light.fillStyle = beam;
    light.beginPath();
    light.moveTo(x, y);
    light.lineTo(x + Math.cos(angle - spread) * length, y + Math.sin(angle - spread) * length);
    light.quadraticCurveTo(tipX, tipY, x + Math.cos(angle + spread) * length, y + Math.sin(angle + spread) * length);
    light.closePath();
    light.fill();
    // Local bloom and a warm reflection follow the headlamp, without flicker.
    glow(effects, x, y, 10.5, '255,207,123', .23);
    glow(effects, x, y, 3.7, '255,248,219', .28);
    const direction = Math.atan2(85 - y, 82 - x);
    const alignment = Math.max(0, 1 - Math.abs(direction - angle) / .4);
    glow(effects, 82, 85, 10, '255,215,153', .15 * alignment);
    glow(light, 83, 96, 11, '236,196,129', .09 * alignment);
  }

  function drawBlink() {
    // A brief, occasional blink during the rest, while the body stays planted.
    if (!effects || reduced.matches || step !== 0 || cycles % 3 !== 1) return;
    const t = (elapsed - .28) / .15;
    if (t < 0 || t > 1) return;
    const closed = Math.sin(Math.PI * t);
    for (const [x, y, scale] of [[51.5,58.5,1],[60.3,61.7,.76]]) {
      effects.save();
      effects.translate(x, y);
      effects.rotate(.36);
      effects.scale(scale, scale);
      const visor = effects.createRadialGradient(0, 0, 0, 0, 0, 4.4);
      visor.addColorStop(0, '#101412');
      visor.addColorStop(.8, '#101412');
      visor.addColorStop(1, 'rgba(16,20,18,0)');
      effects.fillStyle = visor;
      effects.beginPath();
      effects.ellipse(0, -.1, 4.1, 4.0, 0, 0, Math.PI * 2);
      effects.fill();
      effects.strokeStyle = '#25cad2';
      effects.lineWidth = 1.4;
      effects.lineCap = 'round';
      effects.beginPath();
      effects.moveTo(-2.5, .7);
      effects.quadraticCurveTo(0, -5.3 + closed * 7, 2.5, .7);
      effects.stroke();
      effects.restore();
    }
  }

  function drawImpact() {
    if (!effects || !Number.isFinite(impactAge)) return;
    // Fine dust expands and thins after contact; it does not precede the strike.
    if (impactAge < .65) {
      const t = impactAge / .65;
      const opacity = Math.sin(Math.PI * t) * .19;
      for (let i = 0; i < 3; i++) {
        glow(effects, contact.x + (i - 1) * (2 + t * 8), contact.y - t * (4 + i),
          2 + t * (7 + i), '136,151,147', opacity);
      }
    }
    if (impactAge < .085) {
      effects.globalAlpha = 1 - impactAge / .085;
      effects.strokeStyle = '#f3cc80';
      effects.lineWidth = .9;
      effects.beginPath();
      effects.moveTo(contact.x - 1, contact.y - 2);
      effects.lineTo(contact.x - 3.5, contact.y - 6);
      effects.moveTo(contact.x + 1, contact.y - 2);
      effects.lineTo(contact.x + 2.4, contact.y - 5);
      effects.stroke();
      effects.globalAlpha = 1;
    }
    for (const p of particles) {
      effects.save();
      effects.globalAlpha = Math.min(1, Math.max(0, (1.5 - impactAge) / .55));
      effects.translate(p.x, p.y);
      effects.rotate(p.angle);
      effects.fillStyle = p.color;
      effects.beginPath();
      effects.moveTo(-p.radius, -.4 * p.radius);
      effects.lineTo(-.15 * p.radius, -p.radius);
      effects.lineTo(p.radius, -.15 * p.radius);
      effects.lineTo(.5 * p.radius, .8 * p.radius);
      effects.lineTo(-.7 * p.radius, .6 * p.radius);
      effects.closePath();
      effects.fill();
      effects.restore();
    }
  }

  function render() {
    for (const [canvas, ctx] of [[lightCanvas,light],[effectsCanvas,effects]]) {
      if (!ctx) continue;
      ctx.setTransform(canvas.width / 100, 0, 0, canvas.height / 100, 0, 0);
      ctx.clearRect(0, 0, 100, 100);
    }
    drawLamp();
    drawBlink();
    drawImpact();
  }

  function tick(time) {
    request = null;
    const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, .04);
    lastTime = time;
    elapsed += dt;
    advanceParticles(dt);
    while (elapsed >= frames[step].duration) {
      elapsed -= frames[step].duration;
      step = (step + 1) % frames.length;
      if (step === 0) cycles += 1;
      if (frames[step].impact) strike();
      drawPose();
    }
    render();
    request = requestAnimationFrame(tick);
  }

  function schedule() {
    if (request !== null) cancelAnimationFrame(request);
    request = null;
    lastTime = null;
    if (!paused && visible && !document.hidden) request = requestAnimationFrame(tick);
  }

  function updateControl() {
    mascot.classList.toggle('is-paused', paused);
    button.setAttribute('aria-label', paused ? 'Play robot animation' : 'Pause robot animation');
    button.title = paused ? 'Play animation' : 'Pause animation';
  }

  function position() {
    const title = lead.getBoundingClientRect();
    const parent = heading.getBoundingClientRect();
    const gap = title.height < 45 ? 5 : 9;
    const size = Math.max(0, Math.min(80, title.height * 1.12, title.left - gap - 6));
    mascot.style.width = `${size}px`;
    mascot.style.height = `${size}px`;
    mascot.style.left = `${title.left - parent.left - size - gap}px`;
    mascot.style.top = `${title.top - parent.top + title.height * .88 - size * .975}px`;
    mascot.classList.toggle('is-positioned', size >= 20);
    const pixels = Math.ceil(mascot.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 3));
    for (const canvas of [lightCanvas, effectsCanvas]) {
      if (canvas.width !== pixels) canvas.width = canvas.height = pixels;
    }
    render();
  }

  button.hidden = false;
  button.addEventListener('click', () => {
    paused = !paused;
    updateControl();
    schedule();
  });
  reduced.addEventListener('change', () => {
    paused = reduced.matches;
    if (paused) {
      step = elapsed = 0;
      particles = [];
      impactAge = Infinity;
      drawPose();
      render();
    }
    updateControl();
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }).observe(mascot);
  const resize = new ResizeObserver(position);
  resize.observe(heading);
  resize.observe(lead);
  document.fonts.ready.then(position);
  position();
  drawPose();
  updateControl();
  schedule();
})();
