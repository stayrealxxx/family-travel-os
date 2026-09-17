(()=>{
  const hero=document.getElementById('today');
  if(!hero || document.getElementById('weatherDeck')) return;

  const LOCATIONS={
    sj:{name:'San Jose',sub:'Bay Area',lat:37.3382,lon:-121.8863},
    to:{name:'Thousand Oaks',sub:'Los Angeles area',lat:34.1706,lon:-118.8376}
  };
  const WINDOWS={
    A:{to:['2026-12-23','2026-12-30'],sj:['2026-12-30','2027-01-02']},
    B:{sj:['2026-12-23','2026-12-26'],to:['2026-12-26','2027-01-02']},
    C:{to:['2026-12-23','2026-12-28'],sj:['2026-12-28','2026-12-31']},
    D:{sj:['2026-12-23','2026-12-26'],to:['2026-12-26','2027-01-02']}
  };
  const CACHE_KEY='travel.weatherCache.v1';
  const UNIT_KEY='travel.weatherUnit';
  const state={data:{},source:{}};
  let unit=localStorage.getItem(UNIT_KEY)==='metric'?'metric':'imperial';

  const style=document.createElement('style');
  style.textContent=`
  .weather-section{margin-top:16px;animation:weatherIn .5s ease both}@keyframes weatherIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .weather-shell{position:relative;overflow:hidden;border-radius:28px;padding:17px;background:linear-gradient(155deg,#0d1d30 0%,#12304a 52%,#0d3d48 100%);border:1px solid rgba(110,220,255,.15);box-shadow:0 18px 48px rgba(4,23,39,.24);color:#f5fbff}
  .weather-shell:before,.weather-shell:after{content:"";position:absolute;border-radius:50%;filter:blur(34px);pointer-events:none}.weather-shell:before{width:180px;height:180px;right:-70px;top:-90px;background:rgba(83,214,255,.16)}.weather-shell:after{width:150px;height:150px;left:-80px;bottom:-100px;background:rgba(138,130,255,.16)}
  .weather-head{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin-bottom:12px}.weather-head h3{margin:0;font-size:19px;letter-spacing:-.025em}.weather-head p{margin:4px 0 0;color:#96afbf;font-size:10px;line-height:1.4}.weather-head-actions{display:flex;align-items:center;gap:7px}.weather-live{display:inline-flex;align-items:center;gap:6px;font-size:9px;font-weight:950;letter-spacing:.09em;color:#75dcff;white-space:nowrap}.weather-live:before{content:"";width:7px;height:7px;border-radius:50%;background:#53d6ff;box-shadow:0 0 0 0 rgba(83,214,255,.45);animation:weatherPulse 2s infinite}@keyframes weatherPulse{70%{box-shadow:0 0 0 8px rgba(83,214,255,0)}100%{box-shadow:0 0 0 0 rgba(83,214,255,0)}}.weather-unit{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:inherit;border-radius:999px;padding:6px 9px;font-size:9px;font-weight:950;letter-spacing:.04em;cursor:pointer;min-width:37px}.weather-unit:hover{background:rgba(255,255,255,.12)}
  .weather-grid{position:relative;z-index:1;display:grid;grid-template-columns:1fr;gap:10px}.weather-card{position:relative;border:1px solid rgba(255,255,255,.09);border-radius:21px;padding:14px;background:rgba(255,255,255,.05);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);overflow:hidden;transition:.25s ease}.weather-card.route-next{border-color:rgba(83,214,255,.35);box-shadow:inset 0 0 0 1px rgba(83,214,255,.08),0 12px 28px rgba(2,18,31,.18)}.weather-card.route-next:after{content:'NEXT STOP';position:absolute;right:11px;top:10px;font-size:8px;font-weight:950;letter-spacing:.1em;color:#75dcff}
  .weather-city{font-size:12px;font-weight:950}.weather-city span{display:block;color:#8fa9ba;font-size:9px;font-weight:700;margin-top:2px}.weather-now{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;margin-top:12px}.weather-icon{font-size:34px;filter:drop-shadow(0 5px 8px rgba(0,0,0,.15))}.weather-temp{font-size:34px;font-weight:1000;letter-spacing:-.055em;line-height:1}.weather-condition{font-size:10px;color:#a8bfcc;margin-top:4px}.weather-local{text-align:right}.weather-local b{display:block;font-size:11px}.weather-local span{display:block;font-size:9px;color:#8fa9ba;margin-top:3px}.weather-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:12px}.weather-stat{padding:8px;border-radius:12px;background:rgba(255,255,255,.045);text-align:center}.weather-stat small{display:block;font-size:8px;color:#829eaf;letter-spacing:.07em}.weather-stat b{display:block;font-size:11px;margin-top:3px}.weather-forecast{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:11px}.weather-day{padding:8px 4px;border-radius:12px;background:rgba(255,255,255,.04);text-align:center}.weather-day .d{font-size:8px;color:#86a2b4;font-weight:850}.weather-day .i{font-size:17px;margin:4px 0}.weather-day .t{font-size:9px;font-weight:900}.weather-day .r{font-size:8px;color:#72d8ff;margin-top:3px}.weather-trip-note{margin-top:11px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08);font-size:9px;color:#90acbc;line-height:1.45}.weather-trip-note strong{color:#dff7ff}.weather-alert{position:relative;z-index:1;margin-top:10px;padding:10px 12px;border-radius:14px;background:rgba(255,197,90,.10);border:1px solid rgba(255,208,112,.16);font-size:10px;color:#ffe3aa;line-height:1.45}.weather-footer{position:relative;z-index:1;margin-top:9px;display:flex;justify-content:space-between;gap:10px;font-size:8px;color:#7793a5}.weather-footer a{color:#8edfff;text-decoration:none}
  .weather-skeleton{height:202px;border-radius:18px;background:linear-gradient(90deg,rgba(255,255,255,.035),rgba(255,255,255,.08),rgba(255,255,255,.035));background-size:200% 100%;animation:weatherShimmer 1.4s linear infinite}@keyframes weatherShimmer{to{background-position:-200% 0}}
  @media(min-width:720px){.weather-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(prefers-reduced-motion:reduce){.weather-live:before,.weather-skeleton{animation:none!important}}
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.className='weather-section';section.id='weatherDeck';
  section.innerHTML=`<div class="weather-shell"><div class="weather-head"><div><h3>Weather deck</h3><p id="weatherModeText">实时当地天气 · 临近旅行后自动切换到行程日期预报</p></div><div class="weather-head-actions"><button class="weather-unit" id="weatherUnitToggle" type="button" aria-label="Weather units">°F</button><span class="weather-live" id="weatherSource">LIVE</span></div></div><div class="weather-grid" id="weatherGrid"><div class="weather-skeleton"></div><div class="weather-skeleton"></div></div><div class="weather-alert" id="weatherAlert" hidden></div><div class="weather-footer"><span id="weatherUpdated">正在更新天气…</span><span>Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a></span></div></div>`;
  hero.insertAdjacentElement('afterend',section);

  const weatherUnitButton=()=>document.getElementById('weatherUnitToggle');
  const tempValue=f=>unit==='metric'?Math.round((Number(f)-32)*5/9):Math.round(Number(f));
  const tempUnit=()=>unit==='metric'?'°C':'°F';
  const windValue=mph=>unit==='metric'?Math.round(Number(mph)*1.609344):Math.round(Number(mph));
  const windUnit=()=>unit==='metric'?'km/h':'mph';
  const fmtTemp=f=>`${tempValue(f)}${tempUnit()}`;
  const fmtWind=mph=>`${windValue(mph)} ${windUnit()}`;

  const wmo=(code)=>{
    if(code===0)return['☀️','晴朗'];
    if([1,2].includes(code))return['🌤️','少云'];
    if(code===3)return['☁️','多云'];
    if([45,48].includes(code))return['🌫️','有雾'];
    if([51,53,55,56,57].includes(code))return['🌦️','毛毛雨'];
    if([61,63,65,66,67,80,81,82].includes(code))return['🌧️','有雨'];
    if([71,73,75,77,85,86].includes(code))return['🌨️','有雪'];
    if([95,96,99].includes(code))return['⛈️','雷雨'];
    return['🌤️','天气变化'];
  };
  const locale=()=>{const l=window.TravelPreferences?.getLanguage?.()||document.documentElement.dataset.lang||'zh-CN';return l==='zh-TW'?'zh-TW':l==='en'?'en-US':'zh-CN'};
  const fmtDate=s=>{const d=new Date(s+'T12:00:00');return new Intl.DateTimeFormat(locale(),{month:'short',day:'numeric'}).format(d)};
  const dayName=s=>{const d=new Date(s+'T12:00:00');return new Intl.DateTimeFormat(locale(),{weekday:'short'}).format(d)};
  const currentRoute=()=>{try{return (typeof active!=='undefined'&&WINDOWS[active])?active:'B'}catch(e){return 'B'}};
  const firstStop=()=>{const r=currentRoute(),w=WINDOWS[r];return new Date(w.sj[0])<new Date(w.to[0])?'sj':'to'};
  const tripWindow=k=>WINDOWS[currentRoute()][k];
  const daysAway=date=>Math.ceil((new Date(date+'T00:00:00').getTime()-Date.now())/86400000);
  const forecastReady=k=>{const [start,end]=tripWindow(k);const d=daysAway(start);return d<=15 && daysAway(end)>=-1};

  function apiUrl(loc){
    const p=new URLSearchParams({latitude:loc.lat,longitude:loc.lon,current:'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max',temperature_unit:'fahrenheit',wind_speed_unit:'mph',timezone:'auto',forecast_days:'16'});
    return 'https://api.open-meteo.com/v1/forecast?'+p.toString();
  }
  function readCache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')}catch(e){return {}}}
  function saveCache(key,data){const c=readCache();c[key]={at:Date.now(),data};localStorage.setItem(CACHE_KEY,JSON.stringify(c))}
  async function loadOne(key){
    const cached=readCache()[key];
    try{const res=await fetch(apiUrl(LOCATIONS[key]),{cache:'no-store'});if(!res.ok)throw new Error('weather');const data=await res.json();state.data[key]=data;state.source[key]='live';saveCache(key,data)}
    catch(e){if(cached&&cached.data){state.data[key]=cached.data;state.source[key]='cached'}else{state.source[key]='error'}}
  }
  function localTime(data){try{return new Intl.DateTimeFormat(locale(),{hour:'numeric',minute:'2-digit',timeZone:data.timezone}).format(new Date())}catch(e){return'Local time'}}
  function dailyRows(key,data){
    if(!data||!data.daily)return[];
    const d=data.daily, ready=forecastReady(key),[start,end]=tripWindow(key),today=new Date().toISOString().slice(0,10);
    let idx=[];
    d.time.forEach((date,i)=>{if(ready){if(date>=start&&date<=end&&date>=today)idx.push(i)}else if(i<4)idx.push(i)});
    if(!idx.length)idx=[0,1,2,3].filter(i=>i<d.time.length);
    return idx.slice(0,4).map(i=>({date:d.time[i],code:d.weather_code[i],hi:Number(d.temperature_2m_max[i]),lo:Number(d.temperature_2m_min[i]),rain:Math.round(d.precipitation_probability_max[i]||0),wind:Number(d.wind_speed_10m_max[i]||0)}));
  }
  function card(key){
    const loc=LOCATIONS[key],data=state.data[key],src=state.source[key];
    if(!data)return `<article class="weather-card ${key===firstStop()?'route-next':''}"><div class="weather-city">${loc.name}<span>${loc.sub}</span></div><div class="weather-trip-note">天气数据暂时无法载入；联网后会自动恢复。</div></article>`;
    const cur=data.current||{}, [icon,cond]=wmo(cur.weather_code), rows=dailyRows(key,data), ready=forecastReady(key),[start,end]=tripWindow(key);
    const todayIndex=0, todayRain=(data.daily&&data.daily.precipitation_probability_max&&data.daily.precipitation_probability_max[todayIndex])||0;
    return `<article class="weather-card ${key===firstStop()?'route-next':''}"><div class="weather-city">${loc.name}<span>${loc.sub}</span></div><div class="weather-now"><div class="weather-icon">${icon}</div><div><div class="weather-temp">${fmtTemp(cur.temperature_2m)}</div><div class="weather-condition">${cond} · 体感 ${fmtTemp(cur.apparent_temperature)}</div></div><div class="weather-local"><b>${localTime(data)}</b><span>${src==='cached'?'Cached':'Local time'}</span></div></div><div class="weather-stats"><div class="weather-stat"><small>RAIN</small><b>${Math.round(todayRain)}%</b></div><div class="weather-stat"><small>WIND</small><b>${fmtWind(cur.wind_speed_10m||0)}</b></div><div class="weather-stat"><small>TRIP</small><b>${ready?'FORECAST':'WAIT'}</b></div></div><div class="weather-forecast">${rows.map(r=>{const wi=wmo(r.code)[0];return `<div class="weather-day"><div class="d">${ready?fmtDate(r.date):dayName(r.date)}</div><div class="i">${wi}</div><div class="t">${fmtTemp(r.hi)} / ${fmtTemp(r.lo)}</div><div class="r">💧 ${r.rain}%</div></div>`}).join('')}</div><div class="weather-trip-note">${ready?`<strong>Trip forecast active</strong> · ${fmtDate(start)}–${fmtDate(end)} 的行程天气已进入可预报窗口。`:`目前显示当地实时天气与未来几天。<strong>${fmtDate(start)}–${fmtDate(end)}</strong> 的正式行程天气会在临近约两周时自动替换这里。`}</div></article>`;
  }
  function alerts(){
    const msgs=[];
    ['sj','to'].forEach(k=>{if(!forecastReady(k)||!state.data[k])return;dailyRows(k,state.data[k]).forEach(r=>{if(r.rain>=55)msgs.push(`${LOCATIONS[k].name} ${fmtDate(r.date)} 降水概率 ${r.rain}%`);if(r.wind>=25)msgs.push(`${LOCATIONS[k].name} ${fmtDate(r.date)} 最大风速约 ${fmtWind(r.wind)}`);if(r.lo<=40)msgs.push(`${LOCATIONS[k].name} ${fmtDate(r.date)} 低温约 ${fmtTemp(r.lo)}`)})});
    return [...new Set(msgs)].slice(0,3);
  }
  function render(){
    document.getElementById('weatherGrid').innerHTML=card('sj')+card('to');
    const readyAny=forecastReady('sj')||forecastReady('to');
    document.getElementById('weatherModeText').textContent=readyAny?'行程天气已进入 16 天预报窗口 · 自动按路线日期显示':'实时当地天气 · 行程日期进入约两周范围后自动切换为正式预报';
    const srcs=Object.values(state.source);document.getElementById('weatherSource').textContent=srcs.includes('live')?'LIVE':srcs.includes('cached')?'CACHED':'OFFLINE';
    const a=alerts(),box=document.getElementById('weatherAlert');if(a.length){box.hidden=false;box.innerHTML='⚠️ <strong>Trip weather watch</strong> · '+a.join(' · ')}else box.hidden=true;
    const live=Object.values(state.source).includes('live');document.getElementById('weatherUpdated').textContent=(live?'刚刚更新':'使用上次缓存的天气数据')+` · ${tempUnit()} / ${windUnit()}`;
    const b=weatherUnitButton();if(b){b.textContent=unit==='metric'?'°C':'°F';b.setAttribute('aria-label',unit==='metric'?'Switch to Fahrenheit':'Switch to Celsius')}
  }
  function setUnit(next){
    unit=next==='metric'?'metric':'imperial';localStorage.setItem(UNIT_KEY,unit);render();
  }
  function toggleUnit(){
    const next=unit==='metric'?'imperial':'metric';
    if(window.TravelPreferences?.setWeatherUnit)window.TravelPreferences.setWeatherUnit(next);else{setUnit(next);window.dispatchEvent(new CustomEvent('travel:weather-unit',{detail:{unit:next}}))}
  }
  async function refresh(){await Promise.all([loadOne('sj'),loadOne('to')]);render()}
  weatherUnitButton()?.addEventListener('click',toggleUnit);
  window.addEventListener('travel:weather-unit',e=>setUnit(e.detail?.unit));
  window.addEventListener('travel:language',()=>render());
  refresh();
  document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.route-tab'))setTimeout(render,80)});
  window.addEventListener('online',()=>refresh());
  setInterval(()=>{if(navigator.onLine)refresh()},30*60*1000);
})();
