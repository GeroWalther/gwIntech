import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PartyModeOverlay, {
  BEST_SCORE_KEY,
  getBestScore,
  saveBestScore,
} from '../PartyModeOverlay';

describe('Timer functionality', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    // Mock window.matchMedia for reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('BEST_SCORE_KEY constant', () => {
    it('should be "nyanBestScore"', () => {
      expect(BEST_SCORE_KEY).toBe('nyanBestScore');
    });
  });

  describe('getBestScore', () => {
    it('should return 0 when no score is stored', () => {
      expect(getBestScore()).toBe(0);
    });

    it('should return stored score from localStorage', () => {
      localStorage.setItem(BEST_SCORE_KEY, '42');
      expect(getBestScore()).toBe(42);
    });

    it('should parse integer correctly', () => {
      localStorage.setItem(BEST_SCORE_KEY, '100');
      expect(getBestScore()).toBe(100);
    });
  });

  describe('saveBestScore', () => {
    it('should save score when higher than current best', () => {
      expect(saveBestScore(10)).toBe(true);
      expect(localStorage.getItem(BEST_SCORE_KEY)).toBe('10');
    });

    it('should not save score when lower than current best', () => {
      localStorage.setItem(BEST_SCORE_KEY, '50');
      expect(saveBestScore(30)).toBe(false);
      expect(localStorage.getItem(BEST_SCORE_KEY)).toBe('50');
    });

    it('should save score when equal to current best (first time)', () => {
      expect(saveBestScore(0)).toBe(false); // 0 is not > 0
    });

    it('should update best score when new score is higher', () => {
      localStorage.setItem(BEST_SCORE_KEY, '10');
      expect(saveBestScore(20)).toBe(true);
      expect(localStorage.getItem(BEST_SCORE_KEY)).toBe('20');
    });
  });

  describe('Timer component behavior', () => {
    it('should display initial score of 0 when overlay opens', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);
      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 0 seconds'
      );
    });

    it('should increment score every second', async () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);

      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 0 seconds'
      );

      // Advance timer by 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 1 seconds'
      );

      // Advance timer by another 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 3 seconds'
      );
    });

    it('should reset score when overlay closes and reopens', () => {
      const { rerender } = render(
        <PartyModeOverlay isOpen={true} onClose={() => {}} />
      );

      // Advance timer by 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 5 seconds'
      );

      // Close overlay
      rerender(<PartyModeOverlay isOpen={false} onClose={() => {}} />);

      // Reopen overlay
      rerender(<PartyModeOverlay isOpen={true} onClose={() => {}} />);

      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 0 seconds'
      );
    });

    it('should have aria-live="polite" on score display', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);
      expect(screen.getByTestId('current-score')).toHaveAttribute(
        'aria-live',
        'polite'
      );
    });

    it('should not display best score when it is 0', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);
      expect(screen.queryByTestId('best-score')).not.toBeInTheDocument();
    });

    it('should display best score when it is greater than 0', () => {
      localStorage.setItem(BEST_SCORE_KEY, '25');
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);

      expect(screen.getByTestId('best-score')).toBeInTheDocument();
      expect(screen.getByTestId('best-score')).toHaveTextContent(
        'Best: 25 seconds'
      );
    });

    it('should save best score when overlay closes', () => {
      const { rerender } = render(
        <PartyModeOverlay isOpen={true} onClose={() => {}} />
      );

      // Advance timer by 10 seconds
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Close overlay
      rerender(<PartyModeOverlay isOpen={false} onClose={() => {}} />);

      // Best score should be saved
      expect(localStorage.getItem(BEST_SCORE_KEY)).toBe('10');
    });

    it('should not save score as best if lower than existing best', () => {
      localStorage.setItem(BEST_SCORE_KEY, '100');
      const { rerender } = render(
        <PartyModeOverlay isOpen={true} onClose={() => {}} />
      );

      // Advance timer by 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Close overlay
      rerender(<PartyModeOverlay isOpen={false} onClose={() => {}} />);

      // Best score should remain unchanged
      expect(localStorage.getItem(BEST_SCORE_KEY)).toBe('100');
    });
  });

  describe('Visibility change handling', () => {
    it('should pause timer when tab becomes hidden', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);

      // Advance timer by 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 2 seconds'
      );

      // Simulate tab becoming hidden
      act(() => {
        Object.defineProperty(document, 'visibilityState', {
          value: 'hidden',
          writable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });

      // Advance timer by 3 more seconds (should not increment)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Score should still be 2 (paused)
      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 2 seconds'
      );
    });

    it('should resume timer when tab becomes visible again', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);

      // Advance timer by 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Simulate tab becoming hidden
      act(() => {
        Object.defineProperty(document, 'visibilityState', {
          value: 'hidden',
          writable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });

      // Advance timer by 3 seconds (paused, should not increment)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Simulate tab becoming visible
      act(() => {
        Object.defineProperty(document, 'visibilityState', {
          value: 'visible',
          writable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });

      // Advance timer by 2 more seconds (should increment)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Score should be 4 (2 initial + 2 after resume)
      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 4 seconds'
      );
    });

    it('should not increment during hidden state', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);

      // Simulate tab hidden immediately
      act(() => {
        Object.defineProperty(document, 'visibilityState', {
          value: 'hidden',
          writable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });

      // Advance timer by 10 seconds
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      // Score should still be 0
      expect(screen.getByTestId('current-score')).toHaveTextContent(
        'Nyan score: 0 seconds'
      );
    });
  });

  describe('Timer cleanup', () => {
    it('should clean up timer when overlay closes', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      const { rerender } = render(
        <PartyModeOverlay isOpen={true} onClose={() => {}} />
      );

      // Advance timer
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Close overlay
      rerender(<PartyModeOverlay isOpen={false} onClose={() => {}} />);

      // clearInterval should have been called
      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('should clean up visibility listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      const { unmount } = render(
        <PartyModeOverlay isOpen={true} onClose={() => {}} />
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'visibilitychange',
        expect.any(Function)
      );
    });
  });

  describe('Score display UI', () => {
    it('should have score display in top-left corner', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);
      const scoreDisplay = screen.getByTestId('score-display');
      expect(scoreDisplay).toHaveStyle({
        position: 'absolute',
        top: '20px',
        left: '20px',
      });
    });

    it('should display score in white color', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);
      const scoreDisplay = screen.getByTestId('score-display');
      expect(scoreDisplay).toHaveStyle({ color: '#FFFFFF' });
    });

    it('should display best score in gold color', () => {
      localStorage.setItem(BEST_SCORE_KEY, '10');
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);
      const bestScore = screen.getByTestId('best-score');
      expect(bestScore).toHaveStyle({ color: '#FFD700' });
    });

    it('should use monospace font for score display', () => {
      render(<PartyModeOverlay isOpen={true} onClose={() => {}} />);
      const scoreDisplay = screen.getByTestId('score-display');
      expect(scoreDisplay).toHaveStyle({ fontFamily: 'monospace' });
    });
  });
});
