import React, { useState } from "react";

interface AvatarWithFallbackProps {
  src: string;
  alt: string;
  size?: number; // e.g., 40 for 40px
  fallbackSrc?: string;
  className?: string;
}

const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({
  src,
  alt,
  size = 40,
  fallbackSrc = "/default-avatar.png",
  className = "",
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className="relative"
      style={{ width: size, height: size, minWidth: size }}
    >
      {!loaded && !error && (
        <div
          className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"
          style={{ width: size, height: size }}
        />
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`rounded-full object-cover border border-gray-300 ${
          loaded ? "block" : "hidden"
        } ${className}`}
        style={{ width: size, height: size }}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </div>
  );
};

export default AvatarWithFallback;
