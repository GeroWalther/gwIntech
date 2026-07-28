import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RainbowTrail from './RainbowTrail';
import ShareButtons from './ShareButtons';

// Focus trap helper: get all focusable elements in a container
export const getFocusableElements = (container) => {
  if (!container) return [];
  const focusableSelectors = [
    'button:not([disabled]):not([tabindex="-1"])',
    'a[href]:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
  ].join(', ');
  return Array.from(container.querySelectorAll(focusableSelectors));
};

export const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 2,
  }));
};

/** What you are dodging out there. */
export const OBSTACLE_GLYPHS = ['🌑', '☄️', '🛸', '👾', '🪐', '🌚'];

export const BEST_SCORE_KEY = 'nyanBestScore';

export const getBestScore = () => {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(BEST_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

export const saveBestScore = (score) => {
  if (typeof window === 'undefined') return;
  const currentBest = getBestScore();
  if (score > currentBest) {
    localStorage.setItem(BEST_SCORE_KEY, score.toString());
    return true;
  }
  return false;
};

const PartyModeOverlay = ({ isOpen, onClose }) => {
  const [stars, setStars] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [catLoaded, setCatLoaded] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);
  const audioRef = useRef(null);
  const overlayRef = useRef(null);
  const previousActiveElement = useRef(null);

  // ---------------------------------------------------------------- game
  // The score was always "seconds the overlay has been open". It still is —
  // but now you have to survive them. Keeping that definition means the
  // existing timer, best-score and share behaviour all carry over unchanged.
  const [catY, setCatY] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const catYRef = useRef(50);
  const obstaclesRef = useRef([]);
  const gameOverRef = useRef(false);
  const rafRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const spawnCountRef = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = currentScore;
  }, [currentScore]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        window.removeEventListener('resize', checkMobile);
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isOpen && stars.length === 0) {
      const starCount = isMobile ? 40 : 75;
      setStars(generateStars(starCount));
    }
  }, [isOpen, isMobile, stars.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Load best score on mount
  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  // Focus trap: trap focus inside overlay and restore focus on close
  useEffect(() => {
    if (!isOpen) return;

    // Store the previously focused element to restore later
    previousActiveElement.current = document.activeElement;

    // Focus the first focusable element in the overlay after a short delay
    // to allow the DOM to update
    const focusTimeout = setTimeout(() => {
      if (overlayRef.current) {
        const focusableElements = getFocusableElements(overlayRef.current);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 100);

    // Handle tab key to trap focus
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab' || !overlayRef.current) return;

      const focusableElements = getFocusableElements(overlayRef.current);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: go to last element if on first
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: go to first element if on last
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previously focused element when overlay closes
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Timer logic
  useEffect(() => {
    if (isOpen) {
      // Reset and start timer when overlay opens
      setCurrentScore(0);
      isPausedRef.current = false;

      timerRef.current = setInterval(() => {
        if (!isPausedRef.current && !gameOverRef.current) {
          setCurrentScore((prev) => prev + 1);
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      // Stop and reset timer when overlay closes
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Save best score when closing (if we had a score)
      setCurrentScore((prev) => {
        if (prev > 0) {
          const newBestSaved = saveBestScore(prev);
          if (newBestSaved) {
            setBestScore(prev);
          }
        }
        return 0;
      });
    }
  }, [isOpen]);

  // Reset the run whenever the overlay opens.
  const resetRun = useCallback(() => {
    obstaclesRef.current = [];
    setObstacles([]);
    spawnCountRef.current = 0;
    lastSpawnRef.current = 0;
    gameOverRef.current = false;
    setGameOver(false);
    catYRef.current = 50;
    setCatY(50);
    setCurrentScore(0);
  }, []);

  useEffect(() => {
    if (isOpen) resetRun();
  }, [isOpen, resetRun]);

  // Steering: pointer and touch fly the cat directly, arrows nudge it.
  useEffect(() => {
    if (!isOpen) return undefined;
    const el = overlayRef.current;
    if (!el) return undefined;

    const flyTo = (clientY) => {
      const rect = el.getBoundingClientRect();
      if (!rect.height) return;
      const pct = ((clientY - rect.top) / rect.height) * 100;
      catYRef.current = Math.max(12, Math.min(88, pct));
      setCatY(catYRef.current);
    };

    const onPointer = (e) => flyTo(e.clientY);
    const onTouch = (e) => {
      if (e.touches && e.touches[0]) flyTo(e.touches[0].clientY);
    };
    const onKey = (e) => {
      const up = e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W';
      const down = e.key === 'ArrowDown' || e.key === 's' || e.key === 'S';
      if (!up && !down) return;
      e.preventDefault();
      catYRef.current = Math.max(12, Math.min(88, catYRef.current + (up ? -6 : 6)));
      setCatY(catYRef.current);
    };

    el.addEventListener('pointermove', onPointer);
    el.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('pointermove', onPointer);
      el.removeEventListener('touchmove', onTouch);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // The obstacle field. Gated on the overlay actually having a measurable box:
  // with no layout there is nothing to dodge and nothing to collide with, so
  // the scene stays the calm flying cat it has always been. That is also what
  // keeps this inert under jsdom, where every rect measures zero.
  useEffect(() => {
    if (!isOpen || prefersReducedMotion) return undefined;

    const el = overlayRef.current;
    const rect = el && el.getBoundingClientRect();
    if (!rect || rect.width < 200 || rect.height < 200) return undefined;
    if (typeof requestAnimationFrame !== 'function') return undefined;

    const catW = isMobile ? 150 : 250;
    const catH = catW * 0.5;
    const catLeft = (isMobile ? 0.1 : 0.15) * rect.width;

    let last = null;

    const step = (now) => {
      if (last === null) last = now;
      const dt = Math.min(48, now - last);
      last = now;

      if (!gameOverRef.current && !isPausedRef.current) {
        const n = spawnCountRef.current;
        const speed = 0.22 + Math.min(0.3, n * 0.004); // px per ms, ramps up
        const gap = Math.max(430, 1000 - n * 14);

        if (now - lastSpawnRef.current > gap) {
          lastSpawnRef.current = now;
          spawnCountRef.current = n + 1;
          const size = 34 + Math.random() * 28;
          obstaclesRef.current = obstaclesRef.current.concat({
            id: `${now}-${n}`,
            x: rect.width + size,
            y: 70 + Math.random() * Math.max(40, rect.height - 190),
            size,
            glyph: OBSTACLE_GLYPHS[n % OBSTACLE_GLYPHS.length],
          });
        }

        obstaclesRef.current = obstaclesRef.current
          .map((o) => ({ ...o, x: o.x - speed * dt }))
          .filter((o) => o.x > -o.size * 2);

        // Hit box is deliberately smaller than the sprite — a near miss should
        // read as a near miss, not a cheat.
        const catTop = (catYRef.current / 100) * rect.height - catH / 2;
        const hit = obstaclesRef.current.some(
          (o) =>
            o.x < catLeft + catW * 0.7 &&
            o.x + o.size * 0.8 > catLeft + catW * 0.2 &&
            o.y < catTop + catH * 0.78 &&
            o.y + o.size * 0.8 > catTop + catH * 0.22
        );

        if (hit) {
          gameOverRef.current = true;
          setGameOver(true);
          if (saveBestScore(scoreRef.current)) setBestScore(scoreRef.current);
        }

        setObstacles(obstaclesRef.current);
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isOpen, prefersReducedMotion, isMobile]);

  // Audio playback logic
  useEffect(() => {
    if (isOpen) {
      // Start playing audio when overlay opens (user-initiated via cat click)
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        // Handle both Promise and non-Promise returns
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // Ignore play errors (e.g., autoplay policy)
          });
        }
      }
    } else {
      // Stop and reset audio when overlay closes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  // Toggle mute handler
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (audioRef.current) {
        audioRef.current.muted = !prev;
      }
      return !prev;
    });
  }, []);

  // Visibility change handler for timer and audio
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isPausedRef.current = true;
        // Pause audio when tab is hidden
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
      } else {
        isPausedRef.current = false;
        // Resume audio when tab becomes visible (if overlay is open and not muted)
        if (isOpen && audioRef.current && audioRef.current.paused) {
          const playPromise = audioRef.current.play();
          // Handle both Promise and non-Promise returns
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              // Ignore play errors (e.g., if user hasn't interacted yet)
            });
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen]);

  const overlayVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-label="Party mode overlay"
          aria-modal="true"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000',
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {/* Stars */}
          {stars.map((star) => (
            <div
              key={star.id}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: '#FFFFFF',
                borderRadius: '50%',
              }}
              aria-hidden="true"
            />
          ))}

          {/* Rainbow Trail — rides with the cat so the two never separate. */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateY(${catY - 50}%)`,
              transition: prefersReducedMotion ? 'none' : 'transform 90ms linear',
              zIndex: 1,
            }}
          >
            <RainbowTrail />
          </div>

          {/* Obstacles */}
          {obstacles.map((o) => (
            <div
              key={o.id}
              aria-hidden="true"
              data-testid="obstacle"
              style={{
                position: 'absolute',
                left: `${o.x}px`,
                top: `${o.y}px`,
                fontSize: `${o.size}px`,
                lineHeight: 1,
                userSelect: 'none',
                zIndex: 2,
              }}
            >
              {o.glyph}
            </div>
          ))}

          {/* Cat GIF */}
          <div
            style={{
              position: 'absolute',
              left: isMobile ? '10%' : '15%',
              top: `${catY}%`,
              transform: 'translateY(-50%)',
              transition: prefersReducedMotion ? 'none' : 'top 90ms linear',
              zIndex: 2,
            }}
            data-testid="cat-container"
          >
            <img
              src="/hiddenCat/technyancolor.gif"
              alt="Nyan cat flying through space with a rainbow trail"
              style={{
                width: isMobile ? '150px' : '250px',
                height: 'auto',
                display: 'block',
                opacity: catLoaded ? 1 : 0,
                transition: prefersReducedMotion ? 'none' : 'opacity 0.3s ease',
              }}
              onLoad={() => setCatLoaded(true)}
              data-testid="cat-gif"
            />
          </div>

          {/* Audio element */}
          <audio
            ref={audioRef}
            src="/hiddenCat/technyancolor.mp3"
            loop
            data-testid="nyan-audio"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close party mode"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'transparent',
              border: '2px solid #FFFFFF',
              color: '#FFFFFF',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              zIndex: 10000,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            ×
          </button>

          {/* Mute toggle button */}
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            data-testid="mute-toggle"
            style={{
              position: 'absolute',
              top: '20px',
              right: '70px',
              backgroundColor: 'transparent',
              border: '2px solid #FFFFFF',
              color: '#FFFFFF',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              zIndex: 10000,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Score Display */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              color: '#FFFFFF',
              fontFamily: 'monospace',
              fontSize: isMobile ? '14px' : '18px',
              zIndex: 10000,
              textAlign: 'left',
            }}
            data-testid="score-display"
          >
            <div aria-live="polite" data-testid="current-score">
              Nyan score: {currentScore} seconds
            </div>
            {bestScore > 0 && (
              <div
                style={{
                  marginTop: '8px',
                  color: '#FFD700',
                  fontSize: isMobile ? '12px' : '14px',
                }}
                data-testid="best-score"
              >
                Best: {bestScore} seconds
              </div>
            )}
          </div>

          {/* How to fly — shown only for the first few seconds of a run. */}
          {!gameOver && !prefersReducedMotion && currentScore < 4 && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: isMobile ? '90px' : '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'monospace',
                fontSize: isMobile ? '12px' : '15px',
                textAlign: 'center',
                zIndex: 10000,
                pointerEvents: 'none',
              }}
            >
              Move to fly · ↑ ↓ also work · dodge the debris
            </div>
          )}

          {/* Game over */}
          {gameOver && (
            <div
              data-testid="game-over"
              role="status"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0,0,0,0.82)',
                border: '2px solid rgba(255,255,255,0.25)',
                borderRadius: '18px',
                padding: isMobile ? '24px 28px' : '34px 46px',
                textAlign: 'center',
                color: '#FFFFFF',
                fontFamily: 'monospace',
                zIndex: 10001,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: isMobile ? '38px' : '52px', lineHeight: 1 }}>💥</div>
              <div
                style={{
                  marginTop: '12px',
                  fontSize: isMobile ? '18px' : '24px',
                  fontWeight: 700,
                }}
              >
                Caught by space debris
              </div>
              <div style={{ marginTop: '10px', fontSize: isMobile ? '14px' : '17px' }}>
                You flew for {currentScore} second{currentScore === 1 ? '' : 's'}
              </div>
              {bestScore > 0 && (
                <div style={{ marginTop: '6px', color: '#FFD700', fontSize: isMobile ? '12px' : '15px' }}>
                  Best: {bestScore} seconds
                </div>
              )}
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={resetRun}
                  data-testid="play-again"
                  style={{
                    background: '#FFFFFF',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 22px',
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Play again
                </button>
                <button
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    color: '#FFFFFF',
                    border: '2px solid rgba(255,255,255,0.35)',
                    borderRadius: '10px',
                    padding: '10px 22px',
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              zIndex: 10000,
            }}
            data-testid="share-buttons-container"
          >
            <ShareButtons score={currentScore} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PartyModeOverlay;
