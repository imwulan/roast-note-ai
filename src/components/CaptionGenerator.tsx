import { useState } from "react";
import { toast } from "sonner";
import { Copy, Sparkles, Loader2, Check, ArrowRight } from "lucide-react";

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
    <label className="flex flex-col gap-2.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-full border border-border bg-background/70 px-5 text-[14px] text-foreground transition-all placeholder:text-muted-foreground/60 hover:border-roast/40 focus:border-roast focus:bg-background focus:outline-none focus:ring-4 focus:ring-roast/10";

const selectClass = inputClass + " appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%221.5%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:12px_12px] bg-[right_1.25rem_center] bg-no-repeat pr-10";

function CopyCard({ title, body }: { title: string; body: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="group relative rounded-2xl border border-border/70 bg-background p-6 lift hover:border-roast/40 hover:shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{title}</span>
        <button
          onClick={onCopy}
          className={`press inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
            copied
              ? "border-roast/40 bg-roast/5 text-roast"
              : "border-border bg-background/60 text-foreground hover:bg-secondary"
          }`}
        >
          <span key={copied ? "c" : "i"} className="check-pop inline-flex items-center gap-1.5">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
      <p className="whitespace-pre-wrap font-serif text-[19px] leading-snug text-foreground sm:text-[20px]">
        {body}
      </p>
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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
      <form
        onSubmit={submit}
        className="relative overflow-hidden rounded-[24px] border border-border/70 bg-cream/70 p-6 shadow-[var(--shadow-soft)] grain sm:p-9"
      >
        <div className="mb-7">
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-roast">
            The generator
          </span>
          <h3 className="mt-3 font-serif text-[28px] leading-tight text-foreground sm:text-[32px]">
            Brew your <span className="italic">caption</span>
          </h3>
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
                className={inputClass}
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
          className="group press mt-8 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 text-[13px] font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:bg-espresso hover:shadow-[var(--shadow-lift)] disabled:opacity-80"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />}
          {loading ? "Brewing your brand voice…" : "Generate caption"}
          {!loading && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {!result && !loading && (
          <div className="flex h-full min-h-[440px] flex-col items-center justify-center rounded-[24px] border border-dashed border-border/70 bg-background/40 p-10 text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-cream">
              <Sparkles className="h-4 w-4 text-roast" />
            </div>
            <p className="font-serif text-[26px] leading-tight text-foreground">
              Your captions <span className="italic">appear here.</span>
            </p>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
              Fill in the form and we'll write copy that matches your café's voice — sensory, considered, never generic.
            </p>
          </div>
        )}
        {loading && (
          <div className="flex h-full min-h-[440px] items-center justify-center rounded-[24px] border border-border/70 bg-cream/40 grain fade-in">
            <div className="flex flex-col items-center gap-6 text-muted-foreground">
              <div className="steam">
                <span />
                <span />
                <span />
                <div className="steam-cup" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="font-serif text-[20px] leading-tight shimmer-text">
                  Brewing your brand voice…
                </span>
                <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground/80">
                  Pulling the shot
                </span>
              </div>
            </div>
          </div>
        )}
        {result && (
          <div className="flex flex-col gap-3 fade-up">
            <CopyCard title="Main caption" body={result.mainCaption} />
            <CopyCard title="Short CTA" body={result.shortCta} />
            <CopyCard title="Story text" body={result.storyText} />
            <div className="rounded-2xl border border-border/70 bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Hashtags</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(result.hashtags.map((h) => `#${h}`).join(" "));
                    toast.success("Hashtags copied");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[11px] hover:bg-secondary"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-border bg-cream/70 px-3 py-1 text-[12px] text-foreground"
                  >
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
