(()=>{
  if(window.TravelPreferencesV2)return;
  window.TravelPreferencesV2=true;

  const LANG_KEY='travel.language';
  const UNIT_KEY='travel.weatherUnit';
  const supported=['zh-CN','zh-TW','en'];
  let lang=supported.includes(localStorage.getItem(LANG_KEY))?localStorage.getItem(LANG_KEY):'zh-CN';

  const traditionalMap={
    '后':'後','为':'為','这':'這','还':'還','与':'與','预':'預','计':'計','飞':'飛','机':'機','关':'關','键':'鍵','东':'東','节':'節','动':'動','车':'車','间':'間','时':'時','实':'實','现':'現','临':'臨','显':'顯','换':'換','个':'個','两':'兩','约':'約','从':'從','开':'開','点':'點','击':'擊','横':'橫','线':'線','长':'長','当':'當','经':'經','过':'過','网':'網','络':'絡','离':'離','载':'載','数':'數','据':'據','暂':'暫','会':'會','体':'體','风':'風','报':'報','围':'圍','几':'幾','进':'進','备':'備','处':'處','确':'確','认':'認','订':'訂','营':'營','业':'業','选':'選','儿':'兒','区':'區','归':'歸','达':'達','转':'轉','边':'邊','无':'無','尽':'盡','优':'優','轻':'輕','频':'頻','缓':'緩','应':'應','种':'種','际':'際','别':'別','门':'門','续':'續','华':'華','历':'歷','装':'裝','务':'務','资':'資','态':'態','气':'氣','温':'溫','随':'隨','启':'啟','误':'誤','审':'審','阅':'閱','锁':'鎖','团':'團','结':'結','试':'試','择':'擇','览':'覽','见':'見','亲':'親','准':'準','虑':'慮','终':'終','额':'額','饭':'飯','价':'價','费':'費','号':'號','页':'頁','广':'廣','并':'並','图':'圖','标':'標','称':'稱','仅':'僅','较':'較','样':'樣','旧':'舊','栏':'欄','项':'項','总':'總','类':'類','欢':'歡','乐':'樂','读':'讀','写':'寫','变':'變','产':'產','满':'滿','场':'場','远':'遠','层':'層','单':'單','双':'雙','苏':'蘇','湾':'灣','让':'讓','严':'嚴','护':'護','规':'規','则':'則','滤':'濾','宽':'寬','险':'險','术':'術','专':'專','识':'識','块':'塊','将':'將','码':'碼','库':'庫','证':'證','销':'銷','检':'檢','测':'測','权':'權','设':'設','获':'獲','顺':'順','稳':'穩','录':'錄','访':'訪','对':'對','钟':'鐘','题':'題','联':'聯','电':'電','脑':'腦','统':'統','触':'觸','发':'發','删':'刪','档':'檔','隐':'隱','继':'繼','储':'儲','视':'視','听':'聽','细':'細','带':'帶','买':'買','卖':'賣','钱':'錢','张':'張','妈':'媽','爷':'爺','岁':'歲','学':'學','书':'書','话':'話','语':'語','简':'簡'
  };
  const simplifiedMap={};Object.entries(traditionalMap).forEach(([a,b])=>{if(!simplifiedMap[b])simplifiedMap[b]=a});
  const convert=(s,map)=>[...String(s)].map(c=>map[c]||c).join('');
  const toTraditional=s=>convert(s,traditionalMap);
  const toSimplified=s=>convert(s,simplifiedMap);

  const phrases=[
    ['West Coast Christmas','西海岸圣诞之旅'],
    ['Dec 23, 2026 → Jan 2, 2027 · Family of 4','2026年12月23日 → 2027年1月2日 · 一家四口'],
    ['Live trip countdown','实时行程倒计时'],
    ['Christmas on the West Coast ✨','西海岸圣诞之旅 ✨'],
    ['Philadelphia → Bay Area → Los Angeles → Home','Philadelphia → Bay Area → Los Angeles → 回家'],
    ['PLANNING','规划中'],['DAYS','天'],['HOURS','小时'],['MIN','分钟'],['SEC','秒'],
    ['Trip cards','预订卡片'],['预订与关键交通','预订与关键交通'],
    ['Up next','接下来'],['横向滑动查看','横向滑动查看'],['Itinerary','行程'],['点击日期展开','点击日期展开'],
    ['Journey map','路线图'],['Checklist','待办清单'],['出发前待办','出发前待办'],
    ['Today','今天'],['Bookings','预订'],['Plan','行程'],
    ['Booked / Paid','已预订 / 已支付'],['Still Needed','仍需预订'],['Total Items','总项目'],
    ['AUTO SYNC','自动同步'],['MANUAL SYNC','手动同步'],['Refresh','刷新'],
    ['Outbound flight','去程航班'],['California flight','加州境内航班'],['Return flight','返程航班'],
    ['Los Angeles stay','Los Angeles 住宿'],['San Jose stay','San Jose 住宿'],['Rental car','租车'],['Family-size vehicle','家庭用车'],
    ['STILL NEEDED','仍需预订'],['BOOKED','已预订'],['PAID','已支付'],['CONSIDERING','考虑中'],
    ['DEPART','出发'],['ARRIVE','抵达'],['CHECK-IN','入住'],['CHECK-OUT','退房'],['PICKUP','取车'],['DROP-OFF','还车'],
    ['NONSTOP','直飞'],['CONNECTION','转机'],['NEXT','下一项'],['THEN','然后'],['LATER','稍后'],
    ['Weather deck','天气'],['Live local weather','实时当地天气'],['Updating weather…','正在更新天气…'],
    ['Clear','晴朗'],['Partly cloudy','少云'],['Cloudy','多云'],['Foggy','有雾'],['Drizzle','毛毛雨'],['Rain','有雨'],['Snow','有雪'],['Thunderstorms','雷雨'],['Variable weather','天气变化'],
    ['Feels like','体感'],['Local time','当地时间'],['Cached','缓存'],['RAIN','降水'],['WIND','风速'],['TRIP','行程'],['FORECAST','预报'],['WAIT','等待'],
    ['Trip forecast active','行程预报已启用'],['Trip weather watch','行程天气提醒'],
    ['Bay Area','湾区'],['Los Angeles area','Los Angeles 地区'],['Home','家'],['Drive','自驾'],
    ['Trip begins · PHL → West Coast','行程开始 · PHL → 西海岸'],['Until estimated departure','距离预计出发时间'],
    ['Trip preparation','旅行准备中'],['On the trip','旅途中'],['Trip complete','旅行已完成'],
    ['Getting ready','准备出发'],['Calculating next item','正在计算下一项行程'],
    ['Pre-trip mode · showing the next planned item','旅行前模式 · 当前显示下一项计划'],
    ['Trip complete · itinerary kept as a record','旅行已结束 · 行程保留为记录'],
    ['Family Travel OS · Offline-ready PWA','Family Travel OS · 支持离线使用'],
    ['Public page excludes sensitive confirmation data','公开页面不会显示敏感确认信息'],
    ['Route B 当前重点方案；优先 PHL → SFO nonstop。','Route B current focus; prioritize PHL → SFO nonstop.'],
    ['San Jose → Los Angeles 短途转场。','Short California hop from San Jose to Los Angeles.'],
    ['目标 1/2 回到费城地区，1/3 保留 buffer。','Target return to the Philadelphia area on Jan 2, with Jan 3 kept as a buffer.'],
    ['优先一个住宿基地，减少一家四口搬运行李。','Prefer one lodging base to minimize moving luggage for a family of four.'],
    ['朋友家或酒店仍待确认。','Friend’s home or hotel is still to be confirmed.'],
    ['车型、儿童座椅与是否 one-way 仍待确认。','Vehicle type, child seats, and one-way rental are still to be confirmed.'],
    ['确认朋友日期','Confirm friends’ dates'],['锁定主要航班','Book main flights'],['确认 San Jose 住宿','Confirm San Jose lodging'],['确定 LA 住宿','Choose LA lodging'],['确定租车方案','Choose rental-car plan'],['安排节假日用餐','Plan holiday meals'],
    ['San Jose 与 Thousand Oaks 节假日安排','Holiday availability in San Jose and Thousand Oaks'],['PHL → SFO 与 LAX → PHL','PHL → SFO and LAX → PHL'],['朋友家还是酒店','Friend’s home or hotel'],['Thousand Oaks / Westlake Village','Thousand Oaks / Westlake Village'],['车型、儿童座椅、分段租车','Vehicle type, child seats, split rental'],['确认营业时间与订位','Confirm opening hours and reservations']
  ];

  const table=new Map();
  phrases.forEach(([en,zh])=>{
    const tw=toTraditional(zh);const row={en,'zh-CN':zh,'zh-TW':tw};
    [en,zh,tw].forEach(v=>table.set(v,row));
  });
  const variants=[...table.entries()].sort((a,b)=>b[0].length-a[0].length);

  function translateString(input){
    if(input==null)return input;
    const raw=String(input);const trim=raw.trim();if(!trim)return raw;
    const exact=table.get(trim);let out=exact?exact[lang]:trim;
    if(!exact){
      if(lang==='zh-TW')out=toTraditional(out);
      else if(lang==='zh-CN')out=toSimplified(out);
      else variants.forEach(([v,row])=>{if(v.length>=3&&out.includes(v))out=out.split(v).join(row.en)});
    }
    const left=raw.match(/^\s*/)?.[0]||'',right=raw.match(/\s*$/)?.[0]||'';
    return left+out+right;
  }

  let observer=null,scheduled=false,button=null,panel=null;
  const observerConfig={subtree:true,childList:true};

  function updateControl(){
    const label=lang==='zh-CN'?'简':lang==='zh-TW'?'繁':'EN';
    if(button&&button.textContent!==label)button.textContent=label;
    panel?.querySelectorAll('[data-lang-choice]').forEach(b=>{
      const wanted=b.dataset.langChoice===lang;
      if(b.classList.contains('selected')!==wanted)b.classList.toggle('selected',wanted);
    });
  }

  function apply(root=document.body){
    if(!root)return;
    observer?.disconnect();
    try{
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
        const p=node.parentElement;if(!p||['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','TEXTAREA'].includes(p.tagName)||p.closest?.('.lang-wrap'))return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
      }});
      const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
      nodes.forEach(node=>{const next=translateString(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next});
      document.documentElement.lang=lang==='zh-TW'?'zh-Hant':lang==='zh-CN'?'zh-CN':'en';
      document.documentElement.dataset.lang=lang;
    }finally{if(observer)observer.observe(document.body,observerConfig)}
  }

  function setLanguage(next){
    if(!supported.includes(next)||next===lang)return;
    lang=next;localStorage.setItem(LANG_KEY,lang);updateControl();apply(document.body);
    window.dispatchEvent(new CustomEvent('travel:language',{detail:{language:lang}}));
  }

  function installControl(){
    const actions=document.querySelector('.actions');if(!actions)return;
    const old=document.getElementById('languageButton');if(old)old.closest('.lang-wrap')?.remove();
    const style=document.createElement('style');style.textContent=`
      .lang-wrap{position:relative}.lang-button{font-size:12px!important;font-weight:950;letter-spacing:-.02em}.lang-menu{position:absolute;right:0;top:50px;width:178px;padding:8px;border-radius:18px;background:var(--card-solid);border:1px solid var(--line);box-shadow:var(--shadow);z-index:50;display:none}.lang-menu.open{display:grid;gap:4px}.lang-choice{border:0;background:transparent;color:var(--text);text-align:left;padding:10px 11px;border-radius:12px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}.lang-choice:hover,.lang-choice.selected{background:color-mix(in srgb,var(--purple) 12%,transparent);color:var(--purple)}[data-lang="zh-CN"] .weather-card.route-next:after,[data-lang="zh-TW"] .weather-card.route-next:after{content:'下一站'!important}[data-lang="en"] .weather-card.route-next:after{content:'NEXT STOP'!important}`;document.head.appendChild(style);
    const wrap=document.createElement('div');wrap.className='lang-wrap';wrap.innerHTML=`<button class="circle lang-button" id="languageButton" type="button" aria-label="Language">简</button><div class="lang-menu" id="languageMenu"><button class="lang-choice" data-lang-choice="zh-CN">简体中文</button><button class="lang-choice" data-lang-choice="zh-TW">繁體中文</button><button class="lang-choice" data-lang-choice="en">English</button></div>`;
    actions.insertBefore(wrap,document.getElementById('theme'));
    button=wrap.querySelector('#languageButton');panel=wrap.querySelector('#languageMenu');
    button.onclick=e=>{e.stopPropagation();panel.classList.toggle('open')};
    panel.onclick=e=>{const b=e.target.closest('[data-lang-choice]');if(!b)return;setLanguage(b.dataset.langChoice);panel.classList.remove('open')};
    document.addEventListener('click',e=>{if(!wrap.contains(e.target))panel.classList.remove('open')});
    updateControl();
  }

  function boot(){
    installControl();
    apply(document.body);
    observer=new MutationObserver(muts=>{
      if(!muts.some(m=>m.addedNodes&&m.addedNodes.length)||scheduled)return;
      scheduled=true;
      requestAnimationFrame(()=>{scheduled=false;apply(document.body)});
    });
    observer.observe(document.body,observerConfig);
  }

  window.TravelPreferences={
    getLanguage:()=>lang,
    setLanguage,
    translate:translateString,
    getWeatherUnit:()=>localStorage.getItem(UNIT_KEY)||'imperial',
    setWeatherUnit:u=>{if(!['imperial','metric'].includes(u))return;localStorage.setItem(UNIT_KEY,u);window.dispatchEvent(new CustomEvent('travel:weather-unit',{detail:{unit:u}}))}
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
