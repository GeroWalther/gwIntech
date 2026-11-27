// Pip & the Star Lantern - browser front end.
// The game itself is C++ compiled to WebAssembly (game.js / game.wasm). This file runs the
// 30 Hz loop, draws the pixel frame and the text layer onto a canvas, turns keyboard, touch
// and gamepad input into the game's key codes, plays the generated sounds through WebAudio,
// keeps the save in localStorage and handles installing as an app.
(() => {
  'use strict';

  const KEY = { Up: 1000, Down: 1001, Left: 1002, Right: 1003, Esc: 1004, Enter: 1005, Tab: 1006, Backspace: 1007 };
  const KEY_HOLD = 3000, KEY_RELEASE = 3100;
  const DIR_KEY = [KEY.Up, KEY.Right, KEY.Down, KEY.Left]; // game order: 0 north, 1 east, 2 south, 3 west
  const HOLD_AFTER = 4;        // ticks a direction must be held before it counts as walking on
  const STEP_MS = 1000 / 30;
  const SAVE_KEY = 'starlantern.sav';
  const STATE = { TITLE: 0, INTRO: 1, PLAY: 2, PAUSE: 3, ENDING: 4, CREDITS: 5 };

  const $ = (s) => document.querySelector(s);
  const canvas = $('#screen');
  const ctx = canvas.getContext('2d', { alpha: false });
  const frameCanvas = document.createElement('canvas');
  frameCanvas.width = 120; frameCanvas.height = 80;
  const fctx = frameCanvas.getContext('2d');
  let frameImage = fctx.createImageData(120, 80);

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* private mode */ } },
  };

  let M = null;            // the Emscripten module
  let tickCount = 0;

  // ------------------------------------------------------------------ audio
  const sounds = new Map();
  let actx = null, master = null, musicSrc = null, musicName = '';
  function onSound(name, data, rate) { sounds.set(name, { data, rate, buf: null }); }
  function bufferFor(name) {
    const s = sounds.get(name);
    if (!s || !actx) return null;
    if (!s.buf) {
      s.buf = actx.createBuffer(1, s.data.length, s.rate);
      s.buf.getChannelData(0).set(s.data);
    }
    return s.buf;
  }
  function unlockAudio() {
    try {
      if (!actx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        actx = new AC();
        master = actx.createGain();
        master.connect(actx.destination);
        // iOS only unlocks after something actually plays inside the gesture.
        const b = actx.createBuffer(1, 1, 22050), s = actx.createBufferSource();
        s.buffer = b; s.connect(master); s.start(0);
        actx.onstatechange = () => { if (actx.state === 'running' && !musicSrc) startMusic(); };
      }
      if (actx.state !== 'running') actx.resume().then(() => { if (!musicSrc) startMusic(); }).catch(() => {});
      else if (!musicSrc) startMusic();
    } catch (e) { /* no audio */ }
  }
  function play(name, vol, loop) {
    const buf = bufferFor(name);
    if (!buf || actx.state !== 'running') return null;
    const src = actx.createBufferSource(), g = actx.createGain();
    src.buffer = buf; src.loop = !!loop; g.gain.value = vol;
    src.connect(g); g.connect(master); src.start();
    return src;
  }
  function playSfx(name) { play('s_' + name, 0.7, false); }
  function stopMusic() { if (musicSrc) { try { musicSrc.stop(); } catch (e) { /* already stopped */ } musicSrc = null; } }
  function startMusic() { stopMusic(); if (musicName) musicSrc = play('m_' + musicName, 0.42, true); }
  function playMusic(name) { if (name === musicName && musicSrc) return; musicName = name; startMusic(); }

  // ------------------------------------------------------------------ saves
  function restoreSave(FS) {
    try { FS.mkdir('/save'); } catch (e) { /* exists */ }
    const s = store.get(SAVE_KEY);
    if (s) FS.writeFile('/save/starlantern.sav', s);
  }
  function onSaved() {
    try {
      const data = M.FS.readFile('/save/starlantern.sav', { encoding: 'utf8' });
      store.set(SAVE_KEY, data);
    } catch (e) { store.del(SAVE_KEY); }
  }

  // ------------------------------------------------------------------ layout
  const pad = $('#pad'), buttons = $('#buttons');
  const btnA = buttons.querySelector('[data-k="a"]'), btnB = buttons.querySelector('[data-k="b"]');
  const pills = { tool: $('.pill[data-k="tool"]'), map: $('.pill[data-k="map"]'), menu: $('.pill[data-k="menu"]') };
  let touchUI = false;
  let L = null; // current layout

  const inset = { t: 0, r: 0, b: 0, l: 0 };
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
  document.body.appendChild(probe);
  function readInsets() {
    const cs = getComputedStyle(probe);
    inset.t = parseFloat(cs.paddingTop) || 0; inset.r = parseFloat(cs.paddingRight) || 0;
    inset.b = parseFloat(cs.paddingBottom) || 0; inset.l = parseFloat(cs.paddingLeft) || 0;
  }

  function place(el, x, y, w, h) {
    el.style.left = x + 'px'; el.style.top = y + 'px';
    if (w != null) el.style.width = w + 'px';
    if (h != null) el.style.height = h + 'px';
  }

  function layout() {
    readInsets();
    const vw = window.innerWidth, vh = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
    const left = inset.l, top = inset.t, right = vw - inset.r, bottom = vh - inset.b;
    const aw = right - left, ah = bottom - top;
    let box; // css-pixel box the game is fitted into
    if (!touchUI) {
      const m = Math.min(16, aw * 0.02);
      box = { x: left + m, y: top + m, w: aw - 2 * m, h: ah - 2 * m };
    } else if (aw >= ah) { // landscape: controls on both sides
      const side = Math.max(120, Math.min(230, aw * 0.2));
      box = { x: left + side, y: top + 4, w: aw - 2 * side, h: ah - 8 };
      const ps = Math.min(side - 14, ah * 0.46, 176);
      place(pad, left + (side - ps) / 2, top + ah * 0.58 - ps / 2, ps, ps);
      const bs = Math.min((side - 18) / 2, 74);
      const bx = right - side;
      place(buttons, bx, top + ah * 0.58 - bs * 1.2, side, bs * 2.4);
      place(btnB, side * 0.5 - bs - 4, bs * 0.95, bs, bs);
      place(btnA, side * 0.5 + 4, bs * 0.25, bs, bs);
      place(pills.menu, bx + side / 2 - 34, top + 10);
      place(pills.map, left + side / 2 - 30, top + 10);
      place(pills.tool, bx + side / 2 - 32, top + ah * 0.58 - bs * 1.2 - 44);
    } else { // portrait: controls at the bottom where thumbs rest, the picture centred above
      const ps = Math.min(aw * 0.44, 190);
      const bs = Math.min(aw * 0.19, 80);
      const py = bottom - ps - Math.max(18, ah * 0.04);  // top of the pad
      const pillY = py - 48;
      place(pills.map, left + aw * 0.5 - 140, pillY);
      place(pills.tool, left + aw * 0.5 - 34, pillY);
      place(pills.menu, left + aw * 0.5 + 76, pillY);
      place(pad, left + aw * 0.05, py, ps, ps);
      const bw = aw * 0.46;
      place(buttons, right - bw - aw * 0.03, py + ps / 2 - bs * 1.2, bw, bs * 2.4);
      place(btnB, bw * 0.5 - bs - 6, bs * 0.95, bs, bs);
      place(btnA, bw * 0.5 + 6, bs * 0.25, bs, bs);
      box = { x: left + 2, y: top + 4, w: aw - 4, h: pillY - 12 - top - 4 };
    }
    // Fit 3:2, snapping to whole device pixels per game pixel when that costs little.
    let gw = Math.min(box.w, box.h * 1.5), gh = gw / 1.5;
    let px = gh * dpr / 80;
    if (px >= 3 && Math.floor(px) / px > 0.86) px = Math.floor(px);
    const gwd = Math.round(120 * px), ghd = Math.round(80 * px);
    gw = gwd / dpr; gh = ghd / dpr;
    const gx = box.x + (box.w - gw) / 2, gy = box.y + (box.h - gh) / 2;
    const uiRows = Math.max(20, Math.min(40, Math.floor(gh / 13)));
    L = { dpr, gx: Math.round(gx * dpr), gy: Math.round(gy * dpr), gw: gwd, gh: ghd, uiRows, uiCols: uiRows * 3, css: { gx, gy, gw, gh } };
    setupFont();
    draw();
  }

  // ------------------------------------------------------------------ text
  let fontPx = 16, glyphW = 8, cellW = 8, cellH = 16, glyphDy = 0;
  function setupFont() {
    cellW = L.gw / L.uiCols; cellH = L.gh / L.uiRows;
    ctx.font = '100px VT323, ui-monospace, monospace';
    const adv = ctx.measureText('M').width / 100;  // advance per px of font size
    fontPx = Math.min(cellH * 1.12, (cellW * 1.02) / adv);
    glyphW = adv * fontPx;
    glyphDy = cellH * 0.56;
  }
  const colorCache = new Map();
  function css(c) {
    let s = colorCache.get(c);
    if (!s) { s = 'rgb(' + (c & 255) + ',' + ((c >> 8) & 255) + ',' + ((c >> 16) & 255) + ')'; colorCache.set(c, s); }
    return s;
  }
  const BITMAPS = {
    0x25b6: ['10000', '11100', '11111', '11100', '10000'],          // ▶
    0x25bc: ['11111', '01110', '00100'],                             // ▼
    0x2665: ['01010', '11111', '11111', '01110', '00100'],          // ♥
    0x2661: ['01010', '10101', '10001', '01010', '00100'],          // ♡
    0x2726: ['00100', '01110', '11111', '01110', '00100'],          // ✦
    0x2727: ['00100', '01010', '10001', '01010', '00100'],          // ✧
  };
  const BOX = { 0x2500: 'lr', 0x2502: 'ud', 0x256d: 'rd', 0x256e: 'ld', 0x256f: 'lu', 0x2570: 'ru' };
  function drawSpecial(ch, x0, y0, x1, y1) {
    const w = x1 - x0, h = y1 - y0;
    const box = BOX[ch];
    if (box) {
      const t = Math.max(1, Math.round(w / 5));
      const cx = Math.round(x0 + w / 2 - t / 2), cy = Math.round(y0 + h / 2 - t / 2);
      if (box.includes('l')) ctx.fillRect(x0, cy, cx - x0 + t, t);
      if (box.includes('r')) ctx.fillRect(cx, cy, x1 - cx, t);
      if (box.includes('u')) ctx.fillRect(cx, y0, t, cy - y0 + t);
      if (box.includes('d')) ctx.fillRect(cx, cy, t, y1 - cy);
      return true;
    }
    const bm = BITMAPS[ch];
    if (!bm) return false;
    const p = Math.max(1, Math.round(Math.min(w / 5.6, h / 6.5)));
    const bw = bm[0].length * p, bh = bm.length * p;
    const ox = Math.round(x0 + (w - bw) / 2), oy = Math.round(y0 + (h - bh) / 2);
    for (let j = 0; j < bm.length; j++)
      for (let i = 0; i < bm[j].length; i++)
        if (bm[j][i] === '1') ctx.fillRect(ox + i * p, oy + j * p, p, p);
    return true;
  }

  // ------------------------------------------------------------------ drawing
  function draw() {
    if (!M || !L) return;
    M._web_render(L.uiCols, L.uiRows);
    const fw = M._web_frame_w(), fh = M._web_frame_h();
    if (frameCanvas.width !== fw || frameCanvas.height !== fh) {
      frameCanvas.width = fw; frameCanvas.height = fh; frameImage = fctx.createImageData(fw, fh);
    }
    const fp = M._web_frame();
    frameImage.data.set(M.HEAPU8.subarray(fp, fp + fw * fh * 4));
    fctx.putImageData(frameImage, 0, 0);

    ctx.fillStyle = '#08060e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(frameCanvas, 0, 0, fw, fh, L.gx, L.gy, L.gw, L.gh);

    const uc = M._web_ui_cols(), ur = M._web_ui_rows();
    const cells = M.HEAPU32.subarray(M._web_cells() >> 2, (M._web_cells() >> 2) + uc * ur * 3);
    const cw = L.gw / uc, ch = L.gh / ur;
    const X = (i) => L.gx + Math.round(i * cw), Y = (j) => L.gy + Math.round(j * ch);
    // backgrounds, merged into runs
    for (let y = 0; y < ur; y++) {
      let run = -1, runBg = -1, runSolid = false;
      for (let x = 0; x <= uc; x++) {
        let bg = -1, solid = false;
        if (x < uc) {
          const i = (y * uc + x) * 3;
          if (cells[i]) { solid = (cells[i + 1] >>> 24) & 1; bg = solid ? cells[i + 2] : -2; }
        }
        if (bg !== runBg) {
          if (runBg !== -1 && run >= 0) {
            ctx.fillStyle = runBg === -2 ? 'rgba(0,0,0,0.45)' : css(runBg);
            ctx.fillRect(X(run), Y(y), X(x) - X(run), Y(y + 1) - Y(y));
          }
          run = x; runBg = bg; runSolid = solid;
        }
      }
      void runSolid;
    }
    // glyphs
    ctx.font = fontPx.toFixed(2) + 'px VT323, ui-monospace, monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    let lastFg = -1;
    for (let y = 0; y < ur; y++) {
      for (let x = 0; x < uc; x++) {
        const i = (y * uc + x) * 3, c = cells[i];
        if (!c || c === 32) continue;
        const fg = cells[i + 1] & 0xffffff;
        if (fg !== lastFg) { ctx.fillStyle = css(fg); lastFg = fg; }
        const x0 = X(x), y0 = Y(y), x1 = X(x + 1), y1 = Y(y + 1);
        if (c > 0x2000 && drawSpecial(c, x0, y0, x1, y1)) continue;
        ctx.fillText(String.fromCodePoint(c), (x0 + x1) / 2, y0 + glyphDy);
      }
    }
  }

  // ------------------------------------------------------------------ input
  const dirSources = new Map();  // source -> dir; the newest source wins
  let curDir = -1, dirSince = 0, holding = false;
  function send(k) { if (M) M._web_key(k); }
  function setDir(source, dir) {
    if (dir < 0) dirSources.delete(source);
    else { dirSources.delete(source); dirSources.set(source, dir); }
    const vals = [...dirSources.values()];
    const nd = vals.length ? vals[vals.length - 1] : -1;
    if (nd === curDir) return;
    if (holding) { send(KEY_RELEASE); holding = false; }
    curDir = nd;
    dirSince = tickCount;
    if (nd >= 0) send(DIR_KEY[nd]);
  }
  function beforeTick() {
    pollGamepad();
    if (curDir >= 0 && tickCount - dirSince >= HOLD_AFTER) { send(KEY_HOLD + curDir); holding = true; }
  }

  function setTouch(on) {
    if (on === touchUI) return;
    touchUI = on;
    document.body.classList.toggle('touch', on);
    if (M) M._web_set_touch(on ? 1 : 0);
    layout();
  }

  const CODE_DIR = { ArrowUp: 0, KeyW: 0, ArrowRight: 1, KeyD: 1, ArrowDown: 2, KeyS: 2, ArrowLeft: 3, KeyA: 3 };
  const CODE_KEY = { Space: 32, Enter: KEY.Enter, NumpadEnter: KEY.Enter, Escape: KEY.Esc, Tab: KEY.Tab, Backspace: KEY.Backspace };
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    unlockAudio();
    if (touchUI) setTouch(false);
    const d = CODE_DIR[e.code];
    if (d !== undefined) { e.preventDefault(); if (!e.repeat) setDir('key:' + e.code, d); return; }
    let k = CODE_KEY[e.code];
    if (k === undefined && /^Key[A-Z]$/.test(e.code)) k = e.code.charCodeAt(3) + 32;
    if (k === undefined && /^Digit[1-3]$/.test(e.code)) k = e.code.charCodeAt(5);
    if (k === undefined) return;
    e.preventDefault();
    if (e.repeat) return;
    if (k === 113) return; // q quits in the terminal; not here
    send(k);
  });
  window.addEventListener('keyup', (e) => {
    if (CODE_DIR[e.code] !== undefined) setDir('key:' + e.code, -1);
  });
  window.addEventListener('blur', () => { for (const s of [...dirSources.keys()]) setDir(s, -1); });

  function vibrate() { if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) { /* ignore */ } }
  let askedFullscreen = false;
  function maybeFullscreen() {
    if (askedFullscreen) return;
    askedFullscreen = true;
    const standalone = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone;
    const el = document.documentElement;
    if (!standalone && el.requestFullscreen && /Android/i.test(navigator.userAgent))
      el.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
  }

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') setTouch(true);
  }, true);
  document.addEventListener('pointerup', unlockAudio, true);
  document.addEventListener('touchend', unlockAudio, true);
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // D-pad: the direction is the side of the pad the finger is on; sliding changes it.
  const arms = { 0: pad.querySelector('.u'), 1: pad.querySelector('.r'), 2: pad.querySelector('.d'), 3: pad.querySelector('.l') };
  function padDir(e) {
    const r = pad.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < r.width * 0.1) return -2; // dead zone: keep the current one
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);
  }
  let padPointer = null, padCur = -1;
  function padSet(d) {
    if (d === -2) return;
    if (d !== padCur) { if (d >= 0) vibrate(); padCur = d; }
    for (const k in arms) arms[k].classList.toggle('on', +k === d);
    setDir('pad', d);
  }
  pad.addEventListener('pointerdown', (e) => {
    e.preventDefault(); maybeFullscreen(); unlockAudio();
    padPointer = e.pointerId; pad.setPointerCapture(e.pointerId);
    const d = padDir(e); padSet(d === -2 ? 0 : d);
  });
  pad.addEventListener('pointermove', (e) => { if (e.pointerId === padPointer) padSet(padDir(e)); });
  const padUp = (e) => { if (e.pointerId === padPointer) { padPointer = null; padSet(-1); } };
  pad.addEventListener('pointerup', padUp);
  pad.addEventListener('pointercancel', padUp);

  function holdButton(el, key) {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation(); maybeFullscreen(); unlockAudio(); vibrate();
      el.setPointerCapture(e.pointerId); el.classList.add('on'); send(key);
    });
    const up = () => el.classList.remove('on');
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  }
  holdButton(btnA, KEY.Enter);
  holdButton(btnB, 102); // f
  holdButton(pills.tool, KEY.Tab);
  holdButton(pills.map, 109); // m
  holdButton(pills.menu, KEY.Esc);

  // Tapping the picture moves story pages and menus along (never during play).
  canvas.addEventListener('pointerdown', (e) => {
    if (!M || e.pointerType === 'mouse') return;
    const st = M._web_state();
    if (st === STATE.TITLE || st === STATE.INTRO || st === STATE.ENDING || st === STATE.CREDITS) { unlockAudio(); send(KEY.Enter); }
  });

  // Gamepads: d-pad / left stick walk, A act, B/X tool, Y switch tool, Select map, Start menu.
  const padPrev = {};
  function pollGamepad() {
    if (!navigator.getGamepads) return;
    for (const gp of navigator.getGamepads()) {
      if (!gp || !gp.connected) continue;
      const b = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
      let d = -1;
      if (b(12) || ay < -0.5) d = 0; else if (b(15) || ax > 0.5) d = 1; else if (b(13) || ay > 0.5) d = 2; else if (b(14) || ax < -0.5) d = 3;
      const id = 'gp' + gp.index;
      if ((dirSources.get(id) ?? -1) !== d) setDir(id, d);
      const prev = padPrev[id] || {};
      const map = { 0: KEY.Enter, 1: 102, 2: 102, 3: KEY.Tab, 8: 109, 9: KEY.Esc };
      for (const i in map) {
        const now = b(+i);
        if (now && !prev[i]) { if (touchUI) setTouch(false); unlockAudio(); send(map[i]); }
        prev[i] = now;
      }
      padPrev[id] = prev;
    }
  }

  // ------------------------------------------------------------------ install
  const hint = $('#hint'), hintText = $('#hint-text'), hintGo = $('#hint-go');
  let installEvt = null, hintWanted = '';
  const standalone = () => matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || navigator.standalone === true;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; hintWanted = 'prompt'; });
  window.addEventListener('appinstalled', () => { installEvt = null; hintWanted = ''; });
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIOS && !standalone()) hintWanted = 'ios';
  hintGo.addEventListener('click', async () => {
    if (!installEvt) return;
    installEvt.prompt();
    try { await installEvt.userChoice; } catch (e) { /* ignore */ }
    installEvt = null; hintWanted = '';
  });
  $('#hint-x').addEventListener('click', () => { store.set('pip.hint.off', '1'); hintWanted = ''; });
  ['pointerdown', 'click'].forEach((t) => hint.addEventListener(t, (e) => e.stopPropagation()));
  function updateHint() {
    const show = !!hintWanted && !store.get('pip.hint.off') && M && M._web_state() === STATE.TITLE;
    if (show) {
      if (hintWanted === 'ios') { hintText.textContent = 'Install: Share → Add to Home Screen'; hintGo.style.display = 'none'; }
      else { hintText.textContent = 'Install as an app'; hintGo.style.display = ''; }
    }
    hint.classList.toggle('show', show);
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      const base = new URL(document.baseURI);
      // The page may live at "/game" while its files sit under "/game/": the worker then
      // needs the slash-less scope, which the server allows with Service-Worker-Allowed.
      let scope = base.pathname;
      if (!location.pathname.startsWith(scope)) scope = scope.replace(/\/$/, '') || '/';
      navigator.serviceWorker.register(new URL('sw.js', base).pathname, { scope }).catch(() => {});
    });
  }

  // ------------------------------------------------------------------ loop & boot
  let acc = 0, last = 0;
  function loop(now) {
    if (!last) last = now;
    acc += Math.min(250, now - last);
    last = now;
    let n = 0;
    while (acc >= STEP_MS && n < 4) {
      beforeTick();
      M._web_tick();
      tickCount++;
      acc -= STEP_MS;
      n++;
    }
    if (acc > STEP_MS * 4) acc = 0;
    if (n) { draw(); if (tickCount % 15 === 0) updateHint(); }
    requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', () => {
    if (!M) return;
    if (document.hidden) { M._web_save(); if (actx) actx.suspend().catch(() => {}); }
    else { last = 0; if (actx) actx.resume().catch(() => {}); }
  });
  window.addEventListener('pagehide', () => { if (M) M._web_save(); });
  window.addEventListener('resize', () => requestAnimationFrame(layout));
  window.addEventListener('orientationchange', () => setTimeout(layout, 120));

  const loading = $('#loading'), bar = $('#load-bar');
  function fail(msg) {
    loading.classList.add('err');
    $('#load-text').textContent = msg;
  }
  async function boot() {
    setTouch(matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches);
    if (!touchUI) layout();
    bar.style.width = '35%';
    const fontReady = document.fonts ? document.fonts.load('20px VT323').catch(() => {}) : Promise.resolve();
    let mod;
    try {
      mod = await createGame({
        locateFile: (f) => f + '?v=f496f678ca',
        onSound, playSfx, playMusic, onSaved,
        print: () => {}, printErr: (t) => console.warn(t),
      });
    } catch (e) {
      fail('The game could not start in this browser.');
      return;
    }
    bar.style.width = '80%';
    await fontReady;
    restoreSave(mod.FS);
    M = mod;
    M._web_init(1);
    M._web_set_touch(touchUI ? 1 : 0);
    bar.style.width = '100%';
    layout();
    loading.style.display = 'none';
    requestAnimationFrame(loop);
    // test hook for automated checks
    window.__pip = { send, setDir, state: () => M._web_state(), debug: () => M.UTF8ToString(M._web_debug()), cmd: (c) => { const p = M.stringToNewUTF8(c); const r = M.UTF8ToString(M._web_cmd(p)); M._free(p); return r; }, setTouch };
  }
  if (typeof createGame !== 'function') fail('The game files did not load. Check your connection and reload.');
  else boot();
})();
