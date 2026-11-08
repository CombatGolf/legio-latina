const CACHE='legio-latina-v1';
const scope=self.registration.scope;
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  const response=await fetch(scope,{cache:'reload'});
  if(!response.ok)throw new Error('App shell unavailable');
  const html=await response.clone().text();
  const paths=[scope,new URL('manifest.webmanifest',scope).href,new URL('icon.svg',scope).href,new URL('favicon.svg',scope).href];
  for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    const path=new URL(match[1],scope).href;
    if(path.startsWith(scope))paths.push(path);
  }
  await cache.addAll([...new Set(paths)]);
  self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('legio-latina-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==location.origin||!url.href.startsWith(scope))return;
  if(event.request.mode==='navigate')event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(scope,copy));return response;}).catch(()=>caches.match(scope)));
  else event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}return response;})));
});
