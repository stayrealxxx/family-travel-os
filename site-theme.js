(()=>{
  const style=document.createElement('style');
  style.textContent=`
  :root{
    --bg:#edf4f9 !important;
    --card:rgba(250,252,253,.90) !important;
    --card-solid:#fafcfd !important;
    --text:#101820 !important;
    --muted:#6f7f8c !important;
    --line:rgba(74,103,121,.14) !important;
    --purple:#6fb8c7 !important;
    --blue:#77c4d2 !important;
    --cyan:#9adbe2 !important;
    --green:#3e9d78 !important;
    --red:#cf6d68 !important;
    --gold:#c58c2d !important;
    --shadow:0 16px 40px rgba(83,110,127,.10) !important;
    --shadow-soft:0 9px 24px rgba(83,110,127,.08) !important;
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
      linear-gradient(180deg,#d7e9ea 0 8px,transparent 8px),
      radial-gradient(circle at 83% 3%,rgba(198,229,233,.55),transparent 24%),
      radial-gradient(circle at 15% 14%,rgba(215,233,234,.72),transparent 30%),
      linear-gradient(180deg,#edf4f9 0%,#eef4fa 42%,#edf4f9 100%) !important;
    background-attachment:fixed !important;
  }
  [data-theme="dark"] body{
    background:
      radial-gradient(circle at 8% 4%,rgba(83,214,255,.12),transparent 25%),
      radial-gradient(circle at 92% 18%,rgba(108,99,255,.09),transparent 28%),
      linear-gradient(180deg,#071521 0%,#0a2032 44%,#071823 100%) !important;
  }
  body:before{background:radial-gradient(circle,#cfe9ec,transparent 68%) !important;opacity:.42 !important}
  body:after{background:radial-gradient(circle,#d7e9ea,transparent 68%) !important;opacity:.34 !important}
  [data-theme="dark"] body:before{background:radial-gradient(circle,#53d6ff,transparent 68%) !important;opacity:.14 !important}
  [data-theme="dark"] body:after{background:radial-gradient(circle,#6c63ff,transparent 68%) !important;opacity:.11 !important}

  .aurora{
    background:
      radial-gradient(circle at 82% 8%,rgba(198,229,233,.32),transparent 24%),
      radial-gradient(circle at 8% 55%,rgba(215,233,234,.28),transparent 26%),
      linear-gradient(180deg,rgba(237,244,249,.10),transparent 30%) !important;
  }
  [data-theme="dark"] .aurora{
    background:
      radial-gradient(circle at 82% 8%,rgba(83,214,255,.09),transparent 24%),
      radial-gradient(circle at 8% 55%,rgba(90,199,216,.08),transparent 26%),
      linear-gradient(180deg,rgba(17,43,67,.08),transparent 30%) !important;
  }

  .top:before{background:linear-gradient(180deg,rgba(237,244,249,.97) 68%,transparent) !important;opacity:1 !important}
  [data-theme="dark"] .top:before{background:linear-gradient(180deg,rgba(7,21,33,.98) 68%,transparent) !important}

  .bottom-nav{background:rgba(250,252,253,.92) !important;border-top-color:rgba(74,103,121,.12) !important}
  [data-theme="dark"] .bottom-nav{background:rgba(10,31,48,.90) !important;border-top-color:rgba(152,205,229,.13) !important}

  .circle{
    background:#fafcfd !important;
    color:#101010 !important;
    border-color:#101010 !important;
    box-shadow:0 8px 20px rgba(67,83,94,.08) !important;
  }
  [data-theme="dark"] .circle{background:rgba(17,43,67,.82) !important;color:#f6fbff !important;border-color:rgba(255,255,255,.88) !important}

  .pill.ok{background:#d7e9e9 !important;color:#3e9d78 !important}
  [data-theme="dark"] .pill.ok{background:color-mix(in srgb,var(--green) 13%,transparent) !important;color:var(--green) !important}

  .card,.glass{background:var(--card) !important;border-color:var(--line) !important}
  .card,.glass,.weather-shell,.weather-card,.hero,.circle,.bottom-nav,.top:before{transition:background .32s ease,border-color .32s ease,color .32s ease,box-shadow .32s ease}
  .warn{color:var(--gold) !important}

  /* Light Journey Ring: same pale blue / white palette as the header reference */
  .hero.cd-mode-d{
    background:linear-gradient(155deg,rgba(250,252,253,.98),rgba(237,244,249,.97) 58%,rgba(215,233,234,.94)) !important;
    border-color:rgba(74,103,121,.13) !important;
    box-shadow:0 18px 44px rgba(83,110,127,.11) !important;
    color:#101820 !important;
  }
  .hero.cd-mode-d .eyebrow,.hero.cd-mode-d .hero-sub,.hero.cd-mode-d .progress-top,.hero.cd-mode-d .next-main span{color:#71818e !important}
  .hero.cd-mode-d .next-strip{background:rgba(250,252,253,.78) !important;border-color:rgba(74,103,121,.12) !important}
  .hero.cd-mode-d .next-place{color:#4a95a6 !important}
  .hero.cd-mode-d .track{background:rgba(89,121,140,.10) !important}
  .hero.cd-mode-d .fill{background:linear-gradient(90deg,#77c4d2,#9adbe2) !important;box-shadow:0 0 18px rgba(119,196,210,.18) !important}
  .hero.cd-mode-d .journey-bg{stroke:rgba(74,103,121,.10) !important}
  .hero.cd-mode-d .journey-core span,.hero.cd-mode-d .journey-copy h4{color:#71818e !important}
  .hero.cd-mode-d .journey-copy p{color:#71818e !important}
  .hero.cd-mode-d .journey-chip{background:#fafcfd !important;border-color:rgba(74,103,121,.13) !important;color:#526776 !important}
  .hero.cd-mode-d .journey-glow:before{background:#c7e7ea !important;opacity:.55}
  .hero.cd-mode-d .journey-glow:after{background:#d7e9ea !important;opacity:.50}

  [data-theme="dark"] .hero.cd-mode-d{background:linear-gradient(160deg,#0e1b2c,#112b43 55%,#103a47) !important;border-color:rgba(94,213,255,.16) !important;box-shadow:0 24px 68px rgba(4,23,39,.34) !important;color:#f4fbff !important}
  [data-theme="dark"] .hero.cd-mode-d .eyebrow,[data-theme="dark"] .hero.cd-mode-d .hero-sub,[data-theme="dark"] .hero.cd-mode-d .progress-top,[data-theme="dark"] .hero.cd-mode-d .next-main span{color:#9fb9c8 !important}
  [data-theme="dark"] .hero.cd-mode-d .next-strip{background:rgba(255,255,255,.05) !important;border-color:rgba(255,255,255,.09) !important}
  [data-theme="dark"] .hero.cd-mode-d .next-place{color:#75dcff !important}
  [data-theme="dark"] .hero.cd-mode-d .track{background:rgba(255,255,255,.09) !important}
  [data-theme="dark"] .hero.cd-mode-d .journey-bg{stroke:rgba(255,255,255,.08) !important}
  [data-theme="dark"] .hero.cd-mode-d .journey-core span,[data-theme="dark"] .hero.cd-mode-d .journey-copy h4{color:#8faec0 !important}
  [data-theme="dark"] .hero.cd-mode-d .journey-copy p{color:#9fb9c8 !important}
  [data-theme="dark"] .hero.cd-mode-d .journey-chip{background:rgba(255,255,255,.045) !important;border-color:rgba(255,255,255,.09) !important;color:#cfe8f3 !important}

  /* Light weather deck uses the same reference palette, not a separate blue theme */
  .weather-shell{
    background:linear-gradient(155deg,#fafcfd 0%,#edf4f9 56%,#d7e9ea 100%) !important;
    border-color:rgba(74,103,121,.13) !important;
    box-shadow:0 16px 40px rgba(83,110,127,.10) !important;
    color:#101820 !important;
  }
  .weather-head p,.weather-city span,.weather-condition,.weather-local span,.weather-trip-note,.weather-footer,.weather-stat small,.weather-day .d{color:#71818e !important}
  .weather-live,.weather-card.route-next:after,.weather-footer a,.weather-day .r{color:#4a95a6 !important}
  .weather-card{background:rgba(250,252,253,.78) !important;border-color:rgba(74,103,121,.12) !important}
  .weather-card.route-next{border-color:rgba(111,184,199,.42) !important;box-shadow:inset 0 0 0 1px rgba(111,184,199,.08),0 10px 24px rgba(83,110,127,.08) !important}
  .weather-stat,.weather-day{background:rgba(237,244,249,.88) !important}
  .weather-trip-note{border-top-color:rgba(74,103,121,.10) !important}
  .weather-trip-note strong{color:#334956 !important}
  .weather-alert{background:rgba(197,140,45,.10) !important;border-color:rgba(197,140,45,.16) !important;color:#7b5718 !important}

  [data-theme="dark"] .weather-shell{background:linear-gradient(155deg,#0d1d30 0%,#12304a 52%,#0d3d48 100%) !important;border-color:rgba(110,220,255,.15) !important;box-shadow:0 18px 48px rgba(4,23,39,.24) !important;color:#f5fbff !important}
  [data-theme="dark"] .weather-head p,[data-theme="dark"] .weather-city span,[data-theme="dark"] .weather-condition,[data-theme="dark"] .weather-local span,[data-theme="dark"] .weather-trip-note,[data-theme="dark"] .weather-footer,[data-theme="dark"] .weather-stat small,[data-theme="dark"] .weather-day .d{color:#96afbf !important}
  [data-theme="dark"] .weather-live,[data-theme="dark"] .weather-card.route-next:after,[data-theme="dark"] .weather-footer a,[data-theme="dark"] .weather-day .r{color:#75dcff !important}
  [data-theme="dark"] .weather-card{background:rgba(255,255,255,.05) !important;border-color:rgba(255,255,255,.09) !important}
  [data-theme="dark"] .weather-stat,[data-theme="dark"] .weather-day{background:rgba(255,255,255,.045) !important}
  [data-theme="dark"] .weather-trip-note{border-top-color:rgba(255,255,255,.08) !important}
  [data-theme="dark"] .weather-trip-note strong{color:#dff7ff !important}
  [data-theme="dark"] .weather-alert{background:rgba(255,197,90,.10) !important;border-color:rgba(255,208,112,.16) !important;color:#ffe3aa !important}
  `;
  document.head.appendChild(style);

  const meta=document.querySelector('meta[name="theme-color"]');
  function syncThemeColor(){
    if(!meta) return;
    meta.setAttribute('content',document.documentElement.dataset.theme==='dark'?'#071521':'#edf4f9');
  }
  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
