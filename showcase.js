/* Source-grounded task mechanics, not solver recordings. No original task code runs here. */
(() => {
  'use strict';
  const host=document.querySelector('#task-gallery');
  if(!host)return;
  const D=SHOWCASE_DATA,R=ShowcaseRules;
  const instructionNames={checkout:'E-commerce',api:'API migration',sync:'Offline collaboration',retrieval:'AI search',finetuning:'LLM fine-tuning',education:'Education'};
  const steps=(items)=>`<div class="environment-journey"><b>Full task</b>${items.map((s,i)=>`<span>${s}</span>${i<items.length-1?'<i aria-hidden="true">→</i>':''}`).join('')}</div>`;
  const buttons=(id,labels)=>`<div class="environment-choices" role="group" aria-label="${id}">${labels.map((label,i)=>`<button type="button" data-choice="${i}" aria-pressed="${i===0}">${label}</button>`).join('')}</div>`;
  host.innerHTML=`
  <div class="environment-index" role="tablist" aria-label="Environment examples">
    ${Object.entries(instructionNames).map(([kind,name],i)=>`<button type="button" role="tab" id="environment-tab-${kind}" data-environment="${kind}" aria-controls="environment-${kind}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${name}</button>`).join('')}
  </div>
  <article class="environment-case" id="environment-checkout">
    <header class="environment-heading"><div><span class="environment-domain">Software engineering</span><h3>Build a reliable<br>online checkout.</h3></div><p>The last poster. Two checkout requests. A delayed payment event. The agent must make the whole purchase journey work—not just the success page.</p></header>
    <div class="environment-workspace checkout-workspace">
      <div class="environment-visual"><div class="environment-topline"><span>Harborlight Editions</span><span>Required checkout behavior</span></div>
        <div class="checkout-preview" id="checkout-drawing"></div>
        ${buttons('Follow the checkout sequence',['Reserve','Retry request','Confirm payment','Replay events'])}
      </div>
      <aside class="environment-feedback" id="checkout-feedback" aria-live="polite" aria-atomic="true"></aside>
    </div>
    ${steps(['Build the storefront & backend','Handle retries & payment events','Verify ownership, stock & recovery'])}
  </article>
  <article class="environment-case" id="environment-api">
    <header class="environment-heading"><div><span class="environment-domain">Software engineering · Backend development</span><h3>Upgrade the API.<br>Keep every client working.</h3></div><p>Three clients need a new contract. One legacy integration cannot change. The agent must ship the new API without breaking the workflows already in use.</p></header>
    <div class="environment-workspace software-workspace">
      <div class="environment-visual"><div class="environment-topline"><span>ParcelFlow</span><span>Client compatibility</span></div>
        <div class="api-preview" id="api-drawing"></div>
        ${buttons('Follow the API migration',['Existing clients','Introduce v2','Migrate clients'])}
      </div>
      <aside class="environment-feedback" id="api-feedback" aria-live="polite" aria-atomic="true"></aside>
    </div>
    ${steps(['Inspect contracts & clients','Implement v2 alongside v1','Test pagination, retries & permissions'])}
  </article>
  <article class="environment-case" id="environment-sync">
    <header class="environment-heading"><div><span class="environment-domain">Software engineering · TypeScript & CRDTs</span><h3>Edit offline.<br>Bring every change back.</h3></div><p>Two tablets edit the same notebook without a connection. The agent must make their histories converge, survive a restart, and stay correct when messages are replayed.</p></header>
    <div class="environment-workspace software-workspace">
      <div class="environment-visual"><div class="environment-topline"><span>Survey notebook</span><span>Independent local stores</span></div>
        <div class="sync-preview" id="sync-drawing"></div>
        ${buttons('Follow the offline editing sequence',['Shared document','Edit offline','Reconnect','Restart'])}
      </div>
      <aside class="environment-feedback" id="sync-feedback" aria-live="polite" aria-atomic="true"></aside>
    </div>
    ${steps(['Implement edits & causal history','Synchronize independent peers','Verify restart, replay & compaction'])}
  </article>
  <article class="environment-case" id="environment-retrieval">
    <header class="environment-heading"><div><span class="environment-domain">Machine learning & AI</span><h3>Search beyond<br>exact keywords.</h3></div><p>An error code and a plain-language question can point to the same procedure. The agent must connect both to current, traceable documentation.</p></header>
    <div class="environment-workspace retrieval-workspace">
      <div class="environment-visual"><div class="environment-topline"><span>Cinderline knowledge base</span><span>Queries & source excerpts</span></div>
        <div class="retrieval-query-modes" role="group" aria-label="Query wording"><button type="button" data-mode="exact" aria-pressed="true">Error code</button><button type="button" data-mode="semantic" aria-pressed="false">In plain language</button></div>
        <div class="retrieval-preview" id="retrieval-drawing"></div>
        ${buttons('Choose a support topic',['Certificate renewal','Event replay','Regional failover'])}
      </div>
      <aside class="environment-feedback" id="retrieval-feedback" aria-live="polite" aria-atomic="true"></aside>
    </div>
    ${steps(['Parse & update the corpus','Combine lexical & semantic search','Evaluate relevance & source freshness'])}
  </article>
  <article class="environment-case" id="environment-finetuning">
    <header class="environment-heading"><div><span class="environment-domain">Machine learning & AI · Model post-training</span><h3>Fine-tune an assistant.<br>Deliver a usable model.</h3></div><p>Mixed-format examples, preference pairs, and an unfinished training history. The agent must build the pipeline, evaluate the model, and ship a release that loads in a fresh process.</p></header>
    <div class="environment-workspace software-workspace">
      <div class="environment-visual"><div class="environment-topline"><span>Asterion assistant</span><span>Training-to-release workflow</span></div>
        <div class="finetuning-preview" id="finetuning-drawing"></div>
        ${buttons('Explore the model development requirements',['Prepare data','SFT','Preferences','Release'])}
      </div>
      <aside class="environment-feedback" id="finetuning-feedback" aria-live="polite" aria-atomic="true"></aside>
    </div>
    ${steps(['Normalize data & recover run state','Train SFT, then preference optimization','Evaluate & reload the full release'])}
  </article>
  <article class="environment-case" id="environment-education">
    <header class="environment-heading"><div><span class="environment-domain">Education & assessment</span><h3>Make exam scores<br>comparable.</h3></div><p>A revised exam needs a defensible link to the original scale. The agent must investigate shared questions, different cohorts, and uncertainty before recommending how scores can be used.</p></header>
    <div class="environment-workspace education-workspace">
      <div class="environment-visual"><div class="environment-topline"><span>Harborline Numeracy</span><span>12 shared questions</span></div>
        <div class="environment-drawing" id="education-drawing"></div>
        ${buttons('Compare exam cohorts',['All examinees','Test centre','Remote'])}
      </div>
      <aside class="environment-feedback" id="education-feedback" aria-live="polite" aria-atomic="true"></aside>
    </div>
    ${steps(['Validate responses & study design','Investigate anchors & fit the link','Quantify uncertainty & justify use'])}
  </article>`;

  // Preserve each public task instruction verbatim, as inert text rather than HTML.
  // Each case keeps its own instruction and interaction state while inactive.
  for(const [kind,name] of Object.entries(instructionNames)){
    const details=document.createElement('details');
    details.className='environment-instruction';
    const summary=document.createElement('summary');
    summary.textContent='Task instruction';
    summary.setAttribute('aria-label',`Task instruction: ${name}`);
    const content=document.createElement('pre');
    content.className='environment-instruction-text';
    content.textContent=D.instructions[kind];
    content.tabIndex=0;
    content.setAttribute('role','region');
    content.setAttribute('aria-label',`Original instruction: ${name}`);
    details.append(summary,content);
    host.querySelector(`#environment-${kind}`).append(details);
  }

  // Manual tabs: do not move the page or reset a case when switching examples.
  const environmentTabs=[...host.querySelectorAll('[data-environment]')];
  const environmentPanels=environmentTabs.map(tab=>host.querySelector(`#${tab.getAttribute('aria-controls')}`));
  environmentPanels.forEach((panel,i)=>{
    panel.setAttribute('role','tabpanel');
    panel.setAttribute('aria-labelledby',environmentTabs[i].id);
    panel.tabIndex=0;
  });
  function activateEnvironment(kind,focus=false){
    const index=environmentTabs.findIndex(tab=>tab.dataset.environment===kind);
    if(index<0)return;
    environmentTabs.forEach((tab,i)=>{
      tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;
      environmentPanels[i].hidden=i!==index;
    });
    if(focus)environmentTabs[index].focus({preventScroll:true});
  }
  const environmentIndex=host.querySelector('.environment-index');
  environmentIndex.addEventListener('click',event=>{
    const tab=event.target.closest('[data-environment]');
    if(tab)activateEnvironment(tab.dataset.environment);
  });
  environmentIndex.addEventListener('keydown',event=>{
    const tab=event.target.closest('[data-environment]');
    if(!tab)return;
    const index=environmentTabs.indexOf(tab),last=environmentTabs.length-1;
    const next={ArrowRight:(index+1)%(last+1),ArrowLeft:(index+last)%(last+1),Home:0,End:last}[event.key];
    if(next===undefined)return;
    event.preventDefault();event.stopPropagation();
    activateEnvironment(environmentTabs[next].dataset.environment,true);
  });
  function environmentFromHash(){return location.hash.replace(/^#environment-/,'');}
  activateEnvironment(Object.hasOwn(instructionNames,environmentFromHash())?environmentFromHash():'checkout');
  window.addEventListener('hashchange',()=>{
    const kind=environmentFromHash();
    if(!Object.hasOwn(instructionNames,kind))return;
    activateEnvironment(kind);
    host.querySelector(`#environment-${kind}`).scrollIntoView({block:'start',behavior:'instant'});
  });

  function select(group,choice){group.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.choice)===choice)));}
  const tag=(text,kind='')=>`<span class="environment-status ${kind}">${text}</span>`;

  const checkoutHost=host.querySelector('#environment-checkout');
  function renderCheckout(choice){
    const m=R.checkout(D.checkout,choice),paid=m.status==='Paid';
    const events=[['Checkout accepted','One order · one reserved poster'],['Same request repeated','Return the existing order'],['Payment success received','Convert the reservation to sold'],['Duplicate + late failure received','Keep the order paid; do not change stock']];
    host.querySelector('#checkout-drawing').innerHTML=`<div class="checkout-order"><div><span>Moon Poster Edition</span><strong>$${(m.priceCents/100).toFixed(2)}</strong></div><span class="checkout-state ${paid?'is-paid':''}">${m.status}</span></div>
      <ol class="checkout-events">${events.map(([title,desc],i)=>`<li class="${i<choice?'is-complete':i===choice?'is-current':'is-upcoming'}"><span class="checkout-event-number">${i+1}</span><div><b>${title}</b><span>${desc}</span></div>${i<choice?'<span class="checkout-tick" aria-label="Earlier step">✓</span>':''}</li>`).join('')}</ol>
      <div class="checkout-ledger"><div><strong>${m.orders}</strong><span>Order</span></div><div><strong>${m.reserved}</strong><span>Reserved</span></div><div><strong>${m.acceptedPayments}</strong><span>Sold</span></div><div><strong>${m.available}</strong><span>Available</span></div></div>`;
    const titles=['One copy. One reservation.','A retry is not another purchase.','Payment changes the inventory.','Paid stays paid.'];
    const desc=['The poster starts with one copy. A pending order reserves it, so another customer cannot buy the same stock.','Repeating the same checkout request must return the existing order—not charge again or reserve another copy.','Only the verified payment callback can mark the order paid and convert reserved stock into a sale.','A duplicate success event must have no second effect. A later failure event must not undo an already paid order.'];
    host.querySelector('#checkout-feedback').innerHTML=`${tag(choice===3?'Safe under retries':'State consistency')}<h4>${titles[choice]}</h4><p>${desc[choice]}</p><div class="environment-consequence"><b>The full task</b><span>Build and test a persistent browser, API, database, and payment flow.</span></div><p class="environment-bound">Requirement-based walkthrough, not a running shop or an agent’s implementation.</p>`;
    select(checkoutHost,choice);
  }
  checkoutHost.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>renderCheckout(Number(b.dataset.choice))));
  renderCheckout(0);

  const retrievalHost=host.querySelector('#environment-retrieval');
  let retrievalChoice=0,retrievalMode='exact';
  const escapeText=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderRetrieval(){
    const t=D.retrieval.topics[retrievalChoice],exact=retrievalMode==='exact';
    const marked=s=>`<mark>${escapeText(s)}</mark>`;
    const query=exact?t.exactQuery:t.semanticQuery;
    host.querySelector('#retrieval-drawing').innerHTML=`<div class="retrieval-query"><span>Query</span><p class="${exact?'is-technical':''}">${escapeText(query)}</p></div>
      <div class="retrieval-bridge" aria-hidden="true"><span>↓</span><span>${exact?'Preserve exact identifiers':'Connect wording with meaning'}</span></div>
      <div class="retrieval-document"><div class="retrieval-document-heading"><b>${escapeText(t.component[0].toUpperCase()+t.component.slice(1))} runbook</b><span>v${t.version}</span></div>
        <p>Product version ${t.version} uses ${exact?marked(t.field):escapeText(t.field)} and reports ${exact?marked(t.error):escapeText(t.error)}. The supported operator switch is ${exact?marked(t.flag):escapeText(t.flag)}.</p>
        <p>Use this runbook when an operator must ${exact?escapeText(t.concept):marked(t.concept)}.</p>
      </div>`;
    host.querySelector('#retrieval-feedback').innerHTML=`${tag(exact?'Lexical evidence':'Semantic evidence')}<h4>${exact?'Keep the technical detail.':'Different words. The same need.'}</h4><p>${exact?'Error identifiers, version strings, and command flags carry precise meaning. The index must preserve them across document formats.':'A user may describe the operational goal without knowing its error code. The task requires embedding-based retrieval alongside keyword search.'}</p><div class="environment-consequence"><b>Beyond a single query</b><span>Apply document revisions and deletions, retain passage provenance, and evaluate the combined ranking.</span></div><p class="environment-bound">Source-derived query–passage pairings; no live retrieval or measured ranking is shown.</p>`;
    select(retrievalHost,retrievalChoice);
    retrievalHost.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===retrievalMode)));
  }
  retrievalHost.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{retrievalChoice=Number(b.dataset.choice);renderRetrieval();}));
  retrievalHost.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{retrievalMode=b.dataset.mode;renderRetrieval();}));
  renderRetrieval();

  const educationHost=host.querySelector('#environment-education'),modes=['all','center','remote'];
  const eduX=p=>83+p*4.96;
  // A fixed 0–100% scale across modes. Shapes and labels distinguish both forms.
  host.querySelector('#education-drawing').innerHTML=`<svg viewBox="0 0 660 394" role="img" aria-labelledby="edu-chart-title edu-chart-desc"><title id="edu-chart-title">Observed correct-answer rates on shared questions</title><desc id="edu-chart-desc"></desc>
    <text x="20" y="23" class="svg-label">Observed correct answers (%)</text>
    <circle cx="419" cy="18" r="4.5" fill="#4d7bac"/><text x="431" y="23">Form A</text><path d="M514 13l5 5-5 5-5-5z" fill="#0d95a2"/><text x="526" y="23">Form B</text>
    ${[0,25,50,75,100].map(p=>`<line x1="${eduX(p)}" x2="${eduX(p)}" y1="40" y2="337" stroke="#dfe9ee"/><text x="${eduX(p)}" y="361" text-anchor="middle">${p}</text>`).join('')}
    <rect x="14" y="263" width="626" height="25" rx="3" fill="#e1f0f5"/>
    ${D.education.cohorts.all.anchors.map((r,i)=>{const y=50+i*25;return `<g class="education-row" data-item="${r.id}"><text x="23" y="${y+5}">${String(i+1).padStart(2,'0')}</text><line class="education-gap" x1="${eduX(r.A.percent)}" x2="${eduX(r.B.percent)}" y1="${y}" y2="${y}" stroke="#99b8c8" stroke-width="2"/><g class="education-a" style="transform:translate(${eduX(r.A.percent)}px,${y}px)"><circle r="4.5" fill="#4d7bac"/></g><g class="education-b" style="transform:translate(${eduX(r.B.percent)}px,${y}px)"><path d="M0-5l5 5-5 5-5-5z" fill="#0d95a2"/></g><title></title></g>`;}).join('')}
    <text x="20" y="389" class="svg-label" id="education-cohort-size"></text></svg>`;
  function renderEducation(choice){
    const m=R.education(D.education,modes[choice]),focus=m.rows.find(r=>r.id==='K10');
    m.rows.forEach((r,i)=>{
      const row=host.querySelector(`.education-row[data-item="${r.id}"]`),y=50+i*25;
      row.querySelector('.education-gap').setAttribute('x1',eduX(r.A.percent));row.querySelector('.education-gap').setAttribute('x2',eduX(r.B.percent));
      row.querySelector('.education-a').style.transform=`translate(${eduX(r.A.percent)}px,${y}px)`;row.querySelector('.education-b').style.transform=`translate(${eduX(r.B.percent)}px,${y}px)`;
      row.querySelector('title').textContent=`Question ${i+1}: Form A ${r.A.percent.toFixed(1)}%, Form B ${r.B.percent.toFixed(1)}%.`;
    });
    host.querySelector('#education-cohort-size').textContent=`${['All examinees','Test centre','Remote'][choice]} · Form A: ${m.counts.A.toLocaleString('en-US')} · Form B: ${m.counts.B.toLocaleString('en-US')}`;
    host.querySelector('#edu-chart-desc').textContent=m.rows.map((r,i)=>`Question ${i+1}: A ${r.A.percent.toFixed(1)}%, B ${r.B.percent.toFixed(1)}%`).join('; ');
    host.querySelector('#education-feedback').innerHTML=`${tag('Inspect the same shared question')}<h4>${['A common item is not enough.','Separate the testing modes.','The subgroup changes the picture.'][choice]}</h4><div class="education-comparison"><span>Question 10 · correct answers</span><div><b>${focus.A.percent.toFixed(1)}<small>%</small><em>Form A</em></b><i>→</i><b>${focus.B.percent.toFixed(1)}<small>%</small><em>Form B</em></b></div></div><p>${['The two exams share these questions, but their examinee groups differ. Matching raw scores alone cannot establish comparability.','At the test centre, question 10 has closer observed rates. Compare the remote cohort before treating an aggregate gap as item behavior.','For remote examinees, the observed gap is larger. The agent must investigate cohort composition and anchor stability before linking scores.'][choice]}</p><p class="environment-bound">Rates computed from synthetic task inputs. Descriptive, unadjusted comparisons—not an equating result or evidence of bias.</p>`;
    select(educationHost,choice);
  }
  educationHost.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>renderEducation(Number(b.dataset.choice))));
  renderEducation(0);


  // These are task-contract walkthroughs, never claimed as agent executions.
  const apiHost=host.querySelector('#environment-api');
  function renderApi(choice){
    const dual=choice>0,migrated=choice===2;
    const version=i=>migrated&&i<3?'v2':'v1';
    host.querySelector('#api-drawing').innerHTML=`<div class="api-routing ${dual?'is-dual':''}">
      <div class="api-routing-label"><span>Independent consumers</span><span>Required endpoint</span></div>
      ${D.api.clients.map((client,i)=>`<div class="api-client ${version(i)==='v2'?'is-v2':''}"><div><b>${escapeText(client)}</b><span>${['Dispatch workflow','Billing workflow','Support workflow','Frozen legacy integration'][i]}</span></div><i class="api-wire" aria-hidden="true"></i><code>/${version(i)}/shipments</code></div>`).join('')}
      <div class="api-versions"><span><i></i>v1 remains available</span><span class="${dual?'is-available':''}"><i></i>${dual?'v2 contract added':'v2 not yet implemented'}</span></div>
      <div class="api-contract"><span>${dual?'v2 shipment fields':'Migration requirement'}</span><p>${dual?'<code>id</code><code>state</code><code>dropoff</code><code>delivery_window</code>':'One service. Four independent consumers.'}</p></div>
    </div>`;
    const titles=['A working starting point.','New contract. Existing commitments.','Three move forward. One stays.'];
    const text=['The supplied v1 service already works. The task is to change it safely—not replace it with a new demo.','Add the approved v2 schema and behavior while retaining the existing v1 API. Publishing a schema alone is not completion.','Dispatch, billing, and support must use v2. The frozen labeler must still complete its v1 workflow.'];
    host.querySelector('#api-feedback').innerHTML=`${tag('Required compatibility')}<h4>${titles[choice]}</h4><p>${text[choice]}</p><div class="environment-consequence"><b>Beyond a route rename</b><span>Follow server pagination, preserve idempotency after a lost response, and keep authorization enforced.</span></div><p class="environment-bound">Contract-based migration walkthrough, not a running API or test result.</p>`;
    select(apiHost,choice);
  }
  apiHost.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>renderApi(Number(b.dataset.choice))));
  renderApi(0);

  const syncHost=host.querySelector('#environment-sync');
  function renderSync(choice){
    const joined=choice>=2;
    const items=D.sync.base.actionItems.filter(x=>['act-cable','act-hinge'].includes(x.id));
    host.querySelector('#sync-drawing').innerHTML=`<div class="sync-document-title"><b>${escapeText(D.sync.base.metadata.siteName)}</b><span>Shared field notebook</span></div>
      <div class="sync-peers ${joined?'is-connected':''}">
      ${['Tablet A','Tablet B'].map((label,peer)=>`<div class="sync-notebook"><div class="sync-device-heading"><b>${label}</b><span>${choice===1?'Offline':choice===3?'Reopened':'Local store'}</span></div><span class="sync-note-label">Action items</span>
        ${items.map((item,i)=>{const resolved=joined||(choice===1&&peer===i);return `<div class="sync-action ${resolved?'is-resolved':''}"><span class="sync-checkbox" aria-hidden="true">${resolved?'✓':''}</span><div><p>${escapeText(item.description)}</p><span>${resolved?'Resolved':escapeText(item.status[0].toUpperCase()+item.status.slice(1))}</span></div></div>`;}).join('')}
      </div>`).join('')}</div>
      <div class="sync-connection ${joined?'is-connected':''}"><i aria-hidden="true"></i><span>${['Same starting history','Two independent offline edits','Both changes retained on both peers','Both changes retained after restart'][choice]}</span><i aria-hidden="true"></i></div>`;
    const titles=['One document. Two stores.','Neither edit can be discarded.','Merge history, not snapshots.','Correctness must survive reopening.'];
    const text=['Both peers start from the supplied notebook, with distinct actor identities and independent storage.','In this illustrative edit sequence, each tablet resolves a different action. A last-writer replacement would lose one update.','Real Automerge sync messages must preserve both branches. Replaying a valid message must not duplicate the application update.','Persist the document, causal history, and sync state. Compaction must still allow an offline peer to catch up.'];
    host.querySelector('#sync-feedback').innerHTML=`${tag(joined?'Required convergence':'Offline-first collaboration')}<h4>${titles[choice]}</h4><p>${text[choice]}</p><div class="environment-consequence"><b>The full coding task</b><span>Implement the TypeScript repository and peer runtime, then test actual independent processes.</span></div><p class="environment-bound">Illustrative edits to the supplied document; expected behavior, not a live CRDT engine.</p>`;
    select(syncHost,choice);
  }
  syncHost.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>renderSync(Number(b.dataset.choice))));
  renderSync(0);

  const fineHost=host.querySelector('#environment-finetuning');
  function renderFinetuning(choice){
    const counts=D.finetuning.counts,pair=D.finetuning.preference;
    const phases=['Data','SFT','Preferences','Release'];
    let body='';
    if(choice===0)body=`<div class="training-data-summary">${[[counts.sft,'SFT examples'],[counts.preferences,'Preference pairs'],[counts.evaluation,'Evaluation cases']].map(([n,label])=>`<div><strong>${n}</strong><span>${label}</span></div>`).join('')}</div><div class="training-insight"><b>Different schemas. One conversation format.</b><p>Normalize legacy and message-based records without changing roles or content. Keep evaluation data out of training.</p></div>`;
    if(choice===1)body=`<div class="training-conversation"><div><span>system</span><p>${escapeText(pair.prompt.find(x=>x.role==='system').content)}</p></div><div><span>user</span><p>${escapeText(pair.prompt.find(x=>x.role==='user').content)}</p></div><div class="is-target"><span>assistant</span><p>Preserve the response-loss representation and use the same chat template at training and inference.</p></div></div>`;
    if(choice===2)body=`<div class="preference-context"><b>Preference training pair</b><span>Supplied review-card excerpts</span></div><div class="preference-pair"><div class="is-chosen"><span>Chosen</span><p>${escapeText(pair.chosen[0].content)}</p></div><div><span>Rejected</span><p>${escapeText(pair.rejected[0].content)}</p></div></div>`;
    if(choice===3)body=`<div class="release-artifacts"><span>Full-weight model release</span><h4>More than a checkpoint.</h4><div>${['Configuration','Model weights','Tokenizer','Chat template'].map(x=>`<span>${x}</span>`).join('')}</div><p>Load with AutoTokenizer and AutoModelForCausalLM in a fresh offline process.</p></div><div class="training-insight"><b>Evaluation is part of the release.</b><p>Run all held-out and protected cases with the real model. Preserve settings, per-row results, and training lineage.</p></div>`;
    host.querySelector('#finetuning-drawing').innerHTML=`<ol class="training-pipeline">${phases.map((label,i)=>`<li class="${i===choice?'is-active':''}"><span>${String(i+1).padStart(2,'0')}</span><b>${label}</b></li>`).join('')}</ol><div class="training-stage">${body}</div>`;
    const titles=['Start with the actual data.','Build a reproducible SFT run.','Learn from the preferred response.','A model someone else can load.'];
    const text=['The provided catalog has separate supervised, preference, and evaluation splits. The agent must connect them to an executable pipeline.','Inspect prior training history before resuming. Model weights alone cannot restore optimizer state or training progress.','Run preference optimization after SFT, using the immutable base as the reference. Preserve chosen-before-rejected semantics.','The task ends with a Hugging Face-compatible directory and verified generation—not a report or canned responses.'];
    host.querySelector('#finetuning-feedback').innerHTML=`${tag('Model development requirements')}<h4>${titles[choice]}</h4><p>${text[choice]}</p><div class="environment-consequence"><b>One connected workflow</b><span>Data roles, loss masking, checkpoints, preference references, evaluation, and offline inference must agree.</span></div><p class="environment-bound">Source data and required workflow; no training run or model score is simulated.</p>`;
    select(fineHost,choice);
  }
  fineHost.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>renderFinetuning(Number(b.dataset.choice))));
  renderFinetuning(0);
  // Animate each diagram when it first becomes visible, and on deliberate changes.
  // The finite motion illustrates connectivity; it has no physical-time meaning.
  if('IntersectionObserver' in window){
    const entrance=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('has-arrived');entrance.unobserve(entry.target);}
    }),{threshold:.22});
    host.querySelectorAll('.environment-case').forEach(el=>entrance.observe(el));
  } else host.querySelectorAll('.environment-case').forEach(el=>el.classList.add('has-arrived'));
})();
