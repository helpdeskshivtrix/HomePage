# ShivTrix Core — Tech OS, Advanced Power Toys & WebRTC Remote Studio

**ShivTrix Core** is an enterprise-grade in-browser Tech Operating System, hardware telemetry control center, native Windows/PowerShell administrative hub, WebRTC remote assistance studio, and **Advanced Power Toys** network diagnostic suite.

---

## 1. WebRTC Remote Resolve (PeerJS Cloud Engine — WhatsTrix Powered)

Remote Resolve now operates on the proven, zero-configuration **PeerJS Cloud** architecture (matching the WhatsTrix networking engine):

* **Official PeerJS Cloud Broker (`0.peerjs.com`)**:
  * Eliminates external demo WebSocket dependencies and offline errors (`CLOUD RELAY OFFLINE`).
  * Connects out-of-the-box over port 443 with SSL enabled — zero registration, zero API keys, and 100% free uptime.
  * Status indicator displays **`● CLOUD RELAY ONLINE (PEERJS)`** in glowing green.
* **Dual-Tier NAT & Firewall Traversal (Google STUN + OpenRelay TURN)**:
  * Configured with Google public STUN servers:
    * `stun:stun.l.google.com:19302`
    * `stun:stun1.l.google.com:19302`
    * `stun:global.stun.twilio.com:3478`
  * Embedded **OpenRelay Metered TURN** (`turn:openrelay.metered.ca:443`) fallback to guarantee peer-to-peer connection traversal even behind symmetric mobile data (CGNAT) and strict enterprise corporate firewalls.
* **Room-Based Auto-Discovery**:
  * Uses your unambiguous 8-character Room ID (e.g. `K9W4M7XP`).
  * Host broadcasts screen stream at 60 FPS via `peer.call(...)`.
  * Remote technician dials into the room via Quick Connect QR code or invite link and immediately receives the live screen feed.
  * Laser pointer coordinates and technician diagnostic triggers stream over PeerJS DataConnection (`conn.send(...)`) with sub-10ms latency.
* **Air-Gapped / Zero-Server Fallback**:
  * The **Manual SDP Exchange** modal remains available for completely air-gapped networks where all public servers are blocked.

---

## 2. GitHub Pages Deployment (Free Public HTTPS Hosting)

GitHub Pages provides free static HTTPS hosting, which is required by browsers to allow screen capture (`navigator.mediaDevices.getDisplayMedia`).

### 2-Minute Deployment Steps
1. **Push to GitHub**:
   * Create a new repository on GitHub (e.g. `shivtrix-core`) and push the files from `shivtrix_github_pages.zip`:
     ```bash
     git init
     git add index.html style.css script.js manifest.json sw.js .nojekyll .gitignore .github/ README.md
     git commit -m "Deploy ShivTrix Core with PeerJS Cloud WebRTC"
     git branch -M main
     git remote add origin https://github.com/<your-username>/shivtrix-core.git
     git push -u origin main
     ```
2. **Enable GitHub Pages**:
   * Navigate to **Settings** → **Pages** in your GitHub repository.
   * Under **Build and deployment** → **Source**, select **GitHub Actions** (or **Deploy from a branch** with branch `main` and folder `/ (root)`).
3. **Open Live App**:
   * Visit `https://<your-username>.github.io/shivtrix-core/`.
   * Both host and remote technician open the URL, join the same Room ID, and connect live over the internet!

---

## 3. Advanced Power Toys & Network Diagnostics

Accessible from the sidebar navigation:

1. **Port Check**: Outbound TCP connectivity probe testing remote host reachability through firewalls. Clarifies that it tests outbound reachability and does *not* open remote ports. Includes presets for 443, 80, 22, 53, 3389, 21, 8080.
2. **Ping**: Single ICMP echo probe reporting packets sent, received, loss rate, and round-trip times.
3. **Continuous Ping (`ping -t`)**: Real-time packet telemetry streaming into an auto-scrolling cyber console with dynamic min/avg/max latency KPIs and live Canvas jitter sparkline.
4. **Traceroute**: Hop-by-hop route inspection streaming router addresses, latency hops, and node classifications with live progress bar and abort control.
5. **NSLookup**: DNS resource record queries (`A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`, `SOA`, `ANY`) with system and public DNS resolver options.
6. **Network Adapters**: Enumerates active physical and virtual network adapters with link speed, MAC address, and IPv4 bindings via native PowerShell (`Get-NetAdapter`).

### Environment Detection Engine
* **Bridge Online Mode**: When connected to `http://127.0.0.1:9871`, native PowerShell cmdlets and kernel sockets run directly.
* **Browser Sandbox Mode**: When running on GitHub Pages without the local companion, tools operate via browser-level timing probes, DoH DNS queries, and W3C network information, accompanied by 1-click copyable native PowerShell commands.

---

## 4. Deliverables & File Structure

```
├── index.html              # Modular Web Application Entry Point (GitHub Pages root)
├── shivtrix_core.html      # Complete standalone single-file bundle (portable, double-click to run)
├── style.css               # Cyber OLED Glassmorphism Stylesheet (All 5 Themes + Diagnostics)
├── script.js               # Master Application Controller, PeerJS Cloud WebRTC & Power Toys
├── companion.py            # Native Companion Daemon & Telemetry Bridge (Python 3)
├── companion.bat           # 1-Click Windows Launcher for Python Companion
├── helper.ps1              # Standalone Windows PowerShell Diagnostic Daemon (HttpListener)
├── run_helper.bat          # 1-Click Windows Launcher for PowerShell Helper
├── manifest.json           # Progressive Web App Manifest
├── sw.js                   # Service Worker for Offline Shell Caching
├── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── .gitignore              # Ignores local caches and zip archives
├── .github/workflows/
│   └── deploy.yml          # Automated GitHub Actions deployment workflow for GitHub Pages
├── shivtrix_github_pages.zip # Static distribution archive ready for GitHub Pages
├── shivtrix_core_suite.zip # Packaged Zip Distribution Archive
└── README.md               # Technical Documentation, Architecture & Setup Guide
```
