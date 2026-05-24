# ☕ Roast Note AI

An AI-powered coffee roast journal app that helps coffee enthusiasts log, analyze, and explore their roasting notes with the help of artificial intelligence.

---

## ✨ Features

- **AI-Powered Tasting Notes** — Generate descriptive roast notes using AI based on your inputs
- **Roast Journal** — Log and track coffee roasts with details like origin, profile, and flavor
- **Supabase Backend** — Secure authentication and real-time data storage
- **Modern UI** — Clean, responsive interface built with Radix UI and Tailwind CSS v4
- **Dark/Light Theme** — Seamless theme switching for comfortable viewing
- **Data Visualization** — Charts for roast history and flavor trends via Recharts
- **Form Validation** — Type-safe forms with React Hook Form and Zod
- **Edge Deployment** — Deployed globally via Cloudflare Workers for fast load times

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + React 19 |
| Language | TypeScript |
| AI Integration | [Vercel AI SDK](https://sdk.vercel.ai) + OpenAI-compatible API |
| Styling | Tailwind CSS v4 + Radix UI + shadcn/ui |
| Database & Auth | [Supabase](https://supabase.com) |
| Routing | TanStack Router (file-based) |
| Data Fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Build Tool | Vite 7 |
| Deployment | Cloudflare Workers (Wrangler) |
| Code Quality | ESLint + Prettier |

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher
- **Bun** (recommended) or npm
- A [Supabase](https://supabase.com) project
- A [Cloudflare](https://cloudflare.com) account (for deployment)
- An OpenAI-compatible API key (for AI features)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/imwulan/roast-note-ai.git
cd roast-note-ai
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root of the project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_compatible_api_key
```

> ⚠️ **Important:** Never commit the `.env` file to version control. It is already listed in `.gitignore`.

### 4. Apply database migrations

```bash
npx supabase db push
```

### 5. Run the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
roast-note-ai/
├── src/                    # Application source code
│   ├── routes/             # File-based routing (TanStack Router)
│   ├── components/         # Reusable UI components (shadcn/ui + custom)
│   ├── lib/                # Utilities, helpers, Supabase client
│   └── server.ts           # Cloudflare Workers entry point
├── supabase/               # Supabase config & SQL migrations
├── .lovable/               # Lovable.dev project configuration
├── vite.config.ts          # Vite + Cloudflare plugin config
├── wrangler.jsonc          # Cloudflare Workers deployment config
├── components.json         # shadcn/ui registry config
├── tsconfig.json           # TypeScript configuration
└── package.json
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |

---

## ☁️ Deployment

This project is configured for **Cloudflare Workers** deployment.

```bash
# Build the project
bun run build

# Deploy to Cloudflare
npx wrangler deploy
```

Make sure to add your environment variables in the **Cloudflare Dashboard → Workers & Pages → Settings → Environment Variables**.

---

## 🤖 AI Integration

Roast Note AI uses the **Vercel AI SDK** with an OpenAI-compatible endpoint to generate tasting notes and flavor descriptions. You can connect it to:

- [OpenAI](https://platform.openai.com) (`gpt-4o`, `gpt-4o-mini`)
- [Groq](https://groq.com)
- [OpenRouter](https://openrouter.ai)
- Any other OpenAI-compatible provider

Set the appropriate base URL and API key in your `.env` file.

---

## 👩‍💻 Author

**Sri Wulandari**
- GitHub: [@imwulan](https://github.com/imwulan)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
