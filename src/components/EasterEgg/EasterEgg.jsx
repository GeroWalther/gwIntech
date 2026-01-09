import { useState } from 'react';
import HiddenCat from './HiddenCat';
import PartyModeOverlay from './PartyModeOverlay';

const EasterEgg = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleCatClick = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <>
      <HiddenCat onCatClick={handleCatClick} />
      <PartyModeOverlay isOpen={isOverlayOpen} onClose={handleCloseOverlay} />
    </>
  );
};

export default EasterEgg;
