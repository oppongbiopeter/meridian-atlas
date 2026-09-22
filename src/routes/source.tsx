import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/source")({
  component: SourceVault,
});

type VaultFile = { path: string; text: string };

function SourceVault() {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/library/source-vault.json")
      .then((r) => r.json())
      .then((data: VaultFile[]) => {
        const sorted = [...data].sort((a, b) => a.path.localeCompare(b.path));
        setFiles(sorted);
        setActive(sorted[0]?.path ?? null);
      });
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return files;
    return files.filter((f) => f.path.toLowerCase().includes(needle));
  }, [files, q]);

  const current = files.find((f) => f.path === active) ?? filtered[0];

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <main className="flex h-dvh min-h-0 flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
            Meridian
          </p>
          <h1 className="font-display text-lg font-medium tracking-tight">Source vault</h1>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!files.length}
          onClick={() =>
            copy(
              "all",
              files.map((f) => `===== ${f.path} =====\n${f.text}`).join("\n\n"),
            )
          }
        >
          {copied === "all" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          Copy all
        </Button>
        <Link to="/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          Atlas
        </Link>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[min(20rem,42vw)] shrink-0 flex-col border-r border-border">
          <div className="p-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter files"
              aria-label="Filter files"
            />
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <ul className="p-1">
              {filtered.map((f) => (
                <li key={f.path}>
                  <button
                    type="button"
                    onClick={() => setActive(f.path)}
                    className={
                      f.path === current?.path
                        ? "w-full rounded-md bg-secondary px-2 py-1.5 text-left font-mono text-2xs"
                        : "w-full rounded-md px-2 py-1.5 text-left font-mono text-2xs text-muted-foreground"
                    }
                  >
                    {f.path}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col">
          {current ? (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
                <p className="truncate font-mono text-xs">{current.path}</p>
                <Button type="button" size="sm" onClick={() => copy(current.path, current.text)}>
                  {copied === current.path ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  Copy file
                </Button>
              </div>
              <ScrollArea className="min-h-0 flex-1">
                <pre className="p-3 font-mono text-2xs leading-relaxed whitespace-pre-wrap">
                  {current.text}
                </pre>
              </ScrollArea>
            </>
          ) : (
            <p className="p-4 text-sm text-muted-foreground">Loading source…</p>
          )}
        </section>
      </div>
    </main>
  );
}
