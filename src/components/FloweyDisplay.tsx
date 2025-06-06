'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Define the types of expressions Flowey can have
export type FloweyExpression = 'neutral' | 'happy' | 'sad' | 'mad' | 'jumpscare';

interface FloweyDisplayProps {
  expression: FloweyExpression;
  isJumpscare: boolean;
}

const FloweyDisplay: React.FC<FloweyDisplayProps> = ({ expression, isJumpscare }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [imageError, setImageError] = useState(false);

  // Handle expression changes with animations
  useEffect(() => {
    if (isJumpscare) {
      setAnimationClass('animate-pulse scale-125');
    } else {
      setAnimationClass('');
    }
  }, [expression, isJumpscare]);
  // Dynamic scaling and positioning
  const getTransformClass = () => {
    const baseClass = 'transition-all duration-500 ease-in-out';
    
    if (isJumpscare) {
      return `${baseClass} scale-150 rotate-12 animate-bounce`;
    } else if (isHovering && !isJumpscare) {
      return `${baseClass} scale-110`;
    } else {
      return `${baseClass} scale-100`;
    }
  };  // Get filter effects based on expression
  const getFilterClass = () => {
    switch (expression) {
      case 'happy':
        return 'brightness-125 saturate-125 hue-rotate-15';
      case 'sad':
        return 'brightness-75 saturate-50 contrast-125';
      case 'mad':
        return 'brightness-110 saturate-150 contrast-125 hue-rotate-[-15deg]';
      case 'jumpscare':
        return 'brightness-150 saturate-200 contrast-150';
      default:
        return 'brightness-100 saturate-100';
    }
  };

  // Get the appropriate image path based on expression
  const getImagePath = () => {
    switch (expression) {
      case 'happy':
        return '/images/flowey happy.png';
      case 'sad':
        return '/images/flowey sad.png';
      case 'mad':
        return '/images/flowey mad.png';
      case 'jumpscare':
        return '/images/flowey jumpscare.png';
      default:
        return '/images/flowey-neutral.png';
    }
  };
  return (
    <div 
      className="flex justify-center items-center w-full cursor-pointer"
      onMouseEnter={() => !isJumpscare && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >      <div className={`relative w-48 h-48 md:w-56 md:h-56 ${getTransformClass()} ${!isJumpscare ? 'flowey-idle' : ''}`}>        {!imageError ? (
          <>
            {/* Flowey image - dynamic based on expression */}
            <Image
              src={getImagePath()}
              alt={`Flowey ${expression} expression`}
              fill
              priority
              className={`object-contain ${getFilterClass()} ${animationClass} ${isJumpscare ? 'jumpscare-active' : ''}`}              style={{
                filter: `${expression === 'jumpscare' 
                  ? 'drop-shadow(0 0 20px red) drop-shadow(0 0 40px rgba(255,0,0,0.5))' 
                  : expression === 'mad'
                  ? 'drop-shadow(0 0 15px orange) drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                  : expression === 'happy'
                  ? 'drop-shadow(0 0 15px green) drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                  : expression === 'sad'
                  ? 'drop-shadow(0 0 15px blue) drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                  : 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'}`
              }}
              unoptimized={true}
              onError={(e) => {
                console.error('Failed to load Flowey image:', e);
                setImageError(true);
              }}
              onLoad={() => console.log('Flowey image loaded successfully')}
            />
          </>
        ) : (          /* Fallback if image fails to load */
          <div className={`w-full h-full rounded-full flex items-center justify-center border-4 border-yellow-400 bg-yellow-100 
                         ${expression === 'happy' ? 'bg-green-100' : 
                           expression === 'sad' ? 'bg-blue-100' : 
                           expression === 'mad' ? 'bg-orange-100' :
                           expression === 'jumpscare' ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <div className="text-6xl">🌻</div>
          </div>        )}
        
        {/* Subtle shadow underneath */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 w-24 h-6 bg-black/20 rounded-full blur-sm"></div>
        
        {/* Interaction indicator */}
        {isHovering && !isJumpscare && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/70 px-2 py-1 rounded whitespace-nowrap">
            * (Flowey is watching you...)
          </div>
        )}
      </div>
    </div>
  );
};

export default FloweyDisplay;

