const CACHE = "scn-v1";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches
            .keys()
            .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim()),
    );
});

// Ưu tiên mạng, mất mạng mới dùng bản đã lưu.
// Bỏ qua mọi request khác domain (Supabase, CDN) để không làm hỏng dữ liệu/đăng nhập.
self.addEventListener("fetch", (e) => {
    const r = e.request;
    if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
    e.respondWith(
        fetch(r)
            .then((res) => {
                const copy = res.clone();
                caches.open(CACHE).then((c) => c.put(r, copy));
                return res;
            })
            .catch(() => caches.match(r).then((m) => m || caches.match("./index.html"))),
    );
});