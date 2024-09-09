import React, { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  width?: number;
  height?: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ width = 60, height = 60 }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [inFocus, setInFocus] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => setInFocus(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleMouseEnter = (): void => {
    setHovered(true);
  };

  const handleMouseLeave = (): void => {
    setHovered(false);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 140 140"
      width={width}
      height={height}
      className="cursor-pointer"
      style={{
        filter: inFocus ? 'blur(0)' : 'blur(5px)',
        opacity: inFocus ? 1 : 0,
        transition: 'filter 1s ease, opacity 1s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <path
        d="M 15 15 L 35 15 L 35 20 L 20 20 L 20 35 L 15 35 Z"
        fill={hovered ? '#A62929' : '#3A3A3A'}
        stroke={hovered ? '#A62929' : '#3A3A3A'}
        strokeWidth="1"
        style={{
          transform: hovered ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      />
      <path
        d="M 105 15 L 125 15 L 125 35 L 120 35 L 120 20 L 105 20 Z"
        fill={hovered ? '#A62929' : '#3A3A3A'}
        stroke={hovered ? '#A62929' : '#3A3A3A'}
        strokeWidth="1"
        style={{
          transform: hovered ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      />
      <path
        d="M 15 105 L 15 125 L 35 125 L 35 120 L 20 120 L 20 105 Z"
        fill={hovered ? '#A62929' : '#3A3A3A'}
        stroke={hovered ? '#A62929' : '#3A3A3A'}
        strokeWidth="1"
        style={{
          transform: hovered ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      />
      <path
        d="M 105 125 L 125 125 L 125 105 L 120 105 L 120 120 L 105 120 Z"
        fill={hovered ? '#A62929' : '#3A3A3A'}
        stroke={hovered ? '#A62929' : '#3A3A3A'}
        strokeWidth="1"
        style={{
          transform: hovered ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      />

      <circle
        cx="70"
        cy="80"
        r="40"
        fill={hovered ? '#E23E57' : '#A62929'}
        stroke="#631919"
        strokeWidth="3"
        style={{
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease, fill 0.3s ease',
        }}
      />
      <path d="M 70 40 Q 65 20, 75 20 Q 80 30, 70 40 Z" fill="#631919" />
      <path d="M 55 50 Q 70 45, 85 50 Q 80 65, 60 65 Z" fill="#BF4040" />
      <circle cx="60" cy="80" r="5" fill="#4D0E0E" />
      <circle cx="80" cy="80" r="5" fill="#4D0E0E" />
      <circle cx="70" cy="95" r="5" fill="#4D0E0E" />
      <path d="M 68 40 L 72 40 L 70 30 Z" fill="#2D6A4F" />
    </svg>
  );
};

export default AnimatedLogo;
