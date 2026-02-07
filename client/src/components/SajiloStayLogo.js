import React from 'react';
import './SajiloStayLogo.css';

const SajiloStayLogo = ({
  size = 'default',
  showTagline = true,
  className = ''
}) => {
  const sizes = {
    tiny: { width: 100, height: 30, fontSize: 12, iconScale: 0.5 },
    small: { width: 120, height: 40, fontSize: 16, iconScale: 0.7 },
    default: { width: 200, height: 60, fontSize: 24, iconScale: 1 },
    large: { width: 280, height: 80, fontSize: 32, iconScale: 1.3 }
  };

  const currentSize = sizes[size] || sizes.default;
  const viewBoxWidth = Number(parseFloat(currentSize.width)) || sizes.default.width;
  const viewBoxHeight = Number(parseFloat(currentSize.height)) || sizes.default.height;

  return (
    <div className={`sajilo-stay-logo ${className}`}>
      <svg
        width={currentSize.width}
        height={currentSize.height}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* House/Pin Icon */}
        <g transform={`translate(10, 10) scale(${currentSize.iconScale})`}>
          <path
            d="M20 5 C25 5, 30 9, 30 15 C30 20, 25 30, 20 40 C15 30, 10 20, 10 15 C10 9, 15 5, 20 5 Z"
            fill="url(#mainGradient)"
            stroke="none"
          />

          <g transform="translate(20, 15)">
            <path d="M-6 2 L0 -4 L6 2 Z" fill="white" />
            <rect x="-5" y="2" width="10" height="8" fill="white" rx="1" />
            <rect x="-1.5" y="6" width="3" height="4" fill="url(#mainGradient)" rx="0.5" />
            <circle cx="2.5" cy="4.5" r="1" fill="url(#mainGradient)" />
          </g>
        </g>

        {/* Typography */}
        <g transform={`translate(${40 + (currentSize.iconScale - 1) * 10}, 15)`}>
          <text
            x="0"
            y={currentSize.fontSize - 4}
            fontFamily="'Inter', 'Segoe UI', sans-serif"
            fontSize={currentSize.fontSize}
            fontWeight="700"
            fill="url(#mainGradient)"
          >
            Sajilo
          </text>

          <text
            x={currentSize.fontSize * 2.8}
            y={currentSize.fontSize - 4}
            fontFamily="'Inter', 'Segoe UI', sans-serif"
            fontSize={currentSize.fontSize}
            fontWeight="400"
            fill="url(#mainGradient)"
          >
            Stay
          </text>

          {showTagline && (
            <text
              x="0"
              y={currentSize.fontSize + 10}
              fontFamily="'Inter', 'Segoe UI', sans-serif"
              fontSize={currentSize.fontSize * 0.4}
              fontWeight="400"
              fill="url(#mainGradient)"
              opacity="0.8"
            >
              Find Your Perfect Room
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};

// Icon-only version
export const SajiloStayIcon = ({ size = 40, className = '' }) => {
  return (
    <div className={`sajilo-stay-icon ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="iconMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <g transform="translate(25, 25)">
          <path
            d="M0 -15 C8 -15, 15 -8, 15 0 C15 8, 8 20, 0 30 C-8 20, -15 8, -15 0 C-15 -8, -8 -15, 0 -15 Z"
            fill="url(#iconMainGradient)"
            stroke="none"
          />

          <g transform="translate(0, 0)">
            <path d="M-8 2 L0 -6 L8 2 Z" fill="white" />
            <rect x="-7" y="2" width="14" height="12" fill="white" rx="1" />
            <rect x="-2.5" y="8" width="5" height="6" fill="url(#iconMainGradient)" rx="1" />
            <circle cx="4" cy="6" r="1.5" fill="url(#iconMainGradient)" />
            <circle cx="-4" cy="6" r="1.5" fill="url(#iconMainGradient)" />
          </g>

          <text
            x="0"
            y="22"
            fontFamily="'Inter', 'Segoe UI', sans-serif"
            fontSize="8"
            fontWeight="700"
            fill="white"
            textAnchor="middle"
          >
            S
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SajiloStayLogo;
