# Cloudflare Workers Chat Demo

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OJamals/prismfin-apple-inspired-financial-analysis-dashboard)]](https://deploy.workers.cloudflare.com/)

A production-ready full-stack chat application built on Cloudflare Workers. Features stateful entities (Users, ChatBoards) powered by a single shared Durable Object for efficient storage, indexed listing with pagination, and a modern React frontend.

## 🚀 Key Features

- **Stateful Backend**: Durable Objects for Users and ChatBoards with automatic indexing and pagination
- **Real-time Chats**: Send/retrieve messages per chat board
- **Type-Safe API**: End-to-end TypeScript with shared types between frontend and worker
- **Modern UI**: React 18, Tailwind CSS, shadcn/ui components, TanStack Query
- **Serverless**: Zero-config deployment to Cloudflare Workers with Pages integration
- **Performance**: Optimized for edge computing, no cold starts for DO-backed entities
- **Developer-Friendly**: Hot-reload dev server, type generation, Bun support

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (data fetching)
- React Router (routing)
- Hono (API client wrapper)
- Sonner (toasts), Lucide (icons)

### Backend
- Cloudflare Workers
- Hono (routing)
- Durable Objects (GlobalDurableObject with entity sharding)
- SQLite-backed DO storage

### Tools
- Bun (fast package manager/build tool)
- Vite (dev server/build)
- Wrangler (Cloudflare CLI)
- TypeScript 5.x (strict mode)

## 📦 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed
- [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (optional for deploy)

### Installation
```bash
bun install
```

### Development
```bash
# Start dev server (frontend + worker proxy)
bun dev

# Open http://localhost:3000 (or $PORT)
```

Type generation for Workers bindings:
```bash
bun cf-typegen
```

Linting:
```bash
bun lint
```

Preview production build:
```bash
bun build
bun preview
```

## 💻 Usage

### API Endpoints
All APIs under `/api/*` (CORS-enabled):

- **Users**
  - `GET /api/users?cursor=&limit=` - List users (paginated)
  - `POST /api/users` - `{ "name": "User" }`
  - `DELETE /api/users/:id`
  - `POST /api/users/deleteMany` - `{ "ids": ["id1", "id2"] }`

- **Chats**
  - `GET /api/chats?cursor=&limit=` - List chat boards
  - `POST /api/chats` - `{ "title": "My Chat" }`
  - `DELETE /api/chats/:id`
  - `POST /api/chats/deleteMany` - `{ "ids": ["id1"] }`

- **Messages**
  - `GET /api/chats/:chatId/messages` - List messages
  - `POST /api/chats/:chatId/messages` - `{ "userId": "u1", "text": "Hello" }`

Health check: `GET /api/health`

Client error reporting: `POST /api/client-errors`

### Frontend Customization
- Edit `src/pages/HomePage.tsx` for main UI
- Add routes in `src/main.tsx`
- Use `src/lib/api-client.ts` for type-safe API calls
- Theme toggle and sidebar in `src/components/`
- Error boundaries included

### Backend Customization
- **Add routes**: `worker/user-routes.ts` (imported dynamically)
- **New entities**: Extend `IndexedEntity` in `worker/entities.ts`
  ```ts
  export class MyEntity extends IndexedEntity<MyState> {
    static readonly entityName = "myentity";
    static readonly indexName = "myentities";
    static readonly initialState: MyState = { id: "" };
  }
  ```
- **Shared types**: `shared/types.ts` & `shared/mock-data.ts`
- **NEVER** modify `worker/core-utils.ts` or `worker/index.ts`

Seed data auto-populates on first list request.

## ☁️ Deployment

Deploy to Cloudflare Workers in one command:

```bash
# Authenticate (first time only)
wrangler login
wrangler whoami  # Check account

# Deploy worker + static assets
bun deploy
```

**Custom domain**: Edit `wrangler.jsonc` → `workers_dev: false` + `[[routes]]`

**Production preview**:
```
wrangler pages dev dist/ --binding=D1_DB=...  # If using Pages
```

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OJamals/prismfin-apple-inspired-financial-analysis-dashboard)]](https://deploy.workers.cloudflare.com/)

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. `bun dev`
4. Submit PR to `main`

Follow TypeScript strict mode & ESLint rules.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙋 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- File issues for bugs/features

Built with ❤️ for the Cloudflare developer community.