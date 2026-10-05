# ShivTrix Play PWA

Files:
- index.html — complete single-page application
- manifest.json — PWA manifest
- sw.js — offline service worker
- icon.svg — app icon

## Install
Upload the folder to GitHub Pages/HTTPS hosting, open index.html, then use the browser's Install App option.

## Important
The frontend includes room UI, room codes, admin tokens, virtual credits, games, music controls, QR invitation generation and browser-local room sync.

For true multi-device Internet-wide real-time rooms, replace the local BroadcastChannel/localStorage transport with a WebSocket/WebRTC/backend service. Do not treat the room admin token as a security credential until server-side authentication is implemented.

QR image generation uses an online QR image endpoint; the core PWA shell is cached for offline use.
