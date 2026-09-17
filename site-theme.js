(()=>{
  const style=document.createElement('style');
  style.textContent=`
  :root{
    --bg:#0d2237 !important;
    --card:rgba(17,43,67,.82) !important;
    --card-solid:#112b43 !important;
    --text:#f4fbff !important;
    --muted:#9fb9c8 !important;
    --line:rgba(152,205,229,.15) !important;
    --purple:#75dcff !important;
    --blue:#53d6ff !important;
    --cyan:#5ac7d8 !important;
    --green:#63c49d !important;
    --red:#ff8b83 !important;
    --gold:#ffd070 !important;
    --shadow:0 22px 58px rgba(2,14,26,.34) !important;
    --shadow-soft:0 12px 30px rgba(2,14,26,.24) !important;
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
  }
  html{background:#0d2237 !important}
  body{
    background:
      radial-gradient(circle at 8% 4%,rgba(83,214,255,.17),transparent 25%),
      radial-gradient(circle at 92% 18%,rgba(108,99,255,.13),transparent 28%),
      radial-gradient(circle at 48% 82%,rgba(90,199,216,.10),transparent 32%),
      linear-gradient(180deg,#0d2237 0%,#102c43 36%,#0b2336 72%,#091d2d 100%) !important;
    background-attachment:fixed !important;
  }
  [data-theme="dark"] body{
    background:
      radial-gradient(circle at 8% 4%,rgba(83,214,255,.12),transparent 25%),
      radial-gradient(circle at 92% 18%,rgba(108,99,255,.09),transparent 28%),
      linear-gradient(180deg,#071521 0%,#0a2032 44%,#071823 100%) !important;
  }
  body:before{background:radial-gradient(circle,#53d6ff,transparent 68%) !important;opacity:.14 !important}
  body:after{background:radial-gradient(circle,#6c63ff,transparent 68%) !important;opacity:.11 !important}
  .aurora{
    background:
      radial-gradient(circle at 82% 8%,rgba(83,214,255,.09),transparent 24%),
      radial-gradient(circle at 8% 55%,rgba(90,199,216,.08),transparent 26%),
      linear-gradient(180deg,rgba(17,43,67,.08),transparent 30%) !important;
  }
  .top:before{background:linear-gradient(180deg,rgba(13,34,55,.97) 68%,transparent) !important;opacity:1 !important}
  [data-theme="dark"] .top:before{background:linear-gradient(180deg,rgba(7,21,33,.98) 68%,transparent) !important}
  .bottom-nav{background:rgba(10,31,48,.88) !important;border-top-color:rgba(152,205,229,.13) !important}
  .circle{background:rgba(17,43,67,.82) !important}
  .card,.glass{border-color:rgba(152,205,229,.14) !important}
  .warn{color:var(--gold) !important}
  `;
  document.head.appendChild(style);

  const meta=document.querySelector('meta[name="theme-color"]');
  function syncThemeColor(){
    if(!meta) return;
    meta.setAttribute('content',document.documentElement.dataset.theme==='dark'?'#071521':'#0d2237');
  }
  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
