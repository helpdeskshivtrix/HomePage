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

To update later, upload the changed files again. If an old version keeps showing, change `VERSION` in `sw.js` (for example to `royalroom-v4`), commit, and refresh twice. **Everyone in a room must reload once after an update** (this version is not compatible with the first two, and everyone gets a new number, so contacts and chats start fresh).

## Using it

- **Access password:** visitors must type the current date and time as `DDMMYYHHMM`, for example `0510261553` for 5 Oct 2026, 15:53 on their own device clock (one minute either side is accepted). It stays unlocked until the tab closes.
- **Your number:** every person gets a 12-digit RoyalRoom number (shown as `1234 5678 9012` under your name). Share it like a phone number. Tap it to copy. It comes from your encryption keys, so it cannot be changed or chosen, and it only changes if you reset your identity.
- **Name:** pick a name on first open. Others see it as `Name#9012` (the last 4 digits of your number).
- **Join someone:** type their number into the box at the top (spaces and dashes are fine), or scan their QR (in-app scanner or any phone camera), or open/paste their invite link. They must have the app open.
- **Groups:** tap **New group**, name it, then invite people with the QR or link. Rooms hold up to 99 members. The room code shown is built from the members' tags.
- **Connection details:** tap the status line under your name (Online / Connecting…). It shows a checklist (https, encryption, saved identity, QR reader, signaling server), the last log lines, optional custom PeerServer/TURN settings, and a reset button.
- **Calls:** voice or video from inside a room. Tap **Camera** during a call to switch between voice and video, and **Mic** to mute. Group calls are limited to 6 people.

## Security

- Your identity is a P-256 key pair created in your browser. Your 12-digit number is derived from a hash of the public keys, and every connection proves ownership of the private key before anything is sent.
- A typed number is about 40 bits long, shorter than the old long ID, so a determined, well-resourced attacker could in theory generate keys that produce a specific number. QR codes and links also carry a separate 100-bit fingerprint that is checked on connect, and after first contact the key is remembered and a different key for the same number is refused. For sensitive contacts, exchange the QR or link in person instead of typing the number.
- Messages, files and call state are encrypted with AES-GCM using a key agreed between the two devices. Every message is also bound to the current connection session, so a recorded message cannot be replayed later. Calls use WebRTC encryption.
- Private keys stay in the browser and are not exported. Clearing site data deletes your identity and chats.
- The password gate is a front-door check in client-side code. Anyone who reads the source can work out the rule, so treat it as a deterrent, not real protection.

## Limits and troubleshooting

- Both people need to be online. Messages are not delivered to offline members.
- Photos and videos are not kept after a page reload. Text history is saved on your device.
- The QR and network libraries are built into `index.html`, so scanning no longer depends on a CDN or is broken by an ad-blocker.
- **Scanning does nothing:** the scan window now tells you what is wrong. Camera needs `https` (GitHub Pages is fine) and permission. You can always paste a link, or tap **From photo** to read a QR from a screenshot.
- **Everyone shows offline:** tap the status line. "Reclaiming identity" after a reload is normal and clears in a few seconds. If it stays on "Connecting…", the public PeerJS server is unreachable, so enter your own PeerServer host there.
- **Calls or chats never connect on mobile data:** many carriers block direct connections. A free public TURN relay is built in as a fallback (messages stay encrypted end to end), but public relays can be slow or unavailable. For reliable use, enter your own TURN server in the connection details.
- **Identity not saved:** private/incognito windows or blocked site data mean your ID changes on reload. Use a normal window.
- **Reset:** connection details has **Reset identity and chats** if something is badly stuck. Contacts will need to re-invite you because your ID changes.
- Safari ignores SVG home-screen icons. For a proper iPhone icon, convert `icon.svg` to a 180×180 PNG named `apple-touch-icon.png` and change the `apple-touch-icon` link in `index.html`.
