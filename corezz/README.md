# ShivTrix Core — Tech OS, Advanced Power Toys & WebRTC Remote Studio

**ShivTrix Core** is an enterprise-grade in-browser Tech Operating System, hardware telemetry control center, native Windows/PowerShell administrative hub, WebRTC remote assistance studio, and **Advanced Power Toys** network diagnostic suite.

---

## 1. GitHub Pages Deployment (Free Public HTTPS Hosting)

Hosting ShivTrix Core on **GitHub Pages** provides free, globally distributed HTTPS hosting, which is required by modern browsers for screen capture (`navigator.mediaDevices.getDisplayMedia`) and PWA installation.

### 2-Minute Deployment Steps
1. **Create a GitHub Repository**:
   * Create a new repository on GitHub (e.g., `shivtrix-core`).
2. **Push Project Files**:
   * Initialize and push the project files to the `main` branch:
     ```bash
     git init
     git add index.html style.css script.js manifest.json sw.js .nojekyll .gitignore README.md
     git commit -m "Deploy ShivTrix Core to GitHub Pages"
     git branch -M main
     git remote add origin https://github.com/<your-username>/shivtrix-core.git
     git push -u origin main
     ```
3. **Enable GitHub Pages**:
   * On GitHub, navigate to **Settings** → **Pages**.
   * Under **Build and deployment** → **Source**, select **Deploy from a branch**.
   * Set Branch: **`main`** / Folder: **`/ (root)`**, then click **Save**.
   * *(Alternative)*: An automated GitHub Actions workflow is pre-configured in `.github/workflows/deploy.yml` and will deploy automatically on push!
4. **Access Your Live HTTPS Web App**:
   * In ~60 seconds, your application will be live at:
     **`https://<your-username>.github.io/shivtrix-core/`**

---

## 2. Live WebRTC Remote Screen Sharing Over the Internet

### How It Works Across Remote Networks
ShivTrix Core features a complete WebRTC peer-to-peer media pipeline engineered for live internet collaboration between technicians and clients anywhere in the world:

1. **NAT & Firewall Traversal (Google & Cloudflare STUN)**:
   * Configured with public STUN servers:
     * `stun:stun.l.google.com:19302`
     * `stun:stun1.l.google.com:19302`
     * `stun:stun2.l.google.com:19302`
     * `stun:stun.cloudflare.com:3478`
   * Automatically resolves external public IP/port mappings for direct peer-to-peer UDP packet transmission across home routers and firewalls.
2. **Cloud WebSocket Signaling Relay**:
   * Peers exchange session descriptions (SDP Offer/Answer) and ICE candidates through a cloud WebSocket relay.
   * **Default Public Relay**: Out-of-the-box, the app connects to a secure public WebSocket relay (`wss://free.blr2.piesocket.com/v3/shivtrix?api_key=...`), enabling immediate zero-configuration internet connections.
   * **Custom Cloud Relay**: Click **Relay Settings** in the Remote Resolve hub to specify your own private WebSocket relay URL (e.g. `wss://my-relay.onrender.com`).
3. **P2P Ultra-Low Latency DataChannel**:
   * Screen annotations, glowing laser pointer coordinates, and technician quick triggers stream directly across an encrypted peer `RTCDataChannel('shivtrix_control')` with sub-10ms latency.
4. **Zero-Server Fallback (Manual Direct SDP Exchange)**:
   * In air-gapped corporate environments where all public WebSockets are blocked by proxies, click **Manual SDP Exchange**:
     * Host clicks *Capture Screen* → copies the compact base64 SDP Offer string → sends it via chat or email.
     * Remote technician pastes the Offer → clicks *Generate Answer* → sends back the Answer string.
     * Host clicks *Apply Answer* → Direct WebRTC P2P media streams immediately with **zero intermediary servers**!

---

## 3. Deploying Your Own Private Cloud Signaling Relay (Free)

Two production-ready, zero-dependency signaling relay scripts are included in the repository:
* **`signaling_server.js`** (Node.js, zero npm packages)
* **`signaling_server.py`** (Python 3, zero pip packages)

