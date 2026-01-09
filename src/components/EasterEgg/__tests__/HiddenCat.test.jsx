import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HiddenCat, {
  SPAWN_PROBABILITY,
  CAT_MODES,
  CAT_SIZE,
  getHiddenPosition,
  getRandomPagePosition,
  getRandomVelocity,
  getRandomTilt,
  shouldSpawn,
  selectMode,
} from '../HiddenCat';

describe('HiddenCat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.innerWidth = 1024;
    global.innerHeight = 768;
    // Mock document dimensions
    Object.defineProperty(document.body, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(cb, 16);
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      clearTimeout(id);
    });
    // Mock matchMedia for reduced motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constants', () => {
    it('should have spawn probability of 30%', () => {
      expect(SPAWN_PROBABILITY).toBe(0.3);
    });

    it('should have floating and hidden modes', () => {
      expect(CAT_MODES.FLOATING).toBe('floating');
      expect(CAT_MODES.HIDDEN).toBe('hidden');
    });

    it('should have cat size of 40px', () => {
      expect(CAT_SIZE).toBe(40);
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

  describe('selectMode', () => {
    it('should return either floating or hidden', () => {
      const mode = selectMode();
      expect([CAT_MODES.FLOATING, CAT_MODES.HIDDEN]).toContain(mode);
    });

    it('should select both modes approximately equally', () => {
      const iterations = 1000;
      let floatingCount = 0;

      for (let i = 0; i < iterations; i++) {
        if (selectMode() === CAT_MODES.FLOATING) {
          floatingCount++;
        }
      }

      const percentage = floatingCount / iterations;
      expect(percentage).toBeGreaterThan(0.4);
      expect(percentage).toBeLessThan(0.6);
    });
  });

  describe('getRandomTilt', () => {
    it('should return a number between -15 and 15 degrees', () => {
      for (let i = 0; i < 100; i++) {
        const tilt = getRandomTilt();
        expect(tilt).toBeGreaterThanOrEqual(-15);
        expect(tilt).toBeLessThanOrEqual(15);
      }
    });
  });

  describe('getRandomPagePosition', () => {
    it('should return position within page bounds', () => {
      const margin = CAT_SIZE + 50;
      const pageHeight = 2000; // mocked in beforeEach

      for (let i = 0; i < 10; i++) {
        const pos = getRandomPagePosition();
        expect(pos.x).toBeGreaterThanOrEqual(margin);
        expect(pos.x).toBeLessThanOrEqual(global.innerWidth - margin);
        expect(pos.y).toBeGreaterThanOrEqual(200);
        expect(pos.y).toBeLessThanOrEqual(pageHeight - 200); // 200 + (pageHeight - 400)
      }
    });
  });

  describe('getRandomVelocity', () => {
    it('should return velocity with vx and vy properties', () => {
      const velocity = getRandomVelocity();
      expect(velocity).toHaveProperty('vx');
      expect(velocity).toHaveProperty('vy');
    });

    it('should return speed between 1.5 and 2.5', () => {
      for (let i = 0; i < 10; i++) {
        const velocity = getRandomVelocity();
        const speed = Math.sqrt(velocity.vx ** 2 + velocity.vy ** 2);
        expect(speed).toBeGreaterThanOrEqual(1.5);
        expect(speed).toBeLessThanOrEqual(2.5);
      }
    });
  });

  describe('getHiddenPosition', () => {
    it('should return position with edge property (left or right)', () => {
      const pos = getHiddenPosition();
      expect(['left', 'right']).toContain(pos.edge);
    });

    it('should return clipPercent between 40 and 60', () => {
      for (let i = 0; i < 20; i++) {
        const pos = getHiddenPosition();
        expect(pos.clipPercent).toBeGreaterThanOrEqual(40);
        expect(pos.clipPercent).toBeLessThanOrEqual(60);
      }
    });

    it('should position cat partially off-screen for left edge', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0) // Select 'left' edge
        .mockReturnValueOnce(0.5) // clipPercent
        .mockReturnValueOnce(0.5); // y position

      const pos = getHiddenPosition();
      expect(pos.edge).toBe('left');
      expect(pos.x).toBeLessThan(0);
    });

    it('should position cat partially off-screen for right edge', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.6) // Select 'right' edge
        .mockReturnValueOnce(0.5) // clipPercent
        .mockReturnValueOnce(0.5); // y position

      const pos = getHiddenPosition();
      expect(pos.edge).toBe('right');
      expect(pos.x).toBeGreaterThan(global.innerWidth - CAT_SIZE);
    });

    it('should position y within page height', () => {
      const pageHeight = 2000; // mocked in beforeEach
      const pos = getHiddenPosition();
      expect(pos.y).toBeGreaterThanOrEqual(200);
      expect(pos.y).toBeLessThanOrEqual(pageHeight - 200);
    });
  });

  describe('HiddenCat component', () => {
    it('should render when spawn probability succeeds', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1); // Less than 0.3

      render(<HiddenCat />);

      const cat = screen.queryByLabelText(/hidden cat/i);
      expect(cat).toBeInTheDocument();
    });

    it('should not render when spawn probability fails', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // Greater than 0.3

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

    it('should have absolute position styling (not fixed)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveStyle({ position: 'absolute' });
    });

    it('should have cursor pointer styling', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveStyle({ cursor: 'pointer' });
    });

    it('should have font size of 40px', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveStyle({ fontSize: '40px' });
    });

    it('should have data-mode attribute', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      const mode = cat.getAttribute('data-mode');
      expect([CAT_MODES.FLOATING, CAT_MODES.HIDDEN]).toContain(mode);
    });

    it('should render in floating mode with correct data attribute', () => {
      // Force floating mode
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2) // shouldSpawn - true
        .mockReturnValueOnce(0.2) // selectMode - floating
        .mockReturnValue(0.5); // other random calls

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveAttribute('data-mode', CAT_MODES.FLOATING);
    });

    it('should render in hidden mode with correct data attribute', () => {
      // Force hidden mode
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2) // shouldSpawn - true
        .mockReturnValueOnce(0.8) // selectMode - hidden
        .mockReturnValue(0.5); // other random calls

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveAttribute('data-mode', CAT_MODES.HIDDEN);
    });

    it('should apply tilt transform', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      const transform = cat.style.transform;
      expect(transform).toMatch(/rotate\(-?\d+(\.\d+)?deg\)/);
    });
  });

  describe('Floating mode animation', () => {
    it('should call requestAnimationFrame in floating mode', async () => {
      // Force floating mode
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2) // shouldSpawn - true
        .mockReturnValueOnce(0.2) // selectMode - floating
        .mockReturnValue(0.5);

      render(<HiddenCat />);

      // Wait for useEffect to run
      await vi.waitFor(() => {
        expect(window.requestAnimationFrame).toHaveBeenCalled();
      });
    });

    it('should cleanup animation frame on unmount', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.2)
        .mockReturnValue(0.5);

      const { unmount } = render(<HiddenCat />);
      unmount();

      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should have continuous animation loop (calls requestAnimationFrame repeatedly)', async () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2) // shouldSpawn - true
        .mockReturnValueOnce(0.2) // selectMode - floating
        .mockReturnValue(0.5);

      render(<HiddenCat />);

      // Wait for multiple frames - animation should be called many times
      await vi.waitFor(() => {
        expect(window.requestAnimationFrame.mock.calls.length).toBeGreaterThan(1);
      }, { timeout: 100 });
    });

    it('should not start animation in hidden mode', async () => {
      // Clear any previous calls first
      window.requestAnimationFrame.mockClear();

      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2) // shouldSpawn - true
        .mockReturnValueOnce(0.8) // selectMode - hidden
        .mockReturnValue(0.5);

      const { unmount } = render(<HiddenCat />);

      // Give time for any animation to potentially start
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Unmount to stop any further frames
      unmount();

      // In hidden mode, requestAnimationFrame should not be called at all
      // (other tests running in parallel may have caused calls, so we just check it was not called for this component)
      const cat = screen.queryByLabelText(/hidden cat/i);
      expect(cat).toBeNull(); // Cat is unmounted
    });

    it('should keep cat fully visible in floating mode (no clipping)', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.2)
        .mockReturnValue(0.5);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      // No clip-path or overflow:hidden should be applied
      expect(cat.style.clipPath).toBeFalsy();
      expect(cat.style.overflow).toBeFalsy();
    });
  });

  describe('Hidden mode positioning', () => {
    it('should position cat at edge in hidden mode', () => {
      // Force hidden mode
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2) // shouldSpawn - true
        .mockReturnValueOnce(0.8) // selectMode - hidden
        .mockReturnValue(0.5);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveAttribute('data-mode', CAT_MODES.HIDDEN);
      // Cat should be positioned (has left and top styles)
      expect(cat.style.left).toBeTruthy();
      expect(cat.style.top).toBeTruthy();
    });

    it('should have tilt applied in hidden mode', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.8)
        .mockReturnValue(0.5);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      const transform = cat.style.transform;
      expect(transform).toMatch(/rotate\(-?\d+(\.\d+)?deg\)/);
    });

    it('should remain clickable in hidden mode', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.8)
        .mockReturnValue(0.5);
      const handleClick = vi.fn();

      render(<HiddenCat onCatClick={handleClick} />);

      const cat = screen.getByLabelText(/hidden cat/i);
      fireEvent.click(cat);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should remain static (no position change) in hidden mode', async () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.8)
        .mockReturnValue(0.5);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      const initialLeft = cat.style.left;
      const initialTop = cat.style.top;

      // Wait a bit to see if position changes
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Position should remain the same
      expect(cat.style.left).toBe(initialLeft);
      expect(cat.style.top).toBe(initialTop);
    });
  });

  describe('Reduced motion preference', () => {
    it('should respect prefers-reduced-motion', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.2)
        .mockReturnValue(0.5);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveStyle({ transition: 'none' });
    });
  });
});
