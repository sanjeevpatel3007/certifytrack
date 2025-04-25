'use client';

import { useId } from 'react';

export default function CertificateBackground({
  className = '',
  primaryColor = '#4285F4',
  secondaryColor = '#34A853',
  ...props
}) {
  const id = useId();
  const gradientId = `certificate-gradient-${id}`;
  const patternId = `certificate-pattern-${id}`;
  
  return (
    <svg 
      viewBox="0 0 800 600" 
      className={`w-full h-full ${className}`}
      {...props}
    >
      {/* Background */}
      <rect 
        width="800" 
        height="600" 
        fill="#ffffff" 
      />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.1" />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.1" />
        </linearGradient>
        
        <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill={primaryColor} fillOpacity="0.2" />
        </pattern>
      </defs>
      
      {/* Background fill and pattern */}
      <rect width="800" height="600" fill={`url(#${gradientId})`} />
      <rect width="800" height="600" fill={`url(#${patternId})`} />
      
      {/* Fancy border */}
      <rect 
        x="20" 
        y="20" 
        width="760" 
        height="560" 
        stroke={primaryColor}
        strokeWidth="2"
        fill="none"
        rx="8"
      />
      
      <rect 
        x="30" 
        y="30" 
        width="740" 
        height="540" 
        stroke={secondaryColor}
        strokeWidth="1"
        strokeDasharray="4,2"
        fill="none"
        rx="6"
      />
      
      {/* Corner decorations */}
      {[
        [35, 35], // Top left
        [765, 35], // Top right
        [35, 565], // Bottom left
        [765, 565], // Bottom right
      ].map(([x, y], index) => (
        <g key={index} transform={`translate(${x} ${y})`}>
          <circle 
            cx="0" 
            cy="0" 
            r="10" 
            fill={primaryColor}
            fillOpacity="0.3"
          />
          <circle 
            cx="0" 
            cy="0" 
            r="5" 
            fill={secondaryColor}
            fillOpacity="0.5"
          />
        </g>
      ))}
      
      {/* Certificate seal */}
      <g transform="translate(400 500)">
        <circle 
          cx="0" 
          cy="0" 
          r="40" 
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
        />
        <circle 
          cx="0" 
          cy="0" 
          r="35" 
          fill="none"
          stroke={secondaryColor}
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        <path 
          d="M-20,-10 L0,15 L20,-10" 
          fill="none" 
          stroke={primaryColor} 
          strokeWidth="2" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
} 