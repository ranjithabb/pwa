const filesToCache = [
    './',
    '/index.html',
    '/next.html',
    '/404.html',
    '/style.css',
    '/hi.png',
    '/manifest.json',
    '/js/app.js'

];

const staticCacheName = 'Lab_8';

self.addEventListener('install', event=> {
    console.log('attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName).then(cache=>{
	console.log("catching static assets")            
	cache.addAll(filesToCache);
        })
    )
})

self.addEventListener('activate', event => {
    console.log("worker activated")
})

/*self.addEventListener('fetch', event => {
    console.log("fetch fired", event)
    event.respondWith(
        caches.match(event.request).then(res => {
            return res || fetch(event.request)
        })
    )
})*/

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


