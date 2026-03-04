# Meilisearch Dashboard

A feature-rich dashboard for managing Meilisearch instances, built with React, TypeScript, Vite, and Tailwind CSS.

**Current Meilisearch target version:** v1.37.0

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite 5
- **Styling:** Tailwind CSS + Flowbite React
- **Editor:** CodeMirror (JSON editing)
- **i18n:** i18next

## Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## Implementation Roadmap

### Current State

| Area | Status |
|------|--------|
| Instance connection & auth | Done |
| Index CRUD | Done |
| Document upload (JSON) | Done |
| Basic keyword search | Done |
| Searchable attributes settings | Done |
| Ranking rules settings | Done |
| Typo tolerance settings | Done |
| Settings diff preview & save | Done |
| Task list with status/type filters | Done |
| API key CRUD | Done |
| Federated multi-index search | Done |
| Experimental features toggle | Done |
| Dumps & snapshots | Done |
| Overview / health widget | Done |

### What's Missing

Below is the full implementation plan organized by phase. Each phase builds on the previous one, moving from foundational gaps to advanced features.

---

### Phase 1 — Complete Index Settings (existing API, no UI)

The settings service and context already fetch/save all 21 settings, but only 3 have UI components. These are all standard Meilisearch settings that existed in v1.30.1.

| # | Setting | UI Needed | Complexity |
|---|---------|-----------|------------|
| 1.1 | **displayedAttributes** | Array editor (like searchableAttributes) | Low |
| 1.2 | **filterableAttributes** | Array editor | Low |
| 1.3 | **sortableAttributes** | Array editor | Low |
| 1.4 | **stopWords** | Array editor | Low |
| 1.5 | **synonyms** | Key→value map editor (stub tab exists, says "to be done") | Medium |
| 1.6 | **distinctAttribute** | Single string input (nullable) | Low |
| 1.7 | **separatorTokens** | Array editor | Low |
| 1.8 | **nonSeparatorTokens** | Array editor | Low |
| 1.9 | **dictionary** | Array editor | Low |
| 1.10 | **pagination** (`maxTotalHits`) | Number input | Low |
| 1.11 | **faceting** (`maxValuesPerFacet`, `sortFacetValuesBy`) | Number input + map editor | Low-Medium |
| 1.12 | **proximityPrecision** | Dropdown (`byWord` / `byAttribute`) | Low |
| 1.13 | **searchCutoffMs** | Number input (nullable) | Low |
| 1.14 | **localizedAttributes** | Array of `{ attributePatterns, locales }` editor | Medium |
| 1.15 | **embedders** | Complex JSON editor for embedder configs (OpenAI, HuggingFace, etc.) | High |

**Approach:** Most of these can reuse the `DynamicTextboxes` component or a similar array editor pattern. Synonyms needs a dedicated key→multi-value editor. Embedders is the most complex — a structured form or JSON editor for each embedder type.

---

### Phase 2 — Document Management

Currently only "upload JSON" and "get by ID" exist. A proper document management panel is critical.

| # | Feature | Endpoint | Complexity |
|---|---------|----------|------------|
| 2.1 | **Document browser** — paginated table of all documents | `GET /indexes/{uid}/documents` | Medium |
| 2.2 | **Document detail view** — expand/inspect full JSON | `GET /indexes/{uid}/documents/{id}` | Low |
| 2.3 | **Inline document editing** — edit & save a single document | `PUT /indexes/{uid}/documents` | Medium |
| 2.4 | **Delete single document** | `DELETE /indexes/{uid}/documents/{id}` | Low |
| 2.5 | **Delete all documents** with confirmation | `DELETE /indexes/{uid}/documents` | Low |
| 2.6 | **Batch delete by IDs** | `POST /indexes/{uid}/documents/delete-batch` | Low |
| 2.7 | **Delete by filter** — filter builder + delete | `POST /indexes/{uid}/documents/delete` | Medium |
| 2.8 | **CSV/NDJSON upload support** | `POST` with `Content-Type` header | Low-Medium |
| 2.9 | **Document update mode** — toggle replace vs. update (POST vs PUT) | Both endpoints | Low |

