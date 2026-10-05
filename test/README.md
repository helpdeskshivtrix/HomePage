# RoyalRoom

Private, end-to-end encrypted rooms for chat, voice/video calls, voice notes and file sharing. Royal blue and OLED black theme. Runs as a static site (no backend of your own) and installs like an app.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app |
| `manifest.json` | Lets browsers install it as an app |
| `icon.svg` | App icon |
| `sw.js` | Offline support and caching of the app shell |
| `README.md` | This guide |

Keep all five files in the same folder (the repository root).

## Deploy with GitHub web only

1. Create a **public** repository, for example `royalroom`.
2. Click **Add file → Upload files**, drag in all five files, and **Commit changes**.
3. Open **Settings → Pages**. Under **Source** choose **Deploy from a branch**, pick **main** and **/ (root)**, then **Save**.
4. After about a minute your app is at `https://YOURNAME.github.io/royalroom/`.
5. Open it on a phone and use **Add to Home Screen** (or **Install** in desktop Chrome/Edge).

To update later, upload the changed files again. If an old version keeps showing, change `VERSION` in `sw.js` (for example to `royalroom-v2`), commit, and refresh twice.

## Using it

- **Access password:** visitors must type the current date and time as `DDMMYYHHMM`, for example `0510261553` for 5 Oct 2026, 15:53 on their own device clock (one minute either side is accepted). It stays unlocked until the tab closes.
- **Name:** pick a name on first open. Others see it as `Name#A1B2`, where the tag is the last 4 characters of your unique ID. The full ID is never shown.
- **Join someone:** scan their QR (in-app scanner or any phone camera), or open/paste their invite link.
- **Groups:** tap **New group**, name it, then invite people with the QR or link. Rooms hold up to 99 members. The room code shown is built from the members' tags.
- **Calls:** voice or video from inside a room. Tap **Camera** during a call to switch between voice and video, and **Mic** to mute. Group calls are limited to 6 people.

## Security

- Your identity is a P-256 key pair created in your browser. Your ID is a hash of the public keys, and every connection proves ownership of the private key before anything is sent.
- Messages, files and call state are encrypted with AES-GCM using a key agreed between the two devices. Calls use WebRTC encryption.
- Private keys stay in the browser and are not exported. Clearing site data deletes your identity and chats.
- The password gate is a front-door check in client-side code. Anyone who reads the source can work out the rule, so treat it as a deterrent, not real protection.

## Limits and troubleshooting

- Both people need to be online. Messages are not delivered to offline members.
- Photos and videos are not kept after a page reload. Text history is saved on your device.
- Camera, microphone and QR scanning need `https` (GitHub Pages is fine) or `localhost`.
- Calls over mobile data or strict networks can fail without a TURN relay server.
- If the status stays on "Connecting…" or retrying, the public PeerJS signaling server is unreachable. Tap the status line and enter your own PeerServer host.
- Safari ignores SVG home-screen icons. For a proper iPhone icon, convert `icon.svg` to a 180×180 PNG named `apple-touch-icon.png` and add `<link rel="apple-touch-icon" href="apple-touch-icon.png">` to `index.html`.
