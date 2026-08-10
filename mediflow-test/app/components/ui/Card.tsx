import { ReactNode } from "react";

export function Card({ children, className = "", padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return <div className={`card ${padded ? "card-pad" : ""} ${className}`.trim()}>{children}</div>;
}
