(()=>{
  const style=document.createElement('style');
  style.textContent=`
  :root{
    --bg:#dcecf2 !important;
    --card:rgba(245,251,253,.78) !important;
    --card-solid:#f7fcfe !important;
    --text:#102739 !important;
    --muted:#617b8b !important;
    --line:rgba(35,91,119,.16) !important;
    --purple:#357e9d !important;
    --blue:#2e9fc5 !important;
    --cyan:#38b7c9 !important;
    --green:#258b67 !important;
    --red:#d85c55 !important;
    --gold:#b98216 !important;
    --shadow:0 18px 44px rgba(26,69,89,.14) !important;
    --shadow-soft:0 10px 28px rgba(26,69,89,.10) !important;
  }
  [data-theme="dark"]{
    --bg:#071521 !important;
    --card:rgba(11,31,49,.88) !important;
    --card-solid:#0d2237 !important;
    --text:#f6fbff !important;
    --muted:#91adbd !important;
    --line:rgba(152,205,229,.13) !important;
    --purple:#75dcff !important;
    --blue:#53d6ff !important;
    --cyan:#5ac7d8 !important;
    --green:#63c49d !important;
    --red:#ff8b83 !important;
    --gold:#ffd070 !important;
    --shadow:0 22px 58px rgba(2,14,26,.34) !important;
    --shadow-soft:0 12px 30px rgba(2,14,26,.24) !important;
  }
  html{background:var(--bg) !important}
  body{
    background:
      radial-gradient(circle at 8% 4%,rgba(83,214,255,.22),transparent 25%),
      radial-gradient(circle at 92% 18%,rgba(76,152,190,.14),transparent 28%),
      radial-gradient(circle at 48% 82%,rgba(90,199,216,.12),transparent 32%),
      linear-gradient(180deg,#e7f3f6 0%,#d6e9ef 38%,#cde4eb 72%,#d8ebf0 100%) !important;
    background-attachment:fixed !important;
  }
  [data-theme="dark"] body{
    background:
      radial-gradient(circle at 8% 4%,rgba(83,214,255,.12),transparent 25%),
      radial-gradient(circle at 92% 18%,rgba(108,99,255,.09),transparent 28%),
      linear-gradient(180deg,#071521 0%,#0a2032 44%,#071823 100%) !important;
  }
  body:before{background:radial-gradient(circle,#53d6ff,transparent 68%) !important;opacity:.12 !important}
  body:after{background:radial-gradient(circle,#6c9fbd,transparent 68%) !important;opacity:.09 !important}
  [data-theme="dark"] body:before{opacity:.14 !important}
  [data-theme="dark"] body:after{background:radial-gradient(circle,#6c63ff,transparent 68%) !important;opacity:.11 !important}
  .aurora{
    background:
      radial-gradient(circle at 82% 8%,rgba(83,214,255,.11),transparent 24%),
      radial-gradient(circle at 8% 55%,rgba(90,199,216,.09),transparent 26%),
      linear-gradient(180deg,rgba(17,43,67,.04),transparent 30%) !important;
  }
  .top:before{background:linear-gradient(180deg,rgba(231,243,246,.96) 68%,transparent) !important;opacity:1 !important}
  [data-theme="dark"] .top:before{background:linear-gradient(180deg,rgba(7,21,33,.98) 68%,transparent) !important}
  .bottom-nav{background:rgba(239,249,252,.90) !important;border-top-color:rgba(35,91,119,.14) !important}
  [data-theme="dark"] .bottom-nav{background:rgba(10,31,48,.90) !important;border-top-color:rgba(152,205,229,.13) !important}
  .circle{background:rgba(247,252,254,.86) !important;border-color:rgba(35,91,119,.16) !important}
  [data-theme="dark"] .circle{background:rgba(17,43,67,.82) !important;border-color:rgba(152,205,229,.13) !important}
  .card,.glass{background:var(--card) !important;border-color:var(--line) !important}
  .card,.glass,.weather-shell,.weather-card,.hero,.circle,.bottom-nav,.top:before{transition:background .32s ease,border-color .32s ease,color .32s ease,box-shadow .32s ease}
  .warn{color:var(--gold) !important}

  /* Journey Ring follows the same day/night toggle */
  .hero.cd-mode-d{
    background:linear-gradient(155deg,rgba(238,249,252,.96),rgba(213,237,245,.94) 56%,rgba(199,230,239,.92)) !important;
    border-color:rgba(38,116,150,.18) !important;
    box-shadow:0 22px 54px rgba(26,69,89,.15) !important;
    color:#102739 !important;
  }
  .hero.cd-mode-d .eyebrow,.hero.cd-mode-d .hero-sub,.hero.cd-mode-d .progress-top,.hero.cd-mode-d .next-main span{color:#607f90 !important}
  .hero.cd-mode-d .next-strip{background:rgba(255,255,255,.44) !important;border-color:rgba(35,91,119,.13) !important}
  .hero.cd-mode-d .next-place{color:#187da5 !important}.hero.cd-mode-d .track{background:rgba(35,91,119,.10) !important}
  .hero.cd-mode-d .fill{background:linear-gradient(90deg,#2e9fc5,#6f79dc) !important;box-shadow:0 0 20px rgba(46,159,197,.16) !important}
  .hero.cd-mode-d .journey-bg{stroke:rgba(35,91,119,.10) !important}.hero.cd-mode-d .journey-core span,.hero.cd-mode-d .journey-copy h4{color:#668596 !important}.hero.cd-mode-d .journey-copy p{color:#607f90 !important}.hero.cd-mode-d .journey-chip{background:rgba(255,255,255,.42) !important;border-color:rgba(35,91,119,.13) !important;color:#315e73 !important}
  .hero.cd-mode-d .journey-glow:before{background:#53d6ff !important;opacity:.42}.hero.cd-mode-d .journey-glow:after{background:#84a8ff !important;opacity:.34}
  [data-theme="dark"] .hero.cd-mode-d{background:linear-gradient(160deg,#0e1b2c,#112b43 55%,#103a47) !important;border-color:rgba(94,213,255,.16) !important;box-shadow:0 24px 68px rgba(4,23,39,.34) !important;color:#f4fbff !important}
  [data-theme="dark"] .hero.cd-mode-d .eyebrow,[data-theme="dark"] .hero.cd-mode-d .hero-sub,[data-theme="dark"] .hero.cd-mode-d .progress-top,[data-theme="dark"] .hero.cd-mode-d .next-main span{color:#9fb9c8 !important}
  [data-theme="dark"] .hero.cd-mode-d .next-strip{background:rgba(255,255,255,.05) !important;border-color:rgba(255,255,255,.09) !important}
  [data-theme="dark"] .hero.cd-mode-d .next-place{color:#75dcff !important}[data-theme="dark"] .hero.cd-mode-d .track{background:rgba(255,255,255,.09) !important}
  [data-theme="dark"] .hero.cd-mode-d .journey-bg{stroke:rgba(255,255,255,.08) !important}[data-theme="dark"] .hero.cd-mode-d .journey-core span,[data-theme="dark"] .hero.cd-mode-d .journey-copy h4{color:#8faec0 !important}[data-theme="dark"] .hero.cd-mode-d .journey-copy p{color:#9fb9c8 !important}[data-theme="dark"] .hero.cd-mode-d .journey-chip{background:rgba(255,255,255,.045) !important;border-color:rgba(255,255,255,.09) !important;color:#cfe8f3 !important}

  /* Weather deck follows the same card palette */
  .weather-shell{background:linear-gradient(155deg,rgba(239,249,252,.96),rgba(214,237,245,.94) 54%,rgba(204,233,240,.92)) !important;border-color:rgba(38,116,150,.18) !important;box-shadow:0 18px 44px rgba(26,69,89,.14) !important;color:#102739 !important}
  .weather-head p,.weather-city span,.weather-condition,.weather-local span,.weather-trip-note,.weather-footer,.weather-stat small,.weather-day .d{color:#607f90 !important}
  .weather-live,.weather-card.route-next:after,.weather-footer a,.weather-day .r{color:#187da5 !important}
  .weather-card{background:rgba(255,255,255,.42) !important;border-color:rgba(35,91,119,.13) !important}
  .weather-card.route-next{border-color:rgba(46,159,197,.38) !important;box-shadow:inset 0 0 0 1px rgba(46,159,197,.08),0 12px 28px rgba(26,69,89,.10) !important}
  .weather-stat,.weather-day{background:rgba(255,255,255,.38) !important}.weather-trip-note{border-top-color:rgba(35,91,119,.10) !important}.weather-trip-note strong{color:#244d61 !important}
  .weather-alert{background:rgba(214,168,55,.12) !important;border-color:rgba(185,130,22,.18) !important;color:#76520d !important}
  [data-theme="dark"] .weather-shell{background:linear-gradient(155deg,#0d1d30 0%,#12304a 52%,#0d3d48 100%) !important;border-color:rgba(110,220,255,.15) !important;box-shadow:0 18px 48px rgba(4,23,39,.24) !important;color:#f5fbff !important}
  [data-theme="dark"] .weather-head p,[data-theme="dark"] .weather-city span,[data-theme="dark"] .weather-condition,[data-theme="dark"] .weather-local span,[data-theme="dark"] .weather-trip-note,[data-theme="dark"] .weather-footer,[data-theme="dark"] .weather-stat small,[data-theme="dark"] .weather-day .d{color:#96afbf !important}
  [data-theme="dark"] .weather-live,[data-theme="dark"] .weather-card.route-next:after,[data-theme="dark"] .weather-footer a,[data-theme="dark"] .weather-day .r{color:#75dcff !important}
  [data-theme="dark"] .weather-card{background:rgba(255,255,255,.05) !important;border-color:rgba(255,255,255,.09) !important}
  [data-theme="dark"] .weather-stat,[data-theme="dark"] .weather-day{background:rgba(255,255,255,.045) !important}[data-theme="dark"] .weather-trip-note{border-top-color:rgba(255,255,255,.08) !important}[data-theme="dark"] .weather-trip-note strong{color:#dff7ff !important}
  [data-theme="dark"] .weather-alert{background:rgba(255,197,90,.10) !important;border-color:rgba(255,208,112,.16) !important;color:#ffe3aa !important}
  `;
  document.head.appendChild(style);

  const meta=document.querySelector('meta[name="theme-color"]');
  function syncThemeColor(){
    if(!meta) return;
    meta.setAttribute('content',document.documentElement.dataset.theme==='dark'?'#071521':'#dcecf2');
  }
  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
