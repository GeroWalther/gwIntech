import { useState, useEffect, useRef, useCallback } from 'react';

// Spawn probability - 50%
export const SPAWN_PROBABILITY = 0.5;

// Cat modes
export const CAT_MODES = {
  FLOATING: 'floating',
  HIDDEN: 'hidden',
};

// Session storage keys
export const STORAGE_KEYS = {
  SPAWNED: 'hiddenCatSpawned',
  MODE: 'hiddenCatMode',
  POSITION: 'hiddenCatPosition',
  VELOCITY: 'hiddenCatVelocity',
  TILT: 'hiddenCatTilt',
};

// Cat size (larger than before)
export const CAT_SIZE = 80; // px

// Generate random position for hidden mode (peeking from edges)
export const getHiddenPosition = () => {
  if (typeof window === 'undefined') return { x: 0, y: 0, edge: 'bottom', clipPercent: 50 };

  const edges = ['left', 'right', 'bottom'];
  const edge = edges[Math.floor(Math.random() * edges.length)];

  let x, y, clipPercent;
  clipPercent = 40 + Math.random() * 20; // 40-60% visible

  const padding = 100; // Keep away from corners

  switch (edge) {
    case 'left':
      x = -(CAT_SIZE * (1 - clipPercent / 100));
      y = padding + Math.random() * (window.innerHeight - padding * 2 - CAT_SIZE);
      break;
    case 'right':
      x = window.innerWidth - (CAT_SIZE * clipPercent / 100);
      y = padding + Math.random() * (window.innerHeight - padding * 2 - CAT_SIZE);
      break;
    case 'bottom':
    default:
      x = padding + Math.random() * (window.innerWidth - padding * 2 - CAT_SIZE);
      y = window.innerHeight - (CAT_SIZE * clipPercent / 100);
      break;
  }

  return { x, y, edge, clipPercent };
};

// Generate random position for floating mode
export const getFloatingStartPosition = () => {
  if (typeof window === 'undefined') return { x: 100, y: 100 };

  const margin = CAT_SIZE + 20;
  const x = margin + Math.random() * (window.innerWidth - margin * 2);
  const y = margin + Math.random() * (window.innerHeight - margin * 2);

  return { x, y };
};

// Generate random velocity for floating mode
export const getRandomVelocity = () => {
  const speed = 1.5 + Math.random() * 1; // 1.5-2.5 px per frame
  const angle = Math.random() * Math.PI * 2;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
};

// Generate random tilt angle
export const getRandomTilt = () => {
  return (Math.random() - 0.5) * 30; // -15 to 15 degrees
};

// Check spawn probability
export const shouldSpawn = () => {
  return Math.random() < SPAWN_PROBABILITY;
};

// Randomly select mode
export const selectMode = () => {
  return Math.random() < 0.5 ? CAT_MODES.FLOATING : CAT_MODES.HIDDEN;
};

const HiddenCat = ({ onCatClick }) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [mode, setMode] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [tilt, setTilt] = useState(0);
  const [hiddenEdge, setHiddenEdge] = useState(null);
  const [clipPercent, setClipPercent] = useState(100);

  const animationRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  // Initialize spawn and mode on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hasSpawned = sessionStorage.getItem(STORAGE_KEYS.SPAWNED);

    if (!hasSpawned) {
      const willSpawn = shouldSpawn();

      if (willSpawn) {
        const selectedMode = selectMode();
        const randomTilt = getRandomTilt();

        setMode(selectedMode);
        setTilt(randomTilt);

        if (selectedMode === CAT_MODES.FLOATING) {
          const startPos = getFloatingStartPosition();
          const startVel = getRandomVelocity();
          setPosition(startPos);
          setVelocity(startVel);
        } else {
          const hiddenPos = getHiddenPosition();
          setPosition({ x: hiddenPos.x, y: hiddenPos.y });
          setHiddenEdge(hiddenPos.edge);
          setClipPercent(hiddenPos.clipPercent);
        }

        setShouldShow(true);
        sessionStorage.setItem(STORAGE_KEYS.SPAWNED, 'true');
        sessionStorage.setItem(STORAGE_KEYS.MODE, selectedMode);
      }
    }
  }, []);

  // Floating animation loop
  const animate = useCallback(() => {
    if (mode !== CAT_MODES.FLOATING || prefersReducedMotion.current) return;

    setPosition((prevPos) => {
      let newX = prevPos.x + velocity.vx;
      let newY = prevPos.y + velocity.vy;
      let newVx = velocity.vx;
      let newVy = velocity.vy;

      // Bounce off edges
      if (newX <= 0 || newX >= window.innerWidth - CAT_SIZE) {
        newVx = -newVx;
        newX = Math.max(0, Math.min(newX, window.innerWidth - CAT_SIZE));
      }
      if (newY <= 0 || newY >= window.innerHeight - CAT_SIZE) {
        newVy = -newVy;
        newY = Math.max(0, Math.min(newY, window.innerHeight - CAT_SIZE));
      }

      // Update velocity if changed
      if (newVx !== velocity.vx || newVy !== velocity.vy) {
        setVelocity({ vx: newVx, vy: newVy });
      }

      return { x: newX, y: newY };
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [mode, velocity]);

  // Start/stop animation based on mode
  useEffect(() => {
    if (shouldShow && mode === CAT_MODES.FLOATING && !prefersReducedMotion.current) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldShow, mode, animate]);

  const handleClick = () => {
    if (onCatClick) {
      onCatClick();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  if (!shouldShow) {
    return null;
  }

  // Styles based on mode
  const baseStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: 'pointer',
    zIndex: 1000,
    fontSize: `${CAT_SIZE}px`,
    lineHeight: 1,
    transform: `rotate(${tilt}deg)`,
    transition: prefersReducedMotion.current ? 'none' : undefined,
    userSelect: 'none',
  };

  // For hidden mode, add clip styling based on edge
  if (mode === CAT_MODES.HIDDEN) {
    // The cat is already positioned partially off-screen, so it naturally clips
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={baseStyle}
      aria-label="Hidden cat - click to reveal surprise"
      data-mode={mode}
      data-testid="hidden-cat"
    >
      🐱
    </div>
  );
};

export default HiddenCat;