**Approach:** Build a `DocumentsTab` component under the index page with a paginated table, row-expand for detail, inline edit via CodeMirror, and action buttons for delete operations. File upload modal should detect format by extension.

---

### Phase 3 — Search Enhancement

The search widget is basic — hardcoded params, no pagination, no filters. Needs to match Algolia-level search testing.

| # | Feature | Complexity |
|---|---------|------------|
| 3.1 | **Search result pagination** (`offset`/`limit` or `page`/`hitsPerPage`) | Low |
| 3.2 | **Filter builder** — visual filter construction for the `filter` param | Medium-High |
| 3.3 | **Sort selector** — pick sort attributes and direction | Low |
| 3.4 | **Facet distribution display** — show facet counts from `facets` param | Medium |
| 3.5 | **Matching strategy toggle** (`last`, `all`, `frequency`) | Low |
| 3.6 | **Attributes to search on** — select which attributes to search | Low |
| 3.7 | **Attributes to retrieve** — select which fields to return | Low |
| 3.8 | **Crop / highlight config** — configure `cropLength`, highlight tags | Low |
| 3.9 | **Performance details display** — show `showPerformanceDetails` data (v1.35+) | Low |
| 3.10 | **Facet search** — search within facet values | `POST /indexes/{uid}/facet-search` | Medium |

**Approach:** Add a collapsible "Advanced Search Options" panel below the search input. Filter builder should use filterable attributes from settings to offer autocomplete. Facets display as a sidebar.

---

### Phase 4 — Task & Operations Improvements

| # | Feature | Complexity |
|---|---------|------------|
| 4.1 | **Cancel tasks** — cancel enqueued/processing tasks | `POST /tasks/cancel` | Low |
| 4.2 | **Delete tasks** — delete completed/failed/canceled tasks | `POST /tasks/delete` | Low |
| 4.3 | **Date range filters** — filter tasks by enqueued/started/finished dates | Low-Medium |
| 4.4 | **Missing task types in filter** — add `snapshotCreation`, `documentEdition`, `upgradeDatabase`, `export`, `indexCompaction`, `networkTopologyChange` | Low |
| 4.5 | **Single task detail view** — click to see full task payload/error | `GET /tasks/{uid}` | Low |
| 4.6 | **Batches monitoring** — list and inspect batches | `GET /batches`, `GET /batches/{uid}` | Medium |
| 4.7 | **Reverse sort toggle** — newest-first option | Low |

---

### Phase 5 — Index Management Improvements

| # | Feature | Complexity |
|---|---------|------------|
| 5.1 | **Swap indexes** — swap two indexes atomically | `POST /swap-indexes` | Low-Medium |
| 5.2 | **Update index** — change primary key | `PATCH /indexes/{uid}` | Low |
| 5.3 | **Clear index** — delete all documents, keep settings | Combine delete docs + UX | Low |
| 5.4 | **Index detail view** — single index stats, creation date, primary key | `GET /indexes/{uid}` | Low |
| 5.5 | **Export index settings** — download settings as JSON | Client-side JSON export | Low |
| 5.6 | **Import index settings** — upload settings JSON to apply | `PATCH /indexes/{uid}/settings` | Low |

---

### Phase 6 — Vector & AI Search

These are the placeholder pages that currently show "Coming Soon".

| # | Feature | Complexity |
|---|---------|------------|
| 6.1 | **Embedder configuration UI** — visual form for setting up embedders (OpenAI, HuggingFace, userProvided, rest, ollama) under index settings | High |
| 6.2 | **Vector search UI** — `vector` param in search, choose embedder, enter text or vector | Medium |
| 6.3 | **Hybrid search UI** — toggle hybrid mode, adjust `semanticRatio` slider | Medium |
| 6.4 | **Similar documents** — find similar docs by ID with vector similarity | `POST /indexes/{uid}/similar` | Medium |
| 6.5 | **Chat completions UI** — interactive chat interface using Meilisearch's chat API | `POST /chats/{workspace}/chat/completions` | High |
| 6.6 | **Vector store status** — show which indexes have embedders, embedding progress | Low-Medium |

