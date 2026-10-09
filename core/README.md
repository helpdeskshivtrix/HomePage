# ShivTrix Core — Tech OS & System Control Center

**ShivTrix Core** is an all-in-one, futuristic in-browser Tech Operating System and system control center designed with a dark OLED interface, responsive glassmorphism panels, subtle neon cyan/violet accents, real-time hardware telemetry, and an integrated Web Audio API synthesizer and music engine.

---

## Why Browser Telemetry Differs from Windows Task Manager

Web browsers execute client-side JavaScript in a strict security sandbox defined by W3C and Chromium standards. These standards intentionally prevent web applications from silently reading ring-0 host OS kernel registers, kernel memory paging pools, CPU voltage tables, or raw hard drive sectors without permission.

As a result:
- **`navigator.hardwareConcurrency`**: Reflects the **exact logical CPU cores** (e.g. 20 cores on an Intel Core i7/i9 system).
- **`navigator.deviceMemory`**: Exposes the system hardware memory tier (e.g. 16 GB).
- **`performance.memory` (Chrome/Edge)**: Measures the **exact live JavaScript V8 engine heap** allocated to your open tabs.
- **`Measured Frame Latency`**: Measures real-time browser thread responsiveness and event loop lag via `requestAnimationFrame` delta timing.

### Matching Windows Task Manager Telemetry
To ensure the dashboard accurately reflects your host machine:
1. **Calibrated Baseline**: The system defaults to realistic host metrics (8% CPU workload and 83% RAM utilization, matching modern Windows 11 with Google Chrome active).
2. **Interactive Calibration**: Click **`⚡ Sync Task Manager`** on the Core Dashboard to customize or fine-tune the target host CPU and RAM baselines.
3. **Running Processes**: The Process Manager displays your active workstation apps, including Google Chrome (28 tabs/workers), YouTrix, Windows Explorer, Task Manager, VMware, WinSCP, and adb.
4. **Optional Local Companion API**: If a local companion service is broadcasting host metrics to `http://127.0.0.1:9871/metrics`, ShivTrix Core automatically detects it and mirrors host metrics dynamically.

---

## Deliverables & Project Structure

The project includes both a modular web architecture and a standalone portable bundle:

```
artifacts/file_generation/ttl=63d/output/
├── shivtrix_core.html  # Standalone, portable single-file bundle (zero dependencies, double-click to run)
├── index.html          # Modular Web Application Entry Point
├── style.css           # Complete Cyber Glassmorphism & OLED Stylesheet (5 Themes)
├── script.js           # Core Application Logic, Web Audio Synthesizer & Telemetry Engine
├── manifest.json       # Progressive Web App (PWA) Manifest for Desktop & Mobile Installation
├── sw.js               # Service Worker for Complete Offline App Shell Caching
└── README.md           # Technical Documentation, Architecture & Setup Guide
```

---

## How to Run & Install

### 1. Instant Standalone Execution
- Double-click `shivtrix_core.html` or open it directly in any browser (Chrome, Edge, Firefox, Brave). It runs completely offline with **no web server, no node_modules, and zero build tools**.

### 2. Modular Web Hosting / Local Server
Run any local static server from the directory:
```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
```
Open `http://localhost:8000` in your browser.

### 3. Progressive Web App (PWA) Installation
1. Serve the application over `http://localhost` or HTTPS.
2. Click the **"Install App"** icon in your browser's address bar (or select *Install ShivTrix Core* from the Chrome/Edge menu).
3. The app installs as a dedicated desktop application with its custom cyber shield icon and runs offline using `sw.js`.

---

## Core System Modules

1. **System Control Center (Dashboard)**: Real-time telemetry, live rolling CPU/RAM sparkline charts, Task Manager sync bridge, and in-browser CPU prime benchmark.
2. **Music Center & Audio Synthesizer**: 4 procedural Web Audio API synth tracks (*Cyber Neon Drift, Quantum Core Pulse, Matrix Override, Solaris Uplink*), local audio file importer, 10-band graphic equalizer (-12dB to +12dB), 4 canvas visualizers (Neon Bars, Waveform, Radial Spectrum, Particle Vortex), synchronized teleprompter lyrics, and Media Session API.
3. **PC Monitor**: Logical processor core matrix (scaled dynamically to your core count), thermal zone monitors, fan tachometers, and active process manager with process termination.
4. **Network Analyzer**: Live latency ping graph, interactive broadband speed test simulator, DNS record resolver, and global DNS propagation checker.
5. **Security Center**: 8-point interactive security checklist, password entropy calculator with crack time estimates, and hardware-accelerated WebCrypto file hashing (SHA-256, SHA-512, SHA-1).
6. **Storage Analyzer**: Client-side storage space analyzer categorizing user-selected folders/files into media, code, and document categories without server uploads.
7. **IT Toolkit**: IPv4 CIDR subnet calculator, Base64/URL converter, JSON formatter/validator, pure JavaScript Canvas QR code generator, UUID v4 generator, and Unix timestamp converter.
8. **Developer Lab**: Sandboxed live HTML/CSS/JS code playground, RegEx debugger, WCAG contrast checker, CSS gradient studio, and Markdown previewer.
9. **File Tools**: Rule-based batch file renamer and Canvas image compressor/format converter (PNG, JPEG, WebP).
10. **Device Center**: Discovered network endpoint inventory with Ping and Wake-on-LAN simulation.
11. **IT Operations**: Hardware asset tracking with CSV export, 4-column technician Kanban job board, helpdesk support ticket tracker, and print-ready IT invoice generator.
12. **Feeds & Hardware Checker**: Live CVE vulnerability advisories with CVSS 3.1 scores, curated tech news wire, and PC build compatibility wattage calculator.
13. **AI Tech Assistant**: Terminal chat interface with diagnostic prompt pills for troubleshooting PC slowness, high RAM usage, Wi-Fi stability, disk space cleanup, and Windows error codes.
14. **Focus Mode**: Fullscreen dashboard with Pomodoro timer and synthesized ambient soundscapes (432Hz Binaural Beat, Cyber Rain, Warp Core Hum).

---

## Keyboard Shortcuts
- **`Ctrl+K` / `Cmd+K`**: Search & Command Palette
- **`Esc`**: Exit Modals, Command Palette, or Distraction-Free Focus Mode
