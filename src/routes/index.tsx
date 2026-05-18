import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { ChevronDown, Coffee, Quote, ArrowRight } from "lucide-react";
import { CaptionGenerator } from "@/components/CaptionGenerator";
import { useAuth } from "@/hooks/use-auth";
import heroCoffee from "@/assets/hero-coffee.jpg";
import pastries from "@/assets/pastries.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoastNote — Premium AI Brand Voice for Cafés" },
      {
        name: "description",
        content:
          "RoastNote is an AI brand voice engine for independent coffee shops, cafés, and artisan bakeries. Generate premium Instagram captions, story text, and hashtags that match your café's branding.",
      },
      { property: "og:title", content: "RoastNote — Premium AI Brand Voice for Cafés" },
      {
        property: "og:description",
        content:
          "AI captions, story text and hashtags styled like premium coffee branding. Built for cafés, roasters and artisan bakeries.",
      },
    ],
  }),
  component: Index,
});

const presets = [
  { name: "Scandinavian Minimal", note: "Sparse, sensory, quietly confident. White-walled rooms and ceramics." },
  { name: "Parisian Luxury", note: "Editorial, romantic, considered. Lower-case headlines and slow vowels." },
  { name: "Urban Roaster", note: "Direct, ingredient-led, third-wave. Talks about origin, not vibes." },
  { name: "Warm Artisan", note: "Hand-written warmth. Sourdough, linen, neighbourhood regulars." },
];

const samples = [
  {
    voice: "Scandinavian Minimal",
    item: "Cardamom Bun",
    platform: "Instagram · Oslo",
    text: "Friday's bake is on the counter.\nCardamom folded in twenty-seven times, baked dark, brushed with brown butter while still warm.\nWe open at eight. They rarely make it to ten.",
    cta: "Saved for the morning queue.",
    hashtags: ["fridaybake", "kardemommebolle", "slowmornings", "grünerløkka", "smallbatch"],
  },
  {
    voice: "Parisian Luxury",
    item: "Vanilla Cortado",
    platform: "Instagram · Le Marais",
    text: "un cortado, comme à la maison.\nespresso tiré court, lait tiède, un fil de vanille de madagascar.\nrien d'autre — c'est suffisant.",
    cta: "à boire debout, au comptoir.",
    hashtags: ["cortado", "cafédequartier", "lemarais", "spécialité", "petitcomptoir"],
  },
  {
    voice: "Urban Roaster",
    item: "Ethiopia Guji V60",
    platform: "Instagram · Brooklyn",
    text: "New lot on bar: Guji, Hambela Alaka. Natural process, drying beds at 1,950m.\nWe're tasting bergamot, white peach, a finish that sits somewhere between jasmine tea and lemon zest.\nBrewed 22g in, 352g out, 3:15 total. Filter only this week.",
    cta: "On bar through Sunday.",
    hashtags: ["ethiopiaguji", "naturalprocess", "v60", "thirdwave", "singleorigin", "filterbar"],
  },
  {
    voice: "Warm Artisan",
    item: "Miso Chocolate Chip Cookie",
    platform: "Instagram · Melbourne",
    text: "We've been working on this one quietly for weeks.\nBrown butter, white miso, valrhona 70%, sea salt on top. Crisp edge, soft middle, a little salty around the third bite.\nBaked in small trays from ten 'til they're gone — usually around two.",
    cta: "Pair with the oat flat white.",
    hashtags: ["cookieoftheweek", "brownbutter", "misococookie", "melbournecoffee", "smallbatchbakes"],
  },
];

const faqs = [
  {
    q: "What is RoastNote?",
    a: "An AI brand voice engine built specifically for independent cafés, coffee shops and artisan bakeries. It writes captions, hashtags and short-form copy in the voice of premium coffee brands.",
  },
  {
    q: "Who is this for?",
    a: "Owners and marketers of independent coffee shops, specialty roasters, brunch cafés and artisan bakeries who want their social to feel like their physical brand — not like a tech startup.",
  },
  {
    q: "Can I customize my tone?",
    a: "Yes. Choose between curated brand voice presets — Scandinavian Minimal, Parisian Luxury, Urban Roaster, Warm Artisan — and combine them with a mood and platform to shape every output.",
  },
  {
    q: "Does this work for bakeries?",
    a: "Yes. Artisan bakery is a first-class business type. RoastNote understands viennoiserie, sourdough, and pastry-led storytelling alongside coffee.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-[0.32em] text-roast">
      <span className="mr-3 inline-block h-px w-7 bg-roast/60" />
      {children}
    </span>
  );
}

