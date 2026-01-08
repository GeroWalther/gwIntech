import { useState, useEffect } from 'react';

export const getRandomPosition = () => {
  const topMargin = 100;
  const bottomMargin = 100;
  const sideMargin = 50;

  const maxWidth = typeof window !== 'undefined' ? window.innerWidth - sideMargin * 2 : 1000;
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight - topMargin - bottomMargin : 600;

  const x = Math.random() * maxWidth + sideMargin;
  const y = Math.random() * maxHeight + topMargin;

  return { x, y };
};

export const shouldSpawn = () => {
  return Math.random() < 0.3;
};

const HiddenCat = ({ onCatClick }) => {
  const [position, setPosition] = useState(null);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSpawned = sessionStorage.getItem('hiddenCatSpawned');

    if (!hasSpawned) {
      const willSpawn = shouldSpawn();

      if (willSpawn) {
        setPosition(getRandomPosition());
        setShouldShow(true);
        sessionStorage.setItem('hiddenCatSpawned', 'true');
      }
    }
  }, []);

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

  if (!shouldShow || !position) {
    return null;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: 'pointer',
        zIndex: 1000,
      }}
      aria-label="Hidden cat - click to reveal surprise"
    >
      🐱
    </div>
  );
};

export default HiddenCat;
