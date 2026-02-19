import React from "react";

interface GhostProps {
  children: React.ReactNode;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  className?: string;
}

export function Ghost({
  children,
  top,
  bottom,
  left,
  right,
  className,
}: GhostProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 2147483647,
        opacity: 0,
        pointerEvents: "none",
        userSelect: "none",
        top,
        bottom,
        left,
        right,
      }}
      className={className}
    >
      {children}
    </span>
  );
}
