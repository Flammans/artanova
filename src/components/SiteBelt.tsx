import React from 'react';

interface SiteBeltProps {
  className?: string;
}

const SiteBelt: React.FC<SiteBeltProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-full h-40 bg-repeat-x opacity-40 ${className}`}
      style={{
        backgroundImage: 'url(/images/ui/site-belt.webp)',
        backgroundSize: '200px 200px',
      }}
      aria-hidden="true"
    ></div>
  );
};

export default SiteBelt;
