import { useState, useEffect } from 'react';
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

const PartyModeOverlay = ({ isOpen, onClose }) => {
  const [stars, setStars] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [catLoaded, setCatLoaded] = useState(false);

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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PartyModeOverlay;
