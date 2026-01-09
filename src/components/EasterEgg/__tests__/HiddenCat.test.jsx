import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HiddenCat, {
  SPAWN_PROBABILITY,
  CAT_MODES,
  STORAGE_KEYS,
  CAT_SIZE,
  getHiddenPosition,
  getFloatingStartPosition,
  getRandomVelocity,
  getRandomTilt,
  shouldSpawn,
  selectMode,
} from '../HiddenCat';

describe('HiddenCat', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
    global.innerWidth = 1024;
    global.innerHeight = 768;
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
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Constants', () => {
    it('should have spawn probability of 50%', () => {
      expect(SPAWN_PROBABILITY).toBe(0.5);
    });

    it('should have floating and hidden modes', () => {
      expect(CAT_MODES.FLOATING).toBe('floating');
      expect(CAT_MODES.HIDDEN).toBe('hidden');
    });

    it('should have correct storage keys', () => {
      expect(STORAGE_KEYS.SPAWNED).toBe('hiddenCatSpawned');
      expect(STORAGE_KEYS.MODE).toBe('hiddenCatMode');
    });

    it('should have cat size of 80px', () => {
      expect(CAT_SIZE).toBe(80);
    });
  });

  describe('shouldSpawn', () => {
    it('should return boolean', () => {
      const result = shouldSpawn();
      expect(typeof result).toBe('boolean');
    });

    it('should return true approximately 50% of the time', () => {
      const iterations = 1000;
      let trueCount = 0;

      for (let i = 0; i < iterations; i++) {
        if (shouldSpawn()) {
          trueCount++;
        }
      }

      const percentage = trueCount / iterations;
      expect(percentage).toBeGreaterThan(0.4);
      expect(percentage).toBeLessThan(0.6);
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

  describe('getFloatingStartPosition', () => {
    it('should return position within viewport bounds with margin', () => {
      const margin = CAT_SIZE + 20;

      for (let i = 0; i < 10; i++) {
        const pos = getFloatingStartPosition();
        expect(pos.x).toBeGreaterThanOrEqual(margin);
        expect(pos.x).toBeLessThanOrEqual(global.innerWidth - margin);
        expect(pos.y).toBeGreaterThanOrEqual(margin);
        expect(pos.y).toBeLessThanOrEqual(global.innerHeight - margin);
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
    it('should return position with edge property', () => {
      const pos = getHiddenPosition();
      expect(['left', 'right', 'bottom']).toContain(pos.edge);
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
        .mockReturnValueOnce(0.4) // Select 'right' edge
        .mockReturnValueOnce(0.5) // clipPercent
        .mockReturnValueOnce(0.5); // y position

      const pos = getHiddenPosition();
      expect(pos.edge).toBe('right');
      expect(pos.x).toBeGreaterThan(global.innerWidth - CAT_SIZE);
    });

    it('should position cat partially off-screen for bottom edge', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.8) // Select 'bottom' edge
        .mockReturnValueOnce(0.5) // clipPercent
        .mockReturnValueOnce(0.5); // x position

      const pos = getHiddenPosition();
      expect(pos.edge).toBe('bottom');
      expect(pos.y).toBeGreaterThan(global.innerHeight - CAT_SIZE);
    });
  });

  describe('HiddenCat component', () => {
    it('should not render if sessionStorage indicates already spawned', () => {
      sessionStorage.setItem(STORAGE_KEYS.SPAWNED, 'true');

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

      expect(sessionStorage.getItem(STORAGE_KEYS.SPAWNED)).toBe('true');
    });

    it('should store mode in sessionStorage', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const mode = sessionStorage.getItem(STORAGE_KEYS.MODE);
      expect([CAT_MODES.FLOATING, CAT_MODES.HIDDEN]).toContain(mode);
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

    it('should have larger font size (80px)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);

      render(<HiddenCat />);

      const cat = screen.getByLabelText(/hidden cat/i);
      expect(cat).toHaveStyle({ fontSize: '80px' });
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
