const filesToCache = [
    'index.html',
    '404.html',
    'style.css',
    'offline.html',
    'cake.png'

];

const staticCacheName = 'my catch file';

self.addEventListener('install', event=> {
    console.log('attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache=>{
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener('fetch',event => {
    console.log('fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(response =>{
            if(response){
                console.log('found', event.request.url,'in cache');
                return response;
            }
            console.log('network request for', event.request.url);
            return fetch(event.request)
            //dynamic catching
            .then(response =>{
                return caches.open(staticCacheName)
            .then(cache =>{
                cache.put(event.request.url,response.clone());
                return response;
            })
        })
    })
         .catch(err=>{
             console.error(err);
        
            
        })
    )
})