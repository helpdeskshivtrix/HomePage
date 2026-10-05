WhatsApp Web clone - PWA
========================
Files
  index.html              the whole app (HTML + CSS + JS in one file)
  manifest.webmanifest    install info (name, colors, icons)
  sw.js                   offline cache + background backup task
  icon-192.png, icon-512.png, icon-maskable-512.png

Deploy (GitHub Pages)
  1. Unzip and upload all files to the root of your repo.
  2. Settings > Pages > deploy from the main branch.
  3. Open the https link, then use "Install app" / "Add to Home screen".

Backup
  - Chats are saved in IndexedDB on the device.
  - Every midnight the app replaces the single internal backup (old one deleted).
  - Backup panel > Choose file: pick one .json file once; each backup overwrites it.
  - If the app is closed at midnight, the backup runs the next time it opens.
