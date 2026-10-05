# ShivTrix Play — GitHub Pages Real-Time Edition

## Deploy
1. Upload all files in this folder to the root of a GitHub repository.
2. Enable **Settings → Pages → Deploy from branch**.
3. Open the generated HTTPS GitHub Pages URL.
4. Open it on another device/browser and use the 8-character room code.

## Real-time architecture
- Hosting: GitHub Pages only.
- Signaling: PeerJS public cloud signaling through the PeerJS CDN client.
- Game/chat/music payloads: WebRTC DataChannels.
- ICE connectivity: public STUN servers.
- Local queue/settings: browser localStorage.
- No Firebase, Node.js, PHP, or database is required.

## Important
The PeerJS public signaling service is only used to introduce peers. It does not provide persistent game state. If a network blocks direct WebRTC connections, a TURN relay may be required; this package does not include a private TURN server.

Room IDs are 8-character uppercase alphanumeric codes.
