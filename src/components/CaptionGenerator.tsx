import { useState, useRef } from "react";
import { toast } from "sonner";
import { Copy, Sparkles, Loader2, Check, ArrowRight, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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
    toast.success("Copied to clipboard", {
      description: `${title} ready to paste.`,
    });
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="group relative rounded-2xl border border-border/70 bg-background p-5 lift hover:border-roast/40 hover:shadow-[var(--shadow-soft)] sm:p-6">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{title}</span>
        <button
          onClick={onCopy}
          className={`press inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-all ${
            copied
              ? "border-roast/40 bg-roast/5 text-roast"
              : "border-border bg-background/60 text-foreground hover:border-roast/30 hover:bg-secondary"
          }`}
        >
          <span key={copied ? "c" : "i"} className="check-pop inline-flex items-center gap-1.5">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3 transition-transform group-hover:scale-110" />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
      <p className="whitespace-pre-wrap font-serif text-[17px] leading-snug text-foreground sm:text-[20px]">
        {body}
      </p>
    </div>
  );
}

export function CaptionGenerator() {
  const { user } = useAuth();
  const [businessType, setBusinessType] = useState(businessTypes[0]);
  const [brandVoice, setBrandVoice] = useState(voicePresets[3]);
  const [product, setProduct] = useState("");
  const [mood, setMood] = useState(moods[0]);
  const [platform, setPlatform] = useState(platforms[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedOutput | null>(null);
  const [history, setHistory] = useState<GeneratedOutput[]>([]);
  const signatureRef = useRef<string>("");

  const runGenerate = async (mode: "fresh" | "regenerate") => {
    if (!product.trim()) {
      toast.error("Add a product or menu item first");
      return;
    }
    const signature = `${businessType}|${brandVoice}|${product}|${mood}|${platform}`;
    const inputsChanged = signature !== signatureRef.current;
    const isRegenerate = mode === "regenerate" && !inputsChanged && (result !== null || history.length > 0);

    const carriedHistory = isRegenerate
      ? [...history, ...(result ? [result] : [])]
      : [];

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          brandVoice,
          product,
          mood,
          platform,
          previousVersions: carriedHistory.map((v) => ({
            mainCaption: v.mainCaption,
            shortCta: v.shortCta,
            storyText: v.storyText,
          })),
        }),
      });
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit reached. Please wait a moment.");
        if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
        throw new Error("Generation failed");
      }
      const data = (await res.json()) as GeneratedOutput;
      setResult(data);
      setHistory(carriedHistory);
      signatureRef.current = signature;

      if (user) {
        const { error } = await supabase.from("generations").insert({
          user_id: user.id,
          business_type: businessType,
          brand_voice: brandVoice,
          mood,
          platform,
          user_input: product,
          generated_caption: data.mainCaption,
          generated_cta: data.shortCta,
          generated_hashtags: data.hashtags,
          generated_story: data.storyText,
        });
        if (error) console.error("Save generation failed:", error);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    if (!result) return;
    const text = [
      result.mainCaption,
      "",
      result.shortCta,
      "",
      result.storyText,
      "",
      result.hashtags.map((h) => `#${h}`).join(" "),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Everything copied", {
      description: "Caption, CTA, story and hashtags ready to paste.",
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void runGenerate("fresh");
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
          <div className="stagger flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background p-4">
              <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Generated output
              </span>
              <button
                onClick={() => void copyAll()}
                className="press inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-[11px] font-medium text-foreground transition-all hover:border-roast/30 hover:bg-cream/60"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy all
              </button>
            </div>

            <CopyCard title="Main caption" body={result.mainCaption} />
            <CopyCard title="Short CTA" body={result.shortCta} />
            <CopyCard title="Story text" body={result.storyText} />

            <div className="group relative rounded-2xl border border-border/70 bg-background p-6 lift hover:border-roast/40 hover:shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Hashtags</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(result.hashtags.map((h) => `#${h}`).join(" "));
                    toast.success("Copied to clipboard", {
                      description: "Hashtags ready to paste.",
                    });
                  }}
                  className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[11px] text-foreground transition-all hover:border-roast/30 hover:bg-secondary"
                >
                  <Copy className="h-3 w-3 transition-transform group-hover:scale-110" /> Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-border bg-cream/70 px-3 py-1 text-[12px] text-foreground transition-colors hover:border-roast/30 hover:bg-cream"
                  >
                    #{h}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => void runGenerate("regenerate")}
                disabled={loading}
                className="group press inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-[12px] font-medium tracking-wide text-foreground transition-all hover:border-roast/40 hover:bg-cream/60 disabled:opacity-60"
              >
                <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-180" />
                Generate another version
              </button>
              {history.length > 0 && (
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  Version {history.length + 1} · {history.length} earlier {history.length === 1 ? "draft" : "drafts"} in memory
                </span>
              )}
            </div>

            {history.length > 0 && (
              <details className="group rounded-2xl border border-dashed border-border/70 bg-background/40 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  Previous versions
                  <span className="text-[10px] normal-case tracking-normal text-muted-foreground/70 group-open:hidden">show</span>
                  <span className="hidden text-[10px] normal-case tracking-normal text-muted-foreground/70 group-open:inline">hide</span>
                </summary>
                <div className="mt-4 flex flex-col gap-4">
                  {history.map((v, i) => (
                    <div key={i} className="rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-roast/30 hover:shadow-[var(--shadow-soft)]">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        Version {i + 1}
                      </span>
                      <p className="mt-2 whitespace-pre-wrap font-serif text-[15px] leading-snug text-foreground/90">
                        {v.mainCaption}
                      </p>
                      <p className="mt-2 text-[12px] italic text-muted-foreground">{v.shortCta}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
