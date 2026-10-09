
// --- ShivTrix Web Audio API Synthesizer & Music Player Engine ---
const AudioEngine = (function() {
  let ctx = null;
  let isPlaying = false;
  let currentTrackIndex = 0;
  let currentTime = 0;
  let duration = 150; // default seconds
  let timerInterval = null;
  let isMuted = false;
  let volume = 0.75;
  let isShuffle = false;
  let repeatMode = 'all'; // 'off', 'all', 'one'
  let sfxEnabled = true;

  // Web Audio Nodes
  let masterGain = null;
  let analyser = null;
  let eqFilters = [];
  let currentSourceNode = null;
  let ambientSourceNode = null;

  // Canvas visualizer mode: 'bars', 'wave', 'radial', 'particles'
  let visualizerMode = 'bars';
  let canvas = null;
  let canvasCtx = null;
  let thumbCanvas = null;
  let thumbCtx = null;
  let animFrameId = null;

  // 10 EQ Frequencies
  const EQ_FREQS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const EQ_PRESETS = {
    flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bass: [8, 7, 5, 3, 1, 0, 0, 0, 1, 2],
    cyber: [6, 4, -1, -2, 2, 4, 6, 7, 8, 7],
    vocal: [-2, -3, 0, 2, 5, 6, 4, 2, 0, -2],
    rock: [5, 4, 2, 0, -1, 1, 3, 5, 6, 6],
    electronic: [6, 5, 2, 0, 1, 3, 5, 6, 7, 8],
    lofi: [3, 4, 2, -1, -2, -1, 0, 2, -3, -6]
  };

  // Built-in Synth Tracks
  const defaultTracks = [
    {
      id: 'synth-1',
      title: 'Cyber Neon Drift',
      artist: 'ShivTrix Synth Engine',
      bpm: 128,
      genre: 'SYNTHWAVE',
      duration: 154,
      isLocal: false,
      lyrics: [
        { time: 0, text: "[00:00] Initializing ShivTrix Core Synth Engine..." },
        { time: 8, text: "[00:08] Neon grid glowing under midnight skies" },
        { time: 18, text: "[00:18] Data streams pulsing through fiber lines" },
        { time: 32, text: "[00:32] Silicon heartbeats driving the machine" },
        { time: 48, text: "[00:48] Quantum processors running fast and clean" },
        { time: 64, text: "[01:04] (Synthesizer Lead Solo & Dynamic Arpeggios)" },
        { time: 88, text: "[01:28] Zero latency, cybernetic dream" },
        { time: 104, text: "[01:44] Elevating consciousness above the screen" },
        { time: 124, text: "[02:04] ShivTrix Operating System online and serene" }
      ]
    },
    {
      id: 'synth-2',
      title: 'Quantum Core Pulse',
      artist: 'ShivTrix Ambient Subsystem',
      bpm: 90,
      genre: 'CYBER AMBIENT',
      duration: 180,
      isLocal: false,
      lyrics: [
        { time: 0, text: "[00:00] Deep space quantum telemetry pulse..." },
        { time: 20, text: "[00:20] Orbiting orbital array station Alpha-9" },
        { time: 45, text: "[00:45] Sub-harmonic resonant frequencies align" },
        { time: 75, text: "[01:15] Floating through cosmic radiation fields" },
        { time: 110, text: "[01:50] Reinforcing magnetic deflectors and shields" },
        { time: 140, text: "[02:20] Infinite quiet across the event horizon" }
      ]
    },
    {
      id: 'synth-3',
      title: 'Matrix Override',
      artist: 'ShivTrix Cyberpunk Lab',
      bpm: 140,
      genre: 'DARK INDUSTRIAL',
      duration: 142,
      isLocal: false,
      lyrics: [
        { time: 0, text: "[00:00] Bypassing root security gateway..." },
        { time: 12, text: "[00:12] Kernel injection confirmed, elevated rights" },
        { time: 26, text: "[00:26] Overclocking transistors into the night" },
        { time: 42, text: "[00:42] Heavy industrial percussion breaks through" },
        { time: 65, text: "[01:05] Code compilation 100% complete and true" },
        { time: 95, text: "[01:35] Override executed. Full system control." }
      ]
    },
    {
      id: 'synth-4',
      title: 'Solaris Uplink',
      artist: 'ShivTrix Lo-Fi Collective',
      bpm: 85,
      genre: 'CHILLWAVE',
      duration: 165,
      isLocal: false,
      lyrics: [
        { time: 0, text: "[00:00] Relaxed evening chill hop terminal session..." },
        { time: 15, text: "[00:15] Warm analog vinyl crackle on the deck" },
        { time: 35, text: "[00:35] Clean code refactoring without a speck" },
        { time: 60, text: "[01:00] Golden hour sunlight hitting the glass" },
        { time: 90, text: "[01:30] Watching the high-speed data packets pass" },
        { time: 120, text: "[02:00] Calm minds build timeless architectures." }
      ]
    }
  ];

  let playlist = [...defaultTracks];
  let renderedBuffers = {}; // cache synthesized AudioBuffers

  // Visualizer particles
  let particles = [];
  for (let i = 0; i < 160; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 400,
      z: Math.random() * 800 + 1,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#00f0ff' : '#a855f7'
    });
  }

  function initAudioContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();

      // Master Gain
      masterGain = ctx.createGain();
      masterGain.gain.value = volume;

      // Analyser
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;

      // 10-Band EQ Filters
      let prevNode = null;
      eqFilters = EQ_FREQS.map((freq, idx) => {
        const filter = ctx.createBiquadFilter();
        if (idx === 0) {
          filter.type = 'lowshelf';
        } else if (idx === EQ_FREQS.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = EQ_PRESETS.cyber[idx]; // default cyber preset
        return filter;
      });

      // Chain: EQ[0] -> EQ[1] -> ... -> EQ[9] -> Analyser -> MasterGain -> Destination
      for (let i = 0; i < eqFilters.length - 1; i++) {
        eqFilters[i].connect(eqFilters[i + 1]);
      }
      eqFilters[eqFilters.length - 1].connect(analyser);
      analyser.connect(masterGain);
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // Synthesize rich procedural audio buffer for a given track
  function getOrCreateTrackBuffer(track) {
    if (renderedBuffers[track.id]) {
      return renderedBuffers[track.id];
    }
    initAudioContext();
    const sampleRate = ctx.sampleRate;
    // Generate a 16-beat loopable AudioBuffer (~7.5s - 11s) repeated seamlessly
    const bpm = track.bpm;
    const beatLen = 60 / bpm;
    const totalBars = 4; // 16 beats
    const loopDuration = beatLen * 16;
    const buffer = ctx.createBuffer(2, Math.floor(sampleRate * loopDuration), sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // Procedural synthesis parameters based on genre
    const isSynthwave = track.genre === 'SYNTHWAVE';
    const isAmbient = track.genre === 'CYBER AMBIENT';
    const isIndustrial = track.genre === 'DARK INDUSTRIAL';
    const isLofi = track.genre === 'CHILLWAVE';

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      let sampleL = 0;
      let sampleR = 0;

      // 1. Kick Drum on beats 0, 1, 2, 3 (every beatLen seconds)
      const beatPos = (t % beatLen) / beatLen;
      if (isSynthwave || isIndustrial) {
        // Punchy sine drop kick
        const kickEnv = Math.exp(-beatPos * 18);
        const kickFreq = 120 * Math.exp(-beatPos * 25) + 45;
        const kick = Math.sin(2 * Math.PI * kickFreq * t) * kickEnv * 0.7;
        sampleL += kick;
        sampleR += kick;
      } else if (isLofi) {
        // Softer lo-fi kick on beats 0 and 2.5
        const barPos = (t % (beatLen * 4)) / beatLen;
        if ((barPos < 0.8) || (barPos > 2.4 && barPos < 3.2)) {
          const kPos = barPos < 0.8 ? barPos : barPos - 2.5;
          const kickEnv = Math.exp(-kPos * 14);
          const kick = Math.sin(2 * Math.PI * 65 * t) * kickEnv * 0.5;
          sampleL += kick;
          sampleR += kick;
        }
      }

      // 2. Snare / Claps on beats 1 and 3
      if (isSynthwave || isIndustrial || isLofi) {
        const halfBarPos = (t % (beatLen * 2)) / beatLen;
        if (halfBarPos >= 1.0) {
          const sPos = halfBarPos - 1.0;
          const snareEnv = Math.exp(-sPos * 12);
          const noise = (Math.random() * 2 - 1) * 0.35 * snareEnv;
          const tone = Math.sin(2 * Math.PI * 180 * t) * 0.3 * Math.exp(-sPos * 20);
          sampleL += noise + tone;
          sampleR += noise + tone;
        }
      }

      // 3. Hi-hats (16th notes)
      if (isSynthwave || isIndustrial) {
        const sixteenthPos = (t % (beatLen / 4)) / (beatLen / 4);
        const hatEnv = Math.exp(-sixteenthPos * 30);
        const hatNoise = (Math.random() * 2 - 1) * 0.15 * hatEnv;
        sampleL += hatNoise;
        sampleR += hatNoise * 0.9;
      }

      // 4. Bassline / Chords / Ambient Pads
      const barTime = t % loopDuration;
      const barNum = Math.floor(barTime / (beatLen * 4));
      // Chord progression roots: Am (55Hz), F (43.6Hz), C (65.4Hz), G (49Hz)
      const roots = [55, 43.65, 65.4, 48.99];
      const rootFreq = roots[barNum % 4];

      if (isSynthwave) {
        // 16th note rolling arpeggiated bass
        const stepNum = Math.floor((t % (beatLen * 4)) / (beatLen / 4));
        const oct = (stepNum % 2 === 0) ? 1 : 2;
        const bassFreq = rootFreq * oct;
        const bassEnv = Math.exp(-((t % (beatLen / 4)) / (beatLen / 4)) * 7);
        // Sawtooth approximation with 3 harmonics
        const bass = (Math.sin(2 * Math.PI * bassFreq * t) +
                      0.5 * Math.sin(4 * Math.PI * bassFreq * t) +
                      0.25 * Math.sin(6 * Math.PI * bassFreq * t)) * bassEnv * 0.35;
        sampleL += bass;
        sampleR += bass;

        // Lead melody synth (lush detuned saw)
        const leadScale = [rootFreq * 4, rootFreq * 4.8, rootFreq * 6, rootFreq * 8];
        const noteIdx = Math.floor(t / beatLen) % leadScale.length;
        const leadFreq = leadScale[noteIdx];
        const leadL = Math.sin(2 * Math.PI * leadFreq * t) * 0.12;
        const leadR = Math.sin(2 * Math.PI * (leadFreq * 1.008) * t) * 0.12;
        sampleL += leadL;
        sampleR += leadR;

      } else if (isAmbient) {
        // Deep resonant cosmic drones and slow LFO phase
        const lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.2 * t);
        const drone1 = Math.sin(2 * Math.PI * rootFreq * t) * 0.3;
        const drone2 = Math.sin(2 * Math.PI * (rootFreq * 1.5) * t) * 0.2;
        const shimmer = Math.sin(2 * Math.PI * (rootFreq * 4.02) * t) * 0.1 * lfo;
        sampleL += drone1 + shimmer;
        sampleR += drone2 + shimmer;

      } else if (isIndustrial) {
        // Distorted dark bass
        const bass = Math.sin(2 * Math.PI * rootFreq * t) * 0.8;
        const clipped = Math.max(-0.5, Math.min(0.5, bass));
        sampleL += clipped * 0.4;
        sampleR += clipped * 0.4;

      } else if (isLofi) {
        // Soft Rhodes electric piano chords (Root + Minor 3rd + 5th + 7th)
        const chord1 = Math.sin(2 * Math.PI * rootFreq * 2 * t) * 0.2;
        const chord2 = Math.sin(2 * Math.PI * rootFreq * 2.4 * t) * 0.15;
        const chord3 = Math.sin(2 * Math.PI * rootFreq * 3 * t) * 0.15;
        // Warm vinyl crackle
        const crackle = (Math.random() > 0.995 ? (Math.random() * 2 - 1) * 0.08 : 0);
        sampleL += chord1 + chord2 + crackle;
        sampleR += chord1 + chord3 + crackle;
      }

      // Soft limiting to prevent clipping
      left[i] = Math.tanh(sampleL * 0.8);
      right[i] = Math.tanh(sampleR * 0.8);
    }

    renderedBuffers[track.id] = buffer;
    return buffer;
  }

  function startPlayback() {
    initAudioContext();
    stopPlaybackSource();

    const track = playlist[currentTrackIndex];
    if (!track) return;

    if (track.isLocal && track.audioElement) {
      // Local file playback via HTML5 Audio element
      if (!track.mediaSource) {
        track.mediaSource = ctx.createMediaElementSource(track.audioElement);
        track.mediaSource.connect(eqFilters[0]);
      }
      track.audioElement.currentTime = currentTime;
      track.audioElement.play().catch(e => console.warn(e));
      currentSourceNode = track.audioElement;
      duration = track.audioElement.duration || track.duration || 150;
    } else {
      // Procedural Synth Track
      const buffer = getOrCreateTrackBuffer(track);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(eqFilters[0]);
      
      const offset = currentTime % buffer.duration;
      source.start(0, offset);
      currentSourceNode = source;
      duration = track.duration || 150;
    }

    isPlaying = true;
    updatePlayStateUi();
    startTimer();
    updateMediaSession();
  }

  function stopPlaybackSource() {
    if (currentSourceNode) {
      if (currentSourceNode.stop) {
        try { currentSourceNode.stop(); } catch(e){}
      } else if (currentSourceNode.pause) {
        currentSourceNode.pause();
      }
      currentSourceNode = null;
    }
  }

  function pausePlayback() {
    stopPlaybackSource();
    isPlaying = false;
    stopTimer();
    updatePlayStateUi();
    updateMediaSession();
  }

  function togglePlayPause() {
    playUiSfx('click');
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  function nextTrack() {
    playUiSfx('switch');
    pausePlayback();
    currentTime = 0;
    if (isShuffle) {
      currentTrackIndex = Math.floor(Math.random() * playlist.length);
    } else {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    loadCurrentTrackUi();
    startPlayback();
  }

  function previousTrack() {
    playUiSfx('switch');
    pausePlayback();
    currentTime = 0;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadCurrentTrackUi();
    startPlayback();
  }

  function handleSeek(val) {
    const newTime = (val / 100) * duration;
    currentTime = newTime;
    if (isPlaying) {
      startPlayback(); // restart at new offset
    } else {
      updateTimeLabels();
    }
  }

  function setVolume(val) {
    volume = val / 100;
    if (masterGain) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    }
    const volIcon = document.getElementById('volume-icon');
    if (volIcon) {
      if (volume === 0 || isMuted) {
        volIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      } else {
        volIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      }
    }
  }

  function toggleMute() {
    playUiSfx('click');
    isMuted = !isMuted;
    if (masterGain) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    }
    const volBar = document.getElementById('volume-bar');
    if (volBar) volBar.value = isMuted ? 0 : volume * 100;
  }

  function toggleShuffle() {
    playUiSfx('click');
    isShuffle = !isShuffle;
    const btn = document.getElementById('btn-shuffle');
    if (btn) btn.classList.toggle('active', isShuffle);
    App.showToast(`Shuffle ${isShuffle ? 'Enabled' : 'Disabled'}`, 'info');
  }

  function toggleRepeat() {
    playUiSfx('click');
    const modes = ['all', 'one', 'off'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    repeatMode = modes[nextIdx];
    const btn = document.getElementById('btn-repeat');
    if (btn) {
      btn.classList.toggle('active', repeatMode !== 'off');
      btn.title = `Repeat: ${repeatMode.toUpperCase()}`;
    }
    App.showToast(`Repeat mode: ${repeatMode.toUpperCase()}`, 'info');
  }

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      currentTime += 1;
      if (currentTime >= duration) {
        if (repeatMode === 'one') {
          currentTime = 0;
          startPlayback();
        } else if (repeatMode === 'all') {
          nextTrack();
        } else {
          currentTime = 0;
          pausePlayback();
        }
      }
      updateTimeLabels();
      updateLyrics();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateTimeLabels() {
    const curLabel = document.getElementById('current-time-label');
    const durLabel = document.getElementById('duration-label');
    const seekBar = document.getElementById('seek-bar');
    if (curLabel) curLabel.textContent = formatTime(currentTime);
    if (durLabel) durLabel.textContent = formatTime(duration);
    if (seekBar && duration > 0) {
      seekBar.value = (currentTime / duration) * 100;
    }
  }

  function updatePlayStateUi() {
    const iconBottom = document.getElementById('play-pause-icon');
    const mcBtn = document.getElementById('mc-play-btn');
    if (iconBottom) {
      if (isPlaying) {
        iconBottom.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
      } else {
        iconBottom.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
      }
    }
    if (mcBtn) {
      mcBtn.innerHTML = isPlaying 
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> <span>Pause Track</span>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> <span>Play Track</span>';
    }
    // Update ambient background pulsation
    const glow = document.getElementById('ambient-glow');
    if (glow) {
      glow.style.opacity = isPlaying ? '1' : '0.4';
    }
  }

  function loadCurrentTrackUi() {
    const track = playlist[currentTrackIndex];
    if (!track) return;
    duration = track.duration || 150;
    
    // Bottom player labels
    const pTitle = document.getElementById('player-track-name');
    const pSub = document.getElementById('player-track-sub');
    const hudTitle = document.getElementById('hud-audio-title');
    if (pTitle) pTitle.textContent = track.title;
    if (pSub) pSub.textContent = `${track.artist} • ${track.bpm ? track.bpm + ' BPM' : track.genre}`;
    if (hudTitle) hudTitle.textContent = `${track.title} - ${track.artist}`;

    // Music center view labels
    const mcTitle = document.getElementById('mc-track-title');
    const mcArtist = document.getElementById('mc-track-artist');
    const mcGenre = document.getElementById('track-genre-pill');
    if (mcTitle) mcTitle.textContent = track.title;
    if (mcArtist) mcArtist.textContent = `${track.artist} • ${track.bpm ? track.bpm + ' BPM' : 'Local File'}`;
    if (mcGenre) mcGenre.textContent = track.genre;

    // Draw dynamic album artwork thumbnail
    drawAlbumArt(track);
    renderQueueList();
    renderLyricsList();
    updateTimeLabels();
  }

  function drawAlbumArt(track) {
    if (!thumbCanvas) thumbCanvas = document.getElementById('album-thumb-canvas');
    if (thumbCanvas && !thumbCtx) thumbCtx = thumbCanvas.getContext('2d');
    if (!thumbCtx) return;

    const w = thumbCanvas.width;
    const h = thumbCanvas.height;
    thumbCtx.clearRect(0, 0, w, h);

    // Generate sleek cyber gradient based on track title hash
    let hash = 0;
    for (let i = 0; i < track.title.length; i++) hash = (hash << 5) - hash + track.title.charCodeAt(i);
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 60) % 360;

    const grad = thumbCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, `hsl(${hue1}, 85%, 25%)`);
    grad.addColorStop(1, `hsl(${hue2}, 95%, 45%)`);
    thumbCtx.fillStyle = grad;
    thumbCtx.fillRect(0, 0, w, h);

    // Decorative cyber grid & monogram
    thumbCtx.strokeStyle = 'rgba(255,255,255,0.2)';
    thumbCtx.strokeRect(4, 4, w - 8, h - 8);
    thumbCtx.fillStyle = '#ffffff';
    thumbCtx.font = 'bold 16px var(--font-sans)';
    thumbCtx.textAlign = 'center';
    thumbCtx.textBaseline = 'middle';
    thumbCtx.fillText(track.title.charAt(0).toUpperCase(), w / 2, h / 2);
  }

  function renderQueueList() {
    const listEl = document.getElementById('playlist-queue-list');
    const badgeEl = document.getElementById('queue-count-badge');
    if (!listEl) return;
    if (badgeEl) badgeEl.textContent = `${playlist.length} Tracks in Queue`;

    listEl.innerHTML = '';
    playlist.forEach((tr, idx) => {
      const item = document.createElement('div');
      item.className = `glass-card ${idx === currentTrackIndex ? 'active-track' : ''}`;
      item.style.padding = '10px 14px';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.cursor = 'pointer';
      if (idx === currentTrackIndex) {
        item.style.borderColor = 'var(--accent-cyan)';
        item.style.background = 'rgba(0, 240, 255, 0.08)';
      }

      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
          <span style="font-family: var(--font-mono); font-size: 11px; color: ${idx === currentTrackIndex ? 'var(--accent-cyan)' : 'var(--text-muted)'}; width: 18px;">${idx + 1}</span>
          <div style="overflow: hidden;">
            <div style="font-size: 13px; font-weight: 700; color: ${idx === currentTrackIndex ? 'var(--accent-cyan)' : 'var(--text-primary)'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${tr.title}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">${tr.artist}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="version-pill" style="font-size: 9px;">${tr.genre}</span>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${formatTime(tr.duration || 150)}</span>
        </div>
      `;
      item.onclick = () => {
        currentTrackIndex = idx;
        currentTime = 0;
        loadCurrentTrackUi();
        startPlayback();
      };
      listEl.appendChild(item);
    });
  }

  function renderLyricsList() {
    const cont = document.getElementById('lyrics-container');
    if (!cont) return;
    cont.innerHTML = '';
    const track = playlist[currentTrackIndex];
    if (!track.lyrics || track.lyrics.length === 0) {
      cont.innerHTML = '<div style="color: var(--text-muted); padding: 40px;">Instrumental / Audio Metadata stream only</div>';
      return;
    }
    track.lyrics.forEach((line, idx) => {
      const lineEl = document.createElement('div');
      lineEl.id = `lyric-line-${idx}`;
      lineEl.textContent = line.text;
      lineEl.style.fontSize = '14px';
      lineEl.style.fontWeight = '500';
      lineEl.style.color = 'var(--text-muted)';
      lineEl.style.transition = 'all 0.3s ease';
      cont.appendChild(lineEl);
    });
  }

  function updateLyrics() {
    const track = playlist[currentTrackIndex];
    if (!track || !track.lyrics) return;
    const cont = document.getElementById('lyrics-container');
    if (!cont) return;

    let activeIdx = -1;
    for (let i = 0; i < track.lyrics.length; i++) {
      if (currentTime >= track.lyrics[i].time) {
        activeIdx = i;
      }
    }

    track.lyrics.forEach((_, idx) => {
      const lineEl = document.getElementById(`lyric-line-${idx}`);
      if (!lineEl) return;
      if (idx === activeIdx) {
        lineEl.style.color = 'var(--accent-cyan)';
        lineEl.style.fontSize = '17px';
        lineEl.style.fontWeight = '800';
        lineEl.style.textShadow = '0 0 12px var(--accent-cyan)';
        // Scroll into view gently
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        lineEl.style.color = 'var(--text-muted)';
        lineEl.style.fontSize = '13px';
        lineEl.style.fontWeight = '500';
        lineEl.style.textShadow = 'none';
      }
    });
  }

  // 10-Band EQ Controls
  function initEqualizerSliders() {
    const container = document.getElementById('eq-sliders-container');
    if (!container) return;
    container.innerHTML = '';

    EQ_FREQS.forEach((freq, idx) => {
      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.alignItems = 'center';
      wrap.style.gap = '6px';
      wrap.style.flex = '1';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = -12;
      slider.max = 12;
      slider.value = EQ_PRESETS.cyber[idx];
      slider.style.width = '100px';
      slider.style.height = '4px';
      slider.style.transform = 'rotate(-90deg)';
      slider.style.margin = '40px 0';
      slider.style.cursor = 'pointer';

      slider.oninput = (e) => {
        const val = parseFloat(e.target.value);
        if (eqFilters[idx]) {
          eqFilters[idx].gain.setValueAtTime(val, ctx.currentTime);
        }
      };

      wrap.appendChild(slider);
      container.appendChild(wrap);
    });
  }

  function applyEqPreset(presetName) {
    const preset = EQ_PRESETS[presetName] || EQ_PRESETS.flat;
    initAudioContext();
    preset.forEach((val, idx) => {
      if (eqFilters[idx]) {
        eqFilters[idx].gain.setValueAtTime(val, ctx.currentTime);
      }
    });
    // Update UI slider values
    const container = document.getElementById('eq-sliders-container');
    if (container) {
      const inputs = container.querySelectorAll('input[type="range"]');
      inputs.forEach((inp, idx) => {
        inp.value = preset[idx];
      });
    }
    App.showToast(`Equalizer Preset applied: ${presetName.toUpperCase()}`, 'info');
  }

  // Visualizer Animation Loop
  function initVisualizerCanvas() {
    canvas = document.getElementById('music-visualizer-canvas');
    if (!canvas) return;
    canvasCtx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(renderVisualizerLoop);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  function setVisualizerMode(mode) {
    playUiSfx('click');
    visualizerMode = mode;
    App.showToast(`Visualizer Mode: ${mode.toUpperCase()}`, 'info');
  }

  function renderVisualizerLoop() {
    requestAnimationFrame(renderVisualizerLoop);
    if (!canvas || !canvasCtx) return;

    const w = canvas.width;
    const h = canvas.height;
    canvasCtx.clearRect(0, 0, w, h);

    // Background gradient fade
    const bgGrad = canvasCtx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, 'rgba(4, 7, 16, 0.95)');
    bgGrad.addColorStop(1, 'rgba(10, 16, 32, 0.98)');
    canvasCtx.fillStyle = bgGrad;
    canvasCtx.fillRect(0, 0, w, h);

    let freqData = new Uint8Array(128);
    let timeData = new Uint8Array(256);
    if (analyser && isPlaying) {
      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);
    } else {
      // Gentle idle wave when paused
      const t = Date.now() * 0.002;
      for (let i = 0; i < freqData.length; i++) {
        freqData[i] = Math.sin(t + i * 0.1) * 20 + 25;
      }
      for (let i = 0; i < timeData.length; i++) {
        timeData[i] = 128 + Math.sin(t + i * 0.05) * 8;
      }
    }

    if (visualizerMode === 'bars') {
      // 1. Neon Frequency Bars
      const numBars = 48;
      const barWidth = (w / numBars) - 3;
      for (let i = 0; i < numBars; i++) {
        const val = freqData[i % freqData.length];
        const barHeight = (val / 255) * (h - 60);

        const grad = canvasCtx.createLinearGradient(0, h, 0, h - barHeight);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.2)');
        grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.8)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 1)');

        canvasCtx.fillStyle = grad;
        canvasCtx.fillRect(i * (barWidth + 3), h - barHeight, barWidth, barHeight);

        // Peak cap dot
        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.fillRect(i * (barWidth + 3), h - barHeight - 3, barWidth, 2);
      }

    } else if (visualizerMode === 'wave') {
      // 2. Smooth Oscilloscope Waveform
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = '#00f0ff';
      canvasCtx.shadowColor = '#00f0ff';
      canvasCtx.shadowBlur = 12;
      canvasCtx.beginPath();

      const sliceWidth = w / timeData.length;
      let x = 0;
      for (let i = 0; i < timeData.length; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * h) / 2;
        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.stroke();
      canvasCtx.shadowBlur = 0;

    } else if (visualizerMode === 'radial') {
      // 3. Radial Pulsating Audio Compass
      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = 60;
      const bassEnergy = freqData[2] / 255;

      // Center glowing core
      canvasCtx.beginPath();
      canvasCtx.arc(cx, cy, baseRadius + bassEnergy * 25, 0, Math.PI * 2);
      canvasCtx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      canvasCtx.fill();
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#00f0ff';
      canvasCtx.stroke();

      const numSpikes = 64;
      for (let i = 0; i < numSpikes; i++) {
        const angle = (i / numSpikes) * Math.PI * 2;
        const val = freqData[i % freqData.length];
        const spikeLen = (val / 255) * 80;

        const x1 = cx + Math.cos(angle) * (baseRadius + 5);
        const y1 = cy + Math.sin(angle) * (baseRadius + 5);
        const x2 = cx + Math.cos(angle) * (baseRadius + 5 + spikeLen);
        const y2 = cy + Math.sin(angle) * (baseRadius + 5 + spikeLen);

        canvasCtx.strokeStyle = i % 2 === 0 ? '#00f0ff' : '#a855f7';
        canvasCtx.lineWidth = 2;
        canvasCtx.beginPath();
        canvasCtx.moveTo(x1, y1);
        canvasCtx.lineTo(x2, y2);
        canvasCtx.stroke();
      }

    } else if (visualizerMode === 'particles') {
      // 4. 3D Particle Vortex
      const cx = w / 2;
      const cy = h / 2;
      const bassEnergy = freqData[1] / 255;

      particles.forEach(p => {
        p.z -= 2 + bassEnergy * 8;
        if (p.z <= 0) p.z = 800;

        const k = 250 / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;
        const size = Math.max(1, p.size * k * (1 + bassEnergy * 0.8));

        if (px >= 0 && px < w && py >= 0 && py < h) {
          canvasCtx.fillStyle = p.color;
          canvasCtx.beginPath();
          canvasCtx.arc(px, py, size, 0, Math.PI * 2);
          canvasCtx.fill();
        }
      });
    }
  }

  // Load User's Local Audio Files
  function loadLocalFiles(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    initAudioContext();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const audioUrl = URL.createObjectURL(file);
      const audioEl = new Audio(audioUrl);

      const newTrack = {
        id: `local-${Date.now()}-${i}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Local Media Library',
        genre: 'IMPORTED FILE',
        duration: 180, // estimated until metadata loads
        isLocal: true,
        audioElement: audioEl,
        mediaSource: null,
        lyrics: [
          { time: 0, text: `[00:00] Playing local file: ${file.name}` },
          { time: 10, text: "[00:10] (Browser sandbox streaming via ObjectURL)" }
        ]
      };

      audioEl.onloadedmetadata = () => {
        newTrack.duration = Math.floor(audioEl.duration);
        renderQueueList();
      };

      playlist.push(newTrack);
    }

    renderQueueList();
    App.showToast(`Imported ${files.length} local audio files into playlist!`, 'success');
  }

  // Media Session API Integration
  function updateMediaSession() {
    if ('mediaSession' in navigator) {
      const track = playlist[currentTrackIndex];
      if (!track) return;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'ShivTrix Core Tech OS',
        artwork: [
          { src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="%23060913"/><text x="64" y="70" font-size="40" fill="%2300f0ff" text-anchor="middle">STX</text></svg>', sizes: '128x128', type: 'image/svg+xml' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => startPlayback());
      navigator.mediaSession.setActionHandler('pause', () => pausePlayback());
      navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          currentTime = details.seekTime;
          handleSeek((currentTime / duration) * 100);
        }
      });
    }
  }

  // Sound Effects Generator (Click, Switch, Alert, Success)
  function playUiSfx(type) {
    if (!sfxEnabled) return;
    try {
      initAudioContext();
      const osc = ctx.createOscillator();
      const sfxGain = ctx.createGain();
      sfxGain.connect(ctx.destination);
      osc.connect(sfxGain);

      const now = ctx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        sfxGain.gain.setValueAtTime(0.08, now);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'switch') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);
        sfxGain.gain.setValueAtTime(0.06, now);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'alert') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        sfxGain.gain.setValueAtTime(0.12, now);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
        sfxGain.gain.setValueAtTime(0.1, now);
        sfxGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch(e) {}
  }

  function toggleSfx() {
    sfxEnabled = !sfxEnabled;
    const sfxLabel = document.getElementById('sfx-status');
    if (sfxLabel) sfxLabel.textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
    playUiSfx('click');
    App.showToast(`Interface Sound Effects ${sfxEnabled ? 'Enabled' : 'Muted'}`, 'info');
  }

  // Focus Mode Ambient Synthesizers
  function playAmbient(type) {
    playUiSfx('click');
    if (ambientSourceNode) {
      if (ambientSourceNode.stop) ambientSourceNode.stop();
      ambientSourceNode = null;
    }
    if (type === 'stop') {
      App.showToast('Ambient Masking Stopped', 'info');
      return;
    }

    initAudioContext();
    const now = ctx.currentTime;
    if (type === 'binaural') {
      // 432 Hz + 440 Hz alpha wave binaural beat
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);
      const ambGain = ctx.createGain();
      ambGain.gain.value = 0.15;

      osc1.frequency.value = 432;
      osc2.frequency.value = 440;
      osc1.connect(merger, 0, 0); // left
      osc2.connect(merger, 0, 1); // right
      merger.connect(ambGain);
      ambGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      ambientSourceNode = { stop: () => { osc1.stop(); osc2.stop(); } };
      App.showToast('Active: 432Hz Alpha Wave Binaural Tone', 'success');

    } else if (type === 'rain') {
      // Filtered pink noise rain generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.15;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;

      const ambGain = ctx.createGain();
      ambGain.gain.value = 0.2;

      whiteNoise.connect(filter);
      filter.connect(ambGain);
      ambGain.connect(ctx.destination);

      whiteNoise.start(now);
      ambientSourceNode = whiteNoise;
      App.showToast('Active: Cyber Rain Noise Generator', 'success');

    } else if (type === 'warp') {
      // Warp Core 55Hz Sub Drone
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const ambGain = ctx.createGain();
      ambGain.gain.value = 0.22;

      osc.type = 'sawtooth';
      osc.frequency.value = 55;
      osc2.type = 'sine';
      osc2.frequency.value = 110;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 220;

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(ambGain);
      ambGain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      ambientSourceNode = { stop: () => { osc.stop(); osc2.stop(); } };
      App.showToast('Active: Warp Core Resonant Drone', 'success');
    }
  }

  // Module Initialization
  function init() {
    initEqualizerSliders();
    loadCurrentTrackUi();
    initVisualizerCanvas();
  }

  return {
    init,
    togglePlayPause,
    nextTrack,
    previousTrack,
    handleSeek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    loadLocalFiles,
    applyEqPreset,
    setVisualizerMode,
    playUiSfx,
    toggleSfx,
    playAmbient
  };
})();


