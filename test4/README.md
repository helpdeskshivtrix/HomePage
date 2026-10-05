# ShivTrix Play — GitHub Pages Realtime

Upload the contents of this folder to the root of a GitHub Pages repository.

Realtime uses **PeerJS from CDN for WebRTC signalling** and **WebRTC data channels** for room/game/chat/music traffic. There is no Firebase, Node.js, PHP, or database.

## Files
- `index.html` — app shell
- `app.js` — complete application/realtime logic
- `sw.js` — PWA service worker
- `manifest.json` — PWA manifest
- `icon.svg` — app icon

## Room
- 8-character room code
- 2–4 players
- QR invite/scanner
- presence and reconnect handling
- realtime chat
- realtime game state
- realtime 3 Patti state
- realtime virtual chips
- realtime music state

## GitHub Pages
Use the HTTPS GitHub Pages URL. Camera QR scanning requires HTTPS.

## Network note
WebRTC normally works directly with STUN. Some restrictive NAT/firewall networks require TURN; this package does not include a private TURN server.
