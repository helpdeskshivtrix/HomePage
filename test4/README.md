# ShivTrix Play — GitHub Pages Realtime

Upload all files to the root of a GitHub Pages repository.

Realtime transport: PeerJS CDN signalling + WebRTC DataChannels. No Firebase, Node, PHP, or database.

The important fix in this version is `app.js`: remote game snapshots are now rendered from `room.state` instead of being received and then discarded by the local game renderer.

Test with two devices on the same HTTPS GitHub Pages URL:
1. Device A creates a room.
2. Device B joins the 8-character room code.
3. Use High Card/Dice/In-Out/3 Patti and verify the remote screen changes.
