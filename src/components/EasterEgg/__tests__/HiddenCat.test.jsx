import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HiddenCat, { getRandomPosition, shouldSpawn } from '../HiddenCat';

describe('HiddenCat', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('getRandomPosition', () => {
    it('should generate position within safe margins', () => {
      global.innerWidth = 1000;
      global.innerHeight = 800;

      const position = getRandomPosition();

      expect(position.x).toBeGreaterThanOrEqual(50);
      expect(position.x).toBeLessThanOrEqual(950);
      expect(position.y).toBeGreaterThanOrEqual(100);
      expect(position.y).toBeLessThanOrEqual(700);
    });

    it('should respect top margin of 100px', () => {
      global.innerHeight = 800;

      const positions = Array.from({ length: 10 }, () => getRandomPosition());

      positions.forEach((pos) => {
        expect(pos.y).toBeGreaterThanOrEqual(100);
      });
    });

    it('should respect bottom margin of 100px', () => {
      global.innerHeight = 800;

      const positions = Array.from({ length: 10 }, () => getRandomPosition());

      positions.forEach((pos) => {
        expect(pos.y).toBeLessThanOrEqual(700);
      });
    });

    it('should respect side margins of 50px', () => {
      global.innerWidth = 1000;

      const positions = Array.from({ length: 10 }, () => getRandomPosition());

      positions.forEach((pos) => {
        expect(pos.x).toBeGreaterThanOrEqual(50);
        expect(pos.x).toBeLessThanOrEqual(950);
      });
    });
  });

  describe('shouldSpawn', () => {
    it('should return boolean', () => {
      const result = shouldSpawn();
      expect(typeof result).toBe('boolean');
    });

    it('should return true approximately 30% of the time', () => {
      const iterations = 1000;
      let trueCount = 0;

      for (let i = 0; i < iterations; i++) {
        if (shouldSpawn()) {
          trueCount++;
        }
      }

      const percentage = trueCount / iterations;
      expect(percentage).toBeGreaterThan(0.2);
      expect(percentage).toBeLessThan(0.4);
    });
  });

  describe('HiddenCat component', () => {
    it('should not render if sessionStorage indicates already spawned', () => {
      sessionStorage.setItem('hiddenCatSpawned', 'true');

      const { container } = render(<HiddenCat />);

      expect(container.firstChild).toBeNull();
    });

    it('should render when spawn probability succeeds', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.queryByLabelText(/hidden cat/i);
      expect(cat).toBeInTheDocument();
    });

    it('should not render when spawn probability fails', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.8);

      const { container } = render(<HiddenCat />);

      expect(container.firstChild).toBeNull();
    });

    it('should be keyboard focusable with tabIndex 0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveAttribute('tabIndex', '0');
    });

    it('should call onCatClick when clicked', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);
      const handleClick = vi.fn();

      render(<HiddenCat onCatClick={handleClick} />);

      const cat = screen.getByLabelText(/hidden cat/i);
      fireEvent.click(cat);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onCatClick when Enter key is pressed', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);
      const handleClick = vi.fn();

      render(<HiddenCat onCatClick={handleClick} />);

      const cat = screen.getByLabelText(/hidden cat/i);
      fireEvent.keyDown(cat, { key: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onCatClick when other keys are pressed', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);
      const handleClick = vi.fn();

      render(<HiddenCat onCatClick={handleClick} />);

      const cat = screen.getByLabelText(/hidden cat/i);
      fireEvent.keyDown(cat, { key: 'Space' });

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should set sessionStorage when spawning', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      expect(sessionStorage.getItem('hiddenCatSpawned')).toBe('true');
    });

    it('should have fixed position styling', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveStyle({ position: 'fixed' });
    });

    it('should have cursor pointer styling', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveStyle({ cursor: 'pointer' });
    });
  });
});
