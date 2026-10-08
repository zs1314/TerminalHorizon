(() => {
  const mascot = document.querySelector('.hero-mascot');
  const heading = document.querySelector('.hero-heading');
  const lead = document.querySelector('.hero-title-lead');
  const canvas = mascot?.querySelector('.miner-scene');
  const ctx = canvas?.getContext('2d');
  if (!mascot || !heading || !lead || !ctx) return;

  const button = mascot.querySelector('.mascot-motion');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const atlas = new Image();
  const rockTexture = new Image();
  const BASE = 82.2, LAYER = 18, SCALE = .80;
  const TIP = { x: 66.96, y: 74.8 };
  const poses = [
    { cell: 0, x: 0, lamp: [66.4,40.7], angle: 1.13 },
    { cell: 1, x: -.8, lamp: [63.2,37.0], angle: 1.00 },
    { cell: 2, x: -2, lamp: [42.5,30.0], angle: .72 },
    { cell: 3, x: -2, lamp: [40.0,29.8], angle: .68 },
  ];
  const frames = [
    { pose: 0, time: .50 }, { pose: 1, time: .18 },
    { pose: 2, time: .20 }, { pose: 3, time: .30 },
    { pose: 2, time: .09 }, { pose: 1, time: .07 },
    { pose: 0, time: .10, hit: true }, { pose: 0, time: .30 },
  ];
  let paused = reduced.matches, visible = true, request = null, lastTime = null;
  let mode = 'dig', elapsed = 0, frame = 0, damage = 0, level = 0;
  let descentTime = 0, depth = 0, bodyDepth = 0, camera = 0;
  let impactAge = Infinity, landingAge = Infinity, impact = { ...TIP };
  let particles = [], chunks = [];

  const smooth = t => { t = Math.max(0, Math.min(1,t)); return t*t*(3-2*t); };
  function path(points, fill, stroke, width = .65) {
    ctx.beginPath();
    points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
    if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.stroke(); }
  }
  function glow(x,y,r,rgb,alpha) {
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(${rgb},${alpha})`);
    g.addColorStop(1,`rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  function ridge(x) {
    const points = [[0,0],[53,0],[59,-2],[63,-4],[66.96,-7.4],[73,-6.0],[78,-3.2],[84,-4.2],[93,0],[100,0]];
    for (let i=1;i<points.length;i++) {
      if (x<=points[i][0]) {
        const [a,b]=points[i-1], [c,d]=points[i];
        return b+(d-b)*(x-a)/(c-a);
      }
    }
    return 0;
  }
  function groundAt(x) { return BASE + depth + ridge(x); }

  function drawRockMaterial() {
    ctx.fillStyle='#c5c9bd';ctx.fillRect(0,0,100,120);
    if(!rockTexture.complete || !rockTexture.naturalWidth)return;
    const tileSize=108, offset=camera%tileSize;
    for(let y=-offset;y<120;y+=tileSize)ctx.drawImage(rockTexture,0,y,100,tileSize);
  }
  function drawWalls() {
    // A cutaway edge makes the downward camera travel visible without a box.
    ctx.save();
    path([[89,25],[96,22],[100,34],[98,56],[100,86],[98,100],[80,100],[80,84],[85,72],[81,54],[84,41]],'#dbe1db');
    ctx.clip();
    drawRockMaterial();
    const edge=ctx.createLinearGradient(81,0,100,0);
    edge.addColorStop(0,'rgba(46,66,60,.13)');edge.addColorStop(.28,'rgba(239,239,221,.10)');edge.addColorStop(1,'rgba(252,251,248,.6)');
    ctx.fillStyle=edge;ctx.fillRect(80,20,20,80);
    const fade=ctx.createLinearGradient(0,20,0,49);
    fade.addColorStop(0,'rgba(252,251,248,1)'); fade.addColorStop(1,'rgba(252,251,248,0)');
    ctx.fillStyle=fade; ctx.fillRect(80,20,20,30);
    ctx.restore();
  }

  function drawTerrain() {
    const y=BASE+depth-camera;
    const outline=[[5,y+1],[11,y],[53,y],[59,y-2],[63,y-4],[TIP.x,y-7.4],[73,y-6],[78,y-3.2],[84,y-4.2],[93,y],[98,y+1],[98,118],[4,118]];
    ctx.save();
    path(outline,'#cbd5d0'); ctx.clip();
    drawRockMaterial();
    const face=ctx.createLinearGradient(0,y-7,0,y+17);
    face.addColorStop(0,'rgba(49,99,93,.23)');face.addColorStop(.4,'rgba(229,230,212,.06)');face.addColorStop(1,'rgba(249,246,233,.35)');
    ctx.fillStyle=face;ctx.fillRect(0,y-9,100,36);
    ctx.restore();
    // The ore is part of the connected floor, not a separate stone prop.
    path([[53,y],[59,y-2],[63,y-4],[TIP.x,y-7.4],[73,y-6],[78,y-3.2],[84,y-4.2],[93,y],[89,y+6],[68,y+7],[55,y+4]],'rgba(47,103,103,.22)');
    path([[TIP.x,y-7.4],[69,y-.5],[62,y+3],[59,y-2],[63,y-4]],'rgba(229,241,218,.23)');
    path([[69,y-.5],[73,y-6],[78,y-3.2],[76,y+3]],'rgba(35,77,77,.24)');
    path([[76,y+3],[84,y-4.2],[88,y+.5],[85,y+5]],'rgba(49,119,109,.17)');
    path([[69,y+7],[76,y+3],[85,y+5],[89,y+6]],'rgba(34,81,73,.25)');
    const crystal=level%2===0?'#86ccc4':'#bcd3aa';
    path([[73,y+.3],[76,y-1.7],[78,y+.7],[76,y+4]],crystal);
    path([[73,y+.3],[76,y-1.7],[75.3,y+1.4]],'#d1eee2');
    path([[82,y+1],[84,y-.2],[86,y+2.2],[83,y+3.3]],'#a4d5c6');
    path([[7,y+.1],[50,y+.1],[59,y-2]],null,'#8da49d',.7);
    if(damage) {
      const cy=TIP.y+depth-camera;
      path([[TIP.x-1,cy+1],[65,cy+3.1],[68.1,cy+4.8],[64.5,cy+8.3],[61,cy+9.8]],null,'#456566',damage===1?.75:1.0);
      path([[68.1,cy+4.8],[72,cy+6],[73.5,cy+9]],null,'#547672',.65);
      if(damage>1) path([[64.5,cy+8.3],[52,y+4],[42,y+3],[33,y+5],[17,y+3]],null,'#56736c',.8);
    }
  }

  function emitChips() {
    impact={x:TIP.x,y:TIP.y+depth};impactAge=0;
    const velocities=[[-24,-43],[-15,-54],[-6,-36],[7,-46],[15,-34]];
    for(let i=0;i<velocities.length;i++) {
      particles.push({x:impact.x,y:impact.y,vx:velocities[i][0],vy:velocities[i][1],r:1.1+i%2*.3,angle:i,spin:(i%2?1:-1)*6,age:0,color:i===2?'#91c9bc':'#638b86',bounces:0});
    }
  }
  function fracture() {
    damage+=1;emitChips();
    if(damage===2) { mode='crack';elapsed=0; }
  }
  function startDescent() {
    mode='descend';descentTime=0;
    const oldDepth=depth;
    level+=1;depth=level*LAYER;damage=0;
    const pieces=[[12,5,16],[29,7,16],[48,6,17],[64,1,15],[78,0,17],[89,6,10]];
    chunks=pieces.map(([x,dy,w],i)=>({x,y:BASE+oldDepth+dy,vx:(i-2.5)*3,vy:2+i*.7,r:w,angle:0,spin:(i%2?1:-1)*.8,age:0,color:i>2?'#7f9f98':'#bccdc5'}));
    // Dust and all particles remain in world coordinates as the camera follows.
  }
  function land() {
    landingAge=0;
    for(const x of [14,39]) for(let i=0;i<3;i++) {
      particles.push({x,y:BASE+depth-.5,vx:(i-1)*8,vy:-12-i*3,r:.7,angle:i,spin:3,age:0,color:'#a1b8ac',bounces:0});
    }
  }
  function advanceDebris(dt) {
    impactAge+=dt;landingAge+=dt;
    for(const p of particles) {
      p.age+=dt;
      p.x+=p.vx*dt;p.y+=p.vy*dt+95*dt*dt;p.vy+=190*dt;p.angle+=p.spin*dt;
      const ground=groundAt(p.x)-p.r;
      if(p.y>=ground && p.vy>0) {
        p.y=ground;p.vx*=.5;p.vy*=p.bounces===0?-.18:0;p.spin*=.3;p.bounces++;
      }
    }
    particles=particles.filter(p=>p.age<1.4);
    for(const p of chunks) {
      p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt+115*dt*dt;p.vy+=230*dt;p.angle+=p.spin*dt;
      const ground=groundAt(p.x)+3;
      if(p.y>=ground) {p.y=ground;p.vy=0;p.vx*=.7;p.spin=0;}
    }
    chunks=chunks.filter(p=>p.age<1.2);
  }

  function activePose() {
    if(mode==='descend') return poses[descentTime<.55?1:0];
    if(mode==='crack') return poses[elapsed>.15?1:0];
    return poses[frames[frame].pose];
  }
  function robotPosition() {return {x:2,y:4+bodyDepth-camera};}
  function drawLamp(pose,pos) {
    const x=pos.x+(pose.lamp[0]+pose.x)*SCALE,y=pos.y+pose.lamp[1]*SCALE;
    const length=48,spread=.22,a=pose.angle;
    const g=ctx.createLinearGradient(x,y,x+Math.cos(a)*length,y+Math.sin(a)*length);
    const dust=impactAge<.6?Math.sin(Math.PI*impactAge/.6):0;
    g.addColorStop(0,`rgba(255,213,146,${.12+dust*.08})`);g.addColorStop(1,'rgba(255,217,150,0)');
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a-spread)*length,y+Math.sin(a-spread)*length);ctx.lineTo(x+Math.cos(a+spread)*length,y+Math.sin(a+spread)*length);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  }
  function drawRobot(pose,pos) {
    const onFloor=Math.abs(bodyDepth-depth)<.05;
    if(onFloor) {
      ctx.save();ctx.translate(28,BASE+depth-camera+.35);ctx.scale(1,.12);glow(0,0,23,'48,80,72',.21);ctx.restore();
    }
    ctx.save();ctx.translate(pos.x+pose.x*SCALE,pos.y);ctx.scale(SCALE,SCALE);
    if(landingAge<.3) {
      const compression=.035*Math.sin(Math.PI*landingAge/.3);
      ctx.translate(0,97.75*compression);ctx.scale(1,1-compression);
    }
    const w=atlas.width/4,h=atlas.height/2;
    ctx.drawImage(atlas,pose.cell*w,0,w,h,0,0,100,100);
    glow(pose.lamp[0],pose.lamp[1],7,'255,222,159',.23);
    if(mode==='dig' && frame===0 && level%2===1 && elapsed>.20 && elapsed<.35 && !reduced.matches) {
      const close=Math.sin(Math.PI*(elapsed-.20)/.15);
      for(const [x,y,s] of [[51.1,58.9,1],[60.1,62.1,.76]]) {
        ctx.save();ctx.translate(x,y);ctx.rotate(.34);ctx.scale(s,s);
        const mask=ctx.createRadialGradient(0,0,0,0,0,4.2);mask.addColorStop(0,'#101412');mask.addColorStop(.78,'#101412');mask.addColorStop(1,'rgba(16,20,18,0)');
        ctx.fillStyle=mask;ctx.beginPath();ctx.ellipse(0,0,4.2,4.1,0,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#29c9d1';ctx.lineWidth=1.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-2.5,.6);ctx.quadraticCurveTo(0,-5.3+7*close,2.5,.6);ctx.stroke();ctx.restore();
      }
    }
    ctx.restore();
  }
  function drawDebris() {
    for(const p of chunks) {
      ctx.save();ctx.globalAlpha=1-smooth((p.age-.55)/.65);ctx.translate(p.x,p.y-camera);ctx.rotate(p.angle);
      path([[-p.r*.5,-3],[-p.r*.15,-5],[p.r*.5,-2],[p.r*.4,3],[-p.r*.4,2]],p.color);
      ctx.save();ctx.clip();
      if(rockTexture.complete && rockTexture.naturalWidth) {
        const sx=Math.max(0,Math.min(.8,p.x/120))*rockTexture.width;
        const sy=((p.y%80)/100)*rockTexture.height;
        ctx.drawImage(rockTexture,sx,sy,rockTexture.width*.16,rockTexture.height*.08,-p.r*.5,-5,p.r,8);
      }
      ctx.restore();
      path([[-p.r*.5,-3],[-p.r*.15,-5],[p.r*.5,-2],[0,-.5]],'rgba(228,232,208,.28)');ctx.restore();
    }
    if(impactAge<.7) {
      const t=impactAge/.7;
      for(let i=0;i<3;i++)glow(impact.x+(i-1)*(2+t*8),impact.y-camera-t*(4+i),2+t*(7+i),'138,158,147',Math.sin(Math.PI*t)*.2);
    }
    if(landingAge<.5) {
      const t=landingAge/.5;
      for(const x of [14,39])glow(x,BASE+depth-camera-1-t*2,3+t*8,'147,164,148',Math.sin(Math.PI*t)*.2);
    }
    if(impactAge<.08)path([[impact.x-3,impact.y-camera-4],[impact.x-1,impact.y-camera-1],[impact.x+.6,impact.y-camera-4.5]],null,'#e2b564',.8);
    for(const p of particles) {
      ctx.save();ctx.globalAlpha=Math.min(1,(1.4-p.age)/.4);ctx.translate(p.x,p.y-camera);ctx.rotate(p.angle);
      path([[-p.r,-p.r*.3],[0,-p.r],[p.r,.1],[p.r*.2,p.r],[-p.r*.8,p.r*.5]],p.color);ctx.restore();
    }
  }
  function render() {
    const s=canvas.width/100;ctx.setTransform(s,0,0,s,0,0);ctx.clearRect(0,0,100,100);
    if(!atlas.complete || !atlas.naturalWidth)return;
    drawWalls();drawTerrain();
    const pose=activePose(),pos=robotPosition();drawLamp(pose,pos);drawRobot(pose,pos);drawDebris();
    // Fade the geological cross-section into the page at the bottom edge.
    ctx.save();ctx.globalCompositeOperation='destination-out';
    const fade=ctx.createLinearGradient(0,94,0,100);fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(1,'rgba(0,0,0,1)');ctx.fillStyle=fade;ctx.fillRect(0,94,100,6);ctx.restore();
  }
  function advance(dt) {
    advanceDebris(dt);
    if(mode==='dig') {
      elapsed+=dt;
      if(elapsed>=frames[frame].time) {
        elapsed-=frames[frame].time;frame=(frame+1)%frames.length;
        if(frames[frame].hit)fracture();
      }
    } else if(mode==='crack') {
      elapsed+=dt;if(elapsed>.26)startDescent();
    } else {
      const wasLanded=bodyDepth>=depth;
      descentTime+=dt;
      const fallen=Math.min(LAYER,95*descentTime*descentTime);
      bodyDepth=depth-LAYER+fallen;
      camera=depth-LAYER+LAYER*smooth(descentTime/.92);
      if(!wasLanded && fallen===LAYER)land();
      if(descentTime>=1.15) {mode='dig';frame=elapsed=0;camera=bodyDepth=depth;}
    }
  }
  function tick(time) {
    request=null;
    const dt=lastTime===null?0:Math.min((time-lastTime)/1000,.04);lastTime=time;
    advance(dt);render();request=requestAnimationFrame(tick);
  }
  function schedule() {
    if(request!==null)cancelAnimationFrame(request);
    request=null;lastTime=null;
    if(!paused && visible && !document.hidden && atlas.complete && atlas.naturalWidth)request=requestAnimationFrame(tick);
  }
  function updateControl() {
    mascot.classList.toggle('is-paused',paused);
    button.setAttribute('aria-label',paused?'Play robot animation':'Pause robot animation');
    button.title=paused?'Play animation':'Pause animation';
  }
  function position() {
    const title=lead.getBoundingClientRect(),parent=heading.getBoundingClientRect();
    const gap=title.height<45?5:9;
    const size=Math.max(0,Math.min(80,title.height*1.12,title.left-gap-6));
    mascot.style.width=mascot.style.height=`${size}px`;
    mascot.style.left=`${title.left-parent.left-size-gap}px`;
    mascot.style.top=`${title.top-parent.top+title.height*.88-size*.975}px`;
    mascot.classList.toggle('is-positioned',size>=20 && atlas.complete && atlas.naturalWidth>0);
    const pixels=Math.max(1,Math.ceil(mascot.getBoundingClientRect().width*Math.min(window.devicePixelRatio||1,3)));
    if(canvas.width!==pixels)canvas.width=canvas.height=pixels;
    render();
  }
  button.hidden=false;
  button.addEventListener('click',()=>{paused=!paused;updateControl();schedule();});
  reduced.addEventListener('change',()=>{
    paused=reduced.matches;
    if(paused){mode='dig';frame=elapsed=damage=0;camera=bodyDepth=depth;particles=[];chunks=[];impactAge=landingAge=Infinity;render();}
    updateControl();schedule();
  });
  document.addEventListener('visibilitychange',schedule);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();}).observe(mascot);
  const resize=new ResizeObserver(position);resize.observe(heading);resize.observe(lead);
  document.fonts.ready.then(position);
  atlas.onload=()=>{position();schedule();};
  atlas.src='assets/miner-character.png';
  rockTexture.onload=render;
  rockTexture.src='assets/mine-strata.jpg';
  position();updateControl();
})();
