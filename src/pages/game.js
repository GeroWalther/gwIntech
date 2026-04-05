import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// xterm.js must be loaded client-side only (no SSR)
function GameTerminal() {
  const termRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let disposed = false;

    async function init() {
      try {
        // Dynamic imports (client-side only)
        const { Terminal } = await import('@xterm/xterm');
        const { FitAddon } = await import('@xterm/addon-fit');

        if (disposed || !termRef.current) return;

        const keyQueue = [];
        window.termGetKey = () => keyQueue.length > 0 ? keyQueue.shift() : -1;

        const term = new Terminal({
          fontSize: 17,
          fontFamily: "'Courier New', 'Menlo', monospace",
          theme: {
            background: '#0a0a0a',
            foreground: '#e0e0e0',
            cursor: '#0a0a0a',
            black: '#0a0a0a',
            red: '#ff4444',
            green: '#44ff44',
            yellow: '#ffcc00',
            blue: '#4488ff',
            magenta: '#cc44ff',
            cyan: '#44ffff',
            white: '#e0e0e0',
          },
          cursorBlink: false,
          allowTransparency: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(termRef.current);
        // Delay fit to ensure container is fully rendered
        await new Promise(r => setTimeout(r, 100));
        fitAddon.fit();

        window.termCols = term.cols;
        window.termRows = term.rows;
        window._gameTerminal = term;
        window.termWrite = (data) => term.write(data);

        // Re-fit on resize (responsive)
        window.addEventListener('resize', () => {
          fitAddon.fit();
          window.termCols = term.cols;
          window.termRows = term.rows;
        });

        term.onKey((e) => {
          const key = e.domEvent.key;
          switch (key) {
            case 'ArrowUp':    keyQueue.push(0x103); break;
            case 'ArrowDown':  keyQueue.push(0x102); break;
            case 'ArrowLeft':  keyQueue.push(0x104); break;
            case 'ArrowRight': keyQueue.push(0x105); break;
            case 'Enter':      keyQueue.push(10); break;
            case 'Escape':     keyQueue.push(27); break;
            case 'Backspace':  keyQueue.push(127); break;
            default:
              if (key.length === 1) keyQueue.push(key.charCodeAt(0));
              break;
          }
        });

        window.termCols = term.cols;
        window.termRows = term.rows;
        console.log('[game] Terminal size:', term.cols, 'x', term.rows);

        // Configure Emscripten Module
        window.Module = {
          locateFile: (filename) => `/game/${filename}`,
          onRuntimeInitialized: () => {
            setLoaded(true);
            term.focus();
          },
          noInitialRun: false,
          print: (text) => console.log('[game]', text),
          printErr: (text) => console.warn('[game]', text),
        };

        // Load WASM
        const script = document.createElement('script');
        script.src = '/game/dungeon.js';
        script.onerror = () => setError('Failed to load game engine');
        document.body.appendChild(script);

      } catch (err) {
        console.error('Game init error:', err);
        setError(err.message);
      }
    }

    init();

    return () => {
      disposed = true;
      if (window._gameTerminal) {
        window._gameTerminal.dispose();
        window._gameTerminal = null;
      }
    };
  }, []);

  // Prevent arrow key scrolling
  useEffect(() => {
    const handler = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative border border-gray-700 rounded-lg overflow-hidden bg-[#0a0a0a] h-full">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0a0a0a]">
          <div className="text-center">
            <div className="text-yellow-400 text-xl mb-2">Loading Dungeon Monsters...</div>
            <div className="text-gray-500 text-sm">Initializing WebAssembly</div>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0a0a0a]">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-2">Failed to load game</div>
            <div className="text-gray-500 text-sm">{error}</div>
            <button onClick={() => location.reload()} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
              Retry
            </button>
          </div>
        </div>
      )}
      <div ref={termRef} style={{ width: '100%', height: 'calc(100vh - 36px)' }} />
    </div>
  );
}

// Only render terminal on client (no SSR)
const GameTerminalNoSSR = dynamic(() => Promise.resolve(GameTerminal), { ssr: false });

export default function GamePage() {
  return (
    <>
      <Head>
        <title>Dungeon Monsters | Play in Browser</title>
        <meta name="description" content="Play Dungeon Monsters - a terminal roguelike dungeon crawler with pixel art and faction-based combat, right in your browser." />
      </Head>

      <div className="h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
        <div className="px-2 py-1 flex items-center justify-between flex-shrink-0">
          <Link href="/projects" className="text-gray-600 hover:text-white transition-colors text-xs">
            &larr; Back
          </Link>
          <h1 className="text-sm font-bold text-yellow-400">
            Dungeon Monsters
          </h1>
          <a href="https://github.com/GeroWalther/dungeon-monsters" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors text-xs">
            GitHub
          </a>
        </div>

        <div className="flex-1 px-1 pb-1 min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameTerminalNoSSR />
          </motion.div>

        </div>
      </div>
    </>
  );
}
