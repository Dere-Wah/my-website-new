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
        color: "transparent",
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        top,
        bottom,
        left,
        right,
        fontSize: "100%",
        lineHeight: "100%",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        boxShadow: "0.2px 0.2px 0.2px 0.2px black",
      }}
      className={className}
    >
      {children}
    </span>
  );
}
