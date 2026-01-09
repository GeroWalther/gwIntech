import { useState, useEffect } from 'react';

export const RAINBOW_COLORS = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#8B00FF', // Violet
];

const RainbowTrail = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add keyframes to document if not already present
    if (!document.getElementById('rainbow-trail-keyframes')) {
      const style = document.createElement('style');
      style.id = 'rainbow-trail-keyframes';
      style.textContent = `
        @keyframes rainbowFlow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-80px);
          }
        }
      `;
      document.head.appendChild(style);
    }

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

  const barHeight = isMobile ? 8 : 12;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '100%',
        height: `${barHeight * 6}px`,
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      {RAINBOW_COLORS.map((color, index) => (
        <div
          key={color}
          data-testid={`rainbow-bar-${index}`}
          style={{
            position: 'absolute',
            top: `${barHeight * index}px`,
            left: 0,
            width: '100%',
            height: `${barHeight}px`,
            backgroundColor: color,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '200%',
              height: '100%',
              background: `repeating-linear-gradient(
                to right,
                ${color} 0px,
                ${color} 40px,
                transparent 40px,
                transparent 80px
              )`,
              animation: prefersReducedMotion
                ? 'none'
                : `rainbowFlow 2s linear infinite`,
              animationDelay: prefersReducedMotion ? '0s' : `${index * 0.1}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default RainbowTrail;
