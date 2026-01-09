import { useState } from 'react';

export const SITE_URL = 'https://www.gw-intech.com';

export const generateXShareUrl = (score) => {
  const text = `I just achieved a Nyan score of ${score} seconds on @gwIntech's portfolio! 🌈🐱`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SITE_URL)}`;
};

export const generateLinkedInShareUrl = (score) => {
  const summary = `I just achieved a Nyan score of ${score} seconds!`;
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}&summary=${encodeURIComponent(summary)}`;
};

const ShareButtons = ({ score }) => {
  const [xHovered, setXHovered] = useState(false);
  const [linkedInHovered, setLinkedInHovered] = useState(false);

  const baseButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    gap: '8px',
  };

  const xButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: xHovered ? '#1a91da' : '#1DA1F2',
    color: '#FFFFFF',
    transform: xHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const linkedInButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: linkedInHovered ? '#094d92' : '#0A66C2',
    color: '#FFFFFF',
    transform: linkedInHovered ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}
      data-testid="share-buttons"
    >
      <a
        href={generateXShareUrl(score)}
        target="_blank"
        rel="noopener noreferrer"
        style={xButtonStyle}
        onMouseEnter={() => setXHovered(true)}
        onMouseLeave={() => setXHovered(false)}
        data-testid="share-x"
        aria-label={`Share your Nyan score of ${score} seconds on X`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share on X
      </a>

      <a
        href={generateLinkedInShareUrl(score)}
        target="_blank"
        rel="noopener noreferrer"
        style={linkedInButtonStyle}
        onMouseEnter={() => setLinkedInHovered(true)}
        onMouseLeave={() => setLinkedInHovered(false)}
        data-testid="share-linkedin"
        aria-label={`Share your Nyan score of ${score} seconds on LinkedIn`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Share on LinkedIn
      </a>
    </div>
  );
};

export default ShareButtons;
