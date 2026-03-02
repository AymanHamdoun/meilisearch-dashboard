# Meilisearch Changelog: v1.30.1 → v1.37.0

What's new since our current dashboard version (v1.30.1) — use this to plan dashboard updates.

---

## v1.31.0

### New Features
- **Strict Document Updates** — New `skipCreation` query parameter for document POST/PUT operations. When set to `true`, updates skip creating non-existent documents. Default is `false` (backward compatible).
- **AWS IRSA Authentication for S3 Snapshots** *(Enterprise only)* — Short-lived credential access for snapshot uploads.

### Breaking Changes
- **S3-Streaming Snapshots now Enterprise-only** — Transitioned from Community to Enterprise Edition.

### Bug Fixes
- Corrected actix payload error handling
- Updated hannoy dependency to v0.1.2

---

## v1.32.0

### Improvements
- **Search Performance Tracing** — Detailed timing/progress logging for each step of the search process (observability).
- **Parallel Document Indexing** — Tasks processed in batches with parallel change extraction. Achieves ~7x speedup on 4M document insertions with 4 CPUs. Note: `indexedDocuments` field may report higher counts than actual operations for POST/PUT requests.

### Bug Fixes
- **Vector Sort Bucketing** — Documents with identical similarity scores now group properly; subsequent ranking rules apply correctly.
- **FID-Based Database Deletion** — Fixed orphaned data when changing `searchableAttributes` from wildcard to specific fields (was causing corruption and search warnings).
- **Graph Link Reconstruction** — hannoy v0.1.3 fixes recall issues and enables recovery of malformed graphs during dumpless upgrades.

---

## v1.33.0

### New Features
- **`/fields` Endpoint** — New `POST /indexes/{indexUid}/fields` endpoint returns detailed metadata about all index fields, including display, search, filtering, and localization configurations.

### Improvements
- **Parallel Cleanup of Old Field IDs** — Dumpless upgrades from pre-v1.32.0 now use multi-threading, reducing upgrade time from ~170 minutes to under 7 minutes.
- **Hannoy Vector Store v0.1.4** — Faster dumpless upgrades via optimized graph rebuilding, improved search speed/relevance.

### Bug Fixes
- **2 TB Index Rescaling** — Meilisearch now properly rescales when indexes reach the 2 TB threshold.

### Security
- Mini-dashboard upgraded to address known security vulnerabilities.

---

## v1.34.0

### New Features
- **Network-based Search** — New `useNetwork` field enables searches across distributed Meilisearch instances. Combines results with weighted ranking scores and remote attribution.
- **Multi-Search `useNetwork`** — Individual queries in `POST /multi-search` now support `useNetwork` for selective federated execution.
- **Federated Search Pagination** — Exhaustive pagination via `federation.page` and `federation.hitsPerPage` parameters.

### Improvements
- **Settings Indexer Optimization** — More efficient processing when removing searchable attributes from the searchable fields list.

### Security
- **Timing Attack Mitigation** — Constant-time comparison for key operations, preventing timing-based attacks.

---

## v1.35.0

### New Features
- **`showPerformanceDetails` Parameter** — Enables detailed performance tracing in search responses (timing breakdowns per search phase). Works on standard search, multi-search, federated search, and similar searches.
- **Multithreaded Facet Processing Stabilized** — Previously experimental, now always enabled. Indexing speed improvements on multi-core systems.

### Breaking Changes
- **`POST /indexes/{indexUid}/fields` Response Structure Changed** — Now returns a paginated object `{ results, offset, limit, total }` instead of a simple array.

### Bug Fixes
- Fixed pattern filtering in the fields endpoint (parent fields no longer incorrectly match child patterns).
- Updated mini-dashboard for improved image display.
- Resolved mTLS compatibility issues with Go clients.

---

## v1.36.0

### New Features
- **New Ranking Rules** (first update since v1.0):
  - `attributeRank` — Documents rank higher when query words match in higher searchable attributes, regardless of position within that attribute.
  - `wordPosition` — Documents rank better when query words appear closer to the beginning of an attribute.
- **Vector Store Migration** — Automatic dumpless upgrade from legacy Annoy to Hannoy (HNSW). Manual migration recommended for large datasets via `vectorStoreSetting`.

### Bug Fixes
- Fixed search failures when using `attributesToSearchOn` on empty indexes.

### Security
- Dependency updates: bytes, jsonwebtoken, time, rsa.

### Breaking Changes
- `meilisearch-openapi-mintlify.json` no longer included in release assets.

---

## v1.37.0

### New Features
- **Replicated Sharding** *(Enterprise only)* — `network.shards` field enables replication across remotes with support for full replication, unbalanced replication, and "watcher" remotes.
- **Vector Store Stabilized** — Hannoy (HNSW) is now the sole vector store implementation. ~27% indexing performance improvement for embedding operations.

### Breaking Changes
- Network objects in `PATCH /network` must now contain at least one shard with remotes when a leader is configured.
- Existing databases auto-migrate during dumpless upgrade, creating shards matching remote names.
- `vectorStoreSetting` experimental feature removed (migration is now automatic).

### Improvements
- `useNetwork: true` now expands queries across shards, ensuring no duplicate or missing documents.

### Security
- **Mini-dashboard API key storage moved from `localStorage` to RAM** — keys no longer persisted in browser storage.
- Dependency updates addressing potential vulnerabilities.

---

## Dashboard-Relevant Features Summary

Key features that may require dashboard updates:

| Feature | Version | Dashboard Impact |
|---------|---------|-----------------|
| `skipCreation` param for document updates | v1.31 | Add toggle in document upload UI |
| Search performance tracing/logging | v1.32 | Could display search performance metrics |
| `/fields` endpoint | v1.33 | New fields explorer/viewer panel |
| Network-based / federated search | v1.34 | Network config UI, federated search toggle |
| `showPerformanceDetails` in search | v1.35 | Show performance breakdown in search results |
| New ranking rules (`attributeRank`, `wordPosition`) | v1.36 | Update ranking rules editor/settings |
| Replicated sharding config | v1.37 | Shard management UI (Enterprise) |
| Vector store now stabilized (Hannoy) | v1.37 | Remove any experimental vector store UI flags |
| API key moved from localStorage to RAM | v1.37 | Review dashboard key storage approach |