**Approach:** The Vector page at `/instance/features/vector` should become an embedder management + vector search testing ground. Chat page should be a real chat interface once the experimental feature is enabled.

---

### Phase 7 — New v1.31–v1.37 Features

Features introduced since our original v1.30.1 that need dashboard support.

| # | Feature | Version | Complexity |
|---|---------|---------|------------|
| 7.1 | **`skipCreation` toggle** — in document upload modal | v1.31 | Low |
| 7.2 | **New ranking rules** — `attributeRank` and `wordPosition` in ranking editor | v1.36 | Low |
| 7.3 | **`/fields` endpoint** — fields metadata explorer | v1.33 | Medium |
| 7.4 | **`showPerformanceDetails`** — performance breakdown in search (already in 3.9) | v1.35 | Low |
| 7.5 | **Network topology viewer** — `GET/PATCH /network` for distributed setups | v1.34 | Medium-High |
| 7.6 | **`useNetwork` toggle** — in search and federated search | v1.34 | Low |
| 7.7 | **Replicated sharding UI** — shard management (Enterprise) | v1.37 | High |
| 7.8 | **`facetSearch` / `prefixSearch` settings** | v1.35+ | Low |

---

### Phase 8 — Observability & Monitoring

| # | Feature | Complexity |
|---|---------|------------|
| 8.1 | **Prometheus metrics viewer** — display `/metrics` data as charts | `GET /metrics` | Medium-High |
| 8.2 | **Log streaming** — real-time log viewer | `POST /logs/stream` | High |
| 8.3 | **Health check** — dedicated `/health` call with status indicator | `GET /health` | Low |
| 8.4 | **Search analytics** — track top queries, no-result queries, response times (client-side) | High |

---

### Phase 9 — UX & Polish

| # | Feature | Complexity |
|---|---------|------------|
| 9.1 | **Keyboard shortcuts** — quick navigation, Cmd+K search palette | Medium |
| 9.2 | **Dark mode** — full theme support (structure exists, needs completion) | Medium |
| 9.3 | **Responsive mobile layout** — test and fix all pages on mobile | Medium |
| 9.4 | **Bulk operations UI** — select multiple indexes/documents for batch actions | Medium |
| 9.5 | **Notification system** — toast notifications for async operations (task completion, errors) | Medium |
| 9.6 | **Settings JSON raw editor** — toggle between visual editor and raw JSON for any settings page | Low |
| 9.7 | **Onboarding flow** — first-time setup wizard for new instances | Medium |

---

### Implementation Priority Summary

```
NOW (foundation)           NEXT (power features)       LATER (advanced)
─────────────────          ─────────────────────        ─────────────────
Phase 1: Settings UI       Phase 3: Search Enhancement  Phase 6: Vector & AI
Phase 2: Document Mgmt     Phase 4: Task Improvements   Phase 7: v1.31-v1.37
Phase 5: Index Mgmt        Phase 8: Observability       Phase 9: UX & Polish
```

See [MEILISEARCH_CHANGELOG.md](./MEILISEARCH_CHANGELOG.md) for the full changelog from v1.30.1 to v1.37.0.



### (Optional) Adding Pre-Push Hook
- ```touch .git/hooks/pre-push```
- ```chmod +x .git/hooks/pre-push```
- write pre push logic
    ``` bash
    #!/bin/bash
    
    # Run lint
    echo "Running linter..."
    npm run lint
    if [ $? -ne 0 ]; then
    echo "Linting failed. Push aborted."
    exit 1
    fi
    
    # Run tests
    echo "Running tests..."
    npm test
    if [ $? -ne 0 ]; then
    echo "Tests failed. Push aborted."
    exit 1
    fi
    
    echo "All checks passed. Proceeding with push."
    exit 0
    ```
