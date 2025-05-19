"use client";

import React, { useEffect, useState } from "react";

interface SafeVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
  poster?: string;
}

const SafeVideo: React.FC<SafeVideoProps> = ({
  src,
  className = "",
  poster,
  ...videoProps
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-sm text-gray-500 ${className}`}
      >
        Video failed to load
      </div>
    );
  }

  return (
    <video
      className={className}
      poster={poster}
      onError={() => setIsError(true)}
      {...videoProps}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default SafeVideo;
