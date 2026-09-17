(()=>{
  if(window.TravelPreferences)return;

  const LANG_KEY='travel.language';
  const UNIT_KEY='travel.weatherUnit';
  const supported=['zh-CN','zh-TW','en'];
  const saved=localStorage.getItem(LANG_KEY);
  let lang=supported.includes(saved)?saved:'zh-CN';

  const hantMap={
    '后':'後','发':'發','复':'複','里':'裡','为':'為','这':'這','还':'還','与':'與','预':'預','计':'計','飞':'飛','机':'機','关':'關','键':'鍵','东':'東','节':'節','动':'動','车':'車','间':'間','时':'時','实':'實','现':'現','临':'臨','显':'顯','换':'換','个':'個','两':'兩','约':'約','从':'從','开':'開','点':'點','击':'擊','横':'橫','线':'線','长':'長','当':'當','经':'經','过':'過','压':'壓','缩':'縮','网':'網','络':'絡','离':'離','线':'線','载':'載','数':'數','据':'據','暂':'暫','会':'會','恢':'恢','体':'體','风':'風','报':'報','围':'圍','这':'這','几':'幾','进':'進','备':'備','处':'處','确':'確','认':'認','订':'訂','营':'營','业':'業','选':'選','儿':'兒','宾':'賓','签':'簽','陆':'陸','区':'區','归':'歸','达':'達','转':'轉','边':'邊','万':'萬','无':'無','尽':'盡','优':'優','轻':'輕','频':'頻','过':'過','缓':'緩','应':'應','种':'種','极':'極','际':'際','别':'別','门':'門','续':'續','华':'華','历':'歷','装':'裝','务':'務','资':'資','态':'態','应':'應','气':'氣','温':'溫','降':'降','概':'概','率':'率','最':'最','会':'會','随':'隨','启':'啟','踪':'蹤','误':'誤','审':'審','阅':'閱','锁':'鎖','团':'團','结':'結','试':'試','择':'擇','览':'覽','见':'見','亲':'親','备':'備','准':'準','虑':'慮','终':'終','额':'額','饭':'飯','价':'價','费':'費','号':'號','页':'頁','广':'廣','并':'並','别':'別','应':'應','击':'擊','图':'圖','标':'標','随':'隨','称':'稱','仅':'僅','较':'較','样':'樣','旧':'舊','栏':'欄','项':'項','总':'總','类':'類','别':'別','欢':'歡','乐':'樂','终':'終','读':'讀','写':'寫','变':'變','义':'義','务':'務','产':'產','间':'間','满':'滿','场':'場','远':'遠','层':'層','单':'單','双':'雙','确':'確','苏':'蘇','湾':'灣','让':'讓','过':'過','严':'嚴','护':'護','规':'規','则':'則','滤':'濾','宽':'寬','险':'險','术':'術','专':'專','业':'業','历':'歷','识':'識','门':'門','块':'塊','归':'歸','态':'態','将':'將','页':'頁','码':'碼','库':'庫','项':'項','证':'證','销':'銷','检':'檢','测':'測','权':'權','览':'覽','类':'類','设':'設','获':'獲','应':'應','层':'層','顺':'順','缓':'緩','稳':'穩','历':'歷','录':'錄','访':'訪','达':'達','对':'對','应':'應','间':'間','钟':'鐘','钟':'鐘','读':'讀','应':'應','区':'區','从':'從','标':'標','题':'題','图':'圖','开':'開','联':'聯','离':'離','电':'電','脑':'腦','应':'應','过':'過','滤':'濾','现':'現','确':'確','认':'認','号':'號','码':'碼','页':'頁','览':'覽','统':'統','选':'選','设':'設','触':'觸','发':'發','删':'刪','并':'並','仅':'僅','档':'檔','显':'顯','隐':'隱','还':'還','继':'繼','续':'續','转':'轉','线':'線','载':'載','储':'儲','历':'歷','检':'檢','视':'視','听':'聽','边':'邊','类':'類','别':'別','细':'細','写':'寫','实':'實','际':'際','带':'帶','买':'買','卖':'賣','钱':'錢','张':'張','妈':'媽','爷':'爺','奶':'奶','岁':'歲','儿':'兒','学':'學','书':'書','话':'話','语':'語','简':'簡','繁':'繁','体':'體'
  };
  const hansMap={};Object.entries(hantMap).forEach(([a,b])=>{if(!hansMap[b])hansMap[b]=a});
  const convert=(s,map)=>[...String(s)].map(c=>map[c]||c).join('');
  const toHant=s=>convert(s,hantMap),toHans=s=>convert(s,hansMap);

  const rows=[
    ['West Coast Christmas','西海岸圣诞之旅','West Coast Christmas'],
    ['Dec 23, 2026 → Jan 2, 2027 · Family of 4','2026年12月23日 → 2027年1月2日 · 一家四口','Dec 23, 2026 → Jan 2, 2027 · Family of 4'],
    ['Live trip countdown','实时行程倒计时','Live trip countdown'],
    ['Christmas on the West Coast ✨','西海岸圣诞之旅 ✨','Christmas on the West Coast ✨'],
    ['Philadelphia → Bay Area → Los Angeles → Home','Philadelphia → Bay Area → Los Angeles → 回家','Philadelphia → Bay Area → Los Angeles → Home'],
    ['PLANNING','规划中','PLANNING'],['DAYS','天','DAYS'],['HOURS','小时','HOURS'],['MIN','分钟','MIN'],['SEC','秒','SEC'],
    ['准备出发','准备出发','Getting ready'],['正在计算下一项行程','正在计算下一项行程','Calculating next item'],['旅行准备中','旅行准备中','Trip preparation'],
    ['Trip cards','预订卡片','Trip cards'],['预订与关键交通','预订与关键交通','Bookings & key transportation'],
    ['Up next','接下来','Up next'],['横向滑动查看','横向滑动查看','Swipe horizontally'],['Itinerary','行程','Itinerary'],['点击日期展开','点击日期展开','Tap a date to expand'],
    ['Journey map','路线图','Journey map'],['Checklist','待办清单','Checklist'],['出发前待办','出发前待办','Before departure'],
    ['Today','今天','Today'],['Bookings','预订','Bookings'],['Plan','行程','Plan'],
    ['Family Travel OS · Offline-ready PWA','Family Travel OS · 支持离线使用','Family Travel OS · Offline-ready PWA'],
    ['Public page excludes sensitive confirmation data','公开页面不会显示敏感确认信息','Public page excludes sensitive confirmation data'],
    ['Booked / Paid','已预订 / 已支付','Booked / Paid'],['Still Needed','仍需预订','Still Needed'],['Total Items','总项目','Total Items'],
    ['AUTO SYNC','自动同步','AUTO SYNC'],['MANUAL SYNC','手动同步','MANUAL SYNC'],['Refresh','刷新','Refresh'],
    ['Outbound flight','去程航班','Outbound flight'],['California flight','加州境内航班','California flight'],['Return flight','返程航班','Return flight'],
    ['Los Angeles stay','Los Angeles 住宿','Los Angeles stay'],['San Jose stay','San Jose 住宿','San Jose stay'],['Rental car','租车','Rental car'],['Family-size vehicle','家庭用车','Family-size vehicle'],
    ['STILL NEEDED','仍需预订','STILL NEEDED'],['BOOKED','已预订','BOOKED'],['PAID','已支付','PAID'],['CONSIDERING','考虑中','CONSIDERING'],
    ['DEPART','出发','DEPART'],['ARRIVE','抵达','ARRIVE'],['CHECK-IN','入住','CHECK-IN'],['CHECK-OUT','退房','CHECK-OUT'],['PICKUP','取车','PICKUP'],['DROP-OFF','还车','DROP-OFF'],
    ['NONSTOP','直飞','NONSTOP'],['CONNECTION','转机','CONNECTION'],['NEXT','下一项','NEXT'],['THEN','然后','THEN'],['LATER','稍后','LATER'],
    ['Trip begins · PHL → West Coast','行程开始 · PHL → 西海岸','Trip begins · PHL → West Coast'],['距离预计出发时间','距离预计出发时间','Until estimated departure'],
    ['🎉 行程已完成','🎉 行程已完成','🎉 Trip complete'],['旅行已完成','旅行已完成','Trip complete'],['旅途中','旅途中','On the trip'],
    ['旅行前模式 · 当前显示下一项计划','旅行前模式 · 当前显示下一项计划','Pre-trip mode · showing the next planned item'],['旅行已结束 · 行程保留为记录','旅行已结束 · 行程保留为记录','Trip complete · itinerary kept as a record'],['TODAY MODE · 已完成项目自动变灰，下一项高亮','TODAY MODE · 已完成项目自动变灰，下一项高亮','TODAY MODE · completed items dim automatically; next item highlighted'],
    ['Weather deck','天气','Weather'],['实时当地天气 · 临近旅行后自动切换到行程日期预报','实时当地天气 · 临近旅行后自动切换到行程日期预报','Live local weather · switches to trip-date forecast when available'],
    ['行程天气已进入 16 天预报窗口 · 自动按路线日期显示','行程天气已进入 16 天预报窗口 · 自动按路线日期显示','Trip weather is within the 16-day forecast window · showing route dates'],['实时当地天气 · 行程日期进入约两周范围后自动切换为正式预报','实时当地天气 · 行程日期进入约两周范围后自动切换为正式预报','Live local weather · trip forecast activates about two weeks before travel'],
    ['正在更新天气…','正在更新天气…','Updating weather…'],['刚刚更新','刚刚更新','Updated just now'],['使用上次缓存的天气数据','使用上次缓存的天气数据','Using cached weather data'],
    ['晴朗','晴朗','Clear'],['少云','少云','Partly cloudy'],['多云','多云','Cloudy'],['有雾','有雾','Foggy'],['毛毛雨','毛毛雨','Drizzle'],['有雨','有雨','Rain'],['有雪','有雪','Snow'],['雷雨','雷雨','Thunderstorms'],['天气变化','天气变化','Variable weather'],
    ['体感','体感','Feels like'],['Local time','当地时间','Local time'],['Cached','缓存','Cached'],['RAIN','降水','RAIN'],['WIND','风速','WIND'],['TRIP','行程','TRIP'],['FORECAST','预报','FORECAST'],['WAIT','等待','WAIT'],
    ['Trip forecast active','行程预报已启用','Trip forecast active'],['天气数据暂时无法载入；联网后会自动恢复。','天气数据暂时无法载入；联网后会自动恢复。','Weather data is temporarily unavailable; it will recover when online.'],
    ['目前显示当地实时天气与未来几天。','目前显示当地实时天气与未来几天。','Showing live local weather and the next few days.'],['的正式行程天气会在临近约两周时自动替换这里。','的正式行程天气会在临近约两周时自动替换这里。',' trip forecast will automatically replace this about two weeks before travel.'],['的行程天气已进入可预报窗口。','的行程天气已进入可预报窗口。',' trip weather is now within the forecast window.'],
    ['Trip weather watch','行程天气提醒','Trip weather watch'],['降水概率','降水概率','precipitation chance'],['最大风速约','最大风速约','max wind about'],['低温约','低温约','low around'],
    ['Bay Area','湾区','Bay Area'],['Los Angeles area','Los Angeles 地区','Los Angeles area'],['Home','家','Home'],['Drive','自驾','Drive'],
    ['Route B 当前重点方案；优先 PHL → SFO nonstop。','Route B 当前重点方案；优先 PHL → SFO 直飞。','Route B current focus; prioritize PHL → SFO nonstop.'],
    ['San Jose → Los Angeles 短途转场。','San Jose → Los Angeles 短途转场。','Short California hop from San Jose to Los Angeles.'],
    ['目标 1/2 回到费城地区，1/3 保留 buffer。','目标 1/2 回到费城地区，1/3 保留缓冲日。','Target return to the Philadelphia area on Jan 2, with Jan 3 kept as a buffer.'],
    ['优先一个住宿基地，减少一家四口搬运行李。','优先一个住宿基地，减少一家四口搬运行李。','Prefer one lodging base to minimize moving luggage for a family of four.'],
    ['朋友家或酒店仍待确认。','朋友家或酒店仍待确认。','Friend’s home or hotel still to be confirmed.'],['车型、儿童座椅与是否 one-way 仍待确认。','车型、儿童座椅与是否单程租车仍待确认。','Vehicle class, child seats, and one-way rental are still to be confirmed.'],
    ['先 Los Angeles / Thousand Oaks，约一周后转 San Jose，最后从 Bay Area 回 PHL。','先 Los Angeles / Thousand Oaks，约一周后转 San Jose，最后从 Bay Area 回 PHL。','Start in Los Angeles / Thousand Oaks, move to San Jose about a week later, then return to PHL from the Bay Area.'],
    ['当前重点方案：先 San Jose，再在 Thousand Oaks / LA 连住约一周，最后 LAX → PHL。','当前重点方案：先 San Jose，再在 Thousand Oaks / LA 连住约一周，最后 LAX → PHL。','Current focus: San Jose first, then about a week based in Thousand Oaks / LA, ending with LAX → PHL.'],
    ['四段飞行、更多打包，仅作为价格对照。','四段飞行、更多打包，仅作为价格对照。','Four flight segments and more packing; kept only as a price comparison.'],['飞行最少，但增加一整天长途自驾。','飞行最少，但增加一整天长途自驾。','Fewest flights, but adds a full day of long-distance driving.'],
    ['跨大陆航班，优先 nonstop。','跨大陆航班，优先直飞。','Transcontinental flight; prioritize nonstop.'],['实际航班待定','实际航班待定','Actual flight TBD'],['预计抵达 LAX','预计抵达 LAX','Estimated arrival at LAX'],['取车后前往 Thousand Oaks','取车后前往 Thousand Oaks','Pick up the car and head to Thousand Oaks'],
    ['朋友探访为主。','朋友探访为主。','Mostly visiting friends.'],['朋友探访 / 节日活动','朋友探访 / 节日活动','Friends / holiday activities'],['保持轻松节奏','保持轻松节奏','Keep an easy pace'],['短途飞往 San Jose。','短途飞往 San Jose。','Short flight to San Jose.'],['前往 LAX','前往 LAX','Head to LAX'],['退房并前往机场','退房并前往机场','Check out and head to the airport'],['加州境内短途航班','加州境内短途航班','Short intra-California flight'],['朋友探访。','朋友探访。','Visit friends.'],['San Jose 会友','San Jose 会友','Meet friends in San Jose'],['两个完整探访日','两个完整探访日','Two full visiting days'],['目标当天回家。','目标当天回家。','Target getting home the same day.'],['跨大陆返程','跨大陆返程','Transcontinental return'],['回到费城地区','回到费城地区','Back in the Philadelphia area'],['结束旅行','结束旅行','Trip ends'],
    ['优先 PHL → SFO nonstop。','优先 PHL → SFO 直飞。','Prioritize PHL → SFO nonstop.'],['跨大陆航班待定','跨大陆航班待定','Transcontinental flight TBD'],['预计抵达 SFO','预计抵达 SFO','Estimated arrival at SFO'],['之后前往 San Jose','之后前往 San Jose','Then head to San Jose'],['抵达 San Jose','抵达 San Jose','Arrive in San Jose'],['安顿入住 / 会友','安顿入住 / 会友','Settle in / meet friends'],['约两个完整探访日。','约两个完整探访日。','About two full visiting days.'],['圣诞期间保持轻松安排','圣诞期间保持轻松安排','Keep Christmas plans relaxed'],['继续 San Jose 行程','继续 San Jose 行程','Continue San Jose plans'],['第二个完整日','第二个完整日','Second full day'],['短途飞往 LA，再去 Thousand Oaks。','短途飞往 LA，再去 Thousand Oaks。','Short flight to LA, then onward to Thousand Oaks.'],['前往 SJC','前往 SJC','Head to SJC'],['办理登机','办理登机','Check in for the flight'],['抵达 Thousand Oaks','抵达 Thousand Oaks','Arrive in Thousand Oaks'],['入住后休息','入住后休息','Check in and rest'],['整段尽量住同一家酒店。','整段尽量住同一家酒店。','Stay at one hotel for this entire segment if possible.'],['Thousand Oaks / LA 行程','Thousand Oaks / LA 行程','Thousand Oaks / LA plans'],['朋友探访与节日活动','朋友探访与节日活动','Friends and holiday activities'],['跨年前后自由活动','跨年前后自由活动','Flexible plans around New Year'],['避免频繁换酒店','避免频繁换酒店','Avoid frequent hotel changes'],['返家；01/03 留作 buffer。','返家；01/03 留作缓冲日。','Return home; keep Jan 3 as a buffer.'],['退房后返程','退房后返程','Check out and begin the return trip'],['结束本次旅行','结束本次旅行','End this trip'],
    ['抵达南加州。','抵达南加州。','Arrive in Southern California.'],['第一段 LA。','第一段 LA。','First LA segment.'],['朋友探访','朋友探访','Visit friends'],['增加机场与行李搬动。','增加机场与行李搬动。','Adds airport time and moving luggage.'],['Side Trip 出发','Side Trip 出发','Start side trip'],['回到 LA','回到 LA','Return to LA'],['第二段 LA。','第二段 LA。','Second LA segment.'],['回到南加州','回到南加州','Back to Southern California'],['返家。','返家。','Return home.'],['抵达后前往 San Jose。','抵达后前往 San Jose。','Head to San Jose after arrival.'],['两天探访','两天探访','Two days visiting'],['长途自驾日。','长途自驾日。','Long-distance driving day.'],['San Jose 出发','San Jose 出发','Depart San Jose'],['I-5 南下','I-5 南下','South on I-5'],['预计抵达 Thousand Oaks','预计抵达 Thousand Oaks','Estimated arrival in Thousand Oaks'],['实际时间取决于交通','实际时间取决于交通','Actual time depends on traffic'],['保持同一住宿','保持同一住宿','Keep the same lodging'],
    ['确认朋友日期','确认朋友日期','Confirm friends’ dates'],['San Jose 与 Thousand Oaks 节假日安排','San Jose 与 Thousand Oaks 节假日安排','Holiday availability in San Jose and Thousand Oaks'],['锁定主要航班','锁定主要航班','Lock in main flights'],['PHL → SFO 与 LAX → PHL','PHL → SFO 与 LAX → PHL','PHL → SFO and LAX → PHL'],['确认 San Jose 住宿','确认 San Jose 住宿','Confirm San Jose lodging'],['朋友家还是酒店','朋友家还是酒店','Friend’s home or hotel'],['确定 LA 住宿','确定 LA 住宿','Choose LA lodging'],['确定租车方案','确定租车方案','Choose rental-car plan'],['车型、儿童座椅、分段租车','车型、儿童座椅、分段租车','Vehicle class, child seats, split rentals'],['安排节假日用餐','安排节假日用餐','Plan holiday meals'],['确认营业时间与订位','确认营业时间与订位','Confirm opening hours and reservations']
  ];

  const table=new Map();
  const allVariants=[];
  rows.forEach(([enSeed,zh,en])=>{
    const hant=toHant(zh);
    const vals={'zh-CN':zh,'zh-TW':hant,'en':en};
    [enSeed,zh,hant,en].forEach(v=>{if(v)table.set(v,vals)});
    allVariants.push(...[enSeed,zh,hant,en].filter(Boolean).map(v=>({v,vals})));
  });
  allVariants.sort((a,b)=>b.v.length-a.v.length);

  function translateString(input){
    if(input==null)return input;
    const original=String(input),trim=original.trim();
    if(!trim)return original;
    const exact=table.get(trim);
    let out=exact?exact[lang]:trim;
    if(!exact){
      out=trim;
      allVariants.forEach(({v,vals})=>{if(v.length>=3&&out.includes(v))out=out.split(v).join(vals[lang])});
      if(lang==='zh-TW')out=toHant(out);
      else if(lang==='zh-CN')out=toHans(out);
    }
    const left=original.match(/^\s*/)?.[0]||'',right=original.match(/\s*$/)?.[0]||'';
    return left+out+right;
  }

  let applying=false;
  function apply(root=document.body){
    if(!root||applying)return;
    applying=true;
    try{
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
        const p=node.parentElement;if(!p||['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','TEXTAREA'].includes(p.tagName))return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
      }});
      const nodes=[];let n;while(n=walker.nextNode())nodes.push(n);
      nodes.forEach(node=>{const next=translateString(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next});
      root.querySelectorAll?.('[aria-label],[title]').forEach(el=>{
        ['aria-label','title'].forEach(a=>{if(el.hasAttribute(a)){const v=el.getAttribute(a),next=translateString(v);if(next!==v)el.setAttribute(a,next)}});
      });
      document.documentElement.lang=lang==='zh-TW'?'zh-Hant':lang==='zh-CN'?'zh-CN':'en';
      document.documentElement.dataset.lang=lang;
      updateControl();
    }finally{applying=false}
  }

  function setLanguage(next){
    if(!supported.includes(next))return;
    lang=next;localStorage.setItem(LANG_KEY,lang);apply(document.body);
    window.dispatchEvent(new CustomEvent('travel:language',{detail:{language:lang}}));
  }
  function getLanguage(){return lang}

  let button,panel;
  function updateControl(){
    if(button)button.textContent=lang==='zh-CN'?'简':lang==='zh-TW'?'繁':'EN';
    panel?.querySelectorAll('[data-lang-choice]').forEach(b=>b.classList.toggle('selected',b.dataset.langChoice===lang));
  }
  function installControl(){
    const actions=document.querySelector('.actions');if(!actions||document.getElementById('languageButton'))return;
    const style=document.createElement('style');style.textContent=`
      .lang-wrap{position:relative}.lang-button{font-size:12px!important;font-weight:950;letter-spacing:-.02em}.lang-menu{position:absolute;right:0;top:50px;width:178px;padding:8px;border-radius:18px;background:var(--card-solid);border:1px solid var(--line);box-shadow:var(--shadow);z-index:50;display:none}.lang-menu.open{display:grid;gap:4px}.lang-choice{border:0;background:transparent;color:var(--text);text-align:left;padding:10px 11px;border-radius:12px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}.lang-choice:hover,.lang-choice.selected{background:color-mix(in srgb,var(--purple) 12%,transparent);color:var(--purple)}
      [data-lang="zh-CN"] .weather-card.route-next:after{content:'下一站'!important}[data-lang="zh-TW"] .weather-card.route-next:after{content:'下一站'!important}[data-lang="en"] .weather-card.route-next:after{content:'NEXT STOP'!important}
    `;document.head.appendChild(style);
    const wrap=document.createElement('div');wrap.className='lang-wrap';wrap.innerHTML=`<button class="circle lang-button" id="languageButton" type="button" aria-label="Language">简</button><div class="lang-menu" id="languageMenu"><button class="lang-choice" data-lang-choice="zh-CN">简体中文</button><button class="lang-choice" data-lang-choice="zh-TW">繁體中文</button><button class="lang-choice" data-lang-choice="en">English</button></div>`;
    actions.insertBefore(wrap,document.getElementById('theme'));
    button=wrap.querySelector('#languageButton');panel=wrap.querySelector('#languageMenu');
    button.onclick=e=>{e.stopPropagation();panel.classList.toggle('open')};
    panel.onclick=e=>{const b=e.target.closest('[data-lang-choice]');if(!b)return;setLanguage(b.dataset.langChoice);panel.classList.remove('open')};
    document.addEventListener('click',e=>{if(!wrap.contains(e.target))panel.classList.remove('open')});
    updateControl();
  }

  window.TravelPreferences={getLanguage,setLanguage,translate:translateString,getWeatherUnit:()=>localStorage.getItem(UNIT_KEY)||'imperial',setWeatherUnit:u=>{if(!['imperial','metric'].includes(u))return;localStorage.setItem(UNIT_KEY,u);window.dispatchEvent(new CustomEvent('travel:weather-unit',{detail:{unit:u}}))}};

  function boot(){installControl();apply(document.body);const observer=new MutationObserver(muts=>{if(applying)return;const roots=new Set();muts.forEach(m=>{if(m.type==='childList')m.addedNodes.forEach(n=>{if(n.nodeType===1)roots.add(n);else if(n.nodeType===3&&n.parentElement)roots.add(n.parentElement)});else if(m.target?.parentElement)roots.add(m.target.parentElement)});roots.forEach(r=>apply(r))});observer.observe(document.body,{subtree:true,childList:true,characterData:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
