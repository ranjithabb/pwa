const filesToCache = [
    '/',
    'index.html',
    'style.css',
    'ginger.png'

];
const staticCacheName = 'our-first-cache';

self.addEventListener('install', event=> {
    console.log('attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache=>{
            return cache.addAll(filesToCache);
        })
    );
});