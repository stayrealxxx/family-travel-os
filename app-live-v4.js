(()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const lang=()=>localStorage.getItem('travel.language')||'zh-CN';
const pillClass=s=>s==='BOOKED'||s==='PAID'?'ok':s==='CONSIDERING'?'warn':'need';
const iconFor=t=>({flight:'✈️',hotel:'🏨',stay:'🏠',car:'🚗',parking:'🅿️',activity:'🎟️',restaurant:'🍽️'})[t]||'📌';
const mapUrl=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q||'');
const hasCjk=s=>/[\u3400-\u9fff\uf900-\ufaff]/.test(String(s||''));

const I18N={
'zh-CN':{booked:'已预订 / 已支付',needed:'仍需预订',total:'总项目',auto:'自动同步',manual:'手动同步',last:'上次检查',refresh:'刷新',refreshing:'刷新中…',retry:'重试',empty:'还没有预订数据。',connection:'转机待定',depart:'出发',arrive:'抵达',checkin:'入住',checkout:'退房',nights:'晚',nav:'导航',pickup:'取车',dropoff:'还车',start:'开始',end:'结束',pre:'旅行前模式 · 当前显示下一项计划',done:'旅行已结束 · 行程保留为记录',today:'TODAY MODE · 已完成项目自动变灰，下一项高亮',tbd:'待确认',detailsTbd:'详情待确认',status:{'STILL NEEDED':'仍需预订','BOOKED':'已预订','PAID':'已支付','CONSIDERING':'考虑中'}},
'zh-TW':{booked:'已預訂 / 已支付',needed:'仍需預訂',total:'總項目',auto:'自動同步',manual:'手動同步',last:'上次檢查',refresh:'重新整理',refreshing:'重新整理中…',retry:'重試',empty:'還沒有預訂資料。',connection:'轉機待定',depart:'出發',arrive:'抵達',checkin:'入住',checkout:'退房',nights:'晚',nav:'導航',pickup:'取車',dropoff:'還車',start:'開始',end:'結束',pre:'旅行前模式 · 目前顯示下一項計畫',done:'旅行已結束 · 行程保留為紀錄',today:'TODAY MODE · 已完成項目自動變灰，下一項高亮',tbd:'待確認',detailsTbd:'詳情待確認',status:{'STILL NEEDED':'仍需預訂','BOOKED':'已預訂','PAID':'已支付','CONSIDERING':'考慮中'}},
en:{booked:'Booked / Paid',needed:'Still Needed',total:'Total Items',auto:'AUTO SYNC',manual:'MANUAL SYNC',last:'Last checked',refresh:'Refresh',refreshing:'Refreshing…',retry:'Retry',empty:'No booking data yet.',connection:'CONNECTION TBD',depart:'DEPART',arrive:'ARRIVE',checkin:'CHECK-IN',checkout:'CHECK-OUT',nights:'nights',nav:'Directions',pickup:'PICKUP',dropoff:'DROP-OFF',start:'START',end:'END',pre:'Pre-trip mode · showing the next planned item',done:'Trip complete · itinerary kept as a record',today:'TODAY MODE · completed items dim automatically; next item highlighted',tbd:'TBD',detailsTbd:'Details to be confirmed',status:{'STILL NEEDED':'STILL NEEDED','BOOKED':'BOOKED','PAID':'PAID','CONSIDERING':'CONSIDERING'}}};
const t=()=>I18N[lang()]||I18N['zh-CN'];

