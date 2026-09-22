import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

export const Route = createFileRoute("/downloads")({
  component: DownloadsPage,
});

const FILES = [
  {
    href: "/library/Meridian-CURRENT-source.zip",
    name: "Meridian-CURRENT-source.zip",
    label: "Current source",
    detail: "App code as of today.",
  },
  {
    href: "/library/Meridian-CURRENT-data.zip",
    name: "Meridian-CURRENT-data.zip",
    label: "Current data",
    detail: "OWID snapshot + world map JSON.",
  },
  {
    href: "/library/Meridian-CURRENT-preview.zip",
    name: "Meridian-CURRENT-preview.zip",
    label: "Current HTML preview",
    detail: "Unzip, then open the HTML in a browser.",
  },
  {
    href: "/library/Meridian-CURRENT-code.docx",
    name: "Meridian-CURRENT-code.docx",
    label: "Current source as Word",
    detail: "Atlas code in a .docx.",
  },
] as const;

function DownloadsPage() {
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-6 bg-background px-5 py-8 text-foreground">
      <div>
        <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
          Meridian
        </p>
        <h1 className="font-display mt-1 text-3xl font-medium tracking-tight">Downloads</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Direct links. Copy a URL into a new browser tab if the button is blocked in preview.
        </p>
      </div>
      <ul className="space-y-3">
        {FILES.map((file) => {
          const url = `${origin}${file.href}`;
          return (
            <li key={file.href} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-overlay)]">
              <p className="text-sm font-medium">{file.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{file.detail}</p>
              <a
                href={file.href}
                download={file.name}
                className="mt-3 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                <Download className="size-4" />
                {file.name}
              </a>
              <p className="mt-3 break-all font-mono text-2xs text-muted-foreground">{url}</p>
            </li>
          );
        })}
      </ul>
      <a href="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
        Back to atlas
      </a>
    </main>
  );
}
