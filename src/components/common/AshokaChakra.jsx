import React from 'react';

export default function AshokaChakra({ size = 16, className = "" }) {
  // 24 spokes (360 / 24 = 15 degrees per spoke)
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 animate-[spin_12s_linear_infinite] ${className}`}
      style={{ width: size, height: size }}
      title="Ashoka Chakra - 24 Spokes of Progress"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle Rim */}
        <circle cx="50" cy="50" r="46" stroke="#0038A8" strokeWidth="6" />
        
        {/* Inner Hub Circle */}
        <circle cx="50" cy="50" r="14" fill="#0038A8" />
        <circle cx="50" cy="50" r="8" fill="#ffffff" />
        <circle cx="50" cy="50" r="4" fill="#0038A8" />

        {/* 24 Precise Radial Spokes */}
        {spokes.map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="50"
            x2="50"
            y2="7"
            stroke="#0038A8"
            strokeWidth="3.2"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}

        {/* Outer Dot Nodes on Rim */}
        {spokes.map((angle) => (
          <circle
            key={`dot-${angle}`}
            cx="50"
            cy="4"
            r="1.8"
            fill="#0038A8"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </svg>
    </div>
  );
}
