const CACHE='family-travel-os-v35';
const CORE=['./','./index.html','./styles-v1.css','./palette-v1.css','./manifest.webmanifest','./christmas-icon.svg','./plan-data-v1.js','./app-core-v3.js','./weather-v4.js','./trip-data.json'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k.startsWith('family-travel-os-')&&k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

async function networkFirst(req,fallbackKey){
  try{
    const response=await fetch(req,{cache:'no-store'});
    if(response&&response.ok){
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(fallbackKey||req,copy));
    }
    return response;
  }catch(err){
    return (await caches.match(fallbackKey||req)) || Response.error();
  }
}

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;

  if(req.mode==='navigate'){
    event.respondWith(networkFirst(req,'./index.html'));
    return;
  }

  if(url.pathname.endsWith('/trip-data.json')){
    event.respondWith(networkFirst(req,'./trip-data.json'));
    return;
  }

  event.respondWith((async()=>{
    const cached=await caches.match(req);
    const fetchPromise=fetch(req).then(response=>{
      if(response&&response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
      }
      return response;
    }).catch(()=>null);
    if(cached){fetchPromise.catch(()=>{});return cached;}
    return (await fetchPromise)||Response.error();
  })());
});
