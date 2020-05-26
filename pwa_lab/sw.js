const cacheName = 'ice-cream';
const staticAssets = [
  './',
  '/images',
  '/css/app.css',  
  '/js/app.js' ,
  '/index.html',
'/manifest.json'


 ];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();

});


self.addEventListener('activate', e => {
  self.clients.claim();
});



self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

/*self.addEventListener('push', async e =>
{
	const title='push message';
	const body='received a push message';
	const icon='a9.jpg';
	const tag='push notification';
	e.waitUntil(
				self.registration.showNotification(title,{
					body: body,
					icon:icon,
					tag:tag
				})
			);
});*/

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}


async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
