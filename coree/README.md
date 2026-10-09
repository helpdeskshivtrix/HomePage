# ShivTrix Core — Tech OS, Administrative Hub & WebRTC Remote Resolve

**ShivTrix Core** is an all-in-one, futuristic in-browser Tech Operating System, hardware telemetry control center, Windows administrative launcher, and WebRTC remote assistance studio with an integrated Web Audio API synthesizer.

---

## 1. Real-Time PC Status on a Live URL (Rainmeter-Grade Precision)

To view your **exact, live Windows Task Manager & Rainmeter-precision PC metrics** on a local or LAN URL:

1. Double-click **`companion.bat`** (or run `python companion.py`) located in this directory.
2. The companion starts a zero-dependency host bridge and web server on port **9871**:
   * **Web App URL**: `http://localhost:9871/` (or `http://<your-lan-ip>:9871/` from your phone, tablet, or secondary monitor).
   * **Live Telemetry API**: `http://localhost:9871/metrics`
   * **Tool Launcher API**: `http://localhost:9871/launch?tool=<name>`
   * **WebRTC Signaling Relay**: `http://localhost:9871/api/signal`
3. ShivTrix Core automatically detects the companion and switches to **`⚡ TASK MANAGER: LIVE SYNCED`**, streaming:
   * **Per-Core CPU Load**: Real-time load across all logical processor cores (e.g. 20 cores).
   * **RAM Allocation**: Exact physical memory committed, used, free, and percentage (matching Windows 11 Task Manager: 83% / 13.28 GB of 16.0 GB).
   * **Disk I/O**: Real-time read/write throughput in KB/s.
   * **Network Throughput**: Inbound and outbound rates in KB/s.
   * **Process Tree**: Real running workstation processes (`Google Chrome`, `YouTrix`, `Windows Explorer`, `Task Manager`, `VMware Workstation`, `WinSCP`, `adb`).

---

## 2. Windows Administrative & Control Panel Hub

Access the **Admin & Control Hub** in the sidebar for 1-click execution and protocol launching of Windows administrative applets:

| Tool | Executable / URI | Category | Description |
| :--- | :--- | :--- | :--- |
| **Group Policy Editor** | `gpedit.msc` | Security & Policy | Local security policies, user rights, and system restrictions. |
| **Windows Defender** | `windowsdefender:` | Security & Policy | Virus & threat protection, firewall, and real-time defense. |
| **Local Security Policy** | `secpol.msc` | Security & Policy | Audit policies, password complexity rules, and software restrictions. |
| **Windows Firewall** | `firewall.cpl` | Security & Policy | Inbound/outbound rules and port filtering applet. |
| **System Configuration** | `msconfig.exe` | System & MMC | Boot configuration, Safe Boot, and selective startup services. |
| **Computer Management** | `compmgmt.msc` | System & MMC | Disk management, Task Scheduler, shared folders, and performance logs. |
| **Registry Editor** | `regedit.exe` | System & MMC | HKEY_LOCAL_MACHINE and user configuration hive editing. |
| **Windows Services** | `services.msc` | System & MMC | Start, stop, and configure automatic/manual background services. |
| **Task Manager** | `taskmgr.exe` | System & MMC | Native Windows live process, performance, and startup manager. |
| **Event Viewer** | `eventvwr.msc` | System & MMC | Windows application, security, setup, and system event logs. |
| **Network Connections** | `ncpa.cpl` | Network & Hardware | Adapter properties, IPv4/IPv6 static assignment, and DNS servers. |
| **Device Manager** | `devmgmt.msc` | Network & Hardware | Hardware device drivers, USB controllers, GPUs, and firmware. |
| **Resource Monitor** | `resmon.exe` | Network & Hardware | Detailed CPU handle tables, disk queues, and network TCP sockets. |
| **Performance Monitor** | `perfmon.msc` | Network & Hardware | Data collector sets and real-time hardware performance counters. |
| **Disk Cleanup** | `cleanmgr.exe` | Network & Hardware | Purge Windows Update cache, temporary files, and crash dumps. |
| **PowerShell (Elevated)** | `powershell.exe` | Terminals | Windows PowerShell session with Administrator privileges. |
| **Command Prompt** | `cmd.exe` | Terminals | Native Windows command interpreter console. |
| **Programs & Features** | `appwiz.cpl` | System & MMC | Add/Remove programs applet to uninstall software. |
| **System Properties** | `sysdm.cpl` | System & MMC | Environment variables, computer name, domain join, and Remote Desktop. |

* **Launch Modes**:
  * **Companion Connected**: Clicking **"Launch Tool"** sends an authenticated trigger to `http://127.0.0.1:9871/launch?tool=...`, immediately opening the native Windows MMC / CPL window.
  * **Browser Sandbox Mode**: Directly navigates to supported protocol URIs (e.g. `windowsdefender:`, `ms-settings:`) and copies the `Win + R` command to your clipboard for instant pasting.

---

## 3. WebRTC Remote Resolve & Live Control Studio

The **Remote Resolve** module provides low-latency, peer-to-peer remote screen sharing and collaborative assistance:

1. **Room Collaboration**:
   * Generate or join using a 6-digit Room ID (e.g. `STX-8429`).
   * Multi-client support allows multiple technicians to observe or collaborate on a session.
2. **Screen Capture**:
   * Utilizes the W3C `navigator.mediaDevices.getDisplayMedia` API with audio capture and cursor tracking.
3. **Permission-Gated Control**:
   * **`View Only`**: Technicians can only monitor the live display stream.
   * **`Laser Pointer`**: Remote technicians can click or drag to project a glowing laser annotation dot on the host screen.
   * **`Assisted Control`**: Technicians can dispatch approved diagnostic triggers (IPConfig report, process tree refresh, DNS flush, Defender quick scan).
   * **`Revoke Access`**: Panic button that immediately kills all active media tracks, clears peer connections, and revokes access.
4. **Session Audit Log**:
   * Chronological timestamped event log recording all remote joins, permission changes, annotations, and commands.

---

## 4. Deliverables & File Structure

```
artifacts/file_generation/ttl=63d/output/
├── shivtrix_core.html      # Standalone, portable single-file bundle (zero build tools, double-click to run)
├── index.html              # Modular Web Application Entry Point
├── style.css               # Complete Cyber OLED Glassmorphism Stylesheet (5 Themes)
├── script.js               # Core OS Logic, Web Audio Synthesizer, WebRTC Studio & Admin Hub
├── manifest.json           # Progressive Web App (PWA) Manifest for Desktop & Mobile Installation
├── sw.js                   # Service Worker for Complete Offline App Shell Caching
├── companion.py            # Rainmeter-Precision Host Bridge & Web Server (Python 3, zero pip dependencies)
├── companion.bat           # 1-Click Windows Batch Launcher for the Companion
├── shivtrix_core_suite.zip # Complete Packaged Project Suite
└── README.md               # Technical Documentation, Architecture & Setup Guide
```

---

## 5. How to Run

### Method A: Standalone File (Immediate Browser Execution)
Double-click `shivtrix_core.html` to open it in Chrome, Edge, Firefox, or Brave. Operates completely in-memory with zero installations.

### Method B: Live URL with Companion Telemetry
Double-click `companion.bat` (or execute `python companion.py`).
Open **`http://localhost:9871/`** in your browser. The app will automatically mirror your host machine's live CPU, RAM, and processes with Rainmeter-grade accuracy.

### Method C: Progressive Web App (PWA)
Open the app in Chrome/Edge, click the **"Install App"** icon in the address bar, and run ShivTrix Core as a standalone desktop application with offline caching enabled via `sw.js`.
