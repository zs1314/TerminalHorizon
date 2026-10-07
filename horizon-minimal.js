"use strict";
// A slowly shifting ink landscape. Decoration only; no research data is encoded.
const HorizonLine = (() => {
  const ground = (x,w,center=w/2) => 76 + 10*((x-center)/(w*.52))**2;
  const envelope = (u) => Math.sin(Math.PI * Math.max(0,Math.min(1,u))) ** 2;
  function scene(ctx,w,h,t,pointer=0) {
    if (w <= 0 || h <= 0) return;
    ctx.clearRect(0,0,w,h);
    const sy=h/150, drift=Math.sin(t*.045)*.002+pointer*.001;
    const ridge=(u,layer)=>{
      const falloff=envelope(u);
      const a=(u+drift)*Math.PI;
      const relief=17*Math.sin(a*1.6+.45)+8*Math.sin(a*4.3+.8)+3*Math.sin(a*9.2);
      return (97-layer*3.8-falloff*(relief+layer*1.1))*sy;
    };
    ctx.save();
    ctx.lineCap='round';ctx.lineJoin='round';
    // Uneven, fine contours read as a landscape drawing, with an open sky above.
    for(let layer=0;layer<16;layer++) {
      ctx.beginPath();
      for(let x=0;x<=w;x+=3) {
        const u=x/w, y=ridge(u,layer)+Math.sin(u*61+layer*1.7)*.24*sy;
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle=layer<4
        ? (layer%3===0?'rgba(153,117,46,.28)':'rgba(153,117,46,.14)')
        : layer<11
          ? (layer%4===0?'rgba(22,126,137,.4)':'rgba(22,126,137,.2)')
          : (layer%4===0?'rgba(44,109,166,.4)':'rgba(44,109,166,.24)');
      ctx.lineWidth=layer%4===0?.85:.65;ctx.stroke();
    }
    // Short horizontal strokes give the distant ground a dry-ink texture.
    for(let row=0;row<6;row++) {
      for(let j=0;j<36;j++) {
        const u=(j+.3*Math.sin(j*7+row))/36;
        const x=u*w, y=(111+row*4+Math.sin(u*12+row)*1.4)*sy;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+5+(j*11+row*7)%19,y);
        ctx.strokeStyle=`rgba(117,111,94,${.12*envelope(u)})`;
        ctx.lineWidth=.65;ctx.stroke();
      }
    }
    ctx.restore();
  }
  return {scene,ground,envelope};
})();
if(typeof module!=='undefined')module.exports=HorizonLine;
