import { useState, useEffect, useRef, useCallback } from 'react';

// Spawn probability - 30%
export const SPAWN_PROBABILITY = 0.3;

// Cat modes
export const CAT_MODES = {
  FLOATING: 'floating',
  HIDDEN: 'hidden',
};

// Cat size
export const CAT_SIZE = 40; // px

// Generate random position within the page (not viewport)
export const getRandomPagePosition = () => {
  if (typeof document === 'undefined') return { x: 100, y: 500 };

  const pageHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    1000
  );
  const pageWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;

  const margin = CAT_SIZE + 50;
  const x = margin + Math.random() * (pageWidth - margin * 2);
  const y = 200 + Math.random() * (pageHeight - 400); // Avoid header/footer areas

  return { x, y };
};

// Generate random position for hidden mode (peeking from edges)
export const getHiddenPosition = () => {
  if (typeof document === 'undefined') return { x: 0, y: 500, edge: 'right', clipPercent: 50 };

  const pageHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    1000
  );
  const pageWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;

  const edges = ['left', 'right'];
  const edge = edges[Math.floor(Math.random() * edges.length)];

  let x, y;
  const clipPercent = 40 + Math.random() * 20; // 40-60% visible

  // Random Y position along the page
  y = 200 + Math.random() * (pageHeight - 400);

  if (edge === 'left') {
    x = -(CAT_SIZE * (1 - clipPercent / 100));
  } else {
    x = pageWidth - (CAT_SIZE * clipPercent / 100);
  }

  return { x, y, edge, clipPercent };
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

  const animationRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  // Initialize spawn and mode on mount - NO sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const willSpawn = shouldSpawn();

    if (willSpawn) {
      const selectedMode = selectMode();
      const randomTilt = getRandomTilt();

      setMode(selectedMode);
      setTilt(randomTilt);

      if (selectedMode === CAT_MODES.FLOATING) {
        const startPos = getRandomPagePosition();
        const startVel = getRandomVelocity();
        setPosition(startPos);
        setVelocity(startVel);
      } else {
        const hiddenPos = getHiddenPosition();
        setPosition({ x: hiddenPos.x, y: hiddenPos.y });
      }

      setShouldShow(true);
    }
  }, []);

  // Floating animation loop - bounces within page bounds
  const animate = useCallback(() => {
    if (mode !== CAT_MODES.FLOATING || prefersReducedMotion.current) return;

    setPosition((prevPos) => {
      const pageHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        1000
      );
      const pageWidth = window.innerWidth;

      let newX = prevPos.x + velocity.vx;
      let newY = prevPos.y + velocity.vy;
      let newVx = velocity.vx;
      let newVy = velocity.vy;

      // Bounce off edges (page bounds, not viewport)
      if (newX <= 0 || newX >= pageWidth - CAT_SIZE) {
        newVx = -newVx;
        newX = Math.max(0, Math.min(newX, pageWidth - CAT_SIZE));
      }
      if (newY <= 100 || newY >= pageHeight - 100) {
        newVy = -newVy;
        newY = Math.max(100, Math.min(newY, pageHeight - 100));
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

  // Use absolute positioning (relative to page, not viewport)
  const baseStyle = {
    position: 'absolute',
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
