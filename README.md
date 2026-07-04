# 内核 NèiHé · Inner Core

> 养心 · 观照 · 自在

A self-cultivation app for Chinese youth, blending traditional philosophy (儒/道/佛) with modern mindfulness tools.

## Architecture

```
neihe/
├── backend/                    # NestJS + TypeORM + PostgreSQL
│   └── src/
│       ├── main.ts             # Entry point, port 3000
│       ├── app.module.ts       # Root module, DB config
│       ├── database/
│       │   └── entities/
│       │       └── user.entity.ts
│       └── modules/
│           ├── auth/           # JWT auth (register/login)
│           │   └── auth.module.ts
│           ├── cards/          # Philosophy cards + favorites
│           │   ├── cards.module.ts
│           │   ├── philosophy-card.entity.ts
│           │   └── favorite.entity.ts
│           ├── journal/        # Mood journal entries
│           │   ├── journal.module.ts
│           │   └── journal-entry.entity.ts
│           ├── breathing/      # Breathing session records
│           │   ├── breathing.module.ts
│           │   └── breathing-session.entity.ts
│           └── stats/          # Aggregated user statistics
│               └── stats.module.ts
│
└── frontend/                   # React + TypeScript
    └── src/
        ├── types/index.ts      # Shared types (mirrors backend entities)
        ├── services/
        │   ├── api.ts          # API service layer
        │   └── seed-cards.ts   # First batch of curated content (17 cards)
        ├── components/         # Reusable UI components (TODO)
        ├── pages/              # Page-level components (TODO)
        ├── hooks/              # Custom React hooks (TODO)
        └── styles/             # Global styles + design tokens (TODO)
```

## Data Model

```
User ──────────┬── JournalEntry ──── PhilosophyCard
               ├── BreathingSession
               └── Favorite ─────── PhilosophyCard
```

Five entities, clean relations:
- **User**: email, nickname, passwordHash
- **PhilosophyCard**: school (儒/道/佛), source, originalText, translation, reflection, themes[], moodFit
- **JournalEntry**: mood (5-level), content, optional cardId link
- **BreathingSession**: pattern, cyclesCompleted, durationSeconds
- **Favorite**: userId + cardId (unique constraint)

## API Endpoints (planned)

| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| POST   | /auth/register          | Create account           |
| POST   | /auth/login             | Get JWT token            |
| GET    | /cards/today            | Daily recommended card   |
| GET    | /cards/random           | Random card              |
| POST   | /cards/:id/favorite     | Toggle favorite          |
| POST   | /journal                | Create journal entry     |
| GET    | /journal?page=&mood=    | List entries (paginated) |
| POST   | /breathing              | Record breathing session |
| GET    | /stats/summary          | User statistics          |

## Development Roadmap

### Sprint 0 (Current): Project Scaffold ✅
- [x] Backend: NestJS project structure, entities, modules
- [x] Frontend: Types, API service, seed data
- [ ] Docker Compose for PostgreSQL
- [ ] Backend: npm install & verify compilation

### Sprint 1: Auth + Cards
- [ ] AuthService: register, login, JWT strategy
- [ ] AuthController: POST /register, POST /login
- [ ] CardsService: getToday (seeded rotation), getRandom
- [ ] CardsController: GET /today, GET /random, POST /:id/favorite
- [ ] Frontend: Card display component, daily view

### Sprint 2: Journal
- [ ] JournalService: create, findAll (paginated, filterable)
- [ ] JournalController: POST /, GET /
- [ ] Frontend: Mood selector, journal input, history list

### Sprint 3: Breathing + Stats
- [ ] BreathingService: create session record
- [ ] StatsService: aggregate mood distribution, streaks, totals
- [ ] Frontend: Breathing exercise UI, stats dashboard

### Sprint 4: Polish + Deploy
- [ ] Content: expand to 50+ curated cards
- [ ] UI polish: animations, responsive, dark mode
- [ ] Deploy: Vercel (frontend) + Railway (backend)

## Design Tokens

```
Primary:    #5B7553  (松柏绿)
Background: #FAF8F5  (宣纸)
Text:       #1A1A1A  (墨)
Secondary:  #777777  (烟灰)
儒:         #8B4513  (赭石)
道:         #2E5E4E  (青苔)
佛:         #6B4C8A  (檀紫)
```

Font: Noto Serif SC (经典原文) + system-ui (界面文字)
