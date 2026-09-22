import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, Download, Eye, FileArchive, FileCode2, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const FILES = [
  {
    href: "/library/Meridian-CURRENT-source.zip",
    name: "Meridian-CURRENT-source.zip",
    title: "Current source",
    detail: "App code as of today. Unzip, then npm install.",
    icon: FileArchive,
  },
  {
    href: "/library/Meridian-CURRENT-data.zip",
    name: "Meridian-CURRENT-data.zip",
    title: "Current data",
    detail: "OWID snapshot + world map JSON.",
    icon: FileArchive,
  },
  {
    href: "/library/Meridian-CURRENT-preview.zip",
    name: "Meridian-CURRENT-preview.zip",
    title: "Current HTML preview",
    detail: "Unzip, then open the HTML in a browser.",
    icon: FileCode2,
  },
  {
    href: "/library/Meridian-CURRENT-code.docx",
    name: "Meridian-CURRENT-code.docx",
    title: "Current source as Word",
    detail: "Atlas / kids / globe / quiz code in a .docx.",
    icon: FileText,
  },
] as const;

type LibraryPanelProps = {
  onClose: () => void;
};

export function LibraryPanel({ onClose }: LibraryPanelProps) {
  const [page, setPage] = useState<"list" | "html">("list");
  const origin = useMemo(
    () => (typeof window === "undefined" ? "" : window.location.origin),
    [],
  );

  if (page === "html") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2">
          <p className="text-sm font-medium">Browser preview</p>
          <Button type="button" variant="secondary" size="sm" onClick={() => setPage("list")}>
            Back
          </Button>
        </div>
        <iframe
          title="Meridian HTML preview"
          src="/library/meridian-preview.html"
          className="min-h-0 w-full flex-1 border-0 bg-background"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center">
      <button
        type="button"
        aria-label="Close library"
        className="absolute inset-0 bg-background/60"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-labelledby="library-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-card p-4 shadow-[var(--shadow-overlay)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
              Library
            </p>
            <h2 id="library-title" className="font-display mt-1 text-xl font-medium tracking-tight">
              Direct links
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Downloads from this preview are often blocked. Open the source vault and copy files
              from there — the app itself is the current work.
            </p>
            <Link
              to="/source"
              className="mt-2 inline-flex h-11 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground"
            >
              Open source vault
            </Link>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
            <X />
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {FILES.map((file) => {
            const Icon = file.icon;
            const url = `${origin}${file.href}`;
            return (
              <li key={file.href} className="rounded-xl bg-secondary p-3">
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{file.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{file.detail}</p>
                    <p className="mt-2 break-all font-mono text-2xs text-muted-foreground">{url}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {file.name.endsWith(".html") ? (
                        <Button type="button" size="sm" onClick={() => setPage("html")}>
                          <Eye className="size-3.5" />
                          View
                        </Button>
                      ) : null}
                      <a
                        href={file.href}
                        download={file.name}
                        className="inline-flex h-11 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground"
                      >
                        <Download className="size-3.5" />
                        {file.name}
                      </a>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(url)}
                      >
                        <Copy className="size-3.5" />
                        Copy URL
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
