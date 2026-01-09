import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RainbowTrail from './RainbowTrail';

export const generateStars = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 2,
  }));
};

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

  // Timer logic
  useEffect(() => {
    if (isOpen) {
      // Reset and start timer when overlay opens
      setCurrentScore(0);
      isPausedRef.current = false;

      timerRef.current = setInterval(() => {
        if (!isPausedRef.current) {
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
          role="dialog"
          aria-label="Party mode overlay"
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

          {/* Rainbow Trail */}
          <RainbowTrail />

          {/* Cat GIF */}
          <div
            style={{
              position: 'absolute',
              left: isMobile ? '10%' : '15%',
              top: '50%',
              transform: 'translateY(-50%)',
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PartyModeOverlay;
