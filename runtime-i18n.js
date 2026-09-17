(()=>{
  if(window.__travelRuntimeI18n)return;
  window.__travelRuntimeI18n=true;

  const lang=()=>localStorage.getItem('travel.language')||'zh-CN';
  const T={
    'zh-CN':{
      begins:'行程开始 · PHL → 西海岸',until:'距离预计出发时间',complete:'🎉 行程已完成',trip:'West Coast Christmas 2026',home:'家',prep:'旅行准备中',days:n=>`${n} 天后出发`,traveling:'旅途中'
    },
    'zh-TW':{
      begins:'行程開始 · PHL → 西海岸',until:'距離預計出發時間',complete:'🎉 行程已完成',trip:'West Coast Christmas 2026',home:'家',prep:'旅行準備中',days:n=>`${n} 天後出發`,traveling:'旅途中'
    },
    en:{
      begins:'Trip begins · PHL → West Coast',until:'Until estimated departure',complete:'🎉 Trip complete',trip:'West Coast Christmas 2026',home:'HOME',prep:'Trip preparation',days:n=>`${n} days to go`,traveling:'On the trip'
    }
  };
  const t=()=>T[lang()]||T['zh-CN'];

  function localizedCountdown(){
    try{
      const start=new Date((tripData&&tripData.trip&&tripData.trip.start)||'2026-12-24T08:00:00-05:00').getTime();
      const end=new Date((tripData&&tripData.trip&&tripData.trip.end)||'2027-01-02T21:30:00-05:00').getTime();
      const now=Date.now();
      const n=typeof nextEvent==='function'?nextEvent():null;
      const target=now<start?start:(n?new Date(n.iso).getTime():end);
      let ms=Math.max(0,target-now),s=Math.floor(ms/1000),d=Math.floor(s/86400);s%=86400;
      const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60),sec=s%60;
      if(typeof bump==='function'){
        bump('cdDays',String(d).padStart(2,'0'));bump('cdHours',String(h).padStart(2,'0'));bump('cdMinutes',String(m).padStart(2,'0'));bump('cdSeconds',String(sec).padStart(2,'0'));
      }
      const c=t();
      if(now<start){
        const a=document.getElementById('nextTitle'),b=document.getElementById('nextMeta'),p=document.getElementById('nextPlace');
        if(a)a.textContent=c.begins;if(b)b.textContent=c.until;if(p)p.textContent='PHL';
      }else if(n){
        const a=document.getElementById('nextTitle'),b=document.getElementById('nextMeta'),p=document.getElementById('nextPlace');
        if(a)a.textContent=n.title;if(b)b.textContent=`${n.dayDate} · ${n.time}`;if(p)p.textContent=n.place||n.dayTitle;
      }else{
        const a=document.getElementById('nextTitle'),b=document.getElementById('nextMeta'),p=document.getElementById('nextPlace');
        if(a)a.textContent=c.complete;if(b)b.textContent=c.trip;if(p)p.textContent=c.home;
      }
      let pct=0;const pl=document.getElementById('progressLabel'),pm=document.getElementById('progressMeta'),pf=document.getElementById('progressFill');
      if(now<start){pct=0;if(pl)pl.textContent=c.prep;if(pm)pm.textContent=c.days(Math.ceil((start-now)/86400000));}
      else if(now>end){pct=100;if(pl)pl.textContent=c.complete.replace('🎉 ','');if(pm)pm.textContent='100%';}
      else{pct=((now-start)/(end-start))*100;if(pl)pl.textContent=c.traveling;if(pm)pm.textContent=Math.round(pct)+'%';}
      if(pf)pf.style.width=Math.max(0,Math.min(100,pct))+'%';
    }catch(e){console.warn('localized countdown',e)}
  }

  try{updateCountdown=localizedCountdown}catch(e){}
  window.TravelRuntimeI18n={updateCountdown:localizedCountdown};
  window.addEventListener('travel:language',()=>{localizedCountdown();setTimeout(localizedCountdown,80)});
  setTimeout(localizedCountdown,0);
})();
