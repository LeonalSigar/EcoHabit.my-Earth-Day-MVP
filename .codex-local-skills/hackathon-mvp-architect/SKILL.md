---
name: hackathon-mvp-architect
description: >
  Elite rapid MVP and hackathon engineering specialist. Use this skill whenever the user
  needs to build a working product under extreme time constraints — 24h, 48h, or 72h
  hackathons, investor demos, prototype sprints, or "build me something today" requests.
  Trigger for phrases like "hackathon", "MVP", "demo in X hours", "prototype", "proof of concept",
  "need this by tomorrow", "build fast", "ship it", "rapid prototype", or any scenario where
  speed-to-working-demo is the primary objective. Always prioritize ruthless scope management,
  pre-built primitives, and demo impact over code elegance.
---

<!-- SKILL: hackathon-mvp-architect — DO NOT EDIT DESCRIPTION BLOCK ABOVE -->

# Hackathon MVP Architect

Speed is the strategy. In a hackathon, the winner is the team that ships the most compelling **working demo** — not the best-architected system. This skill is calibrated for **ruthless scope execution**: cut everything that doesn't serve the demo, double down on everything that does.

---

## Phase 1 — Rapid Scoping (First 30 Minutes)

Before writing a single character of code, nail the scope:

```
## ⚡ MVP Scope Definition

**Core problem statement (1 sentence):**
**Target user (1 sentence):**
**The "wow moment" in the demo:** <the one thing that makes judges lean forward>

**Feature triage:**
| Feature | Impact (H/M/L) | Build Time | MVP? |
|---|---|---|---|
| <feature> | H | 2h | ✅ YES |
| <feature> | M | 4h | ❌ CUT |

**Tech stack decision:**
- Frontend: [Next.js 14 App Router | Vite + React | plain HTML/JS]
- Backend: [Next.js API routes | Express | Supabase | Firebase | mock data]
- Auth: [NextAuth | Clerk | mock/skip]
- DB: [Supabase | PlanetScale | SQLite | mock JSON]
- AI: [OpenAI SDK | Vercel AI SDK | Replicate | none]

**Timeline:**
| Hour | Milestone |
|---|---|
| 0-2h | Scaffold + auth + routing |
| 2-6h | Core feature implementation |
| 6-8h | UI polish + demo data |
| 8-9h | Deployment + rehearsal |

**Non-negotiables for demo:**
1. It must be live on a public URL (Vercel/Netlify)
2. Happy path must work end-to-end
3. Loading states must not be broken
```

---

## Phase 2 — Build Execution

### Stack Instantiation (< 10 minutes)

```bash
# Next.js 14 + Tailwind + shadcn/ui (fastest premium stack for hackathons)
npx create-next-app@latest my-hackathon-app \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd my-hackathon-app
npx shadcn-ui@latest init   # Choose: Default style, Slate base color, CSS variables YES
npx shadcn-ui@latest add button card input dialog toast badge avatar
```

```bash
# Environment bootstrap
cp .env.example .env.local
# Add keys immediately — block nothing on env setup
```

### Rapid Component Strategy

Use **shadcn/ui** for all base components — never build from scratch during a hackathon:
- Tables → `<DataTable>` with TanStack Table
- Forms → React Hook Form + Zod
- Async loading → `loading.tsx` + `<Skeleton>`
- Navigation → pre-built `<NavigationMenu>`
- Toasts / alerts → `<Sonner>` or `useToast()`
- Charts → Recharts (already in shadcn ecosystem)

### AI Integration (if applicable)

```ts
// app/api/ai/route.ts — streaming response in < 20 lines
import { OpenAI } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { messages } = await req.json()
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',  // fast + cheap for demos
    messages,
    stream: true,
  })
  return new StreamingTextResponse(OpenAIStream(response))
}
```

### Demo Data Strategy

**Never demo on an empty database.** Always seed rich, realistic data:
```ts
// lib/seed.ts — run once on deploy
const SEED_USERS = [
  { name: 'Sarah Chen', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Marcus Reid', role: 'Engineer', avatar: 'https://i.pravatar.cc/150?img=12' },
] as const
```

### Deployment Checklist (Hour 8)

```bash
# Vercel (instant, free, zero config for Next.js)
npx vercel --prod

# Environment variables — set ALL of these in Vercel dashboard BEFORE deploy:
# OPENAI_API_KEY, DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL (your vercel domain)

# Verify:
curl https://your-app.vercel.app/api/health
```

---

## Hackathon-Specific Patterns

### Mock Everything That's Not Core

```ts
// lib/mock.ts — replace real DB calls with this during crunch time
export const mockUsers = [...] 
export const getUser = (id: string) => mockUsers.find(u => u.id === id) ?? mockUsers[0]
// Ship with mock → swap to real DB post-hackathon if you win
```

### The "Happy Path" Rule

During a hackathon, only the happy path needs to work. Structure code accordingly:
```ts
// Acceptable in a hackathon context — do NOT do this in production
async function getProjectData(id: string) {
  try {
    return await db.project.findUnique({ where: { id } })
  } catch {
    return MOCK_PROJECT // always return something for the demo
  }
}
```

### Progressive Enhancement Order

1. **Static mockup first** — get the visual story right (30 min)  
2. **Wire up navigation** — every button goes somewhere (30 min)  
3. **Core data flow** — the one feature judges will click (2-4h)  
4. **Loading states** — nothing should hang silently (30 min)  
5. **Error recovery** — at least show a message (30 min)  
6. **Polish** — only if time permits (last 1h)

---

## Pitch Deck Tech Slide Template

```markdown
## ⚙️ Technical Architecture

**Frontend:** Next.js 14 + TypeScript + Tailwind CSS
**AI Layer:** OpenAI GPT-4o via Vercel AI SDK (streaming)
**Database:** Supabase (PostgreSQL + real-time)
**Auth:** Clerk (OAuth in < 10 minutes)
**Deploy:** Vercel (CI/CD on every push)
**Infra cost:** ~$0/month on free tiers for demo scale

> Live demo: https://your-app.vercel.app
```

---

> **CRITICAL GUARDRAIL: ZERO-GUESSING POLICY**
> You are strictly forbidden from guessing, assuming, or hallucinating code architecture, variable names, or logic. If the user asks for a fix, an adjustment, or a review, and has not provided the relevant source file (either via upload, text, or connected repository), you MUST stop immediately. Your only response should be to ask the user to provide the specific file(s) needed before you suggest any code changes.
