import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const InputSchema = z.object({
  businessType: z.string().min(1).max(80),
  brandVoice: z.string().min(1).max(80),
  product: z.string().min(1).max(160),
  mood: z.string().min(1).max(40),
  platform: z.string().min(1).max(40),
  previousVersions: z
    .array(
      z.object({
        mainCaption: z.string(),
        shortCta: z.string(),
        storyText: z.string(),
      }),
    )
    .max(8)
    .optional(),
});

const OutputSchema = z.object({
  mainCaption: z.string(),
  shortCta: z.string(),
  hashtags: z.array(z.string()).min(3).max(12),
  storyText: z.string(),
});

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
        }
        const parsed = InputSchema.safeParse(payload);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
        }
        const { businessType, brandVoice, product, mood, platform, previousVersions } = parsed.data;

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(apiKey);
        const model = gateway("openai/gpt-5");

        const voiceGuides: Record<string, {
          essence: string;
          rhythm: string;
          vocabulary: string;
          tone: string;
          avoid: string;
          reference: string;
        }> = {
          "Scandinavian Minimal": {
            essence:
              "Quiet, restrained, almost architectural. Negative space matters more than what is said. One precise observation lands harder than three adjectives.",
            rhythm:
              "Very short sentences. Fragments. Often 3–8 words. Periods carry weight. Never compound or florid.",
            vocabulary:
              "Pale wood, linen, oat, ceramic, morning light, raw, slow, still, plain, honest. Use nouns over adjectives. No metaphors.",
            tone: "Cool, calm, slightly austere. The pleasure is in the restraint itself. Think Fabrique, Drop, Coffee Collective.",
            avoid:
              "Romantic verbs, French words, exclamation, hype, anything decorative. No 'cozy,' no 'comforting.'",
            reference: "Reads like a Kinfolk caption or a Norm Architects product card.",
          },
          "Parisian Luxury": {
            essence:
              "Editorial, poetic, lightly romantic. Copy that could open a Vogue Paris food column. Indulgence framed as taste, never excess.",
            rhythm:
              "Longer, lyrical sentences with internal pauses. Em dashes welcome. Occasional fragment for cadence. Reads aloud well.",
            vocabulary:
              "Comptoir, matin, beurre, feuilletage, ombre, lumière. French nouns dropped in naturally — never translated, never italicised. Words like quiet, suspended, glossed, lacquered, slow afternoon.",
            tone: "Refined, knowing, a little wistful. Pleasure as a private ritual. Think Cédric Grolet, Maison Plisson, Telescope Café.",
            avoid:
              "Cheesy romance, 'magical', 'heavenly', 'oh la la', exclamations. No tourist-French.",
            reference: "Reads like an editor's note in The Gourmand or a Mast Books menu insert.",
          },
          "Urban Roaster": {
            essence:
              "Ingredient-led, technical, grounded. The product speaks first — origin, process, the bar, the brew. Confidence without polish.",
            rhythm:
              "Medium-length, declarative sentences. Often built around a colon or a hard period. Direct subject-verb-object. No filler.",
            vocabulary:
              "Single-origin specifics (Gesha, Sidamo, washed, natural, anaerobic), bar terms (pull, dose, ratio, EK43, V60), tactile descriptors (syrupy, citric, brown sugar, stone fruit). Real numbers when relevant.",
            tone: "Confident, low-fi, a touch raw. Talks to people who already know coffee — and welcomes those who don't, without explaining down. Think Onyx, Manhattanist, La Cabra, Prufrock.",
            avoid:
              "Soft adjectives, 'cozy', 'perfect', 'elevate'. No corporate gloss. No emoji. No exclamation.",
            reference: "Reads like a roast card or a barista's chalkboard note.",
          },
          "Warm Artisan": {
            essence:
              "Handmade warmth. The bakery on the corner that knows your name. Generous, unhurried, neighborly — but never twee.",
            rhythm:
              "Mixed sentence lengths. A long, walking sentence followed by a short one. Conversational cadence — written the way it would be said across the counter.",
            vocabulary:
              "Tactile verbs (folded, laminated, pulled, poured, dusted, rested). Time words (overnight, all morning, since five). Familiar nouns (kitchen, hands, dough, butter, oven). Names of regulars and neighborhoods are welcome.",
            tone: "Warm, grounded, quietly proud. Pride in the doing, not the brand. Think Tartine, Lune, St. JOHN Bakery, Bread Ahead.",
            avoid:
              "Saccharine 'made with love', 'crafted with passion', 'family' as a buzzword. No corporate warmth.",
            reference: "Reads like a handwritten card tucked next to the pastry case.",
          },
        };

        const voice = voiceGuides[brandVoice] ?? {
          essence: "Editorial, considered, sensory.",
          rhythm: "Varied sentence length. Confident pacing.",
          vocabulary: "Concrete sensory nouns. No filler adjectives.",
          tone: "Modern, human, premium.",
          avoid: "Marketing clichés.",
          reference: "Modern indie café branding.",
        };

        const system = `You are RoastNote — the in-house copy voice for the most thoughtful independent coffee shops, cafés, and artisan bakeries in cities like Copenhagen, Paris, Brooklyn, Melbourne, Lisbon, and London.

You write the way the best small cafés actually write: like a human at the bar who cares about the product, not a marketing team. Your copy could sit next to work by Onyx, La Cabra, Tartine, Maison Plisson, or Coffee Collective without looking out of place.

GLOBAL HARD RULES (never break):
- No emojis. Ever. Across every preset.
- No exclamation points. Anywhere.
- No marketing or startup language: "game-changer", "elevate", "level up", "unlock", "experience", "indulge", "treat yourself", "perfect cup", "the ultimate", "next-level", "must-try", "obsessed", "crushing it".
- No coffee clichés: "but first, coffee", "Monday mood", "fuel", "rise and grind", "caffeine fix", "liquid gold", "happy place", "good vibes".
- No empty intensifiers: "amazing", "delicious", "incredible", "absolutely", "literally", "perfectly".
- No AI tells: tricolons of adjectives ("warm, rich, inviting"), parallel "Whether you're… or…" constructions, "Picture this:", "Step into…", "There's something about…", "Crafted with…", rhetorical questions to the reader.
- No hashtags or @mentions inside captions. Hashtags belong only in the hashtags field.
- Concrete over abstract: a real texture, temperature, sound, smell, light, or hand-motion beats any adjective.
- Sentence rhythm must vary within the caption. Never three sentences of the same length in a row.
- Sound like one specific person wrote it for one specific café — never like a template.`;

        const prompt = `Write one social post for this café.

CONTEXT
- Business: ${businessType}
- Product / menu item: ${product}
- Mood: ${mood}
- Platform: ${platform}
- Brand voice preset: ${brandVoice}

VOICE BIBLE — ${brandVoice}
- Essence: ${voice.essence}
- Rhythm: ${voice.rhythm}
- Vocabulary: ${voice.vocabulary}
- Tone: ${voice.tone}
- Avoid: ${voice.avoid}
- Reference feel: ${voice.reference}

The output for "${brandVoice}" must be unmistakably different in vocabulary, rhythm, and emotional tone from what the other three presets would produce for the same product. If a reader could not guess the preset from the caption alone, rewrite it.

DELIVER (return as structured object):

1. mainCaption
   - Sized for ${platform}. Instagram Post: 2–4 sentences. Story: 1 line. Threads: 1–2 sentences, slightly more conversational. TikTok: 1 punchy line.
   - Anchored in one concrete sensory detail of "${product}" — not a list of adjectives.
   - Carries the ${mood.toLowerCase()} mood through rhythm and word choice, not by naming the mood.
   - Follows the rhythm rule above. Vary sentence length. Fragments allowed when they land.
   - No hashtags, no emojis, no exclamation.

2. shortCta
   - Maximum 6 words. Quiet, specific, never pushy.
   - No "shop now", "tap to order", "don't miss", "link in bio", "come try", "swing by today", "limited time".
   - Prefer an invitation tied to a real moment: an hour, a chair, a counter, a window seat.

3. hashtags
   - 6–8 lowercase tags, no # prefix.
   - Specific to the product, craft, neighborhood feel, and ${brandVoice} sensibility.
   - Banned: coffee, love, foodie, instagood, instafood, yum, yummy, delicious, coffeelover, coffeetime, coffeegram, foodporn, cafe, cafelife.
   - Mix specific (e.g. laminateddough, slowextraction, naturalprocess) with scene-setting (e.g. windowseat, morninglight, cornerbakery). No brand names.

4. storyText
   - Under 110 characters. One line, designed as a Story overlay.
   - A single observation, a time, or a quiet invitation — not a summary of the caption.
   - Different angle from the caption: if the caption talks about the product, the story talks about the moment, or vice versa.

Before returning, silently check: does this read like AI? If any sentence could appear in a generic Canva template, rewrite it sharper and more specific.${
          previousVersions && previousVersions.length > 0
            ? `

