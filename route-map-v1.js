(()=>{
'use strict';

const VERSION='1.0.0';
const GOOGLE='https://www.google.com/maps/dir/?api=1';
let map=null;
let layerGroup=null;
let resizeTimer=null;

const I18N={
  'zh-CN':{
    full:'全程', california:'加州', openFull:'Google Maps · 加州全程', drive:'驾车', flight:'航班',
    navigate:'Google Maps 导航', navigateHere:'导航到这里', mapHint:'点击地点或驾车路线可打开 Google Maps。地图连线表示行程顺序，实际道路以 Google Maps 导航为准。',
    unavailable:'互动地图暂时无法载入，但下面的 Google Maps 导航按钮仍可使用。'
  },
  'zh-TW':{
    full:'全程', california:'加州', openFull:'Google Maps · 加州全程', drive:'駕車', flight:'航班',
    navigate:'Google Maps 導航', navigateHere:'導航到這裡', mapHint:'點擊地點或駕車路線可開啟 Google Maps。地圖連線表示行程順序，實際道路以 Google Maps 導航為準。',
    unavailable:'互動地圖暫時無法載入，但下方的 Google Maps 導航按鈕仍可使用。'
  },
  en:{
    full:'Full trip', california:'California', openFull:'Google Maps · California drive', drive:'Drive', flight:'Flight',
    navigate:'Open in Google Maps', navigateHere:'Navigate here', mapHint:'Tap a place or driving leg to open Google Maps. Map lines show trip sequence; Google Maps provides the actual road route.',
    unavailable:'The interactive map could not load, but the Google Maps navigation buttons below still work.'
  }
};

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const lang=()=>window.TravelOS?.getLang?.()||'zh-CN';
const t=()=>I18N[lang()]||I18N['zh-CN'];
const data=()=>window.TravelOS?.getData?.()||null;
const isTbd=v=>!v||['待确认','待確認','TBD','待定'].includes(String(v).trim());

function pointById(id){
  return data()?.trip?.map?.points?.find(p=>p.id===id)||null;
}
function bookingById(id){
  return data()?.bookings?.find(b=>b.id===id)||null;
}
function queryFor(id,bookingId){
  if(bookingId){
    const b=bookingById(bookingId);
    if(b?.address&&!isTbd(b.address)) return b.address;
  }
  const p=pointById(id);
  if(!p) return '';
  for(const bid of p.bookingIds||[]){
    const b=bookingById(bid);
    if(b?.address&&!isTbd(b.address)) return b.address;
  }
  return p.query||p.name||'';
}
function dirUrl(from,to,fromBookingId,toBookingId){
  const origin=queryFor(from,fromBookingId);
  const destination=queryFor(to,toBookingId);
  const q=new URLSearchParams({api:'1',origin,destination,travelmode:'driving'});
  return 'https://www.google.com/maps/dir/?'+q.toString();
}
function fullCaliforniaUrl(){
  const lax=queryFor('lax');
  const to1=queryFor('to','hotel-thousand-oaks-1');
  const sj=queryFor('sj','hotel-san-jose');
  const to2=queryFor('to','hotel-thousand-oaks-2');
  const q=new URLSearchParams({api:'1',origin:lax,destination:lax,waypoints:[to1,sj,to2].join('|'),travelmode:'driving'});
  return 'https://www.google.com/maps/dir/?'+q.toString();
}
function segmentTitle(leg){
  const a=pointById(leg.from),b=pointById(leg.to);
  return `${a?.short||a?.name||leg.from} → ${b?.short||b?.name||leg.to}`;
}
function updateText(){
  const c=t();
  const full=document.getElementById('routeMapFull');
  const ca=document.getElementById('routeMapCalifornia');
  const g=document.getElementById('routeMapGoogle');
  const note=document.getElementById('routeMapHint');
  const drive=document.getElementById('routeLegendDrive');
  const flight=document.getElementById('routeLegendFlight');
  if(full) full.textContent=c.full;
  if(ca) ca.textContent=c.california;
  if(g){g.textContent=c.openFull;g.href=fullCaliforniaUrl();}
  if(note) note.textContent=c.mapHint;
  if(drive) drive.textContent=c.drive;
  if(flight) flight.textContent=c.flight;
}
function renderLinks(){
  const host=document.getElementById('routeDriveLinks');
  const d=data();
  if(!host||!d?.trip?.map)return;
  const c=t();
  const legs=d.trip.map.legs||[];
  host.innerHTML=legs.filter(x=>x.mode==='drive').map(leg=>{
    const url=dirUrl(leg.from,leg.to,leg.fromBookingId,leg.toBookingId);
    return `<a class="route-nav-btn" target="_blank" rel="noreferrer" href="${esc(url)}"><span>🚗</span><b>${esc(segmentTitle(leg))}</b><small>${esc(c.navigate)}</small></a>`;
  }).join('');
}
function popupHtml(point){
  const q=queryFor(point.id);
  const url='https://www.google.com/maps/dir/?'+new URLSearchParams({api:'1',destination:q,travelmode:'driving'}).toString();
  return `<div class="route-popup"><strong>${esc(point.name)}</strong><div>${esc(point.short||'')}</div><a target="_blank" rel="noreferrer" href="${esc(url)}">${esc(t().navigateHere)} ↗</a></div>`;
}
function boundsFor(ids){
  const pts=(data()?.trip?.map?.points||[]).filter(p=>ids.includes(p.id));
  return pts.map(p=>[p.lat,p.lng]);
}
function fit(mode='full'){
  if(!map)return;
  const ids=mode==='california'?['lax','to','sj']:(data()?.trip?.map?.points||[]).map(p=>p.id);
  const coords=boundsFor(ids);
  if(coords.length) map.fitBounds(coords,{padding:[28,28],maxZoom:mode==='california'?7:5});
}
function initMap(){
  const host=document.getElementById('routeMap');
  const d=data();
  if(!host||!d?.trip?.map)return;
  updateText();
  renderLinks();

  if(!window.L){
    host.innerHTML=`<div class="route-map-fallback">${esc(t().unavailable)}</div>`;
    return;
  }
  if(!map){
    map=L.map(host,{scrollWheelZoom:false,zoomControl:true,attributionControl:true});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,
      attribution:'&copy; OpenStreetMap contributors'
    }).addTo(map);
    layerGroup=L.layerGroup().addTo(map);
  }
  layerGroup.clearLayers();

  const points=d.trip.map.points||[];
  const legs=d.trip.map.legs||[];
  const byId=Object.fromEntries(points.map(p=>[p.id,p]));

  legs.forEach(leg=>{
    const a=byId[leg.from],b=byId[leg.to];
    if(!a||!b)return;
    const isFlight=leg.mode==='flight';
    const line=L.polyline([[a.lat,a.lng],[b.lat,b.lng]],{
      color:isFlight?'#7476e8':'#4da8b8',
      weight:isFlight?3:5,
      opacity:.86,
      dashArray:isFlight?'8 9':null,
      lineCap:'round'
    }).addTo(layerGroup);
    line.bindTooltip(`${isFlight?'✈️':'🚗'} ${esc(segmentTitle(leg))}${leg.flightNumber?' · '+esc(leg.flightNumber):''}`,{sticky:true});
    if(!isFlight){
      line.on('click',()=>window.open(dirUrl(leg.from,leg.to,leg.fromBookingId,leg.toBookingId),'_blank','noopener'));
    }
  });

  points.forEach(point=>{
    const marker=L.circleMarker([point.lat,point.lng],{
      radius:8,
      color:'#4da8b8',
      weight:3,
      fillColor:'#ffffff',
      fillOpacity:1
    }).addTo(layerGroup);
    marker.bindPopup(popupHtml(point));
    marker.bindTooltip(point.short||point.name,{direction:'top',offset:[0,-7]});
  });

  fit('full');
  requestAnimationFrame(()=>map.invalidateSize());
}
function wire(){
  const full=document.getElementById('routeMapFull');
  const ca=document.getElementById('routeMapCalifornia');
  if(full) full.onclick=()=>fit('full');
  if(ca) ca.onclick=()=>fit('california');
}
function render(){
  updateText();
  renderLinks();
  initMap();
  wire();
}
function boot(){
  render();
  window.addEventListener('travel:data',render);
  window.addEventListener('travel:language',render);
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>map?.invalidateSize(),150);
  });
}
window.TravelRouteMap={version:VERSION,render,fit,fullCaliforniaUrl};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
