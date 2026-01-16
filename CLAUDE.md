# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev              # Start dev server on port 6002 (Turbopack)
npm run build            # Production build
npm run start            # Production server on port 6001

# Code Quality
npm run lint             # Biome lint
npm run format           # Biome format with auto-fix
npm run check            # Biome CI check (lint + format)

# Electron Desktop App
npm run electron:dev     # Dev with Electron
npm run dist:win         # Build Windows installer
npm run dist:mac         # Build macOS installer
npm run dist:linux       # Build Linux installer

# Cloudflare Deployment
npm run preview          # Build and preview on Cloudflare
npm run deploy           # Deploy to Cloudflare Workers
```

## Architecture Overview

### App Structure (Next.js App Router)

```
app/
├── [lang]/              # Dynamic locale routing (en, zh, ja)
│   ├── layout.tsx       # Root layout with DiagramProvider, DictionaryProvider
│   └── page.tsx         # Main page: DrawIoEmbed + ChatPanel split view
└── api/
    └── chat/route.ts    # Main AI endpoint (~858 lines) - handles streaming, tools, quota
```

### Core Data Flow

1. **User Input** → `ChatPanel` (`useChat` hook from `@ai-sdk/react`)
2. **API Request** → `/api/chat` (validates access, checks quota, selects AI provider)
3. **Tool Execution** → AI calls `display_diagram`, `edit_diagram`, or `append_diagram`
4. **Tool Handler** → `useDiagramToolHandlers` validates XML, handles truncation
5. **State Update** → `DiagramContext` updates `chartXML`, triggers re-render
6. **Draw.io Render** → `DrawIoEmbed` receives new XML via ref

### Key Files by Domain

**AI Integration:**
- `lib/ai-providers.ts` - 12 provider implementations (OpenAI, Anthropic, Google, Bedrock, etc.)
- `lib/system-prompts.ts` - LLM system prompts for diagram generation
- `app/api/chat/route.ts` - Chat endpoint with tool definitions

**Diagram Operations:**
- `contexts/diagram-context.tsx` - Global state: `chartXML`, `diagramHistory`, `latestSvg`
- `hooks/use-diagram-tool-handlers.ts` - Tool call processing (display/edit/append)
- `lib/utils.ts` - XML validation, truncation detection, parsing utilities

**UI Components:**
- `components/chat-panel.tsx` - Main chat interface (43KB, complex)
- `components/model-config-dialog.tsx` - Multi-provider configuration (109KB)
- `components/chat-input.tsx` - User input with file upload support

**i18n:**
- `lib/i18n/config.ts` - Supported locales configuration
- `lib/i18n/dictionaries/` - Translation JSON files

### AI Tool System

The AI uses 4 tools for diagram manipulation:

| Tool | Purpose |
|------|---------|
| `display_diagram` | Create new diagram from scratch (full XML output) |
| `edit_diagram` | Modify existing diagram via search/replace |
| `append_diagram` | Continue truncated XML from `display_diagram` |
| `get_shape_library` | Discover available icon libraries (AWS, Azure, GCP, etc.) |

XML truncation is detected by `isMxCellXmlComplete()` in `lib/utils.ts`.

### State Management

- **DiagramContext** (`contexts/diagram-context.tsx`): Diagram XML, history, export state
- **useChat** (`@ai-sdk/react`): Chat messages, streaming state
- **localStorage keys** (defined in `lib/storage.ts`):
  - `next-ai-draw-io-diagram-xml` - Current diagram
  - `next-ai-draw-io-messages` - Chat history
  - `next-ai-draw-io-xml-snapshots` - Diagram version history

### Adding a New AI Provider

1. Add provider config in `lib/ai-providers.ts`
2. Add model types in `lib/types/model-config.ts`
3. Update `env.example` with required environment variables
4. Add provider option in `components/model-config-dialog.tsx`

## Code Style

- **Formatter**: Biome with 4-space indentation
- **Quotes**: Double quotes for strings
- **Semicolons**: Only as needed (ASI)
- **Path aliases**: `@/*` maps to root (e.g., `@/lib/utils`)
- **UI components**: `components/ui/` contains shadcn/ui base components (excluded from linting)

## Monorepo Structure

```
packages/
└── mcp-server/          # MCP server for Claude Desktop/Cursor integration
    └── src/index.ts     # Entry point
```

MCP server can be tested with: `npx @next-ai-drawio/mcp-server@latest`
