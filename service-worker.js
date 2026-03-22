/**
 * EPS : Épreuve Combinée — Service Worker v7
 * Network-First pour HTML : mise à jour automatique à chaque ouverture avec WiFi
 * Cache-First pour JS/CSS/CDN : performances offline
 */

const CACHE = 'eps-v7';

const APP_FILES = [
    './',
    './index.html',
    './diagnostic.html',
    './bilan-diagnostic.html',
    './lecon3.html',
    './lecon4.html',
    './lecon5.html',
    './lecon6.html',
    './lecon7.html',
    './bilan-l3.html',
    './bilan-l4.html',
    './bilan-l5.html',
    './bilan-l6.html',
    './bilan-l7.html',
    './bilan-projet-l8.html',
    './firebase-config.js',
    './manifest.json',
];

const CDN_FILES = [
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
];

// INSTALL
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        await cache.addAll(APP_FILES);
        for (const url of CDN_FILES) {
            try { const res = await fetch(url); if (res.ok) await cache.put(url, res); } catch (_) {}
        }
    })());
    self.skipWaiting();
});

// ACTIVATE : purge anciens caches + prise de contrôle immédiate de tous les onglets
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// FETCH
self.addEventListener('fetch', event => {
    const url = event.request.url;
    if (
        event.request.method !== 'GET' ||
        url.includes('firebaseapp.com') ||
        url.includes('firebasedatabase.app') ||
        url.includes('googleapis.com') ||
        url.includes('gstatic.com')
    ) return;

    const isHTML = url.endsWith('.html') || url.endsWith('/') ||
                   event.request.headers.get('accept')?.includes('text/html');

    if (isHTML) {
        // Network-First : récupère toujours la dernière version si WiFi dispo
        event.respondWith((async () => {
            try {
                const res = await fetch(event.request);
                if (res && res.ok) {
                    const cache = await caches.open(CACHE);
                    cache.put(event.request, res.clone());
                }
                return res;
            } catch (_) {
                const cached = await caches.match(event.request);
                if (cached) return cached;
                return new Response(
                    `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hors ligne</title>
<style>body{background:#0f1419;color:#fff;font-family:system-ui;display:flex;
flex-direction:column;align-items:center;justify-content:center;
min-height:100vh;text-align:center;padding:20px}
h1{color:#ff6b35;font-size:1.8rem}p{color:#aaa;margin-bottom:24px}
a{background:#ff6b35;color:#fff;padding:12px 28px;border-radius:12px;text-decoration:none;font-weight:800}
</style></head><body>
<h1>📡 Hors ligne</h1>
<p>Reconnectez-vous pour charger la dernière version.</p>
<a href="./index.html">← Accueil</a></body></html>`,
                    { headers: { 'Content-Type': 'text/html;charset=utf-8' } }
                );
            }
        })());
    } else {
        // Cache-First pour JS/CSS/CDN
        event.respondWith((async () => {
            const cached = await caches.match(event.request);
            if (cached) return cached;
            try {
                const res = await fetch(event.request);
                if (res && res.ok) { const cache = await caches.open(CACHE); cache.put(event.request, res.clone()); }
                return res;
            } catch (_) {}
        })());
    }
});

self.addEventListener('message', event => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
