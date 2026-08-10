export function Skeleton({ height = 16, width = "100%", radius }: { height?: number; width?: string | number; radius?: number }) {
  return (
    <div
      className="skeleton"
      style={{ height, width, borderRadius: radius ?? "var(--radius-sm)" }}
    />
  );
}