function AuthNav() {
  const { user, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || loading) {
    return <span className="h-9 w-20" aria-hidden />;
  }
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          to="/history"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          History
        </Link>
        <button
          onClick={() => signOut()}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
      Sign in
    </Link>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <Coffee className="h-4 w-4 text-roast" />
          <span className="font-serif text-xl tracking-tight">RoastNote</span>
        </a>
        <nav className="hidden items-center gap-9 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#presets">Voice</a>
          <a className="transition-colors hover:text-foreground" href="#generator">Generator</a>
          <a className="transition-colors hover:text-foreground" href="#samples">Samples</a>
          <a className="transition-colors hover:text-foreground" href="#pricing">Pricing</a>
          <a className="transition-colors hover:text-foreground" href="#faq">FAQ</a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <AuthNav />
          <a
            href="#generator"
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-[12px] font-medium tracking-wide text-primary-foreground transition-all hover:bg-espresso"
          >
            Try the generator
          </a>
        </div>
        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <div className="flex flex-col gap-[3px]">
            <span className="block h-px w-4 bg-foreground" />
            <span className="block h-px w-4 bg-foreground" />
          </div>
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3 text-sm">
            {[
              ["Voice", "#presets"],
              ["Generator", "#generator"],
              ["Samples", "#samples"],
              ["Pricing", "#pricing"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3 text-muted-foreground transition-colors last:border-0 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pt-28 lg:pb-32">
        <div className="fade-up">
          <Eyebrow>AI brand voice engine</Eyebrow>
          <h1 className="mt-7 font-serif text-[40px] leading-[1.04] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[76px]">
            Your café deserves a voice people
            <span className="italic text-roast"> remember.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Generate premium social captions inspired by modern coffee branding trends from top cafés in the US &amp; Europe — without sounding like a generic AI tool.
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#generator"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[13px] font-medium tracking-wide text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:bg-espresso hover:shadow-[var(--shadow-lift)]"
            >
              Generate your first caption
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#samples"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background/60 px-6 text-[13px] text-foreground transition-colors hover:bg-secondary"
            >
              See sample outputs
            </a>
          </div>

          <div className="mt-12 flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>Est. 2026</span>
            <span className="h-px w-8 bg-border" />
            <span>Brewed for cafés</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-border/70 bg-cream shadow-[var(--shadow-cup)] grain">
            <img
              src={heroCoffee}
              alt="Artisan flat white in a handmade ceramic cup beside dried wheat and coffee beans"
              width={1600}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 vignette" />
          </div>
          <div className="absolute -bottom-7 -left-4 hidden max-w-[280px] rounded-2xl border border-border/70 bg-cream/95 p-5 shadow-[var(--shadow-lift)] backdrop-blur md:block">
            <Quote className="h-4 w-4 text-roast" />
            <p className="mt-3 font-serif text-[17px] leading-snug">
              "Folded slowly, baked late. Cardamom in the laminate, honey on the crust."
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Scandinavian Minimal · IG
            </p>
          </div>
          <div className="absolute -right-3 -top-3 hidden h-20 w-20 items-center justify-center rounded-full border border-border/70 bg-background/90 backdrop-blur md:flex">
            <span className="font-serif text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              N°01
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Presets() {
  return (
    <section id="presets" className="border-t border-border/60 bg-cream/50">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <Eyebrow>Brand voice presets</Eyebrow>
            <h2 className="mt-5 font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Four voices, each tuned to a <span className="italic text-roast">kind of café.</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Curated from the cafés we admire — not from a list of buzzwords. Choose one and every caption is written in that register.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {presets.map((p, i) => (
            <div
              key={p.name}
              className="group relative flex flex-col rounded-2xl border border-border/70 bg-background p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-roast/40 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm italic text-muted-foreground">N°0{i + 1}</span>
                <span className="h-1 w-1 rounded-full bg-roast/70 transition-all group-hover:w-6" />
              </div>
              <h3 className="mt-6 font-serif text-[26px] leading-tight text-foreground">{p.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GeneratorSection() {
  return (
    <section id="generator" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 max-w-2xl">
          <Eyebrow>The generator</Eyebrow>
          <h2 className="mt-5 font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-5xl">
            Built for the rhythm of a <span className="italic text-roast">café day.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pick a voice, drop in today's pastry or pour-over, and get a complete caption set — main copy, short CTA, hashtags, and a story-sized overlay.
          </p>
        </div>
        <CaptionGenerator />
      </div>
    </section>
  );
}

function Samples() {
  return (
    <section id="samples" className="border-t border-border/60 bg-cream/50">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[20px] border border-border/70 shadow-[var(--shadow-cup)]">
              <img
                src={pastries}
                alt="Pistachio croissant, sourdough loaf and an espresso on warm linen"
                loading="lazy"
                width={1200}
                height={1500}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <Eyebrow>Sample outputs</Eyebrow>
            <h2 className="mt-5 font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Captions, the way <span className="italic text-roast">good cafés</span> write them.
            </h2>
            <div className="mt-10 flex flex-col gap-4">
              {samples.map((s) => (
                <figure
                  key={s.item}
                  className="rounded-2xl border border-border/70 bg-background p-6 transition-shadow hover:shadow-[var(--shadow-soft)] sm:p-7"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <span className="text-roast">{s.voice}</span>
                    <span>{s.platform}</span>
                  </div>
                  <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
                    {s.item}
                  </div>
                  <blockquote className="whitespace-pre-line font-serif text-[19px] leading-snug text-foreground sm:text-[21px]">
                    {s.text}
                  </blockquote>
                  <figcaption className="mt-5 border-t border-border/60 pt-4">
                    <p className="font-serif text-[15px] italic text-roast">{s.cta}</p>
                    <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                      {s.hashtags.map((h) => `#${h}`).join("  ")}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const tiers = [
  {
    name: "Free",
    price: "0",
    desc: "Get a feel for the voice.",
    features: ["10 generations / month", "All 4 brand voice presets", "All platforms"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Brew",
    price: "19",
    desc: "For the daily café feed.",
    features: ["Unlimited generations", "Saved brand profiles", "Priority models", "Export to clipboard & .csv"],
    cta: "Start brewing",
    featured: true,
  },
  {
    name: "Roaster",
    price: "49",
    desc: "Multi-location & teams.",
    features: ["Everything in Brew", "Team seats", "Custom voice training", "Account manager"],
    cta: "Talk to us",
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 max-w-2xl">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-5 font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-5xl">
            Honest pricing. <span className="italic text-roast">Like a good menu.</span>
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 sm:p-9 ${
                t.featured
                  ? "border-roast/40 bg-primary text-primary-foreground shadow-[var(--shadow-cup)]"
                  : "border-border/70 bg-background hover:-translate-y-0.5 hover:border-roast/40 hover:shadow-[var(--shadow-lift)]"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 inline-flex items-center rounded-full border border-roast/40 bg-cream px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-foreground">
                  Most loved
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-[28px]">{t.name}</h3>
                <div>
                  <span className="font-serif text-[42px] leading-none">${t.price}</span>
                  <span className={`ml-1 text-xs ${t.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    /mo
                  </span>
                </div>
              </div>
              <p className={`mt-3 text-sm ${t.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {t.desc}
              </p>
              <div className={`my-7 h-px ${t.featured ? "bg-primary-foreground/15" : "bg-border"}`} />
              <ul className="flex flex-col gap-3.5 text-[14px]">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${t.featured ? "bg-primary-foreground/70" : "bg-roast"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-10 inline-flex h-11 items-center justify-center rounded-full px-6 text-[12px] font-medium tracking-wide transition-all ${
                  t.featured
                    ? "bg-background text-foreground hover:bg-cream"
                    : "border border-border bg-background text-foreground hover:bg-secondary"
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-border/60 bg-cream/50">
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-14 text-center">
          <Eyebrow>Frequently asked</Eyebrow>
          <h2 className="mt-5 font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-5xl">
            Questions, answered <span className="italic text-roast">slowly.</span>
          </h2>
        </div>
        <div className="divide-y divide-border/60 border-y border-border/60">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={f.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="block w-full py-6 text-left transition-colors hover:bg-background/40 sm:py-7"
              >
                <div className="flex items-center justify-between gap-6 px-1">
                  <span className="font-serif text-[20px] leading-snug text-foreground sm:text-[22px]">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-roast transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
                {isOpen && (
                  <p className="mt-4 max-w-2xl px-1 text-[15px] leading-relaxed text-muted-foreground fade-up">
                    {f.a}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-14 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Coffee className="h-4 w-4 text-roast" />
            <span className="font-serif text-2xl">RoastNote</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A premium coffee brand that happens to use AI. Built quietly for the cafés we love.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          <a href="#presets" className="hover:text-foreground transition-colors">Voice</a>
          <a href="#generator" className="hover:text-foreground transition-colors">Generator</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-5 text-[11px] uppercase tracking-[0.24em] text-muted-foreground sm:px-8">
          © {new Date().getFullYear()} RoastNote — Brewed for cafés.
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="bottom-right" richColors closeButton />
      <Nav />
      <main>
        <Hero />
        <Presets />
        <GeneratorSection />
        <Samples />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
