(()=>{
  if(window.TravelPreferencesV3)return;
  window.TravelPreferencesV3=true;

  const LANG_KEY='travel.language';
  const UNIT_KEY='travel.weatherUnit';
  const supported=['zh-CN','zh-TW','en'];
  let lang=supported.includes(localStorage.getItem(LANG_KEY))?localStorage.getItem(LANG_KEY):'zh-CN';

  // Phrase-level overrides are applied before character conversion. This avoids
  // context-sensitive Simplified→Traditional mistakes such as 計劃/規劃 and
  // also gives a few UI terms a natural Traditional-Chinese rendering.
  const traditionalPhrases={
    '规划中':'規劃中','规划':'規劃','计划':'計劃','当前显示下一项计划':'當前顯示下一項計劃',
    '倒计时':'倒計時','实时':'實時','预订':'預訂','仍需预订':'仍需預訂','已预订':'已預訂',
    '自动同步':'自動同步','手动同步':'手動同步','关键交通':'關鍵交通','待办':'待辦',
    '办理登机':'辦理登機','自驾':'自駕','缓存':'快取','缓存的天气数据':'快取的天氣資料',
    '天气数据':'天氣資料','数据':'資料','公开页面':'公開頁面','敏感确认信息':'敏感確認資訊',
    '确认信息':'確認資訊','信息':'資訊','降水概率':'降雨機率','概率':'機率',
    '当地时间':'當地時間','未来几天':'未來幾天','联网后':'連網後','无法载入':'無法載入',
    '恢复':'恢復','路线图':'路線圖','点击日期展开':'點擊日期展開','横向滑动查看':'橫向滑動查看',
    '租车方案':'租車方案','分段租车':'分段租車','儿童座椅':'兒童座椅','营业时间':'營業時間',
    '订位':'訂位','节假日':'節假日','朋友探访':'朋友探訪','跨年前后':'跨年前後',
    '减少':'減少','搬运行李':'搬運行李','跨大陆':'跨大陸','境内航班':'境內航班',
    '抵达':'抵達','出发':'出發','返程':'返程','飞行':'飛行','转场':'轉場','转机':'轉機',
    '直飞':'直飛','还车':'還車','取车':'取車','家庭用车':'家庭用車','总项目':'總項目',
    '下一项':'下一項','稍后':'稍後','然后':'然後','旅行准备中':'旅行準備中',
    '行程已完成':'行程已完成','旅行已结束':'旅行已結束','支持离线使用':'支援離線使用',
    '天气提醒':'天氣提醒','天气预报':'天氣預報','行程预报':'行程預報','风速':'風速','体感':'體感',
    '湾区':'灣區','费城地区':'費城地區','优先':'優先','确认':'確認','确定':'確定','锁定':'鎖定'
  };
  const tradPhraseKeys=Object.keys(traditionalPhrases).sort((a,b)=>b.length-a.length);

  // Complete subset used by Family Travel OS. Keep this local so the PWA works
  // offline and does not depend on an external conversion service.
  const traditionalMap={
    '万':'萬','与':'與','专':'專','业':'業','东':'東','丝':'絲','两':'兩','严':'嚴','个':'個','为':'為','丽':'麗','举':'舉','义':'義','乐':'樂','乔':'喬','习':'習','书':'書','买':'買','乱':'亂','争':'爭','于':'於','亏':'虧','云':'雲','亚':'亞','产':'產','亩':'畝','亲':'親','亿':'億','仅':'僅','从':'從','仓':'倉','仪':'儀','们':'們','价':'價','众':'眾','优':'優','会':'會','伞':'傘','伟':'偉','传':'傳','伤':'傷','伦':'倫','体':'體','余':'餘','佣':'傭','侠':'俠','侣':'侶','侥':'僥','侦':'偵','侧':'側','侨':'僑','侩':'儈','侬':'儂','俩':'倆','俭':'儉','债':'債','倾':'傾','偿':'償','储':'儲','儿':'兒','党':'黨','兰':'蘭','关':'關','兴':'興','养':'養','兽':'獸','内':'內','冈':'岡','册':'冊','写':'寫','军':'軍','农':'農','冲':'衝','决':'決','况':'況','冻':'凍','净':'淨','凉':'涼','减':'減','凑':'湊','几':'幾','凤':'鳳','凭':'憑','凯':'凱','击':'擊','划':'劃','刘':'劉','则':'則','刚':'剛','创':'創','删':'刪','别':'別','刹':'剎','剂':'劑','剑':'劍','剧':'劇','劝':'勸','办':'辦','务':'務','动':'動','励':'勵','劲':'勁','劳':'勞','势':'勢','勋':'勳','匀':'勻','区':'區','医':'醫','华':'華','协':'協','单':'單','卖':'賣','卢':'盧','卫':'衛','却':'卻','厅':'廳','历':'歷','厉':'厲','压':'壓','厌':'厭','厕':'廁','县':'縣','参':'參','双':'雙','发':'發','变':'變','叙':'敘','叹':'嘆','叶':'葉','号':'號','后':'後','吓':'嚇','吕':'呂','吗':'嗎','听':'聽','启':'啟','吴':'吳','呐':'吶','呕':'嘔','员':'員','咏':'詠','咙':'嚨','咸':'鹹','响':'響','哑':'啞','哗':'嘩','唤':'喚','啸':'嘯','喷':'噴','团':'團','园':'園','围':'圍','国':'國','图':'圖','圆':'圓','圣':'聖','场':'場','坏':'壞','块':'塊','坚':'堅','坛':'壇','坝':'壩','坞':'塢','垄':'壟','垒':'壘','垦':'墾','垫':'墊','垭':'埡','墙':'牆','壮':'壯','声':'聲','壳':'殼','处':'處','备':'備','复':'復','够':'夠','头':'頭','夹':'夾','夺':'奪','奋':'奮','奖':'獎','妇':'婦','妈':'媽','妆':'妝','姗':'姍','姜':'薑','娄':'婁','娱':'娛','婴':'嬰','婶':'嬸','孙':'孫','学':'學','宁':'寧','宝':'寶','实':'實','宠':'寵','审':'審','宪':'憲','宫':'宮','宽':'寬','宾':'賓','对':'對','导':'導','寻':'尋','寿':'壽','将':'將','尔':'爾','尘':'塵','尝':'嘗','层':'層','届':'屆','属':'屬','岁':'歲','岂':'豈','岗':'崗','岛':'島','岭':'嶺','岳':'嶽','峡':'峽','峦':'巒','币':'幣','帅':'帥','师':'師','帐':'帳','帘':'簾','带':'帶','帮':'幫','帧':'幀','席':'蓆','帮':'幫','幺':'么','庄':'莊','庆':'慶','庐':'廬','应':'應','庙':'廟','废':'廢','广':'廣','开':'開','异':'異','弃':'棄','张':'張','弥':'彌','弯':'彎','弹':'彈','强':'強','归':'歸','当':'當','录':'錄','彦':'彥','彻':'徹','径':'徑','忆':'憶','忧':'憂','怀':'懷','态':'態','怂':'慫','总':'總','恋':'戀','恒':'恆','恳':'懇','恶':'惡','恼':'惱','悦':'悅','悬':'懸','惊':'驚','惧':'懼','惨':'慘','惯':'慣','愤':'憤','愿':'願','慑':'懾','懒':'懶','戏':'戲','户':'戶','扫':'掃','扬':'揚','扰':'擾','抚':'撫','抛':'拋','抢':'搶','护':'護','报':'報','担':'擔','拟':'擬','拢':'攏','拣':'揀','拥':'擁','拨':'撥','择':'擇','挂':'掛','挚':'摯','挛':'攣','挝':'撾','挟':'挾','挡':'擋','挣':'掙','挥':'揮','损':'損','捡':'撿','换':'換','据':'據','掳':'擄','掷':'擲','搀':'攙','携':'攜','摄':'攝','摆':'擺','摇':'搖','撑':'撐','撵':'攆','擞':'擻','攒':'攢','敌':'敵','敛':'斂','数':'數','斋':'齋','斩':'斬','断':'斷','无':'無','旧':'舊','时':'時','旷':'曠','显':'顯','晋':'晉','晒':'曬','晓':'曉','暂':'暫','术':'術','机':'機','杀':'殺','杂':'雜','权':'權','条':'條','来':'來','杨':'楊','极':'極','构':'構','枪':'槍','柜':'櫃','标':'標','栈':'棧','栋':'棟','栏':'欄','树':'樹','样':'樣','档':'檔','桥':'橋','梦':'夢','检':'檢','楼':'樓','欢':'歡','欧':'歐','歼':'殲','残':'殘','殴':'毆','气':'氣','汉':'漢','汤':'湯','沟':'溝','没':'沒','沥':'瀝','沦':'淪','沧':'滄','沪':'滬','泪':'淚','泼':'潑','泽':'澤','洁':'潔','浅':'淺','浆':'漿','浇':'澆','测':'測','济':'濟','浑':'渾','浓':'濃','涂':'塗','涌':'湧','涛':'濤','润':'潤','涩':'澀','渊':'淵','渐':'漸','渔':'漁','温':'溫','湾':'灣','湿':'濕','溃':'潰','滚':'滾','满':'滿','滤':'濾','滥':'濫','滨':'濱','滩':'灘','潜':'潛','潇':'瀟','澜':'瀾','濒':'瀕','灭':'滅','灯':'燈','灵':'靈','灾':'災','灿':'燦','炉':'爐','点':'點','炼':'煉','烁':'爍','烂':'爛','烟':'煙','烦':'煩','烧':'燒','烫':'燙','热':'熱','爱':'愛','爷':'爺','牵':'牽','状':'狀','独':'獨','狭':'狹','猎':'獵','猫':'貓','献':'獻','玛':'瑪','环':'環','现':'現','琐':'瑣','电':'電','画':'畫','畅':'暢','疗':'療','疟':'瘧','疯':'瘋','痪':'瘓','瘾':'癮','皱':'皺','盘':'盤','监':'監','盖':'蓋','盗':'盜','盏':'盞','盐':'鹽','着':'著','睁':'睜','瞒':'瞞','矫':'矯','矿':'礦','码':'碼','砖':'磚','砚':'硯','硕':'碩','碍':'礙','礼':'禮','祷':'禱','祸':'禍','离':'離','秃':'禿','积':'積','称':'稱','稳':'穩','穷':'窮','窑':'窯','窍':'竅','竞':'競','笔':'筆','笋':'筍','筛':'篩','筝':'箏','筹':'籌','签':'簽','简':'簡','类':'類','粮':'糧','紧':'緊','纠':'糾','红':'紅','纤':'纖','约':'約','级':'級','纪':'紀','纬':'緯','纯':'純','纱':'紗','纲':'綱','纳':'納','纵':'縱','纷':'紛','纸':'紙','纹':'紋','纺':'紡','纽':'紐','线':'線','练':'練','组':'組','细':'細','织':'織','终':'終','经':'經','结':'結','绕':'繞','绘':'繪','给':'給','络':'絡','绝':'絕','统':'統','继':'繼','续':'續','绿':'綠','维':'維','综':'綜','缆':'纜','缓':'緩','编':'編','缘':'緣','缚':'縛','缝':'縫','缩':'縮','缴':'繳','网':'網','罗':'羅','罚':'罰','罢':'罷','羡':'羨','翘':'翹','耸':'聳','联':'聯','聪':'聰','肃':'肅','肠':'腸','肤':'膚','肿':'腫','胀':'脹','胶':'膠','脉':'脈','脏':'臟','脑':'腦','脚':'腳','脱':'脫','脸':'臉','腊':'臘','舰':'艦','艺':'藝','节':'節','芜':'蕪','苇':'葦','苍':'蒼','苏':'蘇','苹':'蘋','范':'範','荐':'薦','药':'藥','获':'獲','莱':'萊','莲':'蓮','莹':'瑩','菊':'菊','萝':'蘿','营':'營','萨':'薩','蓝':'藍','虑':'慮','虚':'虛','虫':'蟲','虽':'雖','蚀':'蝕','蛮':'蠻','补':'補','袭':'襲','装':'裝','裤':'褲','见':'見','观':'觀','规':'規','觅':'覓','视':'視','览':'覽','觉':'覺','触':'觸','誉':'譽','计':'計','订':'訂','认':'認','讨':'討','让':'讓','训':'訓','议':'議','讯':'訊','记':'記','讲':'講','许':'許','论':'論','设':'設','访':'訪','诀':'訣','证':'證','评':'評','识':'識','诈':'詐','诉':'訴','诊':'診','词':'詞','译':'譯','试':'試','诗':'詩','诚':'誠','话':'話','诞':'誕','询':'詢','该':'該','详':'詳','语':'語','误':'誤','说':'說','请':'請','诸':'諸','诺':'諾','读':'讀','课':'課','谁':'誰','调':'調','谈':'談','谋':'謀','谐':'諧','谓':'謂','谢':'謝','谣':'謠','谦':'謙','谨':'謹','贝':'貝','负':'負','贡':'貢','财':'財','责':'責','贤':'賢','败':'敗','账':'賬','货':'貨','质':'質','贩':'販','贫':'貧','购':'購','贯':'貫','贴':'貼','贵':'貴','贷':'貸','贸':'貿','费':'費','贺':'賀','贼':'賊','贾':'賈','资':'資','赋':'賦','赌':'賭','赏':'賞','赐':'賜','赔':'賠','赖':'賴','赚':'賺','赛':'賽','赞':'贊','赵':'趙','赶':'趕','趋':'趨','跃':'躍','跻':'躋','践':'踐','踪':'蹤','车':'車','轨':'軌','轩':'軒','转':'轉','轮':'輪','软':'軟','轴':'軸','轻':'輕','载':'載','轿':'轎','辆':'輛','辈':'輩','辉':'輝','辐':'輻','辑':'輯','输':'輸','辖':'轄','辙':'轍','辞':'辭','边':'邊','辽':'遼','达':'達','迁':'遷','过':'過','迈':'邁','运':'運','还':'還','这':'這','进':'進','远':'遠','违':'違','连':'連','迟':'遲','适':'適','选':'選','逊':'遜','递':'遞','逻':'邏','遗':'遺','邮':'郵','邻':'鄰','郑':'鄭','酝':'醞','酱':'醬','酿':'釀','释':'釋','里':'裡','鉴':'鑑','钟':'鐘','钢':'鋼','钥':'鑰','钦':'欽','钱':'錢','钻':'鑽','铁':'鐵','铃':'鈴','铜':'銅','银':'銀','销':'銷','锁':'鎖','锅':'鍋','错':'錯','锻':'鍛','镇':'鎮','镜':'鏡','长':'長','门':'門','闪':'閃','闭':'閉','问':'問','闲':'閒','间':'間','闷':'悶','闹':'鬧','闻':'聞','阅':'閱','队':'隊','阳':'陽','阴':'陰','阵':'陣','阶':'階','际':'際','陆':'陸','陈':'陳','险':'險','随':'隨','隐':'隱','难':'難','雾':'霧','静':'靜','顶':'頂','顷':'頃','项':'項','顺':'順','须':'須','顾':'顧','顿':'頓','颁':'頒','预':'預','领':'領','颈':'頸','频':'頻','题':'題','额':'額','风':'風','飞':'飛','饭':'飯','饮':'飲','馆':'館','驱':'驅','驶':'駛','驾':'駕','验':'驗','马':'馬','驻':'駐','驳':'駁','骑':'騎','骗':'騙','骚':'騷','鱼':'魚','鲜':'鮮','鸟':'鳥','鸡':'雞','麦':'麥','黄':'黃','齐':'齊','齿':'齒','龙':'龍'
  };
  const simplifiedMap={};Object.entries(traditionalMap).forEach(([s,t])=>{if(!simplifiedMap[t])simplifiedMap[t]=s});

  const convertChars=(s,map)=>[...String(s)].map(c=>map[c]||c).join('');
  function toTraditional(input){
    let out=String(input);
    tradPhraseKeys.forEach(k=>{if(out.includes(k))out=out.split(k).join(traditionalPhrases[k])});
    return convertChars(out,traditionalMap);
  }
  const toSimplified=s=>convertChars(String(s),simplifiedMap);

  // English↔Chinese UI dictionary. Unknown proper nouns, airport codes and hotel
  // names intentionally remain unchanged.
  const phrases=[
    ['West Coast Christmas','西海岸圣诞之旅'],['Dec 23, 2026 → Jan 2, 2027 · Family of 4','2026年12月23日 → 2027年1月2日 · 一家四口'],
    ['Live trip countdown','实时行程倒计时'],['Christmas on the West Coast ✨','西海岸圣诞之旅 ✨'],['Philadelphia → Bay Area → Los Angeles → Home','Philadelphia → Bay Area → Los Angeles → 回家'],
    ['PLANNING','规划中'],['DAYS','天'],['HOURS','小时'],['MIN','分钟'],['SEC','秒'],['Trip cards','预订卡片'],['Bookings & key transportation','预订与关键交通'],
    ['Up next','接下来'],['Swipe horizontally','横向滑动查看'],['Itinerary','行程'],['Tap a date to expand','点击日期展开'],['Journey map','路线图'],['Checklist','待办清单'],['Before departure','出发前待办'],
    ['Today','今天'],['Bookings','预订'],['Plan','行程'],['Booked / Paid','已预订 / 已支付'],['Still Needed','仍需预订'],['Total Items','总项目'],['AUTO SYNC','自动同步'],['MANUAL SYNC','手动同步'],['Refresh','刷新'],
    ['Outbound flight','去程航班'],['California flight','加州境内航班'],['Return flight','返程航班'],['Los Angeles stay','Los Angeles 住宿'],['San Jose stay','San Jose 住宿'],['Rental car','租车'],['Family-size vehicle','家庭用车'],
    ['STILL NEEDED','仍需预订'],['BOOKED','已预订'],['PAID','已支付'],['CONSIDERING','考虑中'],['DEPART','出发'],['ARRIVE','抵达'],['CHECK-IN','入住'],['CHECK-OUT','退房'],['PICKUP','取车'],['DROP-OFF','还车'],['NONSTOP','直飞'],['CONNECTION','转机'],['NEXT','下一项'],['THEN','然后'],['LATER','稍后'],
    ['Weather','天气'],['Weather deck','天气'],['Live local weather','实时当地天气'],['Updating weather…','正在更新天气…'],['Clear','晴朗'],['Partly cloudy','少云'],['Cloudy','多云'],['Foggy','有雾'],['Drizzle','毛毛雨'],['Rain','有雨'],['Snow','有雪'],['Thunderstorms','雷雨'],['Variable weather','天气变化'],['Feels like','体感'],['Local time','当地时间'],['Cached','缓存'],['RAIN','降水'],['WIND','风速'],['TRIP','行程'],['FORECAST','预报'],['WAIT','等待'],['Trip forecast active','行程预报已启用'],['Trip weather watch','行程天气提醒'],
    ['Bay Area','湾区'],['Los Angeles area','Los Angeles 地区'],['Home','家'],['Drive','自驾'],['Trip begins · PHL → West Coast','行程开始 · PHL → 西海岸'],['Until estimated departure','距离预计出发时间'],['Trip preparation','旅行准备中'],['On the trip','旅途中'],['Trip complete','旅行已完成'],['Getting ready','准备出发'],['Calculating next item','正在计算下一项行程'],['Pre-trip mode · showing the next planned item','旅行前模式 · 当前显示下一项计划'],['Trip complete · itinerary kept as a record','旅行已结束 · 行程保留为记录'],
    ['Family Travel OS · Offline-ready PWA','Family Travel OS · 支持离线使用'],['Public page excludes sensitive confirmation data','公开页面不会显示敏感确认信息'],
    ['Confirm friends’ dates','确认朋友日期'],['Book main flights','锁定主要航班'],['Confirm San Jose lodging','确认 San Jose 住宿'],['Choose LA lodging','确定 LA 住宿'],['Choose rental-car plan','确定租车方案'],['Plan holiday meals','安排节假日用餐']
  ];

  const table=new Map();
  phrases.forEach(([en,zh])=>{const tw=toTraditional(zh);const row={en,'zh-CN':zh,'zh-TW':tw};[en,zh,tw].forEach(v=>table.set(v,row))});
  const variants=[...table.entries()].sort((a,b)=>b[0].length-a[0].length);

  function translateString(input){
    if(input==null)return input;
    const raw=String(input),trim=raw.trim();if(!trim)return raw;
    const exact=table.get(trim);let out=exact?exact[lang]:trim;
    if(!exact){
      if(lang==='zh-TW')out=toTraditional(out);
      else if(lang==='zh-CN')out=toSimplified(out);
      else variants.forEach(([v,row])=>{if(v.length>=3&&out.includes(v))out=out.split(v).join(row.en)});
    }
    const left=raw.match(/^\s*/)?.[0]||'',right=raw.match(/\s*$/)?.[0]||'';
    return left+out+right;
  }

  const textSource=new WeakMap();
  const attrSource=new WeakMap();
  let observer=null,scheduled=false,button=null,panel=null;
  const observerConfig={subtree:true,childList:true};

  function renderTextNode(node){
    if(!node||node.nodeType!==3)return;
    const p=node.parentElement;
    if(!p||['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','TEXTAREA'].includes(p.tagName)||p.closest?.('.lang-wrap'))return;
    if(!textSource.has(node))textSource.set(node,node.nodeValue);
    const source=textSource.get(node),next=translateString(source);
    if(node.nodeValue!==next)node.nodeValue=next;
  }
  function renderAttrs(el){
    if(!el||el.nodeType!==1||el.closest?.('.lang-wrap'))return;
    let stored=attrSource.get(el);if(!stored){stored={};attrSource.set(el,stored)}
    ['aria-label','title'].forEach(a=>{if(!el.hasAttribute(a))return;if(!(a in stored))stored[a]=el.getAttribute(a);const next=translateString(stored[a]);if(el.getAttribute(a)!==next)el.setAttribute(a,next)});
  }
  function apply(root=document.body){
    if(!root)return;
    observer?.disconnect();
    try{
      if(root.nodeType===3)renderTextNode(root);
      else{
        renderAttrs(root);
        const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=walker.nextNode()))renderTextNode(n);
        root.querySelectorAll?.('[aria-label],[title]').forEach(renderAttrs);
      }
      document.documentElement.lang=lang==='zh-TW'?'zh-Hant-TW':lang==='zh-CN'?'zh-CN':'en';
      document.documentElement.dataset.lang=lang;
    }finally{if(observer)observer.observe(document.body,observerConfig)}
  }

  function setLanguage(next){
    if(!supported.includes(next)||next===lang)return;
    lang=next;localStorage.setItem(LANG_KEY,lang);updateControl();apply(document.body);
    window.dispatchEvent(new CustomEvent('travel:language',{detail:{language:lang}}));
  }
  function updateControl(){
    const label=lang==='zh-CN'?'简':lang==='zh-TW'?'繁':'EN';
    if(button&&button.textContent!==label)button.textContent=label;
    panel?.querySelectorAll('[data-lang-choice]').forEach(b=>b.classList.toggle('selected',b.dataset.langChoice===lang));
  }
  function installControl(){
    const actions=document.querySelector('.actions');if(!actions)return;
    document.getElementById('languageButton')?.closest('.lang-wrap')?.remove();
    const style=document.createElement('style');style.textContent=`.lang-wrap{position:relative}.lang-button{font-size:12px!important;font-weight:950;letter-spacing:-.02em}.lang-menu{position:absolute;right:0;top:50px;width:178px;padding:8px;border-radius:18px;background:var(--card-solid);border:1px solid var(--line);box-shadow:var(--shadow);z-index:50;display:none}.lang-menu.open{display:grid;gap:4px}.lang-choice{border:0;background:transparent;color:var(--text);text-align:left;padding:10px 11px;border-radius:12px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}.lang-choice:hover,.lang-choice.selected{background:color-mix(in srgb,var(--purple) 12%,transparent);color:var(--purple)}[data-lang="zh-CN"] .weather-card.route-next:after,[data-lang="zh-TW"] .weather-card.route-next:after{content:'下一站'!important}[data-lang="en"] .weather-card.route-next:after{content:'NEXT STOP'!important}`;document.head.appendChild(style);
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
      if(scheduled)return;
      const added=[];muts.forEach(m=>m.addedNodes&&m.addedNodes.forEach(n=>added.push(n)));
      if(!added.length)return;
      scheduled=true;
      requestAnimationFrame(()=>{scheduled=false;added.forEach(n=>apply(n))});
    });
    observer.observe(document.body,observerConfig);
  }

  window.TravelPreferences={
    getLanguage:()=>lang,setLanguage,translate:translateString,
    getWeatherUnit:()=>localStorage.getItem(UNIT_KEY)||'imperial',
    setWeatherUnit:u=>{if(!['imperial','metric'].includes(u))return;localStorage.setItem(UNIT_KEY,u);window.dispatchEvent(new CustomEvent('travel:weather-unit',{detail:{unit:u}}))}
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
