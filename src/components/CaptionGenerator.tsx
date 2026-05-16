import { useState } from "react";
import { toast } from "sonner";
import { Copy, Sparkles, Loader2 } from "lucide-react";

const businessTypes = ["Coffee Shop", "Artisan Bakery", "Brunch Café", "Specialty Roaster"];
const voicePresets = ["Scandinavian Minimal", "Parisian Luxury", "Urban Roaster", "Warm Artisan"];
const moods = ["Cozy", "Elegant", "Moody", "Playful", "Slow Morning", "Modern Minimal"];
const platforms = ["Instagram Post", "Instagram Story", "Threads", "TikTok Caption"];

type GeneratedOutput = {
  mainCaption: string;
  shortCta: string;
  hashtags: string[];
  storyText: string;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">{label}</span>
      {children}
    </label>
  );
}

const selectClass =
  "h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors hover:border-roast focus:border-roast focus:outline-none focus:ring-2 focus:ring-roast/20";

function CopyCard({ title, body }: { title: string; body: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:border-roast/50 hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{title}</span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-secondary"
        >
          <Copy className="h-3 w-3" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="whitespace-pre-wrap font-serif text-lg leading-snug text-foreground">{body}</p>
    </div>
  );
}

export function CaptionGenerator() {
  const [businessType, setBusinessType] = useState(businessTypes[0]);
  const [brandVoice, setBrandVoice] = useState(voicePresets[3]);
  const [product, setProduct] = useState("");
  const [mood, setMood] = useState(moods[0]);
  const [platform, setPlatform] = useState(platforms[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedOutput | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) {
      toast.error("Add a product or menu item first");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, brandVoice, product, mood, platform }),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment.");
        if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
        throw new Error("Generation failed");
      }
      const data = (await res.json()) as GeneratedOutput;
      setResult(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <form onSubmit={submit} className="rounded-2xl border border-border bg-cream/60 p-6 sm:p-8 grain">
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.22em] text-roast">The generator</span>
          <h3 className="mt-2 font-serif text-3xl text-foreground">Brew your caption</h3>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Business type">
            <select className={selectClass} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
              {businessTypes.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Brand voice preset">
            <select className={selectClass} value={brandVoice} onChange={(e) => setBrandVoice(e.target.value)}>
              {voicePresets.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Product or menu item">
              <input
                className={selectClass}
                placeholder="e.g. Pistachio Croissant"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Mood">
            <select className={selectClass} value={mood} onChange={(e) => setMood(e.target.value)}>
              {moods.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Platform">
            <select className={selectClass} value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {platforms.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground transition-all hover:bg-espresso disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Brewing" : "Generate caption"}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {!result && !loading && (
          <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-10 text-center">
            <div className="mb-4 h-12 w-12 rounded-full border border-border flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-roast" />
            </div>
            <p className="font-serif text-2xl text-foreground">Your captions appear here</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Fill in the form and we'll write copy that matches your café's voice — sensory, considered, never generic.
            </p>
          </div>
        )}
        {loading && (
          <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-border bg-cream/40">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm uppercase tracking-[0.18em]">Pulling the shot</span>
            </div>
          </div>
        )}
        {result && (
          <div className="flex flex-col gap-3 fade-up">
            <CopyCard title="Main caption" body={result.mainCaption} />
            <CopyCard title="Short CTA" body={result.shortCta} />
            <CopyCard title="Story text" body={result.storyText} />
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hashtags</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(result.hashtags.map((h) => `#${h}`).join(" "));
                    toast.success("Hashtags copied");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs hover:bg-secondary"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.hashtags.map((h) => (
                  <span key={h} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground">
                    #{h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