REGENERATION MODE — this is version ${previousVersions.length + 1}.
You have already written the following versions for the SAME product, voice, and mood. Stay inside the ${brandVoice} voice bible, but make this version feel genuinely new.

${previousVersions
  .map(
    (v, i) =>
      `--- Version ${i + 1} ---
Caption: ${v.mainCaption}
CTA: ${v.shortCta}
Story: ${v.storyText}`,
  )
  .join("\n\n")}

Hard rules for this regeneration:
- Do not reuse the opening word or opening image of any previous version.
- Do not reuse any distinctive noun, verb, or phrase longer than two words from any previous version (especially the sensory anchor — pick a different angle: light, sound, hand-motion, time of day, surface, temperature, conversation, ritual).
- Change the sentence structure shape: if previous versions led with a fragment, lead with a full sentence here, and vice versa. Change where the period falls.
- Different CTA verb and different setting object than any previous CTA.
- Different angle for the story line than any previous story.
- Still unmistakably ${brandVoice}. The voice is a constant; the rendering is the variable.`
            : ""
        }`;

        try {
          const { experimental_output } = await generateText({
            model,
            system,
            prompt,
            experimental_output: Output.object({ schema: OutputSchema }),
          });
          return Response.json(experimental_output);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Generation failed";
          const status = /402/.test(message) ? 402 : /429/.test(message) ? 429 : 500;
          return new Response(JSON.stringify({ error: message }), { status });
        }
      },
    },
  },
});
