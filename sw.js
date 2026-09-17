const CACHE='family-travel-os-v24';
const CORE=['./','./index.html','./manifest.webmanifest','./christmas-icon.svg','./trip-data.json','./itinerary-v2.js','./runtime-i18n.js','./countdown-lab.js','./weather-v3.js','./site-theme.js','./app-live-v3.js','./preferences-v3.js'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
async function withEnhancements(response){
  const text=await response.text();
  const theme='<script src="./site-theme.js"></script>';
  const itinerary='<script src="./itinerary-v2.js"></script>';
  const runtime='<script src="./runtime-i18n.js"></script>';
  const countdown='<script src="./countdown-lab.js"></script>';
  const weather='<script src="./weather-v3.js"></script>';
  const live='<script src="./app-live-v3.js"></script>';
  const preferences='<script src="./preferences-v3.js"></script>';
  let html=text.includes('site-theme.js')?text:text.replace('</head>',theme+'</head>');
  html=html.includes('itinerary-v2.js')?html:html.replace('</body>',itinerary+'</body>');
  html=html.includes('runtime-i18n.js')?html:html.replace('</body>',runtime+'</body>');
  html=html.includes('countdown-lab.js')?html:html.replace('</body>',countdown+'</body>');
  html=html.includes('weather-v3.js')?html:html.replace('</body>',weather+'</body>');
  html=html.includes('app-live-v3.js')?html:html.replace('</body>',live+'</body>');
  html=html.includes('preferences-v3.js')?html:html.replace('</body>',preferences+'</body>');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const live=await withEnhancements(await fetch(req,{cache:'no-store'}));
        const copy=live.clone();
        caches.open(CACHE).then(c=>c.put('./index.html',copy));
        return live;
      }catch(e){
        const cached=await caches.match('./index.html');
        return cached||Response.error();
      }
    })());
    return;
  }
  if(url.origin===self.location.origin){
    if(url.pathname.endsWith('/trip-data.json')){
      event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res}).catch(()=>caches.match(req)));
      return;
    }
    event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res})));
  }
});
