import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareButtons, {
  generateXShareUrl,
  generateLinkedInShareUrl,
  SITE_URL,
} from '../ShareButtons';

describe('ShareButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('URL generation functions', () => {
    describe('SITE_URL constant', () => {
      it('should be the correct site URL', () => {
        expect(SITE_URL).toBe('https://www.gw-intech.com');
      });
    });

    describe('generateXShareUrl', () => {
      it('should generate correct X share URL with score', () => {
        const url = generateXShareUrl(42);
        expect(url).toContain('https://twitter.com/intent/tweet');
        expect(url).toContain('text=');
        expect(url).toContain('42');
        expect(url).toContain('seconds');
        expect(url).toContain('%40gwIntech'); // @ is URL-encoded
        expect(url).toContain('url=');
        expect(url).toContain(encodeURIComponent(SITE_URL));
      });

      it('should properly encode special characters', () => {
        const url = generateXShareUrl(10);
        // Should contain encoded emoji
        expect(url).toContain('%F0%9F%8C%88'); // rainbow emoji
        expect(url).toContain('%F0%9F%90%B1'); // cat emoji
      });

      it('should include the score dynamically', () => {
        const url1 = generateXShareUrl(5);
        const url2 = generateXShareUrl(100);

        expect(url1).toContain('5');
        expect(url2).toContain('100');
        expect(url1).not.toContain('100');
      });
    });

    describe('generateLinkedInShareUrl', () => {
      it('should generate correct LinkedIn share URL with score', () => {
        const url = generateLinkedInShareUrl(42);
        expect(url).toContain('https://www.linkedin.com/sharing/share-offsite/');
        expect(url).toContain('url=');
        expect(url).toContain(encodeURIComponent(SITE_URL));
        expect(url).toContain('summary=');
        expect(url).toContain('42');
      });

      it('should include the score dynamically', () => {
        const url1 = generateLinkedInShareUrl(15);
        const url2 = generateLinkedInShareUrl(200);

        expect(url1).toContain('15');
        expect(url2).toContain('200');
        expect(url1).not.toContain('200');
      });
    });
  });

  describe('ShareButtons component', () => {
    it('should render share buttons container', () => {
      render(<ShareButtons score={10} />);
      expect(screen.getByTestId('share-buttons')).toBeInTheDocument();
    });

    it('should render X share button', () => {
      render(<ShareButtons score={10} />);
      expect(screen.getByTestId('share-x')).toBeInTheDocument();
    });

    it('should render LinkedIn share button', () => {
      render(<ShareButtons score={10} />);
      expect(screen.getByTestId('share-linkedin')).toBeInTheDocument();
    });

    it('should render both buttons as links', () => {
      render(<ShareButtons score={10} />);

      const xButton = screen.getByTestId('share-x');
      const linkedInButton = screen.getByTestId('share-linkedin');

      expect(xButton.tagName).toBe('A');
      expect(linkedInButton.tagName).toBe('A');
    });

    describe('X button', () => {
      it('should have correct href with score', () => {
        render(<ShareButtons score={25} />);

        const xButton = screen.getByTestId('share-x');
        expect(xButton).toHaveAttribute('href', generateXShareUrl(25));
      });

      it('should open in new tab', () => {
        render(<ShareButtons score={10} />);

        const xButton = screen.getByTestId('share-x');
        expect(xButton).toHaveAttribute('target', '_blank');
      });

      it('should have noopener noreferrer for security', () => {
        render(<ShareButtons score={10} />);

        const xButton = screen.getByTestId('share-x');
        expect(xButton).toHaveAttribute('rel', 'noopener noreferrer');
      });

      it('should have correct brand color (#1DA1F2)', () => {
        render(<ShareButtons score={10} />);

        const xButton = screen.getByTestId('share-x');
        expect(xButton).toHaveStyle({ backgroundColor: '#1DA1F2' });
      });

      it('should have accessible label', () => {
        render(<ShareButtons score={30} />);

        const xButton = screen.getByTestId('share-x');
        expect(xButton).toHaveAttribute(
          'aria-label',
          'Share your Nyan score of 30 seconds on X'
        );
      });

      it('should contain "Share on X" text', () => {
        render(<ShareButtons score={10} />);

        const xButton = screen.getByTestId('share-x');
        expect(xButton).toHaveTextContent('Share on X');
      });

      it('should have hover effect that changes background color', () => {
        render(<ShareButtons score={10} />);

        const xButton = screen.getByTestId('share-x');

        // Before hover
        expect(xButton).toHaveStyle({ backgroundColor: '#1DA1F2' });

        // Trigger hover
        fireEvent.mouseEnter(xButton);
        expect(xButton).toHaveStyle({ backgroundColor: '#1a91da' });

        // After hover
        fireEvent.mouseLeave(xButton);
        expect(xButton).toHaveStyle({ backgroundColor: '#1DA1F2' });
      });
    });

    describe('LinkedIn button', () => {
      it('should have correct href with score', () => {
        render(<ShareButtons score={50} />);

        const linkedInButton = screen.getByTestId('share-linkedin');
        expect(linkedInButton).toHaveAttribute('href', generateLinkedInShareUrl(50));
      });

      it('should open in new tab', () => {
        render(<ShareButtons score={10} />);

        const linkedInButton = screen.getByTestId('share-linkedin');
        expect(linkedInButton).toHaveAttribute('target', '_blank');
      });

      it('should have noopener noreferrer for security', () => {
        render(<ShareButtons score={10} />);

        const linkedInButton = screen.getByTestId('share-linkedin');
        expect(linkedInButton).toHaveAttribute('rel', 'noopener noreferrer');
      });

      it('should have correct brand color (#0A66C2)', () => {
        render(<ShareButtons score={10} />);

        const linkedInButton = screen.getByTestId('share-linkedin');
        expect(linkedInButton).toHaveStyle({ backgroundColor: '#0A66C2' });
      });

      it('should have accessible label', () => {
        render(<ShareButtons score={45} />);

        const linkedInButton = screen.getByTestId('share-linkedin');
        expect(linkedInButton).toHaveAttribute(
          'aria-label',
          'Share your Nyan score of 45 seconds on LinkedIn'
        );
      });

      it('should contain "Share on LinkedIn" text', () => {
        render(<ShareButtons score={10} />);

        const linkedInButton = screen.getByTestId('share-linkedin');
        expect(linkedInButton).toHaveTextContent('Share on LinkedIn');
      });

      it('should have hover effect that changes background color', () => {
        render(<ShareButtons score={10} />);

        const linkedInButton = screen.getByTestId('share-linkedin');

        // Before hover
        expect(linkedInButton).toHaveStyle({ backgroundColor: '#0A66C2' });

        // Trigger hover
        fireEvent.mouseEnter(linkedInButton);
        expect(linkedInButton).toHaveStyle({ backgroundColor: '#094d92' });

        // After hover
        fireEvent.mouseLeave(linkedInButton);
        expect(linkedInButton).toHaveStyle({ backgroundColor: '#0A66C2' });
      });
    });

    describe('Score integration', () => {
      it('should update URLs when score changes', () => {
        const { rerender } = render(<ShareButtons score={10} />);

        let xButton = screen.getByTestId('share-x');
        let linkedInButton = screen.getByTestId('share-linkedin');

        expect(xButton).toHaveAttribute('href', generateXShareUrl(10));
        expect(linkedInButton).toHaveAttribute('href', generateLinkedInShareUrl(10));

        rerender(<ShareButtons score={99} />);

        xButton = screen.getByTestId('share-x');
        linkedInButton = screen.getByTestId('share-linkedin');

        expect(xButton).toHaveAttribute('href', generateXShareUrl(99));
        expect(linkedInButton).toHaveAttribute('href', generateLinkedInShareUrl(99));
      });

      it('should handle zero score', () => {
        render(<ShareButtons score={0} />);

        const xButton = screen.getByTestId('share-x');
        const linkedInButton = screen.getByTestId('share-linkedin');

        expect(xButton).toHaveAttribute('href', generateXShareUrl(0));
        expect(linkedInButton).toHaveAttribute('href', generateLinkedInShareUrl(0));
      });
    });
  });
});
