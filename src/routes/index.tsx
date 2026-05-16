import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { ChevronDown, Coffee, Quote } from "lucide-react";
import { CaptionGenerator } from "@/components/CaptionGenerator";
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
  {
    name: "Scandinavian Minimal",
    note: "Sparse, sensory, quietly confident. White-walled rooms and ceramics.",
  },
  {
    name: "Parisian Luxury",
    note: "Editorial, romantic, considered. Lower-case headlines and slow vowels.",
  },
  {
    name: "Urban Roaster",
    note: "Direct, ingredient-led, third-wave. Talks about origin, not vibes.",
  },
  {
    name: "Warm Artisan",
    note: "Hand-written warmth. Sourdough, linen, neighbourhood regulars.",
  },
];

const samples = [
  {
    voice: "Scandinavian Minimal",
    item: "Cardamom Bun",
    text:
      "Folded slowly, baked late. Cardamom in the laminate, honey on the crust. It pairs well with a quiet morning.",
  },
  {
    voice: "Parisian Luxury",
    item: "Vanilla Cortado",
    text:
      "A small, ceremonial cup. Espresso pulled long, milk warmed not hot — finished with a thread of madagascar vanilla.",
  },
  {
    voice: "Urban Roaster",
    item: "Ethiopia Guji V60",
    text:
      "Single origin. Natural process. Bergamot, stonefruit, a finish like jasmine tea. Brewed 1:16, no notes.",
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

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-roast" />
          <span className="font-serif text-xl tracking-tight">RoastNote</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground transition-colors" href="#presets">Voice</a>
          <a className="hover:text-foreground transition-colors" href="#generator">Generator</a>
          <a className="hover:text-foreground transition-colors" href="#samples">Samples</a>
          <a className="hover:text-foreground transition-colors" href="#pricing">Pricing</a>
          <a className="hover:text-foreground transition-colors" href="#faq">FAQ</a>
        </nav>
        <a
          href="#generator"
          className="hidden md:inline-flex h-9 items-center rounded-md bg-primary px-4 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground hover:bg-espresso transition-colors"
        >
          Try it
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-cream px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-roast">
            <span className="h-1 w-1 rounded-full bg-roast" />
            AI brand voice engine
          </span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Your café deserves a voice people remember.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Generate premium social captions inspired by modern coffee branding trends from top cafés in the US &amp; Europe — without sounding like a generic AI tool.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#generator"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-7 text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground transition-all hover:bg-espresso"
            >
              Generate Your First Caption
            </a>
            <a href="#samples" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              See sample outputs &rarr;
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-sm">
            <img
              src={heroCoffee}
              alt="Artisan flat white in a handmade ceramic cup beside dried wheat and coffee beans"
              width={1600}
              height={1280}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden max-w-[280px] rounded-xl border border-border bg-cream p-5 shadow-sm md:block">
            <Quote className="h-4 w-4 text-roast" />
            <p className="mt-2 font-serif text-base leading-snug">
              "Folded slowly, baked late. Cardamom in the laminate, honey on the crust."
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scandinavian Minimal · IG</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Presets() {
  return (
    <section id="presets" className="border-t border-border bg-cream/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.22em] text-roast">Brand voice presets</span>
          <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
            Four voices, each tuned to a kind of café.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Curated from the cafés we admire — not from a list of buzzwords. Choose one and every caption is written in that register.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {presets.map((p, i) => (
            <div
              key={p.name}
              className="group relative flex flex-col rounded-xl border border-border bg-background p-6 transition-all hover:border-roast/60 hover:-translate-y-0.5"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-4 font-serif text-2xl text-foreground">{p.name}</h3>
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
    <section id="generator" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.22em] text-roast">The generator</span>
          <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
            Built for the rhythm of a café day.
          </h2>
          <p className="mt-4 text-muted-foreground">
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
    <section id="samples" className="border-t border-border bg-cream/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border">
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
            <span className="text-[10px] uppercase tracking-[0.22em] text-roast">Sample outputs</span>
            <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Captions, the way good cafés write them.</h2>
            <div className="mt-10 flex flex-col gap-5">
              {samples.map((s) => (
                <div key={s.item} className="rounded-xl border border-border bg-background p-6">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{s.voice}</span>
                    <span>{s.item}</span>
                  </div>
                  <p className="font-serif text-xl leading-snug text-foreground">{s.text}</p>
                </div>
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
    <section id="pricing" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.22em] text-roast">Pricing</span>
          <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Honest pricing. Like a good menu.</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-2xl border p-8 transition-all ${
                t.featured
                  ? "border-roast bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-roast/50"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-2xl">{t.name}</h3>
                <div>
                  <span className="font-serif text-4xl">${t.price}</span>
                  <span className={`ml-1 text-xs ${t.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>/mo</span>
                </div>
              </div>
              <p className={`mt-2 text-sm ${t.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{t.desc}</p>
              <ul className="mt-7 flex flex-col gap-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${t.featured ? "bg-primary-foreground/70" : "bg-roast"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 inline-flex h-11 items-center justify-center rounded-md px-6 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
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
    <section id="faq" className="border-t border-border bg-cream/40">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-12 text-center">
          <span className="text-[10px] uppercase tracking-[0.22em] text-roast">Frequently asked</span>
          <h2 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Questions, answered slowly.</h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={f.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="block w-full py-6 text-left transition-colors hover:bg-background/50"
              >
                <div className="flex items-center justify-between gap-6 px-2">
                  <span className="font-serif text-xl text-foreground">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-roast transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
                {isOpen && (
                  <p className="mt-3 px-2 text-sm leading-relaxed text-muted-foreground fade-up">{f.a}</p>
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
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-roast" />
          <span className="font-serif text-lg">RoastNote</span>
          <span className="ml-3 text-xs text-muted-foreground">© {new Date().getFullYear()} — Brewed for cafés.</span>
        </div>
        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <a href="#presets" className="hover:text-foreground transition-colors">Voice</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="bottom-right" richColors />
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