### Deploy to Render.com (100% Free):
1. Create a free account at [render.com](https://render.com).
2. Click **New +** → **Web Service** → Connect your GitHub repository.
3. Settings:
   * **Runtime**: Node
   * **Build Command**: *(leave blank)*
   * **Start Command**: `node signaling_server.js`
4. Render will provide a free public HTTPS/WSS URL (e.g., `wss://shivtrix-signaling.onrender.com`).
5. Open ShivTrix Core → **Remote Resolve** → **Relay Settings** → Paste your WSS URL → Click **Save**.

### Deploy to Railway.app:
1. Click **New Project** → **Deploy from GitHub repo**.
2. Railway detects the included `Procfile` (`web: node signaling_server.js`) and deploys automatically.

---

## 4. Advanced Power Toys & Diagnostics Suite

Accessible from the sidebar navigation:

1. **Port Check**: Outbound TCP connectivity probe testing remote host reachability through firewalls. Clearly discloses that it does *not* open remote ports. Includes presets for 443, 80, 22, 53, 3389, 21, 8080.
2. **Ping**: Single ICMP echo probe reporting packets sent, received, loss rate, and round-trip times.
3. **Continuous Ping (`ping -t`)**: Real-time packet telemetry streaming into an auto-scrolling cyber console with dynamic min/avg/max latency KPIs and live Canvas jitter sparkline.
4. **Traceroute**: Hop-by-hop route inspection streaming router addresses, latency hops, and node classifications with live progress bar and abort control.
5. **NSLookup**: DNS resource record queries (`A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`, `SOA`, `ANY`) with system and public DNS resolver options.
6. **Network Adapters**: Enumerates active physical and virtual network adapters with link speed, MAC address, and IPv4 bindings via native PowerShell (`Get-NetAdapter`).

### Environment Detection Engine
* **Bridge Online Mode**: When connected to `http://127.0.0.1:9871`, native PowerShell cmdlets and kernel sockets run directly.
* **Browser Sandbox Mode**: When running as static web app without the helper, tools operate via browser-level timing probes, DoH DNS queries, and W3C network information, accompanied by 1-click copyable native PowerShell commands.

---

## 5. Repository File Structure

```
├── index.html              # Modular Web Application Entry Point (GitHub Pages root)
├── shivtrix_core.html      # Complete standalone single-file bundle (portable, double-click to run)
├── style.css               # Cyber OLED Glassmorphism Stylesheet (All 5 Themes + Diagnostics)
├── script.js               # Master Application Controller, WebRTC P2P Engine & Power Toys
├── companion.py            # Native Companion Daemon & Telemetry Bridge (Python 3)
├── companion.bat           # 1-Click Windows Launcher for Python Companion
├── helper.ps1              # Standalone Windows PowerShell Diagnostic Daemon (HttpListener)
├── run_helper.bat          # 1-Click Windows Launcher for PowerShell Helper
├── signaling_server.js     # Zero-dependency Node.js Cloud WebRTC Signaling Server
├── signaling_server.py     # Zero-dependency Python 3 Cloud WebRTC Signaling Server
├── Procfile                # Cloud deployment configuration for Render / Railway / Heroku
├── manifest.json           # Progressive Web App Manifest
├── sw.js                   # Service Worker for Offline Shell Caching
├── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── .gitignore              # Ignores local caches and zip archives
├── .github/workflows/
│   └── deploy.yml          # Automated GitHub Actions deployment workflow for GitHub Pages
├── shivtrix_core_suite.zip # Packaged Zip Distribution Archive
└── README.md               # Technical Documentation, Architecture & Setup Guide
```

---

## 6. How to Test Between Two Computers

1. **Host Computer**:
   * Open `https://<your-username>.github.io/shivtrix-core/` on Chrome or Edge.
   * Navigate to **Remote Resolve**.
   * Note the 8-character Room ID (e.g. `K9W4M7XP`) or click **Copy Link**.
   * Click **Capture & Share Screen** and select the screen or window to broadcast.
2. **Technician Computer (Anywhere in the World)**:
   * Open the copied link or scan the Quick Connect QR code.
   * The technician automatically joins Room `K9W4M7XP`.
   * WebRTC negotiates via Google STUN and the cloud signaling relay.
   * The live 60 FPS remote screen feed appears immediately!
   * The technician can click or drag on the viewport to project a glowing laser annotation dot on the host's screen in real time.
