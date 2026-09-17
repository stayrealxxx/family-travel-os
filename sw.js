const CACHE='family-travel-os-v9';
const CORE=['./','./index.html','./manifest.webmanifest','./christmas-icon.svg','./trip-data.json','./app-live.js'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
async function withLiveApp(response){
  const text=await response.text();
  const tag='<script src="./app-live.js"></script>';
  const html=text.includes('app-live.js')?text:text.replace('</body>',tag+'</body>');
  return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const live=await withLiveApp(await fetch(req,{cache:'no-store'}));
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
    event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res})));
  }
});
