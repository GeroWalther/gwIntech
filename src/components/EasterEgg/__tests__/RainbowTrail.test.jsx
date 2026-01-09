import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RainbowTrail, { RAINBOW_COLORS } from '../RainbowTrail';

describe('RainbowTrail', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.matchMedia
    global.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    // Set default window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Clean up any existing keyframes style
    const existingStyle = document.getElementById('rainbow-trail-keyframes');
    if (existingStyle) {
      existingStyle.remove();
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('RAINBOW_COLORS constant', () => {
    it('should export correct number of colors', () => {
      expect(RAINBOW_COLORS).toHaveLength(6);
    });

    it('should have colors in correct order', () => {
      expect(RAINBOW_COLORS[0]).toBe('#FF0000'); // Red
      expect(RAINBOW_COLORS[1]).toBe('#FF7F00'); // Orange
      expect(RAINBOW_COLORS[2]).toBe('#FFFF00'); // Yellow
      expect(RAINBOW_COLORS[3]).toBe('#00FF00'); // Green
      expect(RAINBOW_COLORS[4]).toBe('#0000FF'); // Blue
      expect(RAINBOW_COLORS[5]).toBe('#8B00FF'); // Violet
    });
  });

  describe('RainbowTrail component', () => {
    it('should render 6 horizontal bars', () => {
      const { container } = render(<RainbowTrail />);

      const bars = container.querySelectorAll('[data-testid^="rainbow-bar-"]');
      expect(bars).toHaveLength(6);
    });

    it('should render bars with correct colors', () => {
      const { container } = render(<RainbowTrail />);

      RAINBOW_COLORS.forEach((color, index) => {
        const bar = container.querySelector(`[data-testid="rainbow-bar-${index}"]`);
        expect(bar).toHaveStyle({ backgroundColor: color });
      });
    });

    it('should render bars stacked vertically', () => {
      const { container } = render(<RainbowTrail />);

      const bars = container.querySelectorAll('[data-testid^="rainbow-bar-"]');
      bars.forEach((bar, index) => {
        // Desktop height is 12px
        expect(bar).toHaveStyle({ top: `${12 * index}px` });
      });
    });

    it('should have correct positioning (absolute, centered)', () => {
      const { container } = render(<RainbowTrail />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({
        position: 'absolute',
        left: '0px',
        top: '50%',
        transform: 'translateY(-50%)',
      });
    });

    it('should have z-index of 1 (behind cat)', () => {
      const { container } = render(<RainbowTrail />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle({ zIndex: 1 });
    });

    it('should have aria-hidden attribute', () => {
      const { container } = render(<RainbowTrail />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have desktop bar height (12px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(<RainbowTrail />);

      const bars = container.querySelectorAll('[data-testid^="rainbow-bar-"]');
      bars.forEach((bar) => {
        expect(bar).toHaveStyle({ height: '12px' });
      });
    });

    it('should have mobile bar height (8px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      const { container } = render(<RainbowTrail />);

      const bars = container.querySelectorAll('[data-testid^="rainbow-bar-"]');
      bars.forEach((bar) => {
        expect(bar).toHaveStyle({ height: '8px' });
      });
    });

    it('should have animation on bars when not reduced motion', () => {
      const { container } = render(<RainbowTrail />);

      const bar = container.querySelector('[data-testid="rainbow-bar-0"]');
      const animatedElement = bar.firstChild;

      expect(animatedElement).toHaveStyle({
        animation: 'rainbowFlow 2s linear infinite',
      });
    });

    it('should have staggered animation delays', () => {
      const { container } = render(<RainbowTrail />);

      RAINBOW_COLORS.forEach((color, index) => {
        const bar = container.querySelector(`[data-testid="rainbow-bar-${index}"]`);
        const animatedElement = bar.firstChild;

        expect(animatedElement).toHaveStyle({
          animationDelay: `${index * 0.1}s`,
        });
      });
    });

    it('should disable animation when prefers-reduced-motion', () => {
      global.matchMedia = vi.fn().mockImplementation((query) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return {
            matches: true,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
          };
        }
        return {
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        };
      });

      const { container } = render(<RainbowTrail />);

      const bar = container.querySelector('[data-testid="rainbow-bar-0"]');
      const animatedElement = bar.firstChild;

      expect(animatedElement).toHaveStyle({
        animation: 'none',
      });
    });

    it('should have repeating gradient background', () => {
      const { container } = render(<RainbowTrail />);

      const bar = container.querySelector('[data-testid="rainbow-bar-0"]');
      const animatedElement = bar.firstChild;

      const backgroundStyle = animatedElement.style.background;
      expect(backgroundStyle).toContain('repeating-linear-gradient');
      expect(backgroundStyle).toContain('to right');
    });

    it('should inject keyframes style into document head', () => {
      render(<RainbowTrail />);

      const styleElement = document.getElementById('rainbow-trail-keyframes');
      expect(styleElement).toBeTruthy();
      expect(styleElement.textContent).toContain('@keyframes rainbowFlow');
      expect(styleElement.textContent).toContain('translateX');
    });

    it('should not inject duplicate keyframes if already present', () => {
      // First render - creates style
      render(<RainbowTrail />);
      const firstStyleElement = document.getElementById('rainbow-trail-keyframes');
      expect(firstStyleElement).toBeTruthy();

      // Second render - should not create duplicate
      render(<RainbowTrail />);
      const allStyles = document.querySelectorAll('#rainbow-trail-keyframes');
      expect(allStyles).toHaveLength(1);
    });

    it('should have overflow hidden on bars', () => {
      const { container } = render(<RainbowTrail />);

      const bars = container.querySelectorAll('[data-testid^="rainbow-bar-"]');
      bars.forEach((bar) => {
        expect(bar).toHaveStyle({ overflow: 'hidden' });
      });
    });

    it('should have 200% width on animated element for seamless loop', () => {
      const { container } = render(<RainbowTrail />);

      const bar = container.querySelector('[data-testid="rainbow-bar-0"]');
      const animatedElement = bar.firstChild;

      expect(animatedElement).toHaveStyle({ width: '200%' });
    });

    it('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<RainbowTrail />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });
});