const BOOKING_COPY={
'Outbound flight':{
 'zh-CN':{label:'去程航班',detail:'12/24 从家开车到 PHL；优先 PHL → SFO nonstop，避免过早起飞。'},
 'zh-TW':{label:'去程航班',detail:'12/24 從家開車到 PHL；優先 PHL → SFO nonstop，避免過早起飛。'},
 en:{label:'Outbound flight',detail:'Dec 24: drive from home to PHL; prioritize a nonstop PHL → SFO flight without an unnecessarily early departure.'}},
'Bay Area rental car':{
 'zh-CN':{label:'Bay Area 租车',name:'家庭用车',detail:'SFO 落地后取车开往 San Jose；12/28 根据加州段航班从 SFO 或 SJC 还车。'},
 'zh-TW':{label:'Bay Area 租車',name:'家庭用車',detail:'SFO 落地後取車開往 San Jose；12/28 根據加州段航班從 SFO 或 SJC 還車。'},
 en:{label:'Bay Area rental car',name:'Family-size vehicle',detail:'Pick up at SFO after landing and drive to San Jose; on Dec 28 return at SFO or SJC based on the California flight.'}},
'San Jose stay':{
 'zh-CN':{label:'San Jose 住宿',name:'San Jose 酒店',detail:'连续住 4 晚；优先家庭便利、停车方便并减少换酒店。'},
 'zh-TW':{label:'San Jose 住宿',name:'San Jose 飯店',detail:'連續住 4 晚；優先家庭便利、停車方便並減少換飯店。'},
 en:{label:'San Jose stay',name:'San Jose hotel',detail:'Stay 4 consecutive nights; prioritize family convenience, easy parking, and no hotel changes.'}},
'California flight':{
 'zh-CN':{label:'加州段航班',detail:'比较 SFO vs SJC 出发、LAX vs BUR 抵达；按一家四口的真实总成本和到 Thousand Oaks 的实际时间决定。'},
 'zh-TW':{label:'加州段航班',detail:'比較 SFO vs SJC 出發、LAX vs BUR 抵達；按一家四口的真實總成本和到 Thousand Oaks 的實際時間決定。'},
 en:{label:'California flight',detail:'Compare SFO vs SJC departures and LAX vs BUR arrivals; choose by true family cost and actual door-to-door time to Thousand Oaks.'}},
'Southern California rental car':{
 'zh-CN':{label:'Southern California 租车',name:'家庭用车',detail:'抵达南加州后取车；1/2 在 LAX 还车后搭乘返程航班。'},
 'zh-TW':{label:'Southern California 租車',name:'家庭用車',detail:'抵達南加州後取車；1/2 在 LAX 還車後搭乘返程航班。'},
 en:{label:'Southern California rental car',name:'Family-size vehicle',detail:'Pick up after arriving in Southern California; return the car at LAX on Jan 2 before the flight home.'}},
'Thousand Oaks stay':{
 'zh-CN':{label:'Thousand Oaks 住宿',name:'Thousand Oaks / Westlake Village',detail:'住在朋友家附近连续 5 晚；优先房间空间、早餐、停车和家庭便利。'},
 'zh-TW':{label:'Thousand Oaks 住宿',name:'Thousand Oaks / Westlake Village',detail:'住在朋友家附近連續 5 晚；優先房間空間、早餐、停車和家庭便利。'},
 en:{label:'Thousand Oaks stay',name:'Thousand Oaks / Westlake Village',detail:'Stay 5 consecutive nights near friends; prioritize room space, breakfast, parking, and family convenience.'}},
'Return flight':{
 'zh-CN':{label:'返程航班',detail:'1/2 LAX 还车后飞回 PHL；取自家车开回家，1/3 保留 buffer。'},
 'zh-TW':{label:'返程航班',detail:'1/2 LAX 還車後飛回 PHL；取自家車開回家，1/3 保留 buffer。'},
 en:{label:'Return flight',detail:'Jan 2: return the car at LAX, fly to PHL, pick up the family car, and drive home; keep Jan 3 as a buffer.'}},
'PHL parking':{
 'zh-CN':{label:'PHL 停车',name:'PHL 机场停车',detail:'12/24 自驾到 PHL 后停车；1/2 返回 PHL 后取车直接回家。'},
 'zh-TW':{label:'PHL 停車',name:'PHL 機場停車',detail:'12/24 自駕到 PHL 後停車；1/2 返回 PHL 後取車直接回家。'},
 en:{label:'PHL parking',name:'PHL airport parking',detail:'Park after driving to PHL on Dec 24; pick up the family car at PHL on Jan 2 and drive directly home.'}}
};

