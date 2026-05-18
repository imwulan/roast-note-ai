import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Coffee, Copy, Trash2, Sparkles } from "lucide-react";
import { toast, Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — RoastNote" }] }),
  component: HistoryPage,
});

type Generation = {
  id: string;
  business_type: string | null;
  brand_voice: string | null;
  mood: string | null;
  platform: string | null;
  user_input: string | null;
  generated_caption: string | null;
  generated_cta: string | null;
  generated_hashtags: string[] | null;
  generated_story: string | null;
  created_at: string;
};

function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Generation[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setRows((data ?? []) as Generation[]);
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  async function remove(id: string) {
    const { error } = await supabase.from("generations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r?.filter((g) => g.id !== id) ?? null);
    toast.success("Deleted");
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <header className="sticky top-0 z-30 border-b border-border/40 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <Coffee className="h-4 w-4 text-roast" />
            <span className="font-serif text-xl tracking-tight">RoastNote</span>
          </Link>
          <Link
            to="/"
            className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to app
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-[0.32em] text-roast">
          <span className="mr-3 inline-block h-px w-7 bg-roast/60" />
          Your archive
        </span>
        <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl">
          History.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Every caption you've brewed, kept in order. Re-copy, revisit, or clear what you no longer need.
        </p>

        <div className="mt-12">
          {loading || authLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : rows && rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-cream/30 p-12 text-center">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-cream">
                <Sparkles className="h-4 w-4 text-roast" />
              </div>
              <p className="font-serif text-2xl leading-tight text-foreground">
                Nothing here <span className="italic">yet.</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Generate your first caption and it'll be saved here automatically.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-[12px] font-medium tracking-wide text-primary-foreground transition-all hover:bg-espresso"
              >
                Open the generator
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {rows?.map((g) => <Card key={g.id} g={g} onDelete={() => remove(g.id)} />)}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function Card({ g, onDelete }: { g: Generation; onDelete: () => void }) {
  const date = new Date(g.created_at).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <li className="rounded-2xl border border-border/70 bg-background p-6 transition-all hover:border-roast/30 hover:shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-roast">{g.brand_voice}</span>
          {g.platform && <span>· {g.platform}</span>}
          {g.mood && <span>· {g.mood}</span>}
        </div>
        <span>{date}</span>
      </div>
      {g.user_input && (
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="text-foreground">{g.user_input}</span>
          {g.business_type && <span> · {g.business_type}</span>}
        </p>
      )}
      {g.generated_caption && (
        <p className="mt-5 whitespace-pre-wrap font-serif text-[19px] leading-snug text-foreground">
          {g.generated_caption}
        </p>
      )}
      {g.generated_cta && (
        <p className="mt-3 font-serif text-[15px] italic text-muted-foreground">{g.generated_cta}</p>
      )}
      {g.generated_story && (
        <div className="mt-5 rounded-xl border border-border/60 bg-cream/40 p-4 text-sm leading-relaxed text-foreground">
          {g.generated_story}
        </div>
      )}
      {g.generated_hashtags && g.generated_hashtags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {g.generated_hashtags.map((h) => (
            <span
              key={h}
              className="rounded-full border border-border bg-cream/70 px-3 py-1 text-[12px] text-foreground"
            >
              #{h}
            </span>
          ))}
        </div>
      )}
      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          onClick={() => {
            const parts = [g.generated_caption, g.generated_cta, g.generated_hashtags?.map((h) => `#${h}`).join(" ")].filter(Boolean);
            navigator.clipboard.writeText(parts.join("\n\n"));
            toast.success("Copied to clipboard");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[11px] text-foreground transition-colors hover:bg-secondary"
        >
          <Copy className="h-3 w-3" /> Copy
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" /> Delete
        </button>
      </div>
    </li>
  );
}
