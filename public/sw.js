// 최소 서비스 워커 — PWA 설치 가능 요건 충족용.
// 적극적 캐싱 전략을 도입하지 않음 (Vite 해시 번들 + Vercel CDN이 캐시 처리).
// TWA의 경우 SW가 Lighthouse PWA 체크 통과에만 사용됨.

const CACHE = 'routy-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['/']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // network-first, 실패 시 캐시
  if (event.request.method !== 'GET') return
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(event.request).then((cached) => cached || Response.error()))
  )
})
