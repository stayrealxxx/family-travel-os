const CACHE='family-travel-os-v12';
const CORE=['./','./index.html','./manifest.webmanifest','./christmas-icon.svg','./trip-data.json','./countdown-lab.js'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
async function withFinalCountdown(response){
  const text=await response.text();
  const tag='<script src="./countdown-lab.js"></script>';
  const html=text.includes('countdown-lab.js')?text:text.replace('</body>',tag+'</body>');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const live=await withFinalCountdown(await fetch(req,{cache:'no-store'}));
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
