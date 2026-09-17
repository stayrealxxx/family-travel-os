(()=>{
  const hero=document.getElementById('today');
  if(!hero || document.getElementById('countdownFinalRing')) return;

  const style=document.createElement('style');
  style.textContent=`
  /* Keep the entire app in the same visual family as Journey Ring. */
  body{background:
    radial-gradient(circle at 50% -10%,rgba(83,214,255,.16),transparent 34%),
    radial-gradient(circle at 95% 34%,rgba(37,126,153,.10),transparent 30%),
    linear-gradient(180deg,#eaf5f7 0%,#f5f8fb 48%,#edf4f6 100%) fixed!important;
    transition:background .35s ease}
  body:before{background:radial-gradient(circle,rgba(83,214,255,.34),transparent 68%)!important;opacity:.20!important}
  body:after{background:radial-gradient(circle,rgba(55,129,160,.30),transparent 68%)!important;opacity:.18!important}
  .aurora{background:
    radial-gradient(circle at 82% 8%,rgba(83,214,255,.14),transparent 25%),
    radial-gradient(circle at 8% 55%,rgba(32,115,133,.09),transparent 29%),
    linear-gradient(180deg,rgba(17,43,67,.04),transparent 31%)!important}
  [data-theme="dark"] body{background:
    radial-gradient(circle at 50% -8%,rgba(83,214,255,.12),transparent 30%),
    radial-gradient(circle at 92% 32%,rgba(27,97,118,.18),transparent 34%),
    linear-gradient(180deg,#08131f 0%,#0b1724 46%,#0d1d2b 100%) fixed!important}
  [data-theme="dark"] body:before{background:radial-gradient(circle,rgba(83,214,255,.24),transparent 68%)!important;opacity:.20!important}
  [data-theme="dark"] body:after{background:radial-gradient(circle,rgba(71,111,199,.22),transparent 68%)!important;opacity:.18!important}
  [data-theme="dark"] .aurora{background:
    radial-gradient(circle at 82% 8%,rgba(83,214,255,.10),transparent 26%),
    radial-gradient(circle at 8% 55%,rgba(34,123,143,.11),transparent 30%),
    linear-gradient(180deg,rgba(17,43,67,.10),transparent 34%)!important}
  .top:before{background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 82%,#dff2f6 18%) 68%,transparent)!important}
  [data-theme="dark"] .top:before{background:linear-gradient(180deg,rgba(9,20,32,.95) 68%,transparent)!important}

  .hero.cd-mode-d{background:linear-gradient(160deg,#0e1b2c,#112b43 55%,#103a47);border-color:rgba(94,213,255,.16);box-shadow:0 24px 68px rgba(4,23,39,.34);color:#f4fbff;overflow:hidden}
  .hero.cd-mode-d:before,.hero.cd-mode-d:after{display:none}.hero.cd-mode-d .countdown{display:none}
  .hero.cd-mode-d .eyebrow,.hero.cd-mode-d .hero-sub,.hero.cd-mode-d .progress-top,.hero.cd-mode-d .next-main span{color:#9fb9c8}
  .hero.cd-mode-d .next-strip{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.09)}.hero.cd-mode-d .next-place{color:#75dcff}
  .hero.cd-mode-d .track{background:rgba(255,255,255,.09)}.hero.cd-mode-d .fill{background:linear-gradient(90deg,#53d6ff,#6c63ff);box-shadow:0 0 24px rgba(83,214,255,.24)}
  .journey-ring{position:relative;z-index:2;display:grid;grid-template-columns:160px 1fr;gap:20px;align-items:center;margin-top:16px;padding:4px 0 2px}
  .journey-orbit{position:relative;width:160px;height:160px;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}.journey-orbit svg{width:160px;height:160px;transform:rotate(-90deg)}
  .journey-bg{fill:none;stroke:rgba(255,255,255,.08);stroke-width:10}.journey-progress{fill:none;stroke:url(#journeyGrad);stroke-width:10;stroke-linecap:round;stroke-dasharray:339.292;stroke-dashoffset:339.292;transition:stroke-dashoffset .55s ease}
  .journey-core{position:absolute;inset:0;display:grid;place-content:center;text-align:center}.journey-core b{font-size:46px;letter-spacing:-.065em;line-height:.88}.journey-core span{font-size:9px;letter-spacing:.18em;color:#8faec0;margin-top:8px}
  .journey-plane{position:absolute;inset:7px;animation:journeyOrbit 13s linear infinite}.journey-plane span{position:absolute;left:50%;top:-6px;transform:translateX(-50%) rotate(90deg);font-size:17px;filter:drop-shadow(0 3px 5px rgba(0,0,0,.25))}@keyframes journeyOrbit{to{transform:rotate(360deg)}}
  .journey-copy h4{margin:0;font-size:11px;color:#8faec0;letter-spacing:.14em;text-transform:uppercase}.journey-hms{font-size:clamp(24px,6vw,38px);font-weight:950;letter-spacing:-.045em;margin-top:8px;font-variant-numeric:tabular-nums}.journey-copy p{font-size:11px;color:#9fb9c8;line-height:1.5;margin:8px 0 0;max-width:360px}.journey-mini{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.journey-chip{font-size:9px;font-weight:900;letter-spacing:.06em;padding:6px 9px;border:1px solid rgba(255,255,255,.09);border-radius:999px;background:rgba(255,255,255,.045);color:#cfe8f3}
  .journey-glow{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:inherit;z-index:0}.journey-glow:before,.journey-glow:after{content:"";position:absolute;border-radius:50%;filter:blur(46px);opacity:.28}.journey-glow:before{width:260px;height:260px;left:-80px;top:-100px;background:#53d6ff}.journey-glow:after{width:280px;height:280px;right:-100px;bottom:-130px;background:#6c63ff}
  @media(max-width:560px){.journey-ring{grid-template-columns:126px 1fr;gap:14px}.journey-orbit,.journey-orbit svg{width:126px;height:126px}.journey-core b{font-size:36px}.journey-hms{font-size:24px}.journey-copy p{font-size:10px}}
  @media(max-width:390px){.journey-ring{grid-template-columns:1fr}.journey-orbit{margin:auto}.journey-copy{text-align:center}.journey-copy p{margin-left:auto;margin-right:auto}.journey-mini{justify-content:center}}
  @media(prefers-reduced-motion:reduce){.journey-plane{animation:none!important}}
  `;
  document.head.appendChild(style);

  function syncBrowserChrome(){
    const dark=document.documentElement.dataset.theme==='dark';
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content',dark?'#08131f':'#dfeff3');
  }
  syncBrowserChrome();
  new MutationObserver(syncBrowserChrome).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

  hero.classList.add('cd-mode-d');
  localStorage.setItem('travel.countdownPreview','d');

  const glow=document.createElement('div');glow.className='journey-glow';hero.prepend(glow);
  const countdown=hero.querySelector('.countdown');
  if(!countdown) return;

  const ring=document.createElement('div');
  ring.id='countdownFinalRing';
  ring.className='journey-ring';
  ring.innerHTML=`
    <div class="journey-orbit">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs><linearGradient id="journeyGrad"><stop offset="0%" stop-color="#53d6ff"/><stop offset="100%" stop-color="#8a82ff"/></linearGradient></defs>
        <circle class="journey-bg" cx="60" cy="60" r="54"/>
        <circle class="journey-progress" id="journeyProgress" cx="60" cy="60" r="54"/>
      </svg>
      <div class="journey-core"><b id="journeyValue">--</b><span id="journeyUnit">DAYS</span></div>
      <div class="journey-plane"><span>✈️</span></div>
    </div>
    <div class="journey-copy">
      <h4 id="journeyKicker">Journey to departure</h4>
      <div class="journey-hms" id="journeyHms">-- : -- : --</div>
      <p id="journeyDescription">倒数到 West Coast Christmas。出发后圆环会自动切换成整段旅程进度。</p>
      <div class="journey-mini"><span class="journey-chip">PHL → SFO</span><span class="journey-chip">California</span><span class="journey-chip">LAX → PHL</span></div>
    </div>`;
  countdown.after(ring);

  const start=new Date('2026-12-23T08:00:00-05:00').getTime();
  const end=new Date('2027-01-02T21:30:00-05:00').getTime();
  const circumference=2*Math.PI*54;
  const value=document.getElementById('journeyValue');
  const unit=document.getElementById('journeyUnit');
  const hms=document.getElementById('journeyHms');
  const progress=document.getElementById('journeyProgress');
  const kicker=document.getElementById('journeyKicker');
  const desc=document.getElementById('journeyDescription');

  function pad(n){return String(n).padStart(2,'0')}
  function update(){
    const now=Date.now();
    if(now<start){
      let ms=Math.max(0,start-now),s=Math.floor(ms/1000),d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60),sec=s%60;
      value.textContent=d;unit.textContent='DAYS';hms.textContent=`${pad(h)} : ${pad(m)} : ${pad(sec)}`;kicker.textContent='Journey to departure';desc.textContent='倒数到 West Coast Christmas。出发后圆环会自动切换成整段旅程进度。';
      const horizon=120*86400000;const fraction=Math.max(0,Math.min(1,1-(start-now)/horizon));progress.style.strokeDashoffset=String(circumference*(1-fraction));
    }else if(now<=end){
      const pct=Math.max(0,Math.min(100,((now-start)/(end-start))*100));value.textContent=Math.round(pct);unit.textContent='% TRIP';
      let ms=end-now,s=Math.floor(ms/1000),d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);hms.textContent=`${d}D ${pad(h)}H ${pad(m)}M`;kicker.textContent='Trip progress';desc.textContent='圆环现在显示整段旅程完成度；下方仍会突出下一项行程。';progress.style.strokeDashoffset=String(circumference*(1-pct/100));
    }else{
      value.textContent='✓';unit.textContent='DONE';hms.textContent='TRIP COMPLETE';kicker.textContent='West Coast Christmas';desc.textContent='旅程已完成，行程继续保留为家庭旅行记录。';progress.style.strokeDashoffset='0';
    }
  }
  update();setInterval(update,1000);
})();
