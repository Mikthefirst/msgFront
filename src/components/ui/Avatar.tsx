import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  status,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };
  
  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };
  
  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block ${statusSizes[size]} ${statusColors[status]} rounded-full ring-2 ring-white dark:ring-gray-800`}
        />
      )}
    </div>
  );
};

export default Avatar;