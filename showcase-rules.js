/* Deliberately partial, display-only checks. These do not certify a task solution. */
const ShowcaseRules = (() => {
  function metro(data, choice) {
    const east = data.trips.find(t=>t.id==='E01'), west = data.trips.find(t=>t.id==='W01');
    const shortTurn = choice !== 0, hold = choice === 2 ? 6 : 0;
    const departure = west.baseline_departure + hold;
    return {shortTurn,hold,departure,eastEntry:east.baseline_departure+5,
      missed:departure>data.feeder.arrival+data.protection.connection_window ? data.feeder.passengers : 0,
      eastInterval:shortTurn?null:[east.baseline_departure+5,east.baseline_departure+11],
      westInterval:[departure+5,departure+11]};
  }
  function rover(data, viaDune, calibrated) {
    const ids = viaDune?['ECHO-DUNE-RIDGE','DUNE-BLUE-SHELF']:['ECHO-BLUE-WEST'];
    const routes = ids.map(id=>data.routes.find(r=>r.id===id));
    const pose = routes.at(-1).final_pose;
    const target = data.targets.find(t=>t.id==='HYD-BV-CONTACT');
    return {ids,pose,geometry:pose===target.pose,traction:calibrated,
      driveCost:routes.reduce((s,r)=>s+r.battery,0),duration:routes.reduce((s,r)=>s+r.duration,0)};
  }
  function weather(data, time) {
    const stamp = new Date(time).getTime();
    const row = data.weather.find(w=>stamp>=Date.parse(w.start)&&stamp<Date.parse(w.end));
    return {row,blocks:data.blocks.filter(b=>b.kind==='science'&&b.id.match(/^(T24-1|NIR-1|SN-1|COMET-1)$/)).map(b=>{
      const inWindow=stamp>=Date.parse(b.window_start)&&stamp<Date.parse(b.window_end);
      const c=b.constraints,issues=[], end=stamp+b.duration_s*1000;
      const samples=data.weather.filter(w=>Date.parse(w.start)<end&&Date.parse(w.end)>stamp);
      if(!row||!samples.length) issues.push('No weather data');
      else {
        if(samples.some(w=>w.seeing_arcsec>c.seeing_max))issues.push('Seeing');
        if(samples.some(w=>w.transparency<c.transparency_min))issues.push('Transparency');
        if(c.pwv_max!==undefined&&samples.some(w=>w.pwv_mm>c.pwv_max))issues.push('Water vapour');
      }
      return {block:b,inWindow,issues,weatherPass:issues.length===0,fits:end<=Date.parse(b.window_end)};
    })};
  }
  // A requirement-derived sequence, not a running shop or a recorded model result.
  function checkout(data, step) {
    if(!Number.isInteger(step)||step<0||step>3)throw new RangeError('Unknown checkout step');
    const product=data.catalog.find(p=>p.key==='moon-poster-edition');
    const paid=step>=2;
    return {priceCents:product.priceCents,orders:1,paymentAttempts:1,
      status:paid?'Paid':'Awaiting payment',onHand:product.stock-(paid?1:0),
      reserved:paid?0:1,available:product.stock-1,
      requests:step===0?1:2,acceptedPayments:paid?1:0};
  }
  function education(data, mode) {
    const cohort=data.cohorts[mode];
    if(!cohort)throw new RangeError('Unknown cohort');
    const rows=cohort.anchors.map(row=>({...row,gap:row.B.percent-row.A.percent}));
    return {counts:cohort.counts,rows,largest:rows.reduce((a,b)=>Math.abs(a.gap)>Math.abs(b.gap)?a:b)};
  }
  return {metro,rover,weather,checkout,education};
})();
if(typeof module!=='undefined')module.exports=ShowcaseRules;
