# ShivTrix Play — Simple GitHub Realtime

Upload all files to the root of a GitHub Pages repository.

## Realtime
- PeerJS 1.5.4 from jsDelivr CDN
- PeerJS public signalling
- WebRTC data channels for room/game/chat/music data
- No Firebase
- No Node/PHP/backend

## Test
1. Open the GitHub Pages HTTPS URL on device A.
2. Create a room.
3. Open the same HTTPS URL on device B.
4. Enter the 8-character room code.
5. Join.
6. Test High Card, 3 Patti, In/Out and chat.

Use a normal HTTPS GitHub Pages URL, not file://.
If a restrictive network blocks PeerJS/WebRTC, that network may require a TURN relay; this package intentionally has no backend/TURN server.
