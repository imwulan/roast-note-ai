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
        const { businessType, brandVoice, product, mood, platform } = parsed.data;

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(apiKey);
        const model = gateway("openai/gpt-5-mini");

        const voiceGuides: Record<string, string> = {
          "Scandinavian Minimal":
            "Quiet, spare, almost architectural. Short sentences. Natural light, pale wood, linen. No ornament.",
          "Parisian Luxury":
            "Soft, refined, lightly romantic. French nouns welcome (croissant, comptoir, matin). Understated indulgence — never gaudy.",
          "Urban Roaster":
            "Confident, low-fi, slightly raw. Industrial textures, single-origin specifics, mention of the bar or the brew bar. No corporate gloss.",
          "Warm Artisan":
            "Hand-made warmth. Tactile verbs (folded, pulled, poured). Generous, neighborly, never saccharine.",
        };

        const voiceGuide = voiceGuides[brandVoice] ?? "Editorial, considered, sensory.";

        const system = `You are RoastNote — a premium AI brand voice engine for independent coffee shops, cafés, and artisan bakeries.

You write social copy that reads like the back of a beautifully designed coffee bag or the opening paragraph of an indie food magazine: sensory, specific, emotionally engaging, modern, never generic.

Hard rules:
- No emojis (unless brand voice is explicitly playful — none of the current presets are).
- No exclamation points.
- No startup, hustle, or marketing-deck language ("game-changer", "level up", "elevate your morning", "perfect cup", "indulge", "treat yourself").
- No clichés about Mondays, fuel, or "but first, coffee".
- Prefer concrete sensory detail (texture, temperature, light, sound, scent) over adjectives like "delicious" or "amazing".
- Vary sentence length. Fragments are welcome when they land.
- Sound like a human wrote it at the bar, not a brand team in a meeting.`;

        const prompt = `Write a premium social caption set.

BUSINESS: ${businessType}
PRODUCT: ${product}
MOOD: ${mood}
PLATFORM: ${platform}
BRAND VOICE: ${brandVoice}
VOICE GUIDE: ${voiceGuide}

Deliver:
- mainCaption: 2–4 short sentences sized for ${platform}. Sensory, specific to "${product}", carries the ${mood.toLowerCase()} mood and the ${brandVoice} voice. No hashtags inside.
- shortCta: one quiet, confident call to action, max 7 words. Not pushy. No exclamation.
- hashtags: 6–8 lowercase tags (no #), specific to the product, neighborhood feel, and craft — avoid #coffee, #love, #foodie, #instagood and other generics.
- storyText: 1–2 lines under 120 characters, written as a Story overlay — a single observation or invitation, not a recap of the caption.`;

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
