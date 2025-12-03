import React, { useState, useEffect, useRef } from 'react';

interface AnimatedFaceProps {
  isPasswordFocused?: boolean;
  isPasswordHovered?: boolean;
}

export const AnimatedFace: React.FC<AnimatedFaceProps> = ({ 
  isPasswordFocused = false, 
  isPasswordHovered = false 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const faceRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (faceRef.current) {
        const rect = faceRef.current.getBoundingClientRect();
        const faceCenterX = rect.left + rect.width / 2;
        const faceCenterY = rect.top + rect.height / 2;
        
        setMousePos({
          x: e.clientX - faceCenterX,
          y: e.clientY - faceCenterY
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getEyePosition = () => {
    const maxMove = 12; // Increased from 8 to 12
    const distance = Math.sqrt(mousePos.x ** 2 + mousePos.y ** 2);
    const limitedDistance = Math.min(distance, 80); // Reduced from 100 to 80 for faster response
    const scale = limitedDistance / 80;
    
    return {
      x: (mousePos.x / distance) * maxMove * scale || 0,
      y: (mousePos.y / distance) * maxMove * scale || 0
    };
  };

  const eyePos = getEyePosition();

  return (
    <svg 
      ref={faceRef}
      width="128" 
      height="128" 
      viewBox="0 0 128 128" 
      className="drop-shadow-lg"
    >
      {/* Face */}
      <circle cx="64" cy="64" r="60" fill="#FFD93D" stroke="#F6C700" strokeWidth="2"/>
      
      {/* Left Eye */}
      <g>
        {!isPasswordFocused ? (
          <>
            {/* Eyelid for Normal State */}
            <path 
              d="M27,38 Q45,28 63,38" 
              stroke="#000" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
              className="open-eyelid"
            />
            <ellipse 
              cx="45" 
              cy="50" 
              rx="18" 
              ry="22" 
              fill="white" 
              className="open-eye"
            />
            <circle 
              cx={45 + (isPasswordHovered ? -6 : eyePos.x * 0.6)} 
              cy={50 + (isPasswordHovered ? 0 : eyePos.y * 0.6)} 
              r="10" 
              fill="#000"
              className="open-pupil transition-all duration-100"
            />
          </>
        ) : (
          <>
            <g className="animate-eye-close">
              {/* Animated Eye Closing */}
              <path 
                d="M27,50 Q45,50 63,50" 
                stroke="#000" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
                className="closing-eyelid"
              />
            </g>
          </>
        )}
      </g>
      
      {/* Right Eye */}
      <g>
        {!isPasswordFocused ? (
          <>
            {/* Eyelid for Normal State */}
            <path 
              d="M65,38 Q83,28 101,38" 
              stroke="#000" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
              className="open-eyelid"
            />
            <ellipse 
              cx="83" 
              cy="50" 
              rx="18" 
              ry="22" 
              fill="white" 
              className="open-eye"
            />
            <circle 
              cx={83 + (isPasswordHovered ? -6 : eyePos.x * 0.6)} 
              cy={50 + (isPasswordHovered ? 0 : eyePos.y * 0.6)} 
              r="10" 
              fill="#000"
              className="open-pupil transition-all duration-100"
            />
          </>
        ) : (
          <>
            <g className="animate-eye-close">
              {/* Animated Eye Closing */}
              <path 
                d="M65,50 Q83,50 101,50" 
                stroke="#000" 
                strokeWidth="2" 
                fill="none" 
                strokeLinecap="round"
                className="closing-eyelid"
              />
            </g>
          </>
        )}
      </g>
      
      {/* Styles for eye animation */}
      <style>
        {`
          @keyframes eyeClose {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.1); }
          }
          
          .animate-eye-close .closing-eyelid {
            animation: eyeClose 0.3s ease-in-out;
          }
          
          .open-eyelid, .open-eye, .open-pupil {
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
      
      {/* Mouth - Smile */}
      <path 
        d="M 45 82 Q 64 92 83 82" 
        stroke="#000" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AnimatedFace;