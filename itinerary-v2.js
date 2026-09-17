(()=>{
  if(window.__travelPrimaryPlanV2)return;
  window.__travelPrimaryPlanV2=true;

  const lang=()=>localStorage.getItem('travel.language')||'zh-CN';
  const copy={
    'zh-CN':{
      brand:'西海岸圣诞之旅',sub:'2026年12月24日 → 2027年1月2日 · 一家四口',eyebrow:'主行程倒计时',title:'西海岸圣诞之旅 ✨',heroSub:'Downingtown → PHL → SFO → San Jose → Southern California → Thousand Oaks → LAX → PHL → Home',status:'主方案',
      routeName:'主方案 · SFO → San Jose → Thousand Oaks → LAX',routeNote:'12/24 出发；Bay Area 住 4 晚，12/28 转场到南加州，Thousand Oaks 附近连续住 5 晚，1/2 从 LAX 回 PHL。',
      mapTitle:'主行程路线',mapHint:'已收敛为一条主方案',
      flexTitle:'两处机场保持弹性',flexSub:'这里暂时不锁死机场；订票时按一家四口的真实总成本和门到门时间决定。',
      bayTitle:'Bay Area 出发',bayValue:'SFO 或 SJC',bayNote:'比较机票、第一段租车还车位置、从 San Jose 酒店到机场的时间。',
      socalTitle:'Southern California 抵达',socalValue:'LAX 或 BUR',socalNote:'比较机票、第二段租车价格，以及到 Thousand Oaks 酒店的实际车程。',
      fixedTitle:'返程机场',fixedValue:'LAX → PHL',fixedNote:'第二段租车最终在 LAX 还车，优先 nonstop 返回 PHL。',
      tbd:'待定',
      day1:'家 → PHL → SFO → San Jose',day1sub:'自驾到 PHL，飞 SFO；落地取车后开到 San Jose 酒店。',
      leaveHome:'从家出发前往 PHL',leaveHomeD:'自家车留在 PHL；停车方案待订。',flySfo:'PHL → SFO',flySfoD:'优先 nonstop，避免过早起飞；具体航班待订。',pickupBay:'SFO 取第一段租车',pickupBayD:'一家四口 + 行李，车型以家庭空间和总成本为优先。',checkSj:'San Jose 酒店入住',checkSjD:'作为第一段住宿基地，连续住 4 晚。',
      sjDays:'San Jose',sjDaysSub:'3 个完整日，以朋友探访和轻松活动为主。',sjVisit:'San Jose 行程',sjVisitD:'减少搬运行李，维持同一酒店。',
      transfer:'Bay Area → Southern California',transferSub:'从 SFO 或 SJC 起飞，抵达 LAX 或 BUR，再取第二段租车。',dropBay:'第一段租车还车',dropBayD:'还车机场跟随最终选定的 SFO / SJC 航班。',caFlight:'SFO/SJC → LAX/BUR',caFlightD:'短途 nonstop；按真实总成本、机场便利和门到门时间决定。',pickupSoCal:'领取第二段租车',pickupSoCalD:'LAX 或 BUR 取车，随后前往 Thousand Oaks。',checkTo:'Thousand Oaks 附近酒店入住',checkToD:'靠近朋友家，连续住 5 晚。',
      toDays:'Thousand Oaks / LA',toDaysSub:'4 个完整日；保持同一家酒店，朋友探访为主。',toVisit:'Thousand Oaks / LA 行程',toVisitD:'减少换酒店和跨城折腾。',
      returnDay:'Thousand Oaks → LAX → PHL → 家',returnSub:'退房后开到 LAX，还车，飞回 PHL，再取自家车回家。',checkout:'酒店退房并前往 LAX',checkoutD:'为还车、托运行李和安检预留充足时间。',returnCar:'LAX 还第二段租车',returnCarD:'完成南加州租车段。',flyHome:'LAX → PHL',flyHomeD:'优先 nonstop；避免过晚抵达。',driveHome:'PHL 取车后开回家',driveHomeD:'1/3 保留为 work / school buffer。',
      todos:[
        ['✈️','锁定 PHL → SFO','12/24；优先 nonstop + 合理起飞时间'],
        ['🏨','预订 San Jose 酒店','12/24–12/28 · 4 晚；停车、早餐、房间空间'],
        ['🚗','预订 Bay Area 租车','SFO 取车；SFO/SJC 还车，跟随 12/28 航班'],
        ['✈️','比较加州段机场组合','SFO vs SJC → LAX vs BUR；看真实总成本和总时间'],
        ['🏨','预订 Thousand Oaks 酒店','12/28–1/2 · 5 晚；靠近朋友家，减少换酒店'],
        ['🚗','预订 Southern California 租车','LAX/BUR 取车 → LAX 还车'],
        ['✈️','锁定 LAX → PHL','1/2；优先 nonstop，避免太晚回家'],
        ['🅿️','预订 PHL 停车','12/24–1/2；把停车费纳入 true trip cost']
      ]
    },
    'zh-TW':{
      brand:'西海岸聖誕之旅',sub:'2026年12月24日 → 2027年1月2日 · 一家四口',eyebrow:'主行程倒數',title:'西海岸聖誕之旅 ✨',heroSub:'Downingtown → PHL → SFO → San Jose → Southern California → Thousand Oaks → LAX → PHL → Home',status:'主方案',
      routeName:'主方案 · SFO → San Jose → Thousand Oaks → LAX',routeNote:'12/24 出發；Bay Area 住 4 晚，12/28 轉場到南加州，Thousand Oaks 附近連續住 5 晚，1/2 從 LAX 回 PHL。',
      mapTitle:'主行程路線',mapHint:'已收斂為一條主方案',
      flexTitle:'兩處機場保持彈性',flexSub:'這裡暫時不鎖死機場；訂票時按一家四口的真實總成本和門到門時間決定。',
      bayTitle:'Bay Area 出發',bayValue:'SFO 或 SJC',bayNote:'比較機票、第一段租車還車位置、從 San Jose 飯店到機場的時間。',
      socalTitle:'Southern California 抵達',socalValue:'LAX 或 BUR',socalNote:'比較機票、第二段租車價格，以及到 Thousand Oaks 飯店的實際車程。',
      fixedTitle:'返程機場',fixedValue:'LAX → PHL',fixedNote:'第二段租車最終在 LAX 還車，優先 nonstop 返回 PHL。',
      tbd:'待定',
      day1:'家 → PHL → SFO → San Jose',day1sub:'自駕到 PHL，飛 SFO；落地取車後開到 San Jose 飯店。',
      leaveHome:'從家出發前往 PHL',leaveHomeD:'自家車留在 PHL；停車方案待訂。',flySfo:'PHL → SFO',flySfoD:'優先 nonstop，避免過早起飛；具體航班待訂。',pickupBay:'SFO 取第一段租車',pickupBayD:'一家四口 + 行李，車型以家庭空間和總成本為優先。',checkSj:'San Jose 飯店入住',checkSjD:'作為第一段住宿基地，連續住 4 晚。',
      sjDays:'San Jose',sjDaysSub:'3 個完整日，以朋友探訪和輕鬆活動為主。',sjVisit:'San Jose 行程',sjVisitD:'減少搬運行李，維持同一飯店。',
      transfer:'Bay Area → Southern California',transferSub:'從 SFO 或 SJC 起飛，抵達 LAX 或 BUR，再取第二段租車。',dropBay:'第一段租車還車',dropBayD:'還車機場跟隨最終選定的 SFO / SJC 航班。',caFlight:'SFO/SJC → LAX/BUR',caFlightD:'短途 nonstop；按真實總成本、機場便利和門到門時間決定。',pickupSoCal:'領取第二段租車',pickupSoCalD:'LAX 或 BUR 取車，隨後前往 Thousand Oaks。',checkTo:'Thousand Oaks 附近飯店入住',checkToD:'靠近朋友家，連續住 5 晚。',
      toDays:'Thousand Oaks / LA',toDaysSub:'4 個完整日；保持同一家飯店，朋友探訪為主。',toVisit:'Thousand Oaks / LA 行程',toVisitD:'減少換飯店和跨城折騰。',
      returnDay:'Thousand Oaks → LAX → PHL → 家',returnSub:'退房後開到 LAX，還車，飛回 PHL，再取自家車回家。',checkout:'飯店退房並前往 LAX',checkoutD:'為還車、託運行李和安檢預留充足時間。',returnCar:'LAX 還第二段租車',returnCarD:'完成南加州租車段。',flyHome:'LAX → PHL',flyHomeD:'優先 nonstop；避免過晚抵達。',driveHome:'PHL 取車後開回家',driveHomeD:'1/3 保留為 work / school buffer。',
      todos:[
        ['✈️','鎖定 PHL → SFO','12/24；優先 nonstop + 合理起飛時間'],
        ['🏨','預訂 San Jose 飯店','12/24–12/28 · 4 晚；停車、早餐、房間空間'],
        ['🚗','預訂 Bay Area 租車','SFO 取車；SFO/SJC 還車，跟隨 12/28 航班'],
        ['✈️','比較加州段機場組合','SFO vs SJC → LAX vs BUR；看真實總成本和總時間'],
        ['🏨','預訂 Thousand Oaks 飯店','12/28–1/2 · 5 晚；靠近朋友家，減少換飯店'],
        ['🚗','預訂 Southern California 租車','LAX/BUR 取車 → LAX 還車'],
        ['✈️','鎖定 LAX → PHL','1/2；優先 nonstop，避免太晚回家'],
        ['🅿️','預訂 PHL 停車','12/24–1/2；把停車費納入 true trip cost']
      ]
    },
    en:{
      brand:'West Coast Christmas',sub:'Dec 24, 2026 → Jan 2, 2027 · Family of 4',eyebrow:'Primary trip countdown',title:'Christmas on the West Coast ✨',heroSub:'Downingtown → PHL → SFO → San Jose → Southern California → Thousand Oaks → LAX → PHL → Home',status:'PRIMARY PLAN',
      routeName:'Primary plan · SFO → San Jose → Thousand Oaks → LAX',routeNote:'Depart Dec 24; stay 4 nights in the Bay Area, transfer to Southern California on Dec 28, stay 5 nights near Thousand Oaks, then return LAX → PHL on Jan 2.',
      mapTitle:'Primary journey',mapHint:'One primary route',
      flexTitle:'Keep two airport choices flexible',flexSub:'Do not lock these airports yet. Choose by true family cost and door-to-door travel time when booking.',
      bayTitle:'Bay Area departure',bayValue:'SFO or SJC',bayNote:'Compare airfare, first rental-car return location, and hotel-to-airport time from San Jose.',
      socalTitle:'Southern California arrival',socalValue:'LAX or BUR',socalNote:'Compare airfare, second rental-car pricing, and actual drive time to the Thousand Oaks hotel.',
      fixedTitle:'Return airport',fixedValue:'LAX → PHL',fixedNote:'Return the second rental car at LAX and prioritize a nonstop flight to PHL.',
      tbd:'TBD',
      day1:'Home → PHL → SFO → San Jose',day1sub:'Drive to PHL, fly to SFO, pick up a car, then drive to the San Jose hotel.',
      leaveHome:'Drive from home to PHL',leaveHomeD:'Leave the family car at PHL; parking still needs to be booked.',flySfo:'PHL → SFO',flySfoD:'Prioritize nonstop and avoid an unnecessarily early departure.',pickupBay:'Pick up Bay Area rental at SFO',pickupBayD:'Family of four plus luggage; prioritize usable space and true total cost.',checkSj:'Check in at San Jose hotel',checkSjD:'First lodging base for 4 consecutive nights.',
      sjDays:'San Jose',sjDaysSub:'Three full days, mainly visiting friends at a relaxed pace.',sjVisit:'San Jose plans',sjVisitD:'Keep the same hotel and minimize luggage moves.',
      transfer:'Bay Area → Southern California',transferSub:'Fly from SFO or SJC to LAX or BUR, then pick up the second rental car.',dropBay:'Return first rental car',dropBayD:'Return airport follows the final SFO / SJC flight choice.',caFlight:'SFO/SJC → LAX/BUR',caFlightD:'Short nonstop hop; choose by true cost, airport convenience, and door-to-door time.',pickupSoCal:'Pick up Southern California rental',pickupSoCalD:'Pick up at LAX or BUR, then drive to Thousand Oaks.',checkTo:'Check in near Thousand Oaks',checkToD:'Stay near friends for 5 consecutive nights.',
      toDays:'Thousand Oaks / LA',toDaysSub:'Four full days with one hotel base; primarily visiting friends.',toVisit:'Thousand Oaks / LA plans',toVisitD:'Avoid hotel changes and unnecessary cross-city travel.',
      returnDay:'Thousand Oaks → LAX → PHL → Home',returnSub:'Check out, drive to LAX, return the car, fly to PHL, then pick up the family car and drive home.',checkout:'Check out and drive to LAX',checkoutD:'Leave enough time for rental return, checked bags, and security.',returnCar:'Return second rental car at LAX',returnCarD:'Complete the Southern California rental segment.',flyHome:'LAX → PHL',flyHomeD:'Prioritize nonstop and avoid an unnecessarily late arrival.',driveHome:'Pick up car at PHL and drive home',driveHomeD:'Keep Jan 3 as a work / school buffer.',
      todos:[
        ['✈️','Book PHL → SFO','Dec 24 · prioritize nonstop and a reasonable departure time'],
        ['🏨','Book San Jose hotel','Dec 24–28 · 4 nights; parking, breakfast, room size'],
        ['🚗','Book Bay Area rental car','Pick up SFO; return SFO/SJC based on the Dec 28 flight'],
        ['✈️','Compare California airport pairs','SFO vs SJC → LAX vs BUR; compare true cost and total time'],
        ['🏨','Book Thousand Oaks hotel','Dec 28–Jan 2 · 5 nights near friends; avoid hotel changes'],
        ['🚗','Book Southern California rental','Pick up LAX/BUR → return LAX'],
        ['✈️','Book LAX → PHL','Jan 2 · prioritize nonstop and avoid a very late arrival'],
        ['🅿️','Book PHL parking','Dec 24–Jan 2 · include parking in true trip cost']
      ]
    }
  };

  const bookingText={
    'Outbound flight':{en:'Outbound flight','zh-CN':'去程航班','zh-TW':'去程航班'},
    'Bay Area rental car':{en:'Bay Area rental car','zh-CN':'Bay Area 租车','zh-TW':'Bay Area 租車'},
    'San Jose stay':{en:'San Jose stay','zh-CN':'San Jose 住宿','zh-TW':'San Jose 住宿'},
    'California flight':{en:'California flight','zh-CN':'加州境内航班','zh-TW':'加州境內航班'},
    'Southern California rental car':{en:'Southern California rental car','zh-CN':'南加州租车','zh-TW':'南加州租車'},
    'Thousand Oaks stay':{en:'Thousand Oaks stay','zh-CN':'Thousand Oaks 住宿','zh-TW':'Thousand Oaks 住宿'},
    'Return flight':{en:'Return flight','zh-CN':'返程航班','zh-TW':'返程航班'},
    'PHL parking':{en:'PHL parking','zh-CN':'PHL 停车','zh-TW':'PHL 停車'},
    'San Jose hotel':{en:'San Jose hotel','zh-CN':'San Jose 酒店','zh-TW':'San Jose 飯店'},
    'PHL airport parking':{en:'PHL airport parking','zh-CN':'PHL 机场停车','zh-TW':'PHL 機場停車'},
    'Family-size vehicle':{en:'Family-size vehicle','zh-CN':'家庭用车','zh-TW':'家庭用車'},
    '12/24 从家开车到 PHL；优先 PHL → SFO nonstop，避免过早起飞。':{en:'Dec 24: drive from home to PHL; prioritize a nonstop PHL → SFO flight without an unnecessarily early departure.','zh-CN':'12/24 从家开车到 PHL；优先 PHL → SFO nonstop，避免过早起飞。','zh-TW':'12/24 從家開車到 PHL；優先 PHL → SFO nonstop，避免過早起飛。'},
    'SFO 落地后取车开往 San Jose；12/28 根据加州段航班从 SFO 或 SJC 还车。':{en:'Pick up at SFO after landing and drive to San Jose; on Dec 28 return at SFO or SJC based on the California flight.','zh-CN':'SFO 落地后取车开往 San Jose；12/28 根据加州段航班从 SFO 或 SJC 还车。','zh-TW':'SFO 落地後取車開往 San Jose；12/28 根據加州段航班從 SFO 或 SJC 還車。'},
    '连续住 4 晚；优先家庭便利、停车方便并减少换酒店。':{en:'Stay 4 consecutive nights; prioritize family convenience, easy parking, and no hotel changes.','zh-CN':'连续住 4 晚；优先家庭便利、停车方便并减少换酒店。','zh-TW':'連續住 4 晚；優先家庭便利、停車方便並減少換飯店。'},
    '比较 SFO vs SJC 出发、LAX vs BUR 抵达；按总成本和到 Thousand Oaks 的实际时间决定。':{en:'Compare SFO vs SJC departures and LAX vs BUR arrivals; decide by true total cost and actual time to Thousand Oaks.','zh-CN':'比较 SFO vs SJC 出发、LAX vs BUR 抵达；按总成本和到 Thousand Oaks 的实际时间决定。','zh-TW':'比較 SFO vs SJC 出發、LAX vs BUR 抵達；按總成本和到 Thousand Oaks 的實際時間決定。'},
    '抵达南加州后取车；1/2 在 LAX 还车后搭乘返程航班。':{en:'Pick up after arriving in Southern California; return at LAX on Jan 2 before the flight home.','zh-CN':'抵达南加州后取车；1/2 在 LAX 还车后搭乘返程航班。','zh-TW':'抵達南加州後取車；1/2 在 LAX 還車後搭乘返程航班。'},
    '住在朋友家附近连续 5 晚；优先房间空间、早餐、停车和家庭便利。':{en:'Stay 5 consecutive nights near friends; prioritize room space, breakfast, parking, and family convenience.','zh-CN':'住在朋友家附近连续 5 晚；优先房间空间、早餐、停车和家庭便利。','zh-TW':'住在朋友家附近連續 5 晚；優先房間空間、早餐、停車和家庭便利。'},
    '1/2 LAX 还车后飞回 PHL；取自家车开回家，1/3 保留 buffer。':{en:'Jan 2: return the car at LAX, fly to PHL, pick up the family car, and drive home; keep Jan 3 as a buffer.','zh-CN':'1/2 LAX 还车后飞回 PHL；取自家车开回家，1/3 保留 buffer。','zh-TW':'1/2 LAX 還車後飛回 PHL；取自家車開回家，1/3 保留 buffer。'},
    '12/24 自驾到 PHL 后停车；1/2 返回 PHL 后取车直接回家。':{en:'Park after driving to PHL on Dec 24; pick up the family car at PHL on Jan 2 and drive directly home.','zh-CN':'12/24 自驾到 PHL 后停车；1/2 返回 PHL 后取车直接回家。','zh-TW':'12/24 自駕到 PHL 後停車；1/2 返回 PHL 後取車直接回家。'}
  };
  const bookingVariants=[];Object.entries(bookingText).forEach(([seed,row])=>{Object.values(row).forEach(v=>bookingVariants.push([v,row]))});bookingVariants.sort((a,b)=>b[0].length-a[0].length);

  function currentCopy(){return copy[lang()]||copy['zh-CN']}
  function setText(selector,value){const el=document.querySelector(selector);if(el)el.textContent=value}

  function buildPlan(){
    const c=currentCopy();
    if(typeof ROUTES==='undefined'||typeof D==='undefined'||typeof E==='undefined')return;
    Object.keys(ROUTES).forEach(k=>{if(k!=='B')delete ROUTES[k]});
    ROUTES.B={
      name:c.routeName,note:c.routeNote,
      nodes:[['HOME','Downingtown'],['PHL','Philadelphia'],['SFO','Bay Area'],['SJC','San Jose'],['LAX/BUR','SoCal'],['TO','Thousand Oaks'],['LAX','Los Angeles'],['PHL','Philadelphia'],['HOME','Home']],
      days:[
        D('12/24',c.day1,c.day1sub,'SFO',[
          E(c.tbd,c.leaveHome,c.leaveHomeD,'2026-12-24T08:00:00-05:00','Philadelphia International Airport'),
          E(c.tbd,c.flySfo,c.flySfoD,'2026-12-24T11:00:00-05:00','Philadelphia International Airport'),
          E(c.tbd,c.pickupBay,c.pickupBayD,'2026-12-24T15:00:00-08:00','San Francisco International Airport'),
          E(c.tbd,c.checkSj,c.checkSjD,'2026-12-24T18:00:00-08:00','San Jose, CA')
        ]),
        D('12/25–12/27',c.sjDays,c.sjDaysSub,'San Jose',[
          E('10:00',c.sjVisit,c.sjVisitD,'2026-12-25T10:00:00-08:00','San Jose, CA')
        ]),
        D('12/28',c.transfer,c.transferSub,'LAX',[
          E(c.tbd,c.dropBay,c.dropBayD,'2026-12-28T09:00:00-08:00','San Jose, CA'),
          E(c.tbd,c.caFlight,c.caFlightD,'2026-12-28T12:00:00-08:00','Hollywood Burbank Airport'),
          E(c.tbd,c.pickupSoCal,c.pickupSoCalD,'2026-12-28T15:00:00-08:00','Los Angeles International Airport'),
          E(c.tbd,c.checkTo,c.checkToD,'2026-12-28T18:00:00-08:00','Thousand Oaks, CA')
        ]),
        D('12/29–01/01',c.toDays,c.toDaysSub,'Thousand Oaks',[
          E('10:00',c.toVisit,c.toVisitD,'2026-12-29T10:00:00-08:00','Thousand Oaks, CA')
        ]),
        D('01/02',c.returnDay,c.returnSub,'PHL',[
          E(c.tbd,c.checkout,c.checkoutD,'2027-01-02T08:30:00-08:00','Thousand Oaks, CA'),
          E(c.tbd,c.returnCar,c.returnCarD,'2027-01-02T10:30:00-08:00','Los Angeles International Airport'),
          E(c.tbd,c.flyHome,c.flyHomeD,'2027-01-02T13:00:00-08:00','Los Angeles International Airport'),
          E(c.tbd,c.driveHome,c.driveHomeD,'2027-01-02T21:30:00-05:00','Philadelphia International Airport')
        ])
      ]
    };
    try{active='B';localStorage.setItem('travel.route','B')}catch(e){}
    if(typeof TODOS!=='undefined'){TODOS.splice(0,TODOS.length,...c.todos)}
  }

  function updateShell(){
    const c=currentCopy();
    setText('.brand h1',c.brand);setText('.brand .sub',c.sub);setText('.eyebrow',c.eyebrow);setText('.hero-title h2',c.title);setText('.hero-sub',c.heroSub);
    const ns=document.getElementById('nextStatus');if(ns){ns.textContent=c.status;ns.className='pill ok'}
    const section=[...document.querySelectorAll('.section')].find(s=>s.querySelector('#routeSvg'));
    if(section){const h=section.querySelector('.section-head h3'),hint=section.querySelector('.section-head .hint');if(h)h.textContent=c.mapTitle;if(hint)hint.textContent=c.mapHint}
    renderDecisionPanel();
  }

  function renderDecisionPanel(){
    const c=currentCopy();const panelHost=document.querySelector('#routeSvg')?.closest('.route-panel');if(!panelHost)return;
    let panel=document.getElementById('airportFlexPanel');if(!panel){panel=document.createElement('div');panel.id='airportFlexPanel';panel.className='card airport-flex';panelHost.parentNode.insertBefore(panel,panelHost)}
    panel.innerHTML=`<div class="airport-flex-head"><div><b>${c.flexTitle}</b><span>${c.flexSub}</span></div><span class="pill warn">FLEX</span></div><div class="airport-flex-grid"><div><small>${c.bayTitle}</small><strong>${c.bayValue}</strong><p>${c.bayNote}</p></div><div><small>${c.socalTitle}</small><strong>${c.socalValue}</strong><p>${c.socalNote}</p></div><div><small>${c.fixedTitle}</small><strong>${c.fixedValue}</strong><p>${c.fixedNote}</p></div></div>`;
  }

  function translateBookingGrid(){
    const root=document.getElementById('bookingGrid');if(!root)return;const l=lang();
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(node=>{let value=node.nodeValue;bookingVariants.forEach(([variant,row])=>{if(value.includes(variant))value=value.split(variant).join(row[l]||row['zh-CN'])});if(value!==node.nodeValue)node.nodeValue=value});
  }

  function render(){
    buildPlan();updateShell();
    try{if(typeof renderAll==='function')renderAll()}catch(e){console.warn('Primary itinerary render',e)}
    setTimeout(()=>{updateShell();translateBookingGrid()},0);
  }

  const style=document.createElement('style');style.textContent=`
    .route-tabs{display:none!important}.airport-flex{padding:15px;margin-bottom:10px}.airport-flex-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.airport-flex-head b{font-size:14px}.airport-flex-head span:not(.pill){display:block;color:var(--muted);font-size:10px;line-height:1.45;margin-top:4px}.airport-flex-grid{display:grid;grid-template-columns:1fr;gap:8px;margin-top:12px}.airport-flex-grid>div{padding:11px;border:1px solid var(--line);border-radius:14px;background:color-mix(in srgb,var(--card-solid) 55%,transparent)}.airport-flex-grid small{display:block;color:var(--muted);font-size:9px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.airport-flex-grid strong{display:block;font-size:15px;margin-top:5px}.airport-flex-grid p{margin:5px 0 0;color:var(--muted);font-size:10px;line-height:1.45}@media(min-width:720px){.airport-flex-grid{grid-template-columns:repeat(3,1fr)}}
  `;document.head.appendChild(style);

  const grid=document.getElementById('bookingGrid');if(grid)new MutationObserver(()=>translateBookingGrid()).observe(grid,{childList:true,subtree:true});
  window.addEventListener('travel:language',render);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();