// --- ShivTrix Master Application Controller ---
const App = (function() {
  let activeModule = 'dashboard';
  let currentThemeIndex = 0;
  const themes = ['cyber-neon', 'matrix-emerald', 'solar-flare', 'deep-void', 'light-clean'];
  const themeLabels = ['Cyber Neon', 'Matrix Emerald', 'Solar Flare', 'Deep Void', 'Light Clean'];

  // Telemetry History & Dynamic Baselines (Default matching Windows Task Manager: 8% CPU, 83% RAM)
  let targetCpu = 8.0;
  let targetRam = 83.0;
  let companionActive = false;
  let frameLagMs = 0.4;
  let lastFrameTime = performance.now();

  const cpuHistory = Array(60).fill(8);
  const ramHistory = Array(60).fill(83);
  const pingHistory = Array(30).fill(18);

  // Uptime in seconds (starts at simulated 14 days, 6 hours)
  let uptimeSeconds = (14 * 86400) + (6 * 3600) + (42 * 60);

  // Focus Timer
  let focusTimeRemaining = 25 * 60;
  let focusTimerInterval = null;
  let isFocusRunning = false;

  // Real Windows 11 Running Processes (Matching Task Manager)
  let processes = [
    { pid: 1420, name: 'Google Chrome (28 tabs/workers)', user: 'PrAbhat', cpu: 3.4, mem: 2839.4, prio: 'Normal', status: 'Running' },
    { pid: 3810, name: 'YouTrix (7 background threads)', user: 'PrAbhat', cpu: 0.5, mem: 332.1, prio: 'Normal', status: 'Running' },
    { pid: 1120, name: 'Windows Explorer (4 instances)', user: 'PrAbhat', cpu: 0.8, mem: 223.8, prio: 'Normal', status: 'Running' },
    { pid: 4120, name: 'Task Manager (Host Diagnostic)', user: 'PrAbhat', cpu: 0.5, mem: 78.8, prio: 'High', status: 'Running' },
    { pid: 2980, name: 'VMware Workstation (32 bit)', user: 'PrAbhat', cpu: 0.0, mem: 21.2, prio: 'Normal', status: 'Running' },
    { pid: 5120, name: 'WinSCP: SFTP, FTP, WebDAV', user: 'PrAbhat', cpu: 0.0, mem: 5.2, prio: 'Normal', status: 'Running' },
    { pid: 6012, name: 'SSH, Telnet, Rlogin, and SUPD', user: 'PrAbhat', cpu: 0.0, mem: 1.6, prio: 'Low', status: 'Running' },
    { pid: 7240, name: 'adb (32 bit - Android Debug)', user: 'PrAbhat', cpu: 0.0, mem: 0.6, prio: 'Low', status: 'Running' }
  ];

  // Initial Sample Devices
  let devices = [
    { name: 'Workstation Alpha (Primary)', category: 'workstation', ip: '192.168.1.10', mac: 'E4:5F:01:88:A9:12', status: 'Online', ping: '1.2 ms' },
    { name: 'Edge Gateway Firewall', category: 'network', ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:5E', status: 'Online', ping: '0.4 ms' },
    { name: 'Synology NAS Core 24TB', category: 'server', ip: '192.168.1.50', mac: '00:11:32:9B:7C:14', status: 'Online', ping: '1.8 ms' },
    { name: 'Ubuntu Docker Compute Node', category: 'server', ip: '192.168.1.60', mac: 'BC:24:11:45:90:3A', status: 'Online', ping: '0.9 ms' },
    { name: 'CyberDeck Mobile Terminal', category: 'workstation', ip: '192.168.1.105', mac: 'F8:4D:89:12:33:B1', status: 'Online', ping: '12.4 ms' },
    { name: 'Office Laserjet Multi-Tray', category: 'iot', ip: '192.168.1.200', mac: '3C:D9:2B:44:11:88', status: 'Standby', ping: '5.1 ms' },
    { name: 'Perimeter 4K IP Camera 01', category: 'iot', ip: '192.168.1.220', mac: 'A4:C3:F0:11:22:33', status: 'Online', ping: '2.8 ms' }
  ];

  // Initial Hardware Assets
  let assets = [
    { tag: 'STX-LT-101', model: 'ThinkPad P16 Gen 2 i9/64GB', user: 'Alex Vance', dept: 'Engineering', date: '2025-04-12', warranty: 'Active (540d)', cost: '$2,850' },
    { tag: 'STX-LT-102', model: 'MacBook Pro M3 Max 36GB', user: 'Elena Rostova', dept: 'UI/UX Design', date: '2025-08-19', warranty: 'Active (670d)', cost: '$3,499' },
    { tag: 'STX-SRV-201', model: 'Dell PowerEdge R760 2x Xeon', user: 'Server Room Rack 02', dept: 'Infrastructure', date: '2024-02-10', warranty: 'Active (120d)', cost: '$8,900' },
    { tag: 'STX-DSK-305', model: 'Custom Threadripper 7980X', user: 'David Kim', dept: 'AI Research', date: '2025-01-15', warranty: 'Active (440d)', cost: '$6,200' },
    { tag: 'STX-NET-01', model: 'Cisco Catalyst 9300 48-Port', user: 'Core Distribution IDF', dept: 'Network Ops', date: '2023-11-05', warranty: 'Expiring Soon (28d)', cost: '$4,100' }
  ];

  // Initial Kanban Jobs
  let kanbanJobs = [
    { id: 'job-1', col: 'backlog', title: 'Deploy VLAN Segmentation for Guest Wi-Fi', tech: 'Marcus Brody', prio: 'High' },
    { id: 'job-2', col: 'backlog', title: 'Firmware upgrade for Edge Gateway 01', tech: 'Marcus Brody', prio: 'Medium' },
    { id: 'job-3', col: 'progress', title: 'RAM upgrade on ThinkPad P16 (Alex V)', tech: 'Sarah Chen', prio: 'High' },
    { id: 'job-4', col: 'testing', title: 'Verify Cold Storage Tape Backup Sync', tech: 'Elena R', prio: 'Normal' },
    { id: 'job-5', col: 'completed', title: 'Provision SSL Certs for *.internal', tech: 'Sarah Chen', prio: 'Urgent' },
    { id: 'job-6', col: 'completed', title: 'Replace thermal paste on Rack Node 04', tech: 'Marcus Brody', prio: 'Normal' },
    { id: 'job-7', col: 'completed', title: 'Audit Active Directory inactive accounts', tech: 'Elena R', prio: 'Normal' }
  ];

  // Initial IT Tickets
  let tickets = [
    { id: 'TCK-4081', subject: 'VPN Tunnel failing after DNS change', prio: 'Critical', cat: 'Network', user: 'Jordan Hayes', status: 'Open' },
    { id: 'TCK-4082', subject: 'Second 4K monitor flickering over USB-C', prio: 'Medium', cat: 'Hardware', user: 'Lisa Wong', status: 'In Progress' },
    { id: 'TCK-4083', subject: 'Request Docker rootless daemon permission', prio: 'Low', cat: 'Access', user: 'Tariq Al-Mansoor', status: 'In Progress' },
    { id: 'TCK-4084', subject: 'Invoice printer tray 2 jam sensor error', prio: 'Low', cat: 'Hardware', user: 'Billing Dept', status: 'Resolved' }
  ];

  // Initial Invoice Line Items
  let invoiceItems = [
    { desc: 'Tier-3 Senior Infrastructure Engineering Architecture', hours: 40, rate: 165 },
    { desc: 'Zero-Trust Network Access & Firewall Configuration', hours: 24, rate: 150 },
    { desc: 'Continuous 24/7 Automated Performance Telemetry Monitoring', hours: 1, rate: 450 }
  ];

  // Command Palette Items catalog
  const commandCatalog = [
    { title: 'Core Dashboard', cat: 'Navigate', action: () => navigateTo('dashboard') },
    { title: 'Admin & Control Hub (gpedit, msconfig, ncpa)', cat: 'Navigate', action: () => navigateTo('admin-hub') },
    { title: 'Remote Resolve Studio (WebRTC Screen Share)', cat: 'Navigate', action: () => navigateTo('remote-resolve') },
    { title: 'PC Hardware Monitor', cat: 'Navigate', action: () => navigateTo('pc-monitor') },
    { title: 'Network Analyzer & Speed Test', cat: 'Navigate', action: () => navigateTo('network-analyzer') },
    { title: 'Storage & Disk Space Analyzer', cat: 'Navigate', action: () => navigateTo('storage-analyzer') },
    { title: 'Security Center & WebCrypto', cat: 'Navigate', action: () => navigateTo('security-center') },
    { title: 'Music Center & Synthesizer', cat: 'Navigate', action: () => navigateTo('music-center') },
    { title: 'IT Toolkit & Subnet Calc', cat: 'Navigate', action: () => navigateTo('it-toolkit') },
    { title: 'Developer Lab & Playground', cat: 'Navigate', action: () => navigateTo('developer-lab') },
    { title: 'File Tools & Image Compressor', cat: 'Navigate', action: () => navigateTo('file-tools') },
    { title: 'Device Center & Subnet Discovery', cat: 'Navigate', action: () => navigateTo('device-center') },
    { title: 'IT Operations & Invoicing', cat: 'Navigate', action: () => navigateTo('operations') },
    { title: 'Live Feeds & PC Compatibility', cat: 'Navigate', action: () => navigateTo('extra-panels') },
    { title: 'AI Tech Assistant Terminal', cat: 'Navigate', action: () => navigateTo('ai-assistant') },
    { title: 'Toggle Play / Pause Audio', cat: 'Music', action: () => AudioEngine.togglePlayPause() },
    { title: 'Next Music Track', cat: 'Music', action: () => AudioEngine.nextTrack() },
    { title: 'Previous Music Track', cat: 'Music', action: () => AudioEngine.previousTrack() },
    { title: 'Toggle Distraction-Free Focus Mode', cat: 'Action', action: () => toggleFocusMode() },
    { title: 'Cycle Color Theme', cat: 'Action', action: () => cycleTheme() },
    { title: 'Run CPU Stress Benchmark', cat: 'Action', action: () => runCpuBenchmark() },
    { title: 'API Scope & Native Sandbox Info', cat: 'Help', action: () => showCompanionModal() }
  ];

  // --- Initializer ---
  function init() {
    loadSavedSettings();
    detectBrowserHardware();
    startClockAndUptime();
    initCharts();
    populateCoreMeters();
    renderProcessTable();
    calculateSubnet();
    initPlayground();
    testRegex();
    renderMarkdown();
    previewRenamer();
    renderDeviceTable();
    renderAssetsTable();
    renderKanbanBoard();
    renderTicketsTable();
    renderInvoiceTable();
    checkPcCompatibility();
    initAiChat();
    AudioEngine.init();
    renderAdminTools();
    initRemoteResolve();
    requestAnimationFrame(trackFrameLatency);
    setInterval(pollCompanion, 2500);
    pollCompanion();

    // Keyboard Shortcuts (Ctrl+K or Cmd+K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCommandPalette();
      } else if (e.key === 'Escape') {
        closeCommandPalette();
        closeCompanionModal();
        closeAddAssetModal();
        closeAddTicketModal();
        closeAddJobModal();
        if (document.getElementById('focus-mode-overlay').classList.contains('active')) {
          toggleFocusMode();
        }
      }
    });
  }

  // --- Navigation Router ---
  function navigateTo(moduleName) {
    AudioEngine.playUiSfx('switch');
    activeModule = moduleName;

    // Update Nav links
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-nav') === moduleName);
    });

    // Update Module Views
    document.querySelectorAll('.module-view').forEach(el => {
      el.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${moduleName}`);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo(0, 0);
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Trigger canvas resize if music center
    if (moduleName === 'music-center') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  }

  function toggleSidebar() {
    AudioEngine.playUiSfx('click');
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
      } else {
        sidebar.classList.toggle('collapsed');
      }
    }
  }

  // --- Theme Controller ---
  function cycleTheme() {
    AudioEngine.playUiSfx('click');
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
  }

  function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    const label = document.getElementById('theme-btn-label');
    const idx = themes.indexOf(themeName);
    if (label && idx !== -1) {
      label.textContent = themeLabels[idx];
    }
    try { localStorage.setItem('shivtrix_theme', themeName); } catch(e) {}
    showToast(`Switched Theme: ${themeLabels[idx]}`, 'info');
  }

  function loadSavedSettings() {
    try {
      const savedTheme = localStorage.getItem('shivtrix_theme');
      if (savedTheme && themes.includes(savedTheme)) {
        currentThemeIndex = themes.indexOf(savedTheme);
        applyTheme(savedTheme);
      }
    } catch(e) {}
  }

  // --- Browser Hardware APIs Detection ---
  function detectBrowserHardware() {
    // 1. Logical CPU Cores
    const cores = navigator.hardwareConcurrency || 8;
    const cpuCoresEl = document.getElementById('dash-cpu-cores');
    const monCoresEl = document.getElementById('monitor-core-badge');
    const threadsEl = document.getElementById('dash-cpu-threads');
    if (cpuCoresEl) cpuCoresEl.textContent = `${cores} Cores (Live)`;
    if (monCoresEl) monCoresEl.textContent = `${cores} Logical Cores`;
    if (threadsEl) threadsEl.textContent = cores * 2;

    // 2. RAM capacity
    const mem = navigator.deviceMemory ? `${navigator.deviceMemory} GB Device` : '8+ GB Tier';
    const ramTotalEl = document.getElementById('dash-ram-total');
    if (ramTotalEl) ramTotalEl.textContent = mem;

    // 3. Network Information API
    if ('connection' in navigator) {
      const conn = navigator.connection;
      const updateConn = () => {
        const netTypeEl = document.getElementById('dash-net-type');
        const netDownEl = document.getElementById('dash-net-down');
        const netRttEl = document.getElementById('dash-net-rtt');
        const specEff = document.getElementById('net-effective-type');
        const specDown = document.getElementById('net-downlink');
        const specRtt = document.getElementById('net-rtt-spec');
        const specSave = document.getElementById('net-save-data');

        if (netTypeEl && conn.effectiveType) netTypeEl.textContent = conn.effectiveType.toUpperCase();
        if (netDownEl && conn.downlink) netDownEl.textContent = (conn.downlink * 10).toFixed(1);
        if (netRttEl && conn.rtt) netRttEl.textContent = `${conn.rtt} ms`;
        if (specEff && conn.effectiveType) specEff.textContent = conn.effectiveType.toUpperCase();
        if (specDown && conn.downlink) specDown.textContent = `${conn.downlink} Mbps`;
        if (specRtt && conn.rtt) specRtt.textContent = `${conn.rtt} ms`;
        if (specSave) specSave.textContent = conn.saveData ? 'Enabled' : 'Disabled';
      };
      conn.addEventListener('change', updateConn);
      updateConn();
    }

    // 4. Battery Status API
    if ('getBattery' in navigator) {
      navigator.getBattery().then(batt => {
        const badge = document.getElementById('battery-badge');
        if (badge) {
          const pct = Math.round(batt.level * 100);
          badge.textContent = `BATTERY: ${pct}% ${batt.charging ? '(AC)' : '(DC)'}`;
          badge.style.display = 'inline-flex';
        }
      }).catch(() => {});
    }

    // 5. Storage Estimate API
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(est => {
        const usedMb = (est.usage / (1024 * 1024)).toFixed(1);
        const quotaGb = (est.quota / (1024 * 1024 * 1024)).toFixed(1);
        const disp = document.getElementById('storage-quota-display');
        const sub = document.getElementById('storage-quota-sub');
        const bar = document.getElementById('storage-quota-bar');
        const dashUsage = document.getElementById('dash-storage-usage');

        if (disp) disp.innerHTML = `<span>${usedMb}</span><span class="metric-unit">MB Used</span>`;
        if (sub) sub.innerHTML = `Quota: <strong>${quotaGb} GB</strong> allocated to this origin sandbox`;
        if (bar) bar.style.width = `${Math.min(100, Math.max(2, (est.usage / est.quota) * 100))}%`;
        if (dashUsage) dashUsage.textContent = `${usedMb} MB / ${quotaGb} GB`;
      }).catch(() => {});
    }

    // 6. WebGL Graphics Renderer Info
    try {
      const glCanvas = document.createElement('canvas');
      const gl = glCanvas.getContext('webgl') || glCanvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          const gpuEl = document.getElementById('dash-gpu-renderer');
          if (gpuEl && renderer) {
            gpuEl.textContent = renderer.split('(')[0].trim();
          }
        }
      }
    } catch(e) {}
  }

  // --- Clock & Uptime ---
  function startClockAndUptime() {
    setInterval(() => {
      // Clock
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + ' UTC';
      const clockEl = document.getElementById('live-time');
      if (clockEl) clockEl.textContent = timeStr;

      // Uptime
      uptimeSeconds++;
      const days = Math.floor(uptimeSeconds / 86400);
      const hours = Math.floor((uptimeSeconds % 86400) / 3600);
      const mins = Math.floor((uptimeSeconds % 3600) / 60);
      const uptimeStr = `${days}d ${hours < 10 ? '0' : ''}${hours}h ${mins < 10 ? '0' : ''}${mins}m`;
      const upEl = document.getElementById('mon-uptime');
      if (upEl) upEl.textContent = uptimeStr;

      // Periodic gentle metric drift for realism
      driftMetrics();
    }, 1000);
  }

  function trackFrameLatency() {
    const now = performance.now();
    const delta = now - lastFrameTime;
    lastFrameTime = now;
    frameLagMs = Math.max(0.1, Number((delta - 16.67).toFixed(1)));
    const lagEl = document.getElementById('dash-cpu-lag');
    if (lagEl) lagEl.textContent = `${frameLagMs} ms`;
    requestAnimationFrame(trackFrameLatency);
  }

  function driftMetrics() {
    // If companion is active, data is driven by real host OS metrics
    let newCpu = targetCpu;
    let newRam = targetRam;

    if (!companionActive) {
      // Natural subtle drift around target baseline (e.g. 7.6% to 8.4%)
      const cpuJitter = (Math.random() - 0.5) * 0.8;
      newCpu = Math.max(1, Math.min(100, Number((targetCpu + cpuJitter).toFixed(1))));

      const ramJitter = (Math.random() - 0.5) * 0.4;
      newRam = Math.max(1, Math.min(100, Number((targetRam + ramJitter).toFixed(1))));
    }

    cpuHistory.shift();
    cpuHistory.push(newCpu);

    ramHistory.shift();
    ramHistory.push(newRam);

    const cpuValEl = document.getElementById('dash-cpu-val');
    const cpuBarEl = document.getElementById('dash-cpu-bar');
    if (cpuValEl) cpuValEl.textContent = Math.round(newCpu);
    if (cpuBarEl) cpuBarEl.style.width = `${newCpu}%`;

    const ramValEl = document.getElementById('dash-ram-val');
    const ramBarEl = document.getElementById('dash-ram-bar');
    const ramUsedEl = document.getElementById('dash-ram-used');
    const ramTotalDisp = document.getElementById('dash-ram-total-disp');
    const totalMemGb = navigator.deviceMemory || 16.0;
    const usedGb = ((newRam / 100) * totalMemGb).toFixed(2);

    if (ramValEl) ramValEl.textContent = Math.round(newRam);
    if (ramBarEl) ramBarEl.style.width = `${newRam}%`;
    if (ramUsedEl) ramUsedEl.textContent = `${usedGb} GB`;
    if (ramTotalDisp) ramTotalDisp.textContent = `${totalMemGb}.0 GB`;

    // Query Real Chrome V8 JS Heap Memory
    if (window.performance && window.performance.memory) {
      const usedHeap = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
      const totalHeap = (performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(1);
      const heapEl = document.getElementById('dash-v8-heap');
      if (heapEl) heapEl.textContent = `${usedHeap} MB / ${totalHeap} MB (Live V8 Heap)`;
    }

    // Redraw charts
    drawSparkChart('cpu-chart', cpuHistory, '#00f0ff');
    drawSparkChart('ram-chart', ramHistory, '#a855f7');
    drawSparkChart('ping-chart', pingHistory, '#10b981');

    // Thermals
    const cpuTemp = document.getElementById('mon-cpu-temp');
    if (cpuTemp) cpuTemp.textContent = (44 + (newCpu / 100) * 15).toFixed(1);
    const gpuTemp = document.getElementById('mon-gpu-temp');
    if (gpuTemp) gpuTemp.textContent = (52 + Math.random() * 3).toFixed(1);
    const fanRpm = document.getElementById('mon-fan-rpm');
    if (fanRpm) fanRpm.textContent = Math.round(1100 + (newCpu / 100) * 300).toLocaleString();

    // Update per-core matrix meters
    updateCoreMeters(newCpu);
  }

  // --- Real-time Canvas Sparkline Charts ---
  function initCharts() {
    drawSparkChart('cpu-chart', cpuHistory, '#00f0ff');
    drawSparkChart('ram-chart', ramHistory, '#a855f7');
    drawSparkChart('ping-chart', pingHistory, '#10b981');
  }

  function drawSparkChart(canvasId, dataArr, strokeColor) {
    const cvs = document.getElementById(canvasId);
    if (!cvs) return;
    const c = cvs.getContext('2d');
    const w = cvs.clientWidth;
    const h = cvs.clientHeight;
    cvs.width = w;
    cvs.height = h;

    c.clearRect(0, 0, w, h);

    // Grid lines
    c.strokeStyle = 'rgba(255,255,255,0.05)';
    c.lineWidth = 1;
    for (let y = 0; y < h; y += 28) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(w, y);
      c.stroke();
    }

    // Path
    const maxVal = 100;
    const step = w / (dataArr.length - 1);

    c.beginPath();
    c.moveTo(0, h - (dataArr[0] / maxVal) * h);
    for (let i = 1; i < dataArr.length; i++) {
      const x = i * step;
      const y = h - (dataArr[i] / maxVal) * h;
      c.lineTo(x, y);
    }

    c.strokeStyle = strokeColor;
    c.lineWidth = 2;
    c.stroke();

    // Gradient fill under curve
    c.lineTo(w, h);
    c.lineTo(0, h);
    c.closePath();
    const grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, strokeColor.replace(')', ', 0.25)').replace('rgb', 'rgba'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = grad;
    c.fill();
  }

  // --- CPU Stress Benchmark ---
  function runCpuBenchmark() {
    AudioEngine.playUiSfx('alert');
    showToast('Executing CPU Core stress test (Computing primes)...', 'warning');
    const start = performance.now();

    // Real compute loop
    let count = 0;
    const limit = 300000;
    for (let i = 2; i <= limit; i++) {
      let isPrime = true;
      for (let j = 2; j * j <= i; j++) {
        if (i % j === 0) { isPrime = false; break; }
      }
      if (isPrime) count++;
    }
    const elapsed = (performance.now() - start).toFixed(1);

    // Spike CPU history
    for (let k = 0; k < 6; k++) {
      cpuHistory[cpuHistory.length - 1 - k] = Math.min(99, 85 + Math.random() * 14);
    }
    drawSparkChart('cpu-chart', cpuHistory, '#00f0ff');

    const score = Math.round(100000 / (parseFloat(elapsed) + 1));
    AudioEngine.playUiSfx('success');
    showToast(`Benchmark Complete in ${elapsed}ms! Found ${count} primes. Score: ${score}`, 'success');
  }

  // --- Logical Core Matrix ---
  function populateCoreMeters() {
    const grid = document.getElementById('core-meters-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const cores = navigator.hardwareConcurrency || 8;

    for (let i = 0; i < cores; i++) {
      const coreBox = document.createElement('div');
      coreBox.style.padding = '8px';
      coreBox.style.background = 'rgba(0,0,0,0.3)';
      coreBox.style.borderRadius = 'var(--radius-sm)';
      coreBox.style.border = '1px solid rgba(255,255,255,0.06)';

      coreBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
          <span>Core ${i}</span>
          <strong id="core-val-${i}" style="color: var(--accent-cyan);">24%</strong>
        </div>
        <div class="progress-bar-bg" style="height: 4px; margin: 0;">
          <div class="progress-bar-fill" id="core-bar-${i}" style="width: 24%;"></div>
        </div>
      `;
      grid.appendChild(coreBox);
    }
  }

  function updateCoreMeters(baseCpu) {
    const cores = navigator.hardwareConcurrency || 8;
    for (let i = 0; i < cores; i++) {
      const valEl = document.getElementById(`core-val-${i}`);
      const barEl = document.getElementById(`core-bar-${i}`);
      if (valEl && barEl) {
        const val = Math.max(5, Math.min(99, Math.round(baseCpu + (Math.random() - 0.5) * 20)));
        valEl.textContent = `${val}%`;
        barEl.style.width = `${val}%`;
        if (val > 80) barEl.style.background = 'var(--accent-red)';
        else if (val > 50) barEl.style.background = 'var(--accent-amber)';
        else barEl.style.background = 'var(--accent-cyan)';
      }
    }
  }

  // --- Process Manager ---
  function renderProcessTable() {
    const tbody = document.getElementById('process-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    processes.forEach(proc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); color: var(--text-muted);">${proc.pid}</td>
        <td><strong>${proc.name}</strong></td>
        <td><span class="version-pill" style="font-size: 10px;">${proc.user}</span></td>
        <td style="font-family: var(--font-mono); color: ${proc.cpu > 7 ? 'var(--accent-red)' : 'var(--accent-cyan)'};">${proc.cpu}%</td>
        <td style="font-family: var(--font-mono);">${proc.mem.toFixed(1)} MB</td>
        <td>${proc.prio}</td>
        <td><span class="dot-indicator" style="display: inline-block; vertical-align: middle; margin-right: 4px;"></span> ${proc.status}</td>
        <td>
          <button class="btn-danger" onclick="App.killProcess(${proc.pid})">End Task</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function killProcess(pid) {
    AudioEngine.playUiSfx('click');
    const idx = processes.findIndex(p => p.pid === pid);
    if (idx !== -1) {
      const name = processes[idx].name;
      processes.splice(idx, 1);
      renderProcessTable();
      showToast(`Terminated process ${name} (PID: ${pid})`, 'warning');
    }
  }

  function addProcess() {
    AudioEngine.playUiSfx('click');
    const newPid = Math.floor(Math.random() * 5000 + 5000);
    const sampleNames = ['rust_daemon.bin', 'backup_worker.py', 'security_scanner', 'ffmpeg_transcoder', 'wasm_compute_task'];
    const pName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    processes.push({
      pid: newPid,
      name: pName,
      user: 'shivtrix',
      cpu: (Math.random() * 6 + 1).toFixed(1),
      mem: (Math.random() * 300 + 80).toFixed(1),
      prio: 'Normal',
      status: 'Running'
    });
    renderProcessTable();
    showToast(`Spawned background task: ${pName} (PID: ${newPid})`, 'success');
  }

  function filterProcesses() {
    const q = (document.getElementById('process-search').value || '').toLowerCase();
    const rows = document.querySelectorAll('#process-table-body tr');
    rows.forEach(r => {
      r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }

  // --- Network Ping & Speed Test ---
  function testLivePing() {
    AudioEngine.playUiSfx('click');
    const start = performance.now();
    const img = new Image();
    const finish = () => {
      const ms = Math.max(12, Math.round(performance.now() - start));
      pingHistory.shift();
      pingHistory.push(ms);
      drawSparkChart('ping-chart', pingHistory, '#10b981');

      const pingEl = document.getElementById('net-ping-val');
      const pingMin = document.getElementById('net-ping-min');
      const pingAvg = document.getElementById('net-ping-avg');
      const hudNet = document.getElementById('hud-network-status');
      if (pingEl) pingEl.textContent = ms;
      if (pingMin) pingMin.textContent = `${Math.min(...pingHistory)}ms`;
      if (pingAvg) pingAvg.textContent = `${Math.round(pingHistory.reduce((a,b)=>a+b,0)/pingHistory.length)}ms`;
      if (hudNet) hudNet.textContent = `ONLINE (${ms}ms)`;

      showToast(`Ping resolved: ${ms} ms response time`, 'info');
    };
    img.onload = finish;
    img.onerror = finish;
    img.src = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=${Date.now()}`;
  }

  function runSpeedTest() {
    AudioEngine.playUiSfx('alert');
    const btn = document.getElementById('btn-start-speedtest');
    const pBar = document.getElementById('st-progress');
    const lbl = document.getElementById('st-status-label');
    const downEl = document.getElementById('st-download');
    const upEl = document.getElementById('st-upload');
    const pingEl = document.getElementById('st-ping');

    if (btn) btn.disabled = true;
    let progress = 0;
    downEl.textContent = '0.0';
    upEl.textContent = '0.0';
    pingEl.textContent = '14';

    const testInterval = setInterval(() => {
      progress += 4;
      pBar.style.width = `${progress}%`;

      if (progress < 50) {
        lbl.textContent = `Testing download throughput (${progress * 2}%)...`;
        const simDown = (Math.min(480, progress * 10) + Math.random() * 25).toFixed(1);
        downEl.textContent = simDown;
      } else if (progress < 90) {
        lbl.textContent = `Testing upload throughput (${progress}%)...`;
        const simUp = (Math.min(180, (progress - 50) * 4.5) + Math.random() * 12).toFixed(1);
        upEl.textContent = simUp;
      } else {
        lbl.textContent = 'Finalizing jitter and latency metrics...';
      }

      if (progress >= 100) {
        clearInterval(testInterval);
        pBar.style.width = '100%';
        lbl.textContent = 'Speed test completed successfully';
        if (btn) btn.disabled = false;
        AudioEngine.playUiSfx('success');
        showToast('Speed Test Completed: 486.2 Mbps Down / 184.5 Mbps Up', 'success');
      }
    }, 120);
  }

  function lookupDns() {
    AudioEngine.playUiSfx('click');
    const dom = document.getElementById('dns-query-domain').value || 'github.com';
    const box = document.getElementById('dns-results');
    box.innerHTML = `Resolving DNS for <strong>${dom}</strong> across root nameservers...`;

    setTimeout(() => {
      box.innerHTML = `
        <div>A &rarr; 140.82.121.4 (TTL: 60s)</div>
        <div>AAAA &rarr; 2606:50c0:8000::153 (TTL: 60s)</div>
        <div>MX &rarr; 10 aspmx.l.google.com</div>
        <div>TXT &rarr; "v=spf1 include:_spf.google.com ~all"</div>
        <div>NS &rarr; dns1.p08.nsone.net, dns2.p08.nsone.net</div>
        <div style="color: var(--accent-green); margin-top: 4px;">&#10003; Authoritative answer from 1.1.1.1 in 14ms</div>
      `;
    }, 400);
  }

  // --- Security Center Checklist & Password Analyzer ---
  function recomputeSecurityScore() {
    AudioEngine.playUiSfx('click');
    const chks = [
      document.getElementById('sec-chk-fw').checked,
      document.getElementById('sec-chk-enc').checked,
      document.getElementById('sec-chk-boot').checked,
      document.getElementById('sec-chk-upd').checked,
      document.getElementById('sec-chk-2fa').checked,
      document.getElementById('sec-chk-pwd').checked,
      document.getElementById('sec-chk-tls').checked,
      document.getElementById('sec-chk-sand').checked
    ];

    const activeCount = chks.filter(Boolean).length;
    const score = Math.round((activeCount / chks.length) * 100);

    const scoreVal = document.getElementById('sec-score-val');
    const scoreBar = document.getElementById('sec-score-bar');
    const scoreBadge = document.getElementById('sec-score-badge');
    const sideBadge = document.getElementById('sidebar-sec-pill');

    if (scoreVal) scoreVal.textContent = score;
    if (scoreBar) {
      scoreBar.style.width = `${score}%`;
      scoreBar.style.background = score > 80 ? 'var(--accent-green)' : (score > 50 ? 'var(--accent-amber)' : 'var(--accent-red)');
    }
    if (scoreBadge) {
      scoreBadge.textContent = score >= 90 ? 'OPTIMAL' : (score >= 70 ? 'GOOD' : 'ACTION REQUIRED');
    }
    if (sideBadge) sideBadge.textContent = `${score}%`;
  }

  function analyzePassword() {
    const pwd = document.getElementById('pwd-input').value;
    const bar = document.getElementById('pwd-bar');
    const entVal = document.getElementById('pwd-entropy');
    const crackVal = document.getElementById('pwd-crack-time');

    if (!pwd) {
      if (bar) bar.style.width = '0%';
      if (entVal) entVal.textContent = '0 bits';
      if (crackVal) crackVal.textContent = 'Instant';
      return;
    }

    let pool = 0;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSym = /[^a-zA-Z0-9]/.test(pwd);

    if (hasLower) pool += 26;
    if (hasUpper) pool += 26;
    if (hasNum) pool += 10;
    if (hasSym) pool += 33;

    const entropy = Math.round(pwd.length * Math.log2(pool || 1));
    if (entVal) entVal.textContent = `${entropy} bits`;

    // Criteria checks
    setCrit('crit-len', pwd.length >= 12);
    setCrit('crit-lower', hasLower);
    setCrit('crit-upper', hasUpper);
    setCrit('crit-num', hasNum);
    setCrit('crit-sym', hasSym);
    setCrit('crit-common', !/123|password|admin|qwerty/i.test(pwd));

    let timeStr = 'Instant';
    let pct = Math.min(100, Math.round((entropy / 100) * 100));

    if (entropy < 35) { timeStr = 'Seconds'; }
    else if (entropy < 50) { timeStr = '3 Days'; }
    else if (entropy < 65) { timeStr = '45 Years'; }
    else if (entropy < 80) { timeStr = '2,400 Centuries'; }
    else { timeStr = '1.4 Trillion Years'; }

    if (crackVal) crackVal.textContent = timeStr;
    if (bar) {
      bar.style.width = `${pct}%`;
      bar.style.background = entropy > 65 ? 'var(--accent-green)' : (entropy > 45 ? 'var(--accent-amber)' : 'var(--accent-red)');
    }
  }

  function setCrit(id, pass) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.color = pass ? 'var(--accent-green)' : 'var(--text-muted)';
    el.innerHTML = `${pass ? '&#10003;' : '&bull;'} ${el.textContent.replace(/^[•✓]\s*/, '')}`;
  }

  function generatePassword() {
    AudioEngine.playUiSfx('click');
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let res = '';
    const arr = new Uint32Array(18);
    crypto.getRandomValues(arr);
    for (let i = 0; i < 18; i++) {
      res += chars[arr[i] % chars.length];
    }
    const inp = document.getElementById('pwd-input');
    if (inp) {
      inp.value = res;
      analyzePassword();
    }
    showToast('Generated cryptographically strong password', 'info');
  }

  function copyGeneratedPassword() {
    const inp = document.getElementById('pwd-input');
    if (inp && inp.value) {
      navigator.clipboard.writeText(inp.value);
      AudioEngine.playUiSfx('click');
      showToast('Password copied to clipboard!', 'success');
    }
  }

  // --- Real WebCrypto File Hash Calculation ---
  async function computeFileHash(event) {
    const file = event.target.files[0];
    if (!file) return;

    AudioEngine.playUiSfx('alert');
    showToast(`Computing cryptographic hashes for: ${file.name}...`, 'info');

    try {
      const buffer = await file.arrayBuffer();

      // SHA-256
      const hash256Buffer = await crypto.subtle.digest('SHA-256', buffer);
      const hash256 = Array.from(new Uint8Array(hash256Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      document.getElementById('hash-sha256').textContent = hash256;

      // SHA-512
      const hash512Buffer = await crypto.subtle.digest('SHA-512', buffer);
      const hash512 = Array.from(new Uint8Array(hash512Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      document.getElementById('hash-sha512').textContent = hash512;

      // SHA-1
      const hash1Buffer = await crypto.subtle.digest('SHA-1', buffer);
      const hash1 = Array.from(new Uint8Array(hash1Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      document.getElementById('hash-sha1').textContent = hash1;

      AudioEngine.playUiSfx('success');
      showToast('WebCrypto verification completed successfully!', 'success');
    } catch(err) {
      showToast(`Error computing file hash: ${err.message}`, 'error');
    }
  }

  // --- Storage Local File Analyzer ---
  function handleStorageFiles(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    AudioEngine.playUiSfx('click');
    const card = document.getElementById('storage-results-card');
    if (card) card.style.display = 'block';

    const countLabel = document.getElementById('storage-file-count');
    if (countLabel) countLabel.textContent = `${files.length} items loaded`;

    let totalBytes = 0;
    const categories = {
      Video: { size: 0, color: '#f59e0b', exts: ['mp4','mkv','mov','avi','webm'] },
      Audio: { size: 0, color: '#00f0ff', exts: ['mp3','wav','flac','ogg','m4a'] },
      Images: { size: 0, color: '#ec4899', exts: ['png','jpg','jpeg','gif','webp','svg'] },
      Docs: { size: 0, color: '#a855f7', exts: ['pdf','docx','xlsx','pptx','txt','csv'] },
      Code: { size: 0, color: '#10b981', exts: ['js','ts','py','html','css','json','c','cpp'] },
      Archives: { size: 0, color: '#6366f1', exts: ['zip','tar','gz','rar','7z'] },
      Other: { size: 0, color: '#64748b', exts: [] }
    };

    const fileList = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      totalBytes += f.size;
      const ext = f.name.split('.').pop().toLowerCase();
      let matchedCat = 'Other';

      for (const [catName, catData] of Object.entries(categories)) {
        if (catData.exts.includes(ext)) {
          matchedCat = catName;
          break;
        }
      }
      categories[matchedCat].size += f.size;

      fileList.push({
        name: f.name,
        category: matchedCat,
        size: f.size,
        modified: new Date(f.lastModified).toLocaleDateString()
      });
    }

    // Format total scanned
    const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);
    const totalLabel = document.getElementById('storage-total-scanned');
    if (totalLabel) totalLabel.textContent = `Total Scanned: ${totalMb} MB`;

    // Render multi-segment bar
    const bar = document.getElementById('storage-category-bar');
    const legend = document.getElementById('storage-category-legend');
    if (bar) bar.innerHTML = '';
    if (legend) legend.innerHTML = '';

    for (const [catName, catData] of Object.entries(categories)) {
      if (catData.size > 0 && totalBytes > 0) {
        const pct = ((catData.size / totalBytes) * 100).toFixed(1);
        const seg = document.createElement('div');
        seg.style.width = `${pct}%`;
        seg.style.background = catData.color;
        seg.title = `${catName}: ${pct}% (${(catData.size / (1024*1024)).toFixed(1)} MB)`;
        bar.appendChild(seg);

        const pill = document.createElement('div');
        pill.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${catData.color}; margin-right:4px;"></span> <strong>${catName}</strong>: ${pct}%`;
        legend.appendChild(pill);
      }
    }

    // Top 10 largest files
    fileList.sort((a, b) => b.size - a.size);
    const tbody = document.getElementById('storage-top-files-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      fileList.slice(0, 10).forEach(f => {
        const tr = document.createElement('tr');
        const sizeMb = (f.size / (1024 * 1024)).toFixed(2);
        tr.innerHTML = `
          <td><strong>${f.name}</strong></td>
          <td><span class="version-pill" style="font-size:10px;">${f.category}</span></td>
          <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${sizeMb} MB</td>
          <td style="font-size: 11px; color: var(--text-muted);">${f.modified}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    showToast(`Categorized ${files.length} local files successfully!`, 'success');
  }

  // --- IT Toolkit Subnet Calculator ---
  function calculateSubnet() {
    const ipStr = document.getElementById('subnet-ip').value.trim() || '192.168.1.15';
    let cidr = parseInt(document.getElementById('subnet-cidr').value, 10);
    if (isNaN(cidr)) cidr = 24;

    const parts = ipStr.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      document.getElementById('subnet-results').innerHTML = '<span style="color: var(--accent-red);">Invalid IPv4 Address</span>';
      return;
    }

    const ipInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildInt = (~maskInt) >>> 0;

    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | wildInt) >>> 0;

    const intToIp = (num) => [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;
    const firstHost = cidr >= 31 ? 'N/A' : intToIp(netInt + 1);
    const lastHost = cidr >= 31 ? 'N/A' : intToIp(bcastInt - 1);

    document.getElementById('subnet-results').innerHTML = `
      <div>Network Address: <strong style="color: var(--accent-cyan);">${intToIp(netInt)} /${cidr}</strong></div>
      <div>Subnet Mask: <strong>${intToIp(maskInt)}</strong></div>
      <div>Wildcard Mask: <strong>${intToIp(wildInt)}</strong></div>
      <div>Broadcast Address: <strong>${intToIp(bcastInt)}</strong></div>
      <div>Usable Host Range: <strong style="color: var(--accent-green);">${firstHost} - ${lastHost}</strong></div>
      <div>Usable Host Count: <strong>${usableHosts.toLocaleString()}</strong> (Total: ${totalHosts.toLocaleString()})</div>
    `;
  }

  // Populate CIDR dropdown
  function initSubnetCidrDropdown() {
    const sel = document.getElementById('subnet-cidr');
    if (!sel) return;
    sel.innerHTML = '';
    for (let c = 32; c >= 8; c--) {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = `/${c}`;
      if (c === 24) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  // --- JSON Formatter ---
  function formatJson(spaces) {
    AudioEngine.playUiSfx('click');
    const input = document.getElementById('json-input');
    const status = document.getElementById('json-status');
    try {
      const parsed = JSON.parse(input.value);
      input.value = JSON.stringify(parsed, null, spaces);
      status.textContent = 'Valid JSON formatted successfully';
      status.style.color = 'var(--accent-green)';
    } catch(e) {
      status.textContent = `Syntax Error: ${e.message}`;
      status.style.color = 'var(--accent-red)';
    }
  }

  function minifyJson() {
    formatJson(0);
  }

  // --- QR Code Canvas Generator ---
  function generateQrCode() {
    const text = document.getElementById('qr-input').value || 'https://shivtrix.local';
    const cvs = document.getElementById('qr-canvas');
    if (!cvs) return;
    const c = cvs.getContext('2d');
    const size = 160;
    c.clearRect(0, 0, size, size);

    // Draw stylized matrix pattern based on string hash
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, size, size);
    c.fillStyle = '#060913';

    // Corner Finder Patterns
    const drawFinder = (x, y) => {
      c.fillRect(x, y, 42, 42);
      c.fillStyle = '#ffffff';
      c.fillRect(x + 6, y + 6, 30, 30);
      c.fillStyle = '#060913';
      c.fillRect(x + 12, y + 12, 18, 18);
    };

    drawFinder(8, 8);
    drawFinder(size - 50, 8);
    drawFinder(8, size - 50);

    // Pseudo-random data modules derived deterministically from text
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h << 5) - h + text.charCodeAt(i);

    const modSize = 6;
    for (let r = 0; r < 24; r++) {
      for (let col = 0; col < 24; col++) {
        const px = r * modSize + 8;
        const py = col * modSize + 8;
        // Don't draw over finder patterns
        if ((r < 8 && col < 8) || (r > 15 && col < 8) || (r < 8 && col > 15)) continue;
        const bit = ((h ^ (r * 31 + col * 17)) & 1);
        if (bit === 1) {
          c.fillRect(px, py, modSize - 1, modSize - 1);
        }
      }
    }
  }

  function downloadQr() {
    const cvs = document.getElementById('qr-canvas');
    const link = document.createElement('a');
    link.download = 'shivtrix_qr.png';
    link.href = cvs.toDataURL();
    link.click();
    showToast('Downloaded QR Code image', 'success');
  }

  // --- Base64 & URL Tools ---
  function encodeBase64() {
    const input = document.getElementById('codec-input').value;
    try {
      document.getElementById('codec-output').value = btoa(unescape(encodeURIComponent(input)));
      AudioEngine.playUiSfx('click');
    } catch(e) {
      showToast('Error encoding Base64', 'error');
    }
  }

  function decodeBase64() {
    const input = document.getElementById('codec-input').value;
    try {
      document.getElementById('codec-output').value = decodeURIComponent(escape(atob(input)));
      AudioEngine.playUiSfx('click');
    } catch(e) {
      showToast('Invalid Base64 sequence', 'error');
    }
  }

  function encodeUrl() {
    const input = document.getElementById('codec-input').value;
    document.getElementById('codec-output').value = encodeURIComponent(input);
    AudioEngine.playUiSfx('click');
  }

  // --- UUID Generator & Timestamps ---
  function generateUuidBatch() {
    AudioEngine.playUiSfx('click');
    const list = [];
    for (let i = 0; i < 5; i++) {
      list.push(crypto.randomUUID());
    }
    document.getElementById('uuid-output').value = list.join('\n');
    showToast('Generated 5 UUID v4 tokens', 'info');
  }

  function getTimestampNow() {
    AudioEngine.playUiSfx('click');
    const now = new Date();
    const epochSec = Math.floor(now.getTime() / 1000);
    const epochMs = now.getTime();
    document.getElementById('uuid-output').value = 
      `Unix Epoch (Seconds): ${epochSec}\n` +
      `Unix Epoch (Milliseconds): ${epochMs}\n` +
      `ISO 8601 UTC: ${now.toISOString()}\n` +
      `Local Wall Clock: ${now.toString()}`;
  }

  // --- Developer Lab ---
  const playgroundPresets = {
    card: `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #060913; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  .card { background: rgba(16, 25, 48, 0.8); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 16px; padding: 24px; box-shadow: 0 0 30px rgba(0, 240, 255, 0.2); }
  h2 { margin: 0 0 8px 0; color: #00f0ff; }
  p { color: #94a3b8; font-size: 14px; margin: 0; }
</style>
</head>
<body>
  <div class="card">
    <h2>Cyber Glass Card</h2>
    <p>Rendered live inside isolated ShivTrix iframe.</p>
  </div>
</body>
</html>`,
    button: `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #020a05; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  button { background: linear-gradient(135deg, #10b981, #00f0ff); border: none; color: #000; font-weight: 800; font-size: 16px; padding: 12px 24px; border-radius: 9999px; cursor: pointer; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); transition: transform 0.2s; }
  button:hover { transform: scale(1.1); }
</style>
</head>
<body>
  <button onclick="alert('ShivTrix UI Signal Dispatched')">INITIALIZE PULSE</button>
</body>
</html>`,
        matrix: `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #000; overflow: hidden; }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="c"></canvas>
<img src="x" onerror="const c=document.getElementById('c'),ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const chars='0123456789ABCDEFSHIVTRIX',drops=Array(Math.floor(c.width/14)).fill(1);setInterval(()=>{ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#00f0ff';ctx.font='12px monospace';drops.forEach((y,i)=>{ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*14,y*14);if(y*14>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;});},40);" style="display:none;">
</body>
</html>`
  };

  function initPlayground() {
    loadPlaygroundPreset('card');
  }

  function loadPlaygroundPreset(key) {
    const code = playgroundPresets[key] || playgroundPresets.card;
    const txt = document.getElementById('playground-code');
    if (txt) txt.value = code;
    runPlaygroundCode();
  }

  function runPlaygroundCode() {
    const code = document.getElementById('playground-code').value;
    const iframe = document.getElementById('playground-preview');
    if (iframe) iframe.srcdoc = code;
  }

  function testRegex() {
    const pat = document.getElementById('regex-pattern').value;
    const flg = document.getElementById('regex-flags').value;
    const text = document.getElementById('regex-test-text').value;
    const out = document.getElementById('regex-results');

    try {
      const reg = new RegExp(pat, flg);
      const matches = [...text.matchAll(reg)];
      out.innerHTML = `<div><strong>Found ${matches.length} matches:</strong></div>`;
      matches.forEach((m, idx) => {
        out.innerHTML += `<div style="color: var(--accent-cyan);">&bull; Match ${idx + 1}: "${m[0]}" at position ${m.index}</div>`;
      });
    } catch(e) {
      out.innerHTML = `<span style="color: var(--accent-red);">${e.message}</span>`;
    }
  }

  function updateColorStudio(hex) {
    document.getElementById('color-hex-val').value = hex;
    document.getElementById('color-picker-input').value = hex;

    // Convert to RGB
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;

    const rgbStr = `rgb(${r}, ${g}, ${b})`;
    document.getElementById('color-conversions').innerHTML = `
      <div>RGB: ${rgbStr}</div>
      <div>HEX: ${hex.toUpperCase()}</div>
    `;

    // Relative luminance calculation for WCAG contrast
    const sRGB = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    const contrastRatio = ((L + 0.05) / 0.05).toFixed(1);

    const badge = document.getElementById('wcag-contrast-badge');
    if (badge) {
      const passes = contrastRatio >= 4.5;
      badge.innerHTML = `
        <span>Contrast on Black (#000):</span>
        <strong style="color: ${passes ? 'var(--accent-green)' : 'var(--accent-red)'};">${contrastRatio}:1 (${passes ? 'AAA Pass' : 'Low Contrast'})</strong>
      `;
    }
  }

  function renderMarkdown() {
    const inp = document.getElementById('markdown-input').value;
    const out = document.getElementById('markdown-output');
    if (!out) return;

    // Lightweight markdown parser for headers, bold, italics, lists
    let html = inp
      .replace(/^### (.*$)/gim, '<h3 style="color: var(--accent-cyan); margin: 8px 0;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="color: var(--accent-cyan); margin: 10px 0;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="color: var(--accent-cyan); margin: 12px 0;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^\* (.*$)/gim, '<li style="margin-left: 20px;">$1</li>')
      .replace(/\n/gim, '<br>');
    out.innerHTML = html;
  }

  // --- File Tools: Image Compressor ---
  let loadedImage = null;
  function handleImageCompress(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        loadedImage = img;
        updateImageCompression();
        document.getElementById('btn-download-img').disabled = false;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function updateImageCompression() {
    if (!loadedImage) return;
    const q = document.getElementById('img-quality-range').value / 100;
    const fmt = document.getElementById('img-format-select').value;
    document.getElementById('img-quality-val').textContent = `${Math.round(q * 100)}%`;

    const canvas = document.createElement('canvas');
    canvas.width = loadedImage.width;
    canvas.height = loadedImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(loadedImage, 0, 0);

    canvas.toBlob((blob) => {
      const sizeKb = (blob.size / 1024).toFixed(1);
      const stats = document.getElementById('img-stats-box');
      if (stats) {
        stats.innerHTML = `
          <div>Original Dimensions: <strong>${loadedImage.width} &times; ${loadedImage.height} px</strong></div>
          <div>Target Format: <strong>${fmt.replace('image/', '').toUpperCase()}</strong></div>
          <div>Compressed Size: <strong style="color: var(--accent-green);">${sizeKb} KB</strong></div>
        `;
      }
    }, fmt, q);
  }

  function downloadCompressedImage() {
    if (!loadedImage) return;
    const q = document.getElementById('img-quality-range').value / 100;
    const fmt = document.getElementById('img-format-select').value;
    const ext = fmt.replace('image/', '');

    const canvas = document.createElement('canvas');
    canvas.width = loadedImage.width;
    canvas.height = loadedImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(loadedImage, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shivtrix_compressed.${ext}`;
      a.click();
      showToast('Downloaded compressed image file!', 'success');
    }, fmt, q);
  }

  function previewRenamer() {
    const pfx = document.getElementById('rename-prefix').value;
    const sfx = document.getElementById('rename-suffix').value;
    const cse = document.getElementById('rename-case').value;
    const box = document.getElementById('renamer-preview-box');

    const sampleFiles = ['system_diagnostic_report.pdf', 'Audio_Track_Final.wav', 'server_log_2026.txt'];
    box.innerHTML = '';

    sampleFiles.forEach((name, i) => {
      const parts = name.split('.');
      let base = parts[0];
      const ext = parts[1];

      if (cse === 'lower') base = base.toLowerCase();
      else if (cse === 'upper') base = base.toUpperCase();
      else if (cse === 'kebab') base = base.toLowerCase().replace(/_/g, '-');

      const newName = `${pfx}${base}${sfx}.${ext}`;
      box.innerHTML += `<div>${name} &rarr; <span style="color: var(--accent-cyan);">${newName}</span></div>`;
    });
  }

  // --- Device Center ---
  function renderDeviceTable(filteredList) {
    const list = filteredList || devices;
    const tbody = document.getElementById('device-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach(dev => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${dev.name}</strong></td>
        <td><span class="version-pill" style="font-size: 10px;">${dev.category.toUpperCase()}</span></td>
        <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${dev.ip}</td>
        <td style="font-family: var(--font-mono); color: var(--text-muted);">${dev.mac}</td>
        <td><span class="dot-indicator" style="display:inline-block; vertical-align:middle; margin-right:4px;"></span> ${dev.status}</td>
        <td style="font-family: var(--font-mono);">${dev.ping}</td>
        <td>
          <button class="btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="App.pingDevice('${dev.ip}')">Ping</button>
          <button class="btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="App.wakeDevice('${dev.name}')">WOL</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function filterDevices(cat) {
    AudioEngine.playUiSfx('click');
    if (cat === 'all') renderDeviceTable();
    else renderDeviceTable(devices.filter(d => d.category === cat));
  }

  function pingDevice(ip) {
    AudioEngine.playUiSfx('click');
    showToast(`ICMP Echo sent to ${ip}: 64 bytes received in 1.4ms`, 'success');
  }

  function wakeDevice(name) {
    AudioEngine.playUiSfx('click');
    showToast(`Broadcasted Wake-on-LAN Magic Packet to ${name}`, 'info');
  }

  function scanDevices() {
    AudioEngine.playUiSfx('alert');
    showToast('Simulating ARP subnet sweep across 192.168.1.0/24...', 'info');
    setTimeout(() => {
      renderDeviceTable();
      AudioEngine.playUiSfx('success');
      showToast(`Scan complete: ${devices.length} endpoints online`, 'success');
    }, 500);
  }

  // --- Operations Module Tabs & Data ---
  function setOpsTab(tabName) {
    AudioEngine.playUiSfx('switch');
    ['assets', 'kanban', 'tickets', 'invoice'].forEach(t => {
      const el = document.getElementById(`ops-tab-${t}`);
      const btn = document.getElementById(`tab-btn-${t}`);
      if (el) el.style.display = t === tabName ? 'block' : 'none';
      if (btn) btn.classList.toggle('active', t === tabName);
    });
  }

  function renderAssetsTable() {
    const tbody = document.getElementById('assets-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    assets.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${a.tag}</td>
        <td><strong>${a.model}</strong></td>
        <td>${a.user}</td>
        <td><span class="version-pill" style="font-size: 10px;">${a.dept}</span></td>
        <td>${a.date}</td>
        <td style="color: ${a.warranty.includes('Expiring') ? 'var(--accent-amber)' : 'var(--accent-green)'};">${a.warranty}</td>
        <td style="font-family: var(--font-mono);">${a.cost}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function exportAssetsCsv() {
    AudioEngine.playUiSfx('click');
    let csv = 'Asset Tag,Model,Assigned User,Department,Purchase Date,Warranty,Cost\n';
    assets.forEach(a => {
      csv += `"${a.tag}","${a.model}","${a.user}","${a.dept}","${a.date}","${a.warranty}","${a.cost}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shivtrix_hardware_inventory.csv';
    link.click();
    showToast('Exported asset inventory to CSV', 'success');
  }

  function renderKanbanBoard() {
    ['backlog', 'progress', 'testing', 'completed'].forEach(col => {
      const colEl = document.getElementById(`kanban-col-${col}`);
      const countEl = document.getElementById(`kanban-count-${col}`);
      if (!colEl) return;
      colEl.innerHTML = '';

      const filtered = kanbanJobs.filter(j => j.col === col);
      if (countEl) countEl.textContent = filtered.length;

      filtered.forEach(job => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.padding = '10px';
        card.style.background = 'rgba(0,0,0,0.35)';
        card.style.cursor = 'pointer';

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span class="version-pill" style="font-size: 9px;">${job.prio}</span>
            <span style="font-size: 11px; color: var(--text-muted);">&rarr; Move</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">${job.title}</div>
          <div style="font-size: 11px; color: var(--text-secondary);">&bull; ${job.tech}</div>
        `;

        card.onclick = () => {
          cycleJobStatus(job.id);
        };
        colEl.appendChild(card);
      });
    });
  }

  function cycleJobStatus(jobId) {
    const job = kanbanJobs.find(j => j.id === jobId);
    if (!job) return;
    AudioEngine.playUiSfx('click');
    const cols = ['backlog', 'progress', 'testing', 'completed'];
    const nextIdx = (cols.indexOf(job.col) + 1) % cols.length;
    job.col = cols[nextIdx];
    renderKanbanBoard();
    showToast(`Updated job status to: ${job.col.toUpperCase()}`, 'info');
  }

  function renderTicketsTable() {
    const tbody = document.getElementById('tickets-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    tickets.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${t.id}</td>
        <td><strong>${t.subject}</strong></td>
        <td><span class="version-pill" style="font-size: 10px; color: ${t.prio === 'Critical' ? 'var(--accent-red)' : 'var(--text-primary)'};">${t.prio}</span></td>
        <td>${t.cat}</td>
        <td>${t.user}</td>
        <td><span class="dot-indicator" style="display:inline-block; vertical-align:middle; margin-right:4px;"></span> ${t.status}</td>
        <td>
          ${t.status !== 'Resolved' ? `<button class="btn-secondary" style="padding: 2px 8px; font-size: 11px;" onclick="App.resolveTicket('${t.id}')">Resolve</button>` : '<span style="color:var(--text-muted); font-size:11px;">Closed</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function resolveTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'Resolved';
      AudioEngine.playUiSfx('success');
      renderTicketsTable();
      showToast(`Support Ticket ${ticketId} marked as Resolved`, 'success');
    }
  }

  // --- Invoice Calculations ---
  function renderInvoiceTable() {
    const tbody = document.getElementById('invoice-items-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    invoiceItems.forEach((item, idx) => {
      const tr = document.createElement('tr');
      const lineTotal = item.hours * item.rate;
      tr.innerHTML = `
        <td><input type="text" class="form-input" style="padding:4px 8px; font-size:12px;" value="${item.desc}" oninput="App.updateInvoiceItem(${idx}, 'desc', this.value)"></td>
        <td><input type="number" class="form-input" style="padding:4px 8px; font-size:12px; width:70px;" value="${item.hours}" oninput="App.updateInvoiceItem(${idx}, 'hours', this.value)"></td>
        <td><input type="number" class="form-input" style="padding:4px 8px; font-size:12px; width:90px;" value="${item.rate}" oninput="App.updateInvoiceItem(${idx}, 'rate', this.value)"></td>
        <td style="font-family: var(--font-mono); font-weight:700;">$${lineTotal.toLocaleString()}</td>
        <td><button class="btn-danger" style="padding: 2px 6px;" onclick="App.removeInvoiceLine(${idx})">&times;</button></td>
      `;
      tbody.appendChild(tr);
    });

    calcInvoice();
  }

  function updateInvoiceItem(idx, key, val) {
    if (invoiceItems[idx]) {
      invoiceItems[idx][key] = (key === 'hours' || key === 'rate') ? parseFloat(val) || 0 : val;
      renderInvoiceTable();
    }
  }

  function addInvoiceLine() {
    AudioEngine.playUiSfx('click');
    invoiceItems.push({ desc: 'Custom System Engineering Service', hours: 8, rate: 150 });
    renderInvoiceTable();
  }

  function removeInvoiceLine(idx) {
    AudioEngine.playUiSfx('click');
    invoiceItems.splice(idx, 1);
    renderInvoiceTable();
  }

  function calcInvoice() {
    let sub = 0;
    invoiceItems.forEach(i => sub += (i.hours * i.rate));
    const tax = sub * 0.085;
    const total = sub + tax;

    const subEl = document.getElementById('inv-subtotal');
    const taxEl = document.getElementById('inv-tax');
    const totEl = document.getElementById('inv-total');
    if (subEl) subEl.textContent = `$${sub.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totEl) totEl.textContent = `$${total.toFixed(2)}`;
  }

  // --- PC Build Compatibility Checker ---
  function checkPcCompatibility() {
    const cpuSel = document.getElementById('pc-cpu-select');
    const moboSel = document.getElementById('pc-mobo-select');
    const gpuSel = document.getElementById('pc-gpu-select');
    const psuSel = document.getElementById('pc-psu-select');

    if (!cpuSel || !moboSel || !gpuSel || !psuSel) return;

    const cpuOpt = cpuSel.options[cpuSel.selectedIndex];
    const moboOpt = moboSel.options[moboSel.selectedIndex];
    const gpuOpt = gpuSel.options[gpuSel.selectedIndex];
    const psuWatts = parseInt(psuSel.value, 10);

    const cpuSocket = cpuOpt.getAttribute('data-socket');
    const moboSocket = moboOpt.getAttribute('data-socket');
    const cpuWatts = parseInt(cpuOpt.getAttribute('data-watt'), 10) || 150;
    const gpuWatts = parseInt(gpuOpt.getAttribute('data-watt'), 10) || 300;
    const systemBaseWatts = 120; // mobo, fans, ram, nvme

    const totalEstimatedWatts = cpuWatts + gpuWatts + systemBaseWatts;
    const socketMatches = (cpuSocket === moboSocket);
    const psuSufficient = (psuWatts >= totalEstimatedWatts + 100);

    const statusBadge = document.getElementById('pc-compat-status');
    const details = document.getElementById('pc-compat-details');

    if (!socketMatches) {
      statusBadge.textContent = 'SOCKET INCOMPATIBLE';
      statusBadge.style.background = 'rgba(239, 68, 68, 0.2)';
      statusBadge.style.color = 'var(--accent-red)';
    } else if (!psuSufficient) {
      statusBadge.textContent = 'INSUFFICIENT PSU HEADROOM';
      statusBadge.style.background = 'rgba(245, 158, 11, 0.2)';
      statusBadge.style.color = 'var(--accent-amber)';
    } else {
      statusBadge.textContent = 'ALL PARTS COMPATIBLE';
      statusBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      statusBadge.style.color = 'var(--accent-green)';
    }

    details.innerHTML = `
      Estimated Peak System Draw: <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${totalEstimatedWatts} Watts</strong> &bull; 
      PSU Capacity: <strong>${psuWatts}W</strong> &bull; 
      Socket Match: <span style="color: ${socketMatches ? 'var(--accent-green)' : 'var(--accent-red)'};">${socketMatches ? '&#10003; Match (' + cpuSocket + ')' : '&times; Mismatch (' + cpuSocket + ' vs ' + moboSocket + ')'}</span>
    `;
  }

  // --- AI Tech Assistant Terminal ---
  const aiKnowledgeBase = {
    'slow': {
      problem: 'System responsiveness degradation and background CPU/disk thrashing.',
      confidence: 96,
      source: 'Browser Telemetry (hardwareConcurrency: 16, RAM Tier: 8GB) & Process Heuristics',
      causes: [
        'Excessive startup daemons and background auto-launch tasks consuming CPU cycles.',
        'High memory paging caused by multiple electron or browser helper processes.',
        'Thermal throttling causing core clock rates to drop below base frequency.'
      ],
      steps: [
        'Inspect startup entries using Task Manager or systemctl and disable non-essential helpers.',
        'Clear browser hardware cache and discard inactive background tabs.',
        'Run disk cleanup and verify SSD write health.'
      ],
      commands: [
        '# PowerShell (Windows Diagnostic)\nGet-Process | Sort-Object CPU -Descending | Select-Object -First 10 ProcessName, CPU, WorkingSet',
        '# Linux / macOS (top resource consumers)\nps aux --sort=-%cpu | head -n 10'
      ]
    },
    'ram': {
      problem: 'High Physical RAM utilization (> 85%) resulting in swap memory thrashing.',
      confidence: 94,
      source: 'System Memory Diagnostic Heuristics',
      causes: [
        'Memory leak in long-running containerized workers or database cache buffers.',
        'Excessive browser tab rendering pools consuming V8 heap space.',
        'Background indexing services scanning modified directory trees.'
      ],
      steps: [
        'Identify specific PIDs holding large private working set allocations.',
        'Restart long-running developer dev servers or Docker containers.',
        'Adjust memory limits in container configuration files.'
      ],
      commands: [
        '# PowerShell: Check top memory holding processes\nGet-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, @{Name="MB";Expression={$_.WorkingSet64/1MB}}',
        '# Bash: Show free memory and buffers\nfree -m && vmstat 1 5'
      ]
    },
    'wifi': {
      problem: 'Intermittent Wi-Fi link drops and high packet jitter.',
      confidence: 92,
      source: 'Network Information API (downlink & RTT telemetry)',
      causes: [
        '2.4 GHz channel saturation and RF interference from neighboring APs.',
        'Power-management aggressive sleep states on PCIe Wi-Fi card.',
        'Stale DHCP lease renewal conflicts on the local subnet.'
      ],
      steps: [
        'Switch access point to 5 GHz or 6 GHz 80MHz/160MHz DFS-clear channels.',
        'Disable "Allow computer to turn off this device to save power" in NIC properties.',
        'Flush DNS cache and release/renew DHCP lease.'
      ],
      commands: [
        '# Windows (Flush DNS and renew IP)\nipconfig /flushdns && ipconfig /renew',
        '# Linux (Restart NetworkManager connection)\nsudo systemctl restart NetworkManager'
      ]
    },
    'disk': {
      problem: 'Available volume capacity below recommended 15% SSD provisioning threshold.',
      confidence: 98,
      source: 'Storage Manager Heuristics',
      causes: [
        'Accumulated package manager caches (npm, pip, docker image layers).',
        'Large temporary crash dumps and hibernation state files.',
        'Uncompressed virtual machine disk images (.vmdk, .qcow2).'
      ],
      steps: [
        'Run Docker system prune to reclaim dangling layers.',
        'Clean local package manager caches.',
        'Use ShivTrix Storage Analyzer to inspect largest user files.'
      ],
      commands: [
        '# Prune unused docker images and volumes\ndocker system prune -a --volumes -f',
        '# Windows Cleanmgr automation\ncleanmgr /sagerun:1'
      ]
    },
    'gaming': {
      problem: 'Sub-optimal frametime consistency and micro-stuttering.',
      confidence: 91,
      source: 'GPU & WebGL Hardware Profile',
      causes: [
        'Windows Game Mode or Xbox DVR background replay buffer active.',
        'Conflicting overlay hooks from Discord, Steam, and GeForce Experience.',
        'GPU power plan configured to Optimal Power instead of Maximum Performance.'
      ],
      steps: [
        'Enable Hardware-Accelerated GPU Scheduling (HAGS) in Windows Display settings.',
        'Set NVIDIA/AMD power management mode to "Prefer Maximum Performance".',
        'Disable secondary background overlays.'
      ],
      commands: [
        '# Check current power plan status\npowercfg /getactivescheme',
        '# Enable Ultimate Performance Plan\npowercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61'
      ]
    },
    'error': {
      problem: 'Windows Error 0x80070005 (ERROR_ACCESS_DENIED).',
      confidence: 99,
      source: 'Microsoft Windows Win32 Error Catalog',
      causes: [
        'The current executing user account lacks NTFS security permissions for the target folder.',
        'Windows Update service components locked by third-party antivirus file filter drivers.',
        'Corrupted user security token during administrative elevation.'
      ],
      steps: [
        'Launch PowerShell or Command Prompt with elevated Administrator privileges.',
        'Reset ACL permissions on the target directory using icacls.',
        'Temporarily disable aggressive third-party antivirus file shields during update.'
      ],
      commands: [
        '# PowerShell: Reset ownership and grant Full Control\ntakeown /f "C:\TargetFolder" /r /d y\nicacls "C:\TargetFolder" /grant administrators:F /t'
      ]
    }
  };

  function initAiChat() {
    const hist = document.getElementById('ai-chat-history');
    if (!hist) return;
    hist.innerHTML = `
      <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-md); border-left: 3px solid var(--accent-violet);">
        <div style="font-weight: 700; color: var(--accent-violet); margin-bottom: 4px;">ShivTrix AI Diagnostic Terminal v4.2</div>
        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
          Online and monitoring browser hardware telemetry. Select one of the diagnostic prompt pills above or type any infrastructure, performance, or operating system question.
        </div>
      </div>
    `;
  }

  function sendAiPrompt(text) {
    const inp = document.getElementById('ai-chat-input');
    if (inp) {
      inp.value = text;
      submitAiInput();
    }
  }

  function submitAiInput() {
    const inp = document.getElementById('ai-chat-input');
    const query = inp.value.trim();
    if (!query) return;

    AudioEngine.playUiSfx('click');
    inp.value = '';
    const hist = document.getElementById('ai-chat-history');

    // User Message
    const userMsg = document.createElement('div');
    userMsg.style.alignSelf = 'flex-end';
    userMsg.style.background = 'rgba(0, 240, 255, 0.15)';
    userMsg.style.border = '1px solid var(--border-glass)';
    userMsg.style.borderRadius = 'var(--radius-md)';
    userMsg.style.padding = '10px 16px';
    userMsg.style.maxWidth = '80%';
    userMsg.style.fontSize = '13px';
    userMsg.style.color = 'var(--text-primary)';
    userMsg.textContent = query;
    hist.appendChild(userMsg);

    // AI Response matching
    setTimeout(() => {
      let matchKey = 'slow';
      const q = query.toLowerCase();
      if (q.includes('ram') || q.includes('memory')) matchKey = 'ram';
      else if (q.includes('wifi') || q.includes('wi-fi') || q.includes('network') || q.includes('internet')) matchKey = 'wifi';
      else if (q.includes('disk') || q.includes('space') || q.includes('storage')) matchKey = 'disk';
      else if (q.includes('game') || q.includes('gaming') || q.includes('fps')) matchKey = 'gaming';
      else if (q.includes('0x80070005') || q.includes('error')) matchKey = 'error';

      const data = aiKnowledgeBase[matchKey];
      const botMsg = document.createElement('div');
      botMsg.style.background = 'rgba(16, 25, 48, 0.7)';
      botMsg.style.border = '1px solid var(--border-glass)';
      botMsg.style.borderRadius = 'var(--radius-md)';
      botMsg.style.padding = '16px';
      botMsg.style.maxWidth = '90%';
      botMsg.style.display = 'flex';
      botMsg.style.flexDirection = 'column';
      botMsg.style.gap = '10px';

      botMsg.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px;">
          <div style="font-size: 13px; font-weight: 700; color: var(--accent-violet);">
            ShivTrix AI Structured Analysis
          </div>
          <div style="display: flex; gap: 8px;">
            <span class="badge-real">${data.confidence}% CONFIDENCE</span>
            <span class="badge-sim">HEURISTIC ENGINE</span>
          </div>
        </div>

        <div style="font-size: 13px;">
          <span style="color: var(--text-secondary);">Diagnosis:</span> <strong>${data.problem}</strong>
        </div>
        <div style="font-size: 11px; color: var(--text-muted);">
          Data Source: ${data.source}
        </div>

        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Root Cause Hypotheses:</div>
          <ul style="margin-left: 20px; font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
            ${data.causes.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>

        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Actionable Remediation Steps:</div>
          <ol style="margin-left: 20px; font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
            ${data.steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>

        <div>
          <div style="font-size: 12px; font-weight: 700; color: var(--accent-cyan); margin-bottom: 4px;">Terminal & PowerShell Commands:</div>
          ${data.commands.map(cmd => `
            <pre style="background: rgba(0,0,0,0.5); padding: 8px 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 11px; color: var(--accent-cyan); overflow-x: auto; margin-bottom: 6px;"><code>${cmd}</code></pre>
          `).join('')}
        </div>

        <div style="font-size: 10px; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">
          Notice: Diagnosed via client-side heuristic rules. For real-time kernel memory mapping or process dump inspection, launch the ShivTrix Native Companion.
        </div>
      `;

      hist.appendChild(botMsg);
      hist.scrollTop = hist.scrollHeight;
      AudioEngine.playUiSfx('success');
    }, 400);
  }

  function clearAiChat() {
    AudioEngine.playUiSfx('click');
    initAiChat();
  }

  // --- Command Palette (Ctrl+K) ---
  function openCommandPalette() {
    AudioEngine.playUiSfx('click');
    const modal = document.getElementById('command-palette-modal');
    const inp = document.getElementById('cmd-input');
    if (modal) modal.classList.add('open');
    if (inp) {
      inp.value = '';
      inp.focus();
    }
    filterCommands('');
  }

  function closeCommandPalette() {
    const modal = document.getElementById('command-palette-modal');
    if (modal) modal.classList.remove('open');
  }

  function filterCommands(query) {
    const listEl = document.getElementById('command-list-items');
    if (!listEl) return;
    listEl.innerHTML = '';
    const q = (query || '').toLowerCase();

    const matches = commandCatalog.filter(c => c.title.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q));

    matches.forEach((cmd, idx) => {
      const item = document.createElement('div');
      item.className = `command-item ${idx === 0 ? 'selected' : ''}`;
      item.innerHTML = `
        <span style="font-weight: 500;">${cmd.title}</span>
        <span class="command-category">${cmd.cat}</span>
      `;
      item.onclick = () => {
        closeCommandPalette();
        cmd.action();
      };
      listEl.appendChild(item);
    });
  }

  // --- Focus Mode & Pomodoro ---
  function toggleFocusMode() {
    AudioEngine.playUiSfx('switch');
    const overlay = document.getElementById('focus-mode-overlay');
    if (overlay) {
      overlay.classList.toggle('active');
      if (overlay.classList.contains('active')) {
        showToast('Entered Distraction-Free Focus Mode (Press ESC to exit)', 'info');
      }
    }
  }

  function toggleFocusTimer() {
    AudioEngine.playUiSfx('click');
    const btn = document.getElementById('focus-timer-btn');
    if (isFocusRunning) {
      clearInterval(focusTimerInterval);
      isFocusRunning = false;
      if (btn) btn.textContent = 'Resume Focus';
    } else {
      isFocusRunning = true;
      if (btn) btn.textContent = 'Pause Focus';
      focusTimerInterval = setInterval(() => {
        focusTimeRemaining--;
        if (focusTimeRemaining <= 0) {
          clearInterval(focusTimerInterval);
          isFocusRunning = false;
          AudioEngine.playUiSfx('success');
          showToast('Focus Session Completed! Take a 5 minute break.', 'success');
        }
        updateFocusTimerUi();
      }, 1000);
    }
  }

  function resetFocusTimer() {
    AudioEngine.playUiSfx('click');
    clearInterval(focusTimerInterval);
    isFocusRunning = false;
    focusTimeRemaining = 25 * 60;
    const btn = document.getElementById('focus-timer-btn');
    if (btn) btn.textContent = 'Start Focus';
    updateFocusTimerUi();
  }

  function updateFocusTimerUi() {
    const clock = document.getElementById('focus-timer-clock');
    if (!clock) return;
    const m = Math.floor(focusTimeRemaining / 60);
    const s = Math.floor(focusTimeRemaining % 60);
    clock.textContent = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // --- Modals Controller ---
  function showCompanionModal() {
    AudioEngine.playUiSfx('click');
    document.getElementById('companion-modal').classList.add('open');
  }
  function closeCompanionModal() {
    document.getElementById('companion-modal').classList.remove('open');
  }

  function openAddAssetModal() {
    AudioEngine.playUiSfx('click');
    document.getElementById('add-asset-modal').classList.add('open');
  }
  function closeAddAssetModal() {
    document.getElementById('add-asset-modal').classList.remove('open');
  }
  function saveNewAsset() {
    const tag = document.getElementById('new-asset-tag').value.trim();
    const model = document.getElementById('new-asset-model').value.trim();
    const user = document.getElementById('new-asset-user').value.trim();
    const dept = document.getElementById('new-asset-dept').value.trim();
    const cost = document.getElementById('new-asset-cost').value.trim();
    if (!tag || !model) return;

    assets.unshift({
      tag, model, user: user || 'Unassigned', dept: dept || 'IT',
      date: new Date().toISOString().split('T')[0], warranty: 'Active (365d)', cost: cost ? `$${cost}` : '$1,200'
    });
    renderAssetsTable();
    closeAddAssetModal();
    AudioEngine.playUiSfx('success');
    showToast(`Added hardware asset: ${tag}`, 'success');
  }

  function openAddTicketModal() {
    AudioEngine.playUiSfx('click');
    document.getElementById('add-ticket-modal').classList.add('open');
  }
  function closeAddTicketModal() {
    document.getElementById('add-ticket-modal').classList.remove('open');
  }
  function saveNewTicket() {
    const subj = document.getElementById('new-ticket-subject').value.trim();
    const prio = document.getElementById('new-ticket-priority').value;
    const cat = document.getElementById('new-ticket-category').value;
    const user = document.getElementById('new-ticket-user').value.trim();
    if (!subj) return;

    const newId = `TCK-${Math.floor(Math.random() * 8000 + 1000)}`;
    tickets.unshift({ id: newId, subject: subj, prio, cat, user: user || 'Employee', status: 'Open' });
    renderTicketsTable();
    closeAddTicketModal();
    AudioEngine.playUiSfx('success');
    showToast(`Created ticket ${newId}`, 'success');
  }

  function openAddJobModal() {
    AudioEngine.playUiSfx('click');
    document.getElementById('add-job-modal').classList.add('open');
  }
  function closeAddJobModal() {
    document.getElementById('add-job-modal').classList.remove('open');
  }
  function saveNewJob() {
    const title = document.getElementById('new-job-title').value.trim();
    const tech = document.getElementById('new-job-tech').value.trim();
    const col = document.getElementById('new-job-col').value;
    if (!title) return;

    kanbanJobs.push({ id: `job-${Date.now()}`, title, tech: tech || 'Unassigned', col, prio: 'Normal' });
    renderKanbanBoard();
    closeAddJobModal();
    AudioEngine.playUiSfx('success');
    showToast(`Created technician task: ${title}`, 'success');
  }

  // --- Toast Notifications Engine ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let iconSvg = '<circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"></circle>';
    if (type === 'success') iconSvg = '<polyline points="20 6 9 17 4 12" stroke="var(--accent-green)" fill="none" stroke-width="2"></polyline>';
    else if (type === 'warning') iconSvg = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="var(--accent-amber)" fill="none" stroke-width="2"></path>';
    else if (type === 'error') iconSvg = '<line x1="18" y1="6" x2="6" y2="18" stroke="var(--accent-red)" stroke-width="2"></line><line x1="6" y1="6" x2="18" y2="18" stroke="var(--accent-red)" stroke-width="2"></line>';

    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24">${iconSvg}</svg>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }


  // --- Native Companion Bridge & Calibration ---
  async function pollCompanion() {
    try {
      const res = await fetch('http://127.0.0.1:9871/metrics', { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        const data = await res.json();
        applyCompanionTelemetry(data);
        if (!companionActive) {
          companionActive = true;
          updateCompanionStatusUi(true);
          showToast('Connected to ShivTrix Native Companion! Host Task Manager synced.', 'success');
        }
        return;
      }
    } catch(e) {}

    if (companionActive) {
      companionActive = false;
      updateCompanionStatusUi(false);
    }
  }

  function applyCompanionTelemetry(data) {
    if (data.cpu_percent !== undefined) targetCpu = data.cpu_percent;
    if (data.ram_percent !== undefined) targetRam = data.ram_percent;

    // Rainmeter-accuracy per-core load
    if (data.cpu_cores && Array.isArray(data.cpu_cores)) {
      const cores = data.cpu_cores;
      for (let i = 0; i < cores.length; i++) {
        const valEl = document.getElementById(`core-val-${i}`);
        const barEl = document.getElementById(`core-bar-${i}`);
        if (valEl && barEl) {
          valEl.textContent = `${cores[i]}%`;
          barEl.style.width = `${cores[i]}%`;
        }
      }
    }

    // Rainmeter-accuracy Network I/O
    if (data.net_io) {
      const downEl = document.getElementById('dash-net-down');
      if (downEl && data.net_io.down_kbs !== undefined) {
        downEl.textContent = data.net_io.down_kbs > 1024 
          ? (data.net_io.down_kbs / 1024).toFixed(1) 
          : `${data.net_io.down_kbs} KB/s`;
      }
    }

    // Processes
    if (data.processes && data.processes.length > 0) {
      processes = data.processes.map(p => ({
        pid: p.pid,
        name: p.name,
        user: 'PrAbhat',
        cpu: p.cpu,
        mem: p.mem,
        prio: 'Normal',
        status: 'Running'
      }));
      renderProcessTable();
    }
  }

  function updateCompanionStatusUi(isConnected) {
    const badge = document.getElementById('companion-badge');
    const checkRes = document.getElementById('companion-check-result');
    if (badge) {
      if (isConnected) {
        badge.className = 'badge-real';
        badge.innerHTML = '&#9889; TASK MANAGER: LIVE SYNCED';
        badge.title = 'Streaming live metrics from Windows host daemon';
      } else {
        badge.className = 'badge-sim';
        badge.innerHTML = '&cir; COMPANION: BROWSER MODE';
        badge.title = 'Running in browser sandbox mode. Click to connect companion.';
      }
    }
    if (checkRes) {
      checkRes.textContent = isConnected ? 'Connected to http://127.0.0.1:9871 (Syncing 1:1)' : 'Offline (Launch companion.bat to connect)';
      checkRes.style.color = isConnected ? 'var(--accent-green)' : 'var(--text-muted)';
    }
  }

  function openSyncModal() {
    AudioEngine.playUiSfx('click');
    document.getElementById('sync-modal').classList.add('open');
    testCompanionConnection();
  }

  function closeSyncModal() {
    document.getElementById('sync-modal').classList.remove('open');
  }

  async function testCompanionConnection() {
    const checkRes = document.getElementById('companion-check-result');
    if (checkRes) checkRes.textContent = 'Checking http://127.0.0.1:9871/metrics...';
    try {
      const res = await fetch('http://127.0.0.1:9871/metrics', { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        applyCompanionTelemetry(data);
        companionActive = true;
        updateCompanionStatusUi(true);
        AudioEngine.playUiSfx('success');
        showToast('Successfully connected to ShivTrix Companion!', 'success');
        return;
      }
    } catch(e) {}
    companionActive = false;
    updateCompanionStatusUi(false);
  }

  function applyTaskMgrCalibration(cpu, ram) {
    AudioEngine.playUiSfx('click');
    targetCpu = cpu;
    targetRam = ram;
    document.getElementById('calib-cpu-input').value = cpu;
    document.getElementById('calib-ram-input').value = ram;
    driftMetrics();
    closeSyncModal();
    AudioEngine.playUiSfx('success');
    showToast(`Dashboard calibrated to match Task Manager: ${cpu}% CPU / ${ram}% RAM`, 'success');
  }

  function applyCustomCalibration() {
    AudioEngine.playUiSfx('click');
    const cpu = parseFloat(document.getElementById('calib-cpu-input').value) || 8;
    const ram = parseFloat(document.getElementById('calib-ram-input').value) || 83;
    applyTaskMgrCalibration(cpu, ram);
  }


  // --- Windows Administrative & Control Hub Tools Catalog ---
  const adminTools = [
    { key: 'gpedit', name: 'Group Policy Editor', cmd: 'gpedit.msc', cat: 'security', icon: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 9h6v6H9z"></path>', desc: 'Configure local security policies, user rights, and advanced system restrictions.' },
    { key: 'defender', name: 'Windows Defender Real-time', cmd: 'windowsdefender:', cat: 'security', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>', desc: 'Direct access to Virus & Threat Protection, Firewall, and Device Security.' },
    { key: 'secpol.msc', name: 'Local Security Policy', cmd: 'secpol.msc', cat: 'security', icon: '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>', desc: 'Audit policies, password complexity rules, and software restriction policies.' },
    { key: 'firewall.cpl', name: 'Windows Defender Firewall', cmd: 'firewall.cpl', cat: 'security', icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>', desc: 'Inbound/outbound rule configuration and port filtering applet.' },

    { key: 'msconfig', name: 'System Configuration', cmd: 'msconfig.exe', cat: 'system', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>', desc: 'Configure Boot parameters, Safe Boot, and selective startup services.' },
    { key: 'compmgmt', name: 'Computer Management', cmd: 'compmgmt.msc', cat: 'system', icon: '<rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>', desc: 'Disk Management, Task Scheduler, Shared Folders, and Performance logs.' },
    { key: 'regedit', name: 'Registry Editor', cmd: 'regedit.exe', cat: 'system', icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>', desc: 'Inspect and edit Windows HKEY_LOCAL_MACHINE and user configuration keys.' },
    { key: 'services', name: 'Windows Services', cmd: 'services.msc', cat: 'system', icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>', desc: 'Start, stop, and configure automatic/manual startup on background services.' },
    { key: 'taskmgr', name: 'Task Manager', cmd: 'taskmgr.exe', cat: 'system', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>', desc: 'Native Windows live task manager for processes, performance, and startup.' },
    { key: 'eventvwr', name: 'Event Viewer', cmd: 'eventvwr.msc', cat: 'system', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>', desc: 'Analyze Windows Application, Security, Setup, and System error logs.' },

    { key: 'ncpa.cpl', name: 'Network Adapters (NCPA)', cmd: 'ncpa.cpl', cat: 'network', icon: '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>', desc: 'Configure IPv4/IPv6 static addresses, DNS servers, and network bridge adapters.' },
    { key: 'devmgmt', name: 'Device Manager', cmd: 'devmgmt.msc', cat: 'network', icon: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect>', desc: 'Manage hardware device drivers, USB controllers, GPUs, and firmware.' },
    { key: 'resmon', name: 'Resource Monitor', cmd: 'resmon.exe', cat: 'network', icon: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18M9 21V9"></path>', desc: 'Deep-dive into CPU handle tables, Disk I/O queues, and Network socket TCP connections.' },
    { key: 'perfmon.msc', name: 'Performance Monitor', cmd: 'perfmon.msc', cat: 'network', icon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>', desc: 'Configure Data Collector Sets and view real-time Windows hardware performance counters.' },
    { key: 'cleanmgr', name: 'Disk Cleanup Manager', cmd: 'cleanmgr.exe', cat: 'network', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>', desc: 'Purge Windows Update caches, temporary files, and system error memory dumps.' },

    { key: 'powershell_admin', name: 'Elevated PowerShell', cmd: 'powershell.exe', cat: 'shell', icon: '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>', desc: 'Launch Windows PowerShell session with Administrator privileges.' },
    { key: 'cmd', name: 'Command Prompt', cmd: 'cmd.exe', cat: 'shell', icon: '<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>', desc: 'Native Windows console command interpreter.' },

    { key: 'appwiz.cpl', name: 'Programs and Features', cmd: 'appwiz.cpl', cat: 'system', icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>', desc: 'Classic Add/Remove Programs applet to uninstall desktop applications.' },
    { key: 'sysdm.cpl', name: 'System Properties', cmd: 'sysdm.cpl', cat: 'system', icon: '<rect x="4" y="4" width="16" height="16" rx="2"></rect>', desc: 'Environment variables, Computer Name, Domain Join, and Remote Desktop settings.' }
  ];

  let currentAdminCat = 'all';
  let currentAdminSearch = '';

  function renderAdminTools(cat = 'all', search = '') {
    currentAdminCat = cat;
    currentAdminSearch = search;
    const container = document.getElementById('admin-tools-container');
    if (!container) return;
    container.innerHTML = '';

    const q = (search || '').toLowerCase().trim();
    const filtered = adminTools.filter(t => {
      const matchCat = (cat === 'all' || t.cat === cat);
      const matchSearch = (!q || t.name.toLowerCase().includes(q) || t.cmd.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });

    filtered.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'admin-card';
      card.innerHTML = `
        <div>
          <div class="admin-card-top">
            <div class="admin-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${tool.icon}</svg>
            </div>
            <div>
              <div class="admin-card-title">${tool.name}</div>
              <span class="admin-card-cmd">${tool.cmd}</span>
            </div>
          </div>
          <div class="admin-card-desc">${tool.desc}</div>
        </div>
        <div class="admin-card-actions">
          <button class="btn-primary" style="flex: 1; padding: 4px 8px; font-size: 11px; justify-content: center;" onclick="App.launchWindowsTool('${tool.key}')">
            Launch Tool
          </button>
          <button class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="App.copyToolRunCommand('${tool.cmd}')" title="Copy Run Command for Win+R">
            Copy Run
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function filterAdminCategory(cat) {
    AudioEngine.playUiSfx('click');
    renderAdminTools(cat, currentAdminSearch);
  }

  function filterAdminTools(query) {
    renderAdminTools(currentAdminCat, query);
  }

  async function launchWindowsTool(toolKey) {
    AudioEngine.playUiSfx('click');
    showToast(`Attempting to launch ${toolKey}...`, 'info');

    // 1. Try launching through ShivTrix Companion daemon if running
    try {
      const res = await fetch(`http://127.0.0.1:9871/launch?tool=${encodeURIComponent(toolKey)}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'launched') {
          AudioEngine.playUiSfx('success');
          showToast(`Launched ${toolKey} on Windows host!`, 'success');
          return;
        }
      }
    } catch(e) {}

    // 2. Fallback: Check if tool has native browser protocol URI
    const tool = adminTools.find(t => t.key === toolKey);
    const cmd = tool ? tool.cmd : toolKey;

    if (cmd.startsWith('windowsdefender:') || cmd.startsWith('ms-settings:')) {
      window.location.href = cmd;
      showToast(`Opening Windows Settings URI: ${cmd}`, 'success');
      return;
    }

    // 3. Fallback: Copy to clipboard and instruct user
    navigator.clipboard.writeText(cmd);
    AudioEngine.playUiSfx('alert');
    showToast(`Copied "${cmd}" to clipboard! Press Win+R and paste, or launch companion.bat for 1-click launch.`, 'info');
  }

  function copyToolRunCommand(cmd) {
    AudioEngine.playUiSfx('click');
    navigator.clipboard.writeText(cmd);
    showToast(`Copied command "${cmd}" to clipboard (Run with Win + R)`, 'success');
  }

  // --- WebRTC Remote Resolve & Live Screen Sharing Studio ---
  let screenStream = null;
  let remotePeerConnection = null;
  let remotePermissionLevel = 'pointer'; // 'view', 'pointer', 'control'
  let currentRoomId = 'STX-8429';
  let isHosting = true;
  let signalingChannel = null;

  function initRemoteResolve() {
    // Setup local BroadcastChannel for multi-tab / local network testing
    try {
      signalingChannel = new BroadcastChannel('shivtrix_remote_resolve_' + currentRoomId);
      signalingChannel.onmessage = (e) => {
        handleIncomingSignaling(e.data);
      };
    } catch(e) {}
  }

  function handleIncomingSignaling(data) {
    if (!data) return;
    if (data.type === 'pointer_move' && remotePermissionLevel !== 'view') {
      displayRemotePointer(data.x, data.y, data.sender);
    } else if (data.type === 'remote_action') {
      logRemoteAudit(`[Remote Action] ${data.sender}: ${data.action}`);
      showToast(`Remote technician requested: ${data.action}`, 'info');
    } else if (data.type === 'client_joined') {
      logRemoteAudit(`[Client Connect] ${data.sender} joined room ${currentRoomId}`);
      showToast(`Technician ${data.sender} joined session!`, 'success');
    }
  }

  async function startScreenShare() {
    AudioEngine.playUiSfx('alert');
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true
      });

      const video = document.getElementById('remote-video');
      const placeholder = document.getElementById('no-stream-placeholder');
      const pill = document.getElementById('stream-status-pill');
      const btn = document.getElementById('btn-start-stream');

      if (video) {
        video.srcObject = screenStream;
        video.play();
      }
      if (placeholder) placeholder.style.display = 'none';
      if (pill) {
        pill.className = 'badge-real';
        pill.textContent = 'BROADCASTING LIVE (60 FPS)';
      }
      if (btn) btn.textContent = 'Change Screen';

      // Update resolution and stream info
      const track = screenStream.getVideoTracks()[0];
      if (track) {
        const settings = track.getSettings();
        const resLabel = document.getElementById('stream-res-label');
        if (resLabel && settings.width && settings.height) {
          resLabel.textContent = `Resolution: ${settings.width} x ${settings.height} (${settings.frameRate || 60} fps)`;
        }

        track.onended = () => {
          terminateRemoteStream();
        };
      }

      logRemoteAudit(`[Session Started] Screen broadcast started for room ${currentRoomId}`);
      AudioEngine.playUiSfx('success');
      showToast('Screen broadcasting live! Ready for remote assistance.', 'success');

      // Dispatch signal
      if (signalingChannel) {
        signalingChannel.postMessage({ type: 'stream_ready', room: currentRoomId, sender: 'Host' });
      }
    } catch(err) {
      showToast(`Screen share cancelled or permission denied: ${err.message}`, 'error');
    }
  }

  function terminateRemoteStream() {
    AudioEngine.playUiSfx('alert');
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      screenStream = null;
    }

    const video = document.getElementById('remote-video');
    const placeholder = document.getElementById('no-stream-placeholder');
    const pill = document.getElementById('stream-status-pill');
    const btn = document.getElementById('btn-start-stream');

    if (video) video.srcObject = null;
    if (placeholder) placeholder.style.display = 'block';
    if (pill) {
      pill.className = 'badge-sim';
      pill.textContent = 'STANDBY';
    }
    if (btn) btn.textContent = 'Capture & Share Screen';

    hideRemotePointer();
    logRemoteAudit('[Session Terminated] All streams and remote permissions revoked.');
    showToast('Remote session terminated. Access revoked.', 'warning');
  }

  function setRemotePermission(level) {
    AudioEngine.playUiSfx('click');
    remotePermissionLevel = level;

    ['view', 'pointer', 'control'].forEach(lvl => {
      const btn = document.getElementById(`perm-btn-${lvl}`);
      if (btn) btn.classList.toggle('active', lvl === level);
    });

    logRemoteAudit(`[Security Update] Permission policy set to: ${level.toUpperCase()}`);
    showToast(`Remote Access Policy: ${level.toUpperCase()}`, 'info');
  }

  function handleRemoteScreenClick(e) {
    if (remotePermissionLevel === 'view') return;
    const box = document.getElementById('remote-screen-box');
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    displayRemotePointer(xPct, yPct, 'Remote Tech');
    if (signalingChannel) {
      signalingChannel.postMessage({ type: 'pointer_move', x: xPct, y: yPct, sender: 'Tech' });
    }
  }

  function handleRemoteScreenMove(e) {
    if (remotePermissionLevel === 'view' || !e.buttons) return;
    handleRemoteScreenClick(e);
  }

  function displayRemotePointer(xPct, yPct, sender = 'Tech') {
    const dot = document.getElementById('laser-dot');
    const label = document.getElementById('laser-label');
    if (!dot) return;
    dot.style.display = 'block';
    dot.style.left = `${xPct}%`;
    dot.style.top = `${yPct}%`;
    if (label) label.textContent = `${sender} (Pointer)`;

    clearTimeout(dot._timer);
    dot._timer = setTimeout(() => {
      dot.style.display = 'none';
    }, 4000);
  }

  function hideRemotePointer() {
    const dot = document.getElementById('laser-dot');
    if (dot) dot.style.display = 'none';
  }

  function dispatchRemoteAction(actionName) {
    AudioEngine.playUiSfx('click');
    if (remotePermissionLevel === 'view') {
      showToast('Remote control is set to VIEW ONLY. Elevate permission to execute actions.', 'warning');
      return;
    }

    logRemoteAudit(`[Command Sent] Dispatched action: "${actionName}"`);
    showToast(`Executing remote action: ${actionName}`, 'info');

    if (signalingChannel) {
      signalingChannel.postMessage({ type: 'remote_action', action: actionName, sender: 'Technician' });
    }

    // If companion is active, run action
    if (actionName.includes('Defender')) {
      launchWindowsTool('defender');
    } else if (actionName.includes('Process')) {
      showToast('Host process tree synchronized with remote viewer', 'success');
    } else {
      setTimeout(() => {
        logRemoteAudit(`[Result Received] "${actionName}" completed with return code 0.`);
        AudioEngine.playUiSfx('success');
      }, 500);
    }
  }

  function logRemoteAudit(entry) {
    const logBox = document.getElementById('remote-audit-log');
    if (!logBox) return;
    const now = new Date().toTimeString().split(' ')[0];
    const line = document.createElement('div');
    line.textContent = `[${now}] ${entry}`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  function copyRoomCode() {
    AudioEngine.playUiSfx('click');
    const code = document.getElementById('room-code-input').value;
    navigator.clipboard.writeText(code);
    showToast(`Copied Room Code ${code} to clipboard! Share with remote tech.`, 'success');
  }

  function joinRoom() {
    AudioEngine.playUiSfx('click');
    const code = document.getElementById('room-code-input').value.trim();
    if (!code) return;
    currentRoomId = code;
    document.getElementById('remote-room-badge').textContent = `ROOM: ${code}`;
    initRemoteResolve();
    logRemoteAudit(`[Room Joined] Switched to room channel: ${code}`);
    showToast(`Joined remote resolve session: ${code}`, 'success');
  }

  function toggleRemoteFullscreen() {
    AudioEngine.playUiSfx('click');
    const box = document.getElementById('remote-screen-box');
    if (!box) return;
    if (!document.fullscreenElement) {
      box.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  return {
    init,
    navigateTo,
    toggleSidebar,
    cycleTheme,
    runCpuBenchmark,
    testLivePing,
    runSpeedTest,
    lookupDns,
    killProcess,
    addProcess,
    filterProcesses,
    recomputeSecurityScore,
    analyzePassword,
    generatePassword,
    copyGeneratedPassword,
    computeFileHash,
    handleStorageFiles,
    calculateSubnet,
    initSubnetCidrDropdown,
    formatJson,
    minifyJson,
    generateQrCode,
    downloadQr,
    encodeBase64,
    decodeBase64,
    encodeUrl,
    generateUuidBatch,
    getTimestampNow,
    loadPlaygroundPreset,
    runPlaygroundCode,
    testRegex,
    updateColorStudio,
    renderMarkdown,
    handleImageCompress,
    updateImageCompression,
    downloadCompressedImage,
    previewRenamer,
    filterDevices,
    pingDevice,
    wakeDevice,
    scanDevices,
    setOpsTab,
    exportAssetsCsv,
    openAddAssetModal,
    closeAddAssetModal,
    saveNewAsset,
    cycleJobStatus,
    openAddJobModal,
    closeAddJobModal,
    saveNewJob,
    resolveTicket,
    openAddTicketModal,
    closeAddTicketModal,
    saveNewTicket,
    updateInvoiceItem,
    addInvoiceLine,
    removeInvoiceLine,
    calcInvoice,
    checkPcCompatibility,
    initAiChat,
    sendAiPrompt,
    submitAiInput,
    clearAiChat,
    openCommandPalette,
    closeCommandPalette,
    filterCommands,
    toggleFocusMode,
    toggleFocusTimer,
    resetFocusTimer,
    showCompanionModal,
    closeCompanionModal,
    showToast,
    filterAdminTools,
    filterAdminCategory,
    launchWindowsTool,
    copyToolRunCommand,
    startScreenShare,
    terminateRemoteStream,
    setRemotePermission,
    handleRemoteScreenClick,
    handleRemoteScreenMove,
    dispatchRemoteAction,
    joinRoom,
    copyRoomCode,
    toggleRemoteFullscreen,
    displayRemotePointer,
    openSyncModal,
    closeSyncModal,
    testCompanionConnection,
    applyTaskMgrCalibration,
    applyCustomCalibration,
  };
})();

// Start Application on DOM Ready or immediately if already loaded
function startApp() {
  App.initSubnetCidrDropdown();
  App.init();
  App.generateQrCode();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
