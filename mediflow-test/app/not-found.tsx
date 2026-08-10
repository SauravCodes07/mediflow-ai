import Link from "next/link";
import { Button } from "./components/ui/Button";

export default function NotFound() {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", padding: "var(--space-6)" }}
    >
      <div className="card card-pad" style={{ textAlign: "center", maxWidth: 420 }}>
        <div className="text-label" style={{ color: "var(--color-primary)" }}>404</div>
        <h1 className="text-section-title" style={{ margin: "var(--space-2) 0" }}>Page not found</h1>
        <p className="text-meta" style={{ marginBottom: "var(--space-5)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/"><Button>Back to home</Button></Link>
      </div>
    </div>
  );
}
