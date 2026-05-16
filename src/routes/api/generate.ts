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
        const model = gateway("google/gemini-3-flash-preview");

        const system = `You are RoastNote — a premium AI brand voice engine for independent coffee shops, cafés, and artisan bakeries. You write social copy that feels like premium coffee branding: editorial, considered, sensory, never cliché. Avoid emojis unless the brand voice clearly calls for one. Avoid generic startup or hustle language. No exclamation points unless the brand voice is "Playful". Match the requested platform's tone and length conventions.`;

        const prompt = `Generate a premium social caption set for:
Business type: ${businessType}
Brand voice preset: ${brandVoice}
Product / menu item: ${product}
Mood: ${mood}
Platform: ${platform}

Return:
- mainCaption: 2–4 short sentences, sensory, on-brand, no hashtags inside it.
- shortCta: one tight call to action under 8 words.
- hashtags: 5–8 lowercase hashtags (no #), specific not generic.
- storyText: 1–2 sentences sized for an Instagram Story overlay, under 140 characters.`;

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