function genericTranslate(v){
 if(v==null)return '';
 const s=String(v);
 if(['待确认','待確認','TBD'].includes(s.trim()))return t().tbd;
 let out=s;
 try{out=window.TravelPreferences?.translate?.(s)||s}catch(e){}
 if(lang()==='en'&&hasCjk(out))return t().detailsTbd;
 return out;
}
function localizedBooking(x){
 const c=BOOKING_COPY[x.label]?.[lang()]||null;
 return {
   label:c?.label||genericTranslate(x.label),
   name:c?.name||genericTranslate(x.name||''),
   detail:c?.detail||genericTranslate(x.detail||''),
   depart:genericTranslate(x.depart||t().tbd),
   arrive:genericTranslate(x.arrive||t().tbd),
   flightNumber:genericTranslate(x.flightNumber||t().tbd),
   pickup:genericTranslate(x.pickup||t().tbd),
   dropoff:genericTranslate(x.dropoff||t().tbd),
   address:genericTranslate(x.address||'')
 };
}

let latestData=null,loading=false;
function addStyles(){if(document.getElementById('liveDashboardStylesV4'))return;const s=document.createElement('style');s.id='liveDashboardStylesV4';s.textContent=`
.booking.live{padding:17px}.live .booking-name{font-size:12px;text-transform:uppercase;letter-spacing:.06em;font-weight:900}.live .bigrow{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-top:12px}.live .airport{font-size:30px}.live .timepair{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}.live .timepair b{font-size:16px}.live .timepair span{font-size:11px;color:var(--muted)}.live .hotel-dates{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin-top:12px}.live .hotel-dates b{font-size:15px}.live .hotel-dates small{font-size:10px;color:var(--muted);display:block;margin-bottom:3px}.live .nights{font-size:11px;color:var(--muted);white-space:nowrap}.live .card-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.live .mini-btn{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);border-radius:999px;padding:7px 10px;text-decoration:none;color:var(--text);font-size:11px;font-weight:800;background:transparent}.event.is-past{opacity:.46}.event.is-next{background:color-mix(in srgb,var(--accent,var(--purple)) 8%,transparent);margin:4px -6px;padding:11px 6px;border-radius:12px}.today-banner{margin:12px 0 0;padding:10px 12px;border-radius:14px;background:color-mix(in srgb,var(--accent,var(--purple)) 9%,var(--card));font-size:12px;font-weight:850;color:var(--accent,var(--purple))}.trip-ops{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 11px}.trip-op{padding:13px 12px;border-radius:18px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow-soft);min-width:0}.trip-op-label{font-size:9px;color:var(--muted);font-weight:900;letter-spacing:.05em;text-transform:uppercase}.trip-op-value{font-size:21px;line-height:1.05;font-weight:950;margin-top:5px;letter-spacing:-.04em}.trip-op-value.good{color:var(--green)}.trip-op-value.attn{color:var(--red)}.sync-panel{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 13px;margin:0 0 12px;border:1px solid var(--line);border-radius:17px;background:color-mix(in srgb,var(--card-solid) 62%,transparent)}.sync-copy{min-width:0}.sync-title{font-size:11px;font-weight:950}.sync-sub{font-size:10px;color:var(--muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sync-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-right:6px}.refresh-live{border:1px solid var(--line);background:transparent;color:var(--text);border-radius:999px;padding:7px 10px;font-size:10px;font-weight:900;cursor:pointer;white-space:nowrap}.refresh-live.is-loading{opacity:.55;pointer-events:none}.car-route,.parking-range{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;margin-top:13px;padding-top:12px;border-top:1px solid var(--line)}.car-route small,.parking-range small{display:block;color:var(--muted);font-size:9px;letter-spacing:.08em;margin-bottom:4px}.car-route b,.parking-range b{font-size:13px}.booking-empty{padding:22px;text-align:center;color:var(--muted);font-size:12px}.sync-source{font-weight:800;color:var(--text)}@media(max-width:560px){.trip-ops{grid-template-columns:repeat(3,1fr);gap:6px}.trip-op{padding:11px 9px;border-radius:15px}.trip-op-value{font-size:18px}.sync-panel{align-items:flex-start}.sync-sub{white-space:normal}.live .airport{font-size:25px}}
`;document.head.appendChild(s)}
function counts(bookings=[]){const done=bookings.filter(x=>x.status==='BOOKED'||x.status==='PAID').length,needed=bookings.filter(x=>x.status==='STILL NEEDED').length;return{done,needed,total:bookings.length}}
function ensureOpsPanel(data){const grid=$('bookingGrid');if(!grid)return;let host=$('tripOpsDashboard');if(!host){host=document.createElement('div');host.id='tripOpsDashboard';grid.parentNode.insertBefore(host,grid)}const c=counts(data.bookings||[]),mode=(data.sync?.mode||'manual').toLowerCase(),modeLabel=mode==='auto'||mode==='automatic'?t().auto:t().manual;host.innerHTML=`<div class="trip-ops"><div class="trip-op"><div class="trip-op-label">${t().booked}</div><div class="trip-op-value good">${c.done}</div></div><div class="trip-op"><div class="trip-op-label">${t().needed}</div><div class="trip-op-value ${c.needed?'attn':''}">${c.needed}</div></div><div class="trip-op"><div class="trip-op-label">${t().total}</div><div class="trip-op-value">${c.total}</div></div></div><div class="sync-panel"><div class="sync-copy"><div class="sync-title"><span class="sync-dot"></span>${modeLabel}</div><div class="sync-sub"><span class="sync-source">${esc(data.sync?.source||'GitHub')}</span> · ${t().last} ${esc(data.sync?.lastChecked||'—')}</div></div><button class="refresh-live" id="refreshLiveData" type="button">↻ ${t().refresh}</button></div>`;$('refreshLiveData').onclick=()=>loadData(true)}
function renderBookings(data){const grid=$('bookingGrid');if(!grid)return;latestData=data;ensureOpsPanel(data);const items=data.bookings||[];if(!items.length){grid.innerHTML=`<div class="card booking-empty">${t().empty}</div>`;return}grid.innerHTML=items.map(x=>{const y=localizedBooking(x),cls=pillClass(x.status),status=t().status[x.status]||x.status,icon=iconFor(x.type);if(x.type==='flight')return `<div class="card booking live"><div class="booking-top"><span class="booking-icon">${icon}</span><span class="pill ${cls}">${esc(status)}</span></div><div class="booking-name">${esc(y.label)}</div><div class="bigrow"><div><div class="airport">${esc(x.from)}</div><div class="booking-sub">${esc(x.date)}</div></div><div>✈️</div><div style="text-align:right"><div class="airport">${esc(x.to)}</div><div class="booking-sub">${x.nonstop?'NONSTOP':t().connection}</div></div></div><div class="timepair"><div><span>${t().depart}</span><b>${esc(y.depart)}</b></div><div>→</div><div style="text-align:right"><span>${t().arrive}</span><b>${esc(y.arrive)}</b></div></div><div class="booking-sub">${esc(y.flightNumber)} · ${esc(y.detail)}</div></div>`;if(x.type==='hotel'||x.type==='stay')return `<div class="card booking live"><div class="booking-top"><span class="booking-icon">${icon}</span><span class="pill ${cls}">${esc(status)}</span></div><div class="booking-name">${esc(y.label)}</div><div class="booking-main">${esc(y.name)}</div><div class="hotel-dates"><div><small>${t().checkin}</small><b>${esc(x.checkIn)}</b></div><div class="nights">${esc(x.nights)} ${t().nights}</div><div style="text-align:right"><small>${t().checkout}</small><b>${esc(x.checkOut)}</b></div></div><div class="booking-sub">${esc(y.detail)}</div>${x.address&& !['待确认','待確認','TBD'].includes(x.address)?`<div class="card-actions"><a class="mini-btn" href="${mapUrl(x.address)}" target="_blank" rel="noreferrer">📍 ${t().nav}</a></div>`:''}</div>`;if(x.type==='car')return `<div class="card booking live"><div class="booking-top"><span class="booking-icon">${icon}</span><span class="pill ${cls}">${esc(status)}</span></div><div class="booking-name">${esc(y.label)}</div><div class="booking-main">${esc(y.name||t().tbd)}</div><div class="car-route"><div><small>${t().pickup}</small><b>${esc(y.pickup)}</b></div><div>→</div><div style="text-align:right"><small>${t().dropoff}</small><b>${esc(y.dropoff)}</b></div></div><div class="booking-sub">${esc(x.pickupDate||'')} ${x.dropoffDate?`→ ${esc(x.dropoffDate)}`:''}</div><div class="booking-sub">${esc(y.detail)}</div></div>`;if(x.type==='parking')return `<div class="card booking live"><div class="booking-top"><span class="booking-icon">${icon}</span><span class="pill ${cls}">${esc(status)}</span></div><div class="booking-name">${esc(y.label)}</div><div class="booking-main">${esc(y.name||t().tbd)}</div><div class="parking-range"><div><small>${t().start}</small><b>${esc(x.startDate||t().tbd)}</b></div><div>→</div><div style="text-align:right"><small>${t().end}</small><b>${esc(x.endDate||t().tbd)}</b></div></div><div class="booking-sub">${esc(y.detail)}</div></div>`;return `<div class="card booking live"><div class="booking-top"><span class="booking-icon">${icon}</span><span class="pill ${cls}">${esc(status)}</span></div><div class="booking-name">${esc(y.label)}</div><div class="booking-main">${esc(y.name||t().tbd)}</div><div class="booking-sub">${esc(y.detail)}</div></div>`}).join('');window.dispatchEvent(new CustomEvent('travel:bookings-rendered',{detail:{data}}))}
function updateTodayMode(){try{const now=Date.now(),events=typeof allEvents==='function'?allEvents():[],next=events.find(e=>new Date(e.iso).getTime()>now);document.querySelectorAll('.event').forEach(el=>el.classList.remove('is-past','is-next'));[...document.querySelectorAll('.event')].forEach((el,i)=>{const ev=events[i];if(!ev)return;const time=new Date(ev.iso).getTime();if(time<now)el.classList.add('is-past');if(next&&ev.iso===next.iso)el.classList.add('is-next')});const hero=$('today');if(hero&&!$('todayModeBanner')){const b=document.createElement('div');b.id='todayModeBanner';b.className='today-banner';hero.appendChild(b)}const b=$('todayModeBanner');if(b){const start=new Date(latestData?.trip?.start||'2026-12-24T08:00:00-05:00').getTime(),end=new Date(latestData?.trip?.end||'2027-01-02T21:30:00-05:00').getTime();b.textContent=now<start?t().pre:now>end?t().done:t().today}}catch(e){}}
async function loadData(fromButton=false){if(loading)return;loading=true;const btn=$('refreshLiveData');if(btn){btn.classList.add('is-loading');btn.textContent=t().refreshing}try{const r=await fetch('./trip-data.json?ts='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('trip-data.json '+r.status);const d=await r.json();renderBookings(d);updateTodayMode()}catch(e){console.warn('Family Travel OS live data unavailable',e);if(fromButton&&btn)btn.textContent=t().retry}finally{loading=false;const b=$('refreshLiveData');if(b){b.classList.remove('is-loading');b.textContent='↻ '+t().refresh}}}
async function boot(){addStyles();await loadData(false);updateTodayMode();setInterval(updateTodayMode,30000)}
window.addEventListener('travel:language',()=>{if(latestData)renderBookings(latestData);updateTodayMode()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();