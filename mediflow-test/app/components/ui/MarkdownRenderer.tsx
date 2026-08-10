import React from "react";
import Link from "next/link";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  // Split lines to process block elements
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: { text: string; type: "bullet" | "number"; num?: string }[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length === 0) return;
    const isNum = listItems[0].type === "number";
    elements.push(
      isNum ? (
        <ol key={`${keyPrefix}-ol`} className="space-y-1.5 my-2 pl-4 list-decimal text-slate-200">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseInlineMarkdown(item.text)}
            </li>
          ))}
        </ol>
      ) : (
        <ul key={`${keyPrefix}-ul`} className="space-y-1.5 my-2 pl-4 list-disc text-slate-200">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseInlineMarkdown(item.text)}
            </li>
          ))}
        </ul>
      )
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`line-${index}`);
      return;
    }

    // Heading 3 or Bold Header (### Heading or **Heading**)
    if (trimmed.startsWith("### ") || trimmed.startsWith("## ")) {
      flushList(`line-${index}`);
      const headingText = trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, "");
      
      // Customize heading style based on topic
      let headingColor = "text-cyan-300";
      if (headingText.toLowerCase().includes("critical") || headingText.toLowerCase().includes("alert")) {
        headingColor = "text-rose-400";
      } else if (headingText.toLowerCase().includes("action") || headingText.toLowerCase().includes("recommend")) {
        headingColor = "text-amber-300";
      } else if (headingText.toLowerCase().includes("summary")) {
        headingColor = "text-blue-300";
      }

      elements.push(
        <h4 key={index} className={`text-sm font-bold tracking-tight mt-3 mb-1.5 uppercase ${headingColor}`}>
          {headingText}
        </h4>
      );
      return;
    }

    // Bullet List Item (- or * or •)
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (bulletMatch) {
      listItems.push({ text: bulletMatch[1], type: "bullet" });
      return;
    }

    // Numbered List Item (1. or 2.)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      listItems.push({ text: numMatch[2], type: "number", num: numMatch[1] });
      return;
    }

    // Otherwise standard paragraph line
    flushList(`line-${index}`);

    // Operational Alert Card detection
    if (
      (trimmed.includes("🔴") || trimmed.includes("🟠") || trimmed.includes("🟢")) &&
      (trimmed.includes("OT") || trimmed.includes("Admission") || trimmed.includes("Alert") || trimmed.includes("CSSD"))
    ) {
      const isCritical = trimmed.includes("🔴");
      const isWarning = trimmed.includes("🟠");
      
      const cardBorder = isCritical
        ? "border-rose-500/40 bg-rose-500/10 text-rose-200"
        : isWarning
        ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
        : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";

      elements.push(
        <div key={index} className={`my-2 p-3 rounded-xl border ${cardBorder} shadow-sm flex items-start space-x-2`}>
          <div className="text-base shrink-0">{isCritical ? "🔴" : isWarning ? "🟠" : "🟢"}</div>
          <div className="text-xs font-medium leading-normal">
            {parseInlineMarkdown(trimmed.replace(/^[🔴🟠🟢]\s*/, ""))}
          </div>
        </div>
      );
      return;
    }

    elements.push(
      <p key={index} className="text-xs sm:text-sm text-slate-200 leading-relaxed my-1">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList("final");

  return <div className={`space-y-1.5 ${className}`}>{elements}</div>;
}

/**
 * Parses inline formatting: **bold**, *italic*, status tags, links
 */
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex to split by bold (**text**) or links ([text](url))
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-semibold text-white">
          {inner}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      const inner = part.slice(1, -1);
      return (
        <em key={i} className="italic text-slate-300">
          {inner}
        </em>
      );
    }
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const linkUrl = linkMatch[2];
        return (
          <Link
            key={i}
            href={linkUrl}
            className="inline-flex items-center space-x-1 text-cyan-400 font-semibold hover:underline"
          >
            <span>{linkText}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        );
      }
    }

    return part;
  });
}
