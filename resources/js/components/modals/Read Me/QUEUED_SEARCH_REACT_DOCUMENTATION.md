# Raymoch queued company search — React documentation

## Scope

This document covers every JavaScript/JSX file participating in the queued company-search frontend:

1. `resources/js/pages/ExploreBusinesses.jsx`
2. `resources/js/pages/explore/TopSearchPanel.jsx`
3. `resources/js/pages/explore/Top_Search_Form.jsx`
4. `resources/js/pages/companies/Top_search_panel_companies.jsx`
5. `resources/js/hooks/useQueuedCompanySearch.js`
6. `resources/js/components/behaviours/SearchSplashModal.jsx`
7. `resources/js/pages/explore/SearchAnimatedModal.jsx`
8. `resources/js/pages/explore/SnakeSearchLoading.jsx`

It does not document unrelated authentication, pricing, matching, dashboard, or marketing components.

## Active architecture

```text
ExploreBusinesses.jsx
    └── TopSearchPanel.jsx
            ├── useQueuedCompanySearch.js
            └── SearchSplashModal.jsx
                    └── SearchAnimatedModal.jsx
                            └── SnakeSearchLoading.jsx
```

The companies page uses an alternative form:

```text
Top_search_panel_companies.jsx
    └── Top_Search_Form.jsx
            ├── useQueuedCompanySearch.js
            └── SearchSplashModal.jsx
```

Only `useQueuedCompanySearch.js` owns the search lifecycle and polling. Display components must never independently create tokens, call `/run`, or start another polling interval.

## End-to-end lifecycle

```text
User submits validated form
    ↓
hook.start(payload)
    ↓
POST /search-session/store
    ↓
POST /api/main-search-engine/start
    ↓ returns token
GET /api/main-search-engine/status/{token}
    ↓ if started_at is empty
POST /api/main-search-engine/run/{token}
    ↓ dispatches eight backend jobs
GET /api/main-search-engine/status/{token} every second
    ↓
React status state updates the eight tiles
    ↓
All steps terminal / meta.is_completed=true
    ↓
Polling stops; modal remains open for review and View Results
```

The modal remaining visible is intentional. Completion means animation and polling stop and the action becomes available; it does not automatically close the modal.

## API contracts

### Store browser-session filters

```http
POST /search-session/store
```

Request body:

```json
{
  "keyword": "Cannan Company",
  "region": "all",
  "country": "all",
  "state": "all",
  "city": "all",
  "sector": "4",
  "industry": "all",
  "verification": true
}
```

### Start or recover a token

```http
POST /api/main-search-engine/start
```

The hook adds `request_id`. Repeating the same start attempt can therefore return the same server token.

Expected response:

```json
{ "ok": true, "token": "uuid" }
```

### Dispatch jobs

```http
POST /api/main-search-engine/run/{token}
```

The hook invokes this only when status exists but `meta.started_at` is empty. This also recovers a page that closed between `/start` and `/run`.

### Poll status

```http
GET /api/main-search-engine/status/{token}
```

Expected shape:

```json
{
  "ok": true,
  "data": {
    "payload": {},
    "meta": {
      "is_running": false,
      "is_completed": true,
      "is_stopped": false,
      "has_error": false,
      "completed_steps": 7,
      "failed_steps": 0,
      "skipped_steps": 1,
      "total_steps": 8,
      "progress_percent": 100
    },
    "steps": {
      "keyword": {},
      "region": {},
      "country": {},
      "state": {},
      "city": {},
      "sector": {},
      "industry": {},
      "verification": {}
    }
  }
}
```

### Stop

```http
POST /api/main-search-engine/stop/{token}
```

The hook calls this when the user closes an unfinished search. Cancellation is cooperative; SQL already executing may finish, but late results should not replace cancelled state.

## Shared payload rules

```js
{
  keyword: string,
  region: string,       // ID or "all"
  country: string,      // countries_all_id or "all"
  state: string,        // ID or "all"
  city: string,         // ID or "all"
  sector: string,       // sector ID or "all"
  industry: string,     // industry ID or "all"
  verification: boolean
}
```

The active database view exposes dimension IDs, so form option values should remain IDs. Labels are presentation only.

## Step statuses

| Status | Meaning | Terminal |
| --- | --- | --- |
| `queued` | Job has not started | No |
| `running` | Worker is processing it | No |
| `retrying` | Attempt failed and may retry | No |
| `completed` / `done` | Successful result | Yes |
| `skipped` | Filter was intentionally not applied, such as empty keyword | Yes |
| `failed` | Retries exhausted | Yes |
| `cancelled` | User stopped the search | Yes |

An empty keyword normally produces seven completed steps and one skipped step. That is a successful terminal search, not an infinite search.

---

## 1. `ExploreBusinesses.jsx`

### Responsibility

Page-level container for the Explore Businesses screen. It owns filter values and lookup collections, loads dependent dropdown data, and renders the active `TopSearchPanel`.

### Owned state

- Search values: `q`, `region`, `country`, `stateItem`, `city`, `sector`, `industry`, `verified`.
- Lookup collections: regions, countries, states, cities, sectors, industries.
- Page/grid state: `gridQuery`, `page`, `loading`.

### Lookup effects

- Initial effect loads regions, all countries, sectors, and industries in parallel.
- Region change reloads countries and clears lower geography selections.
- Country change loads states and clears city selection.
- State change loads cities.
- Sector change loads its industries and clears the current industry.

### Critical import

The active import must be exactly:

```js
import TopSearchPanel from "../pages/explore/TopSearchPanel.jsx";
```

Do not restore the old `Top_search_panel.jsx` import. That legacy component manually started jobs but did not pass `status` into the modal, causing every tile to remain `idle` at 0%.

### Child contract

The page passes controlled values, setter functions, lookup arrays, and `onCountryFirstSelection` to `TopSearchPanel`.

The currently passed `onSearch` prop is not consumed by the active `TopSearchPanel`; it is stale and can be removed after confirming no pending design depends on it.

---

## 2. `TopSearchPanel.jsx`

### Responsibility

Primary Explore-page filter form. It converts lookup records into `react-select` options, validates required fields, creates the normalized payload, starts the queued search, and binds hook state to the modal.

### Controlled props

| Prop group | Props |
| --- | --- |
| Keyword | `q`, `setQ` |
| Geography | `region`, `country`, `stateItem`, `city` and setters |
| Classification | `sector`, `industry` and setters |
| Verification | `verified`, `setVerified` |
| Lookup data | `regions`, `countries`, `states`, `cities`, `sectors`, `industries` |
| Relationship helper | `onCountryFirstSelection` |

### Validation

Sector is mandatory. Failed validation sets `fieldErrors.sector` and displays a toast. The request is not started.

### Search state

```js
const search = useQueuedCompanySearch();
const isSearching = search.open && !search.status?.meta?.is_completed;
```

While active, form inputs and navigation actions are disabled.

### Submission

```js
const submitSearch = async (event) => {
  event.preventDefault();
  if (isSearching || !validateBeforeSearch()) return;
  await search.start(buildPayload());
};
```

### Modal binding

Every lifecycle value must be forwarded:

```jsx
<SearchSplashModal
  open={search.open}
  token={search.token}
  status={search.status}
  error={search.error}
  starting={search.starting}
  onStop={search.stop}
  onViewResults={search.viewResults}
  onResume={search.resume}
/>
```

Omitting `status` recreates the 0%/idle infinite-display bug.

---

## 3. `Top_Search_Form.jsx`

### Responsibility

Alternative, more autonomous search form used through the companies-page adapter. It supports both controlled props and internal fallback state, restores previous server-session filters, resolves stored filter IDs/names, and loads dependent lookup options.

### Controlled/internal state pattern

For each filter it selects the supplied prop/setter when available, otherwise internal state:

```js
const safeSector = sector ?? internalSector;
const safeSetSector =
  typeof setSector === "function" ? setSector : setInternalSector;
```

### Previous-search restoration

On boot it combines `/search-session/current` with lookup APIs, then resolves stored values. `liveResolveIdRef` prevents an older asynchronous resolution response from overwriting a newer one.

### Validation

- Sector must be selected when required by the UI.
- An industry cannot be active while sector is `all`.
- Invalid combinations set `searchValidationError` and do not call the hook.

### Search integration

This form uses the same hook and the same complete modal prop contract as `TopSearchPanel`.

### Deployment naming warning

The file is named:

```text
Top_Search_Form.jsx
```

but `Top_search_panel_companies.jsx` currently imports:

```js
import TopSearchForm from "../explore/Top_search_form";
```

Windows resolves this case-insensitively, but Linux normally does not. Normalize the import to:

```js
import TopSearchForm from "../explore/Top_Search_Form.jsx";
```

before Linux deployment.

---

## 4. `Top_search_panel_companies.jsx`

### Responsibility

Thin companies-page adapter around `Top_Search_Form.jsx`. It forwards page-specific props without owning the queued-search lifecycle.

### Rule

Do not add another `useQueuedCompanySearch()` instance here. The child already owns one. Two hook owners can produce duplicate modals or competing session recovery.

---

## 5. `useQueuedCompanySearch.js`

### Responsibility

Single state machine for token creation, session recovery, dispatch, polling, stopping, error handling, and navigation to results.

### Public return value

```js
{
  open,
  token,
  status,
  error,
  starting,
  start,
  stop,
  resume,
  close: stop,
  viewResults
}
```

### React state

| State | Meaning |
| --- | --- |
| `open` | Modal visibility |
| `token` | Server search token |
| `status` | Latest normalized status response |
| `error` | User-facing lifecycle error |
| `starting` | `/start` or first status acquisition in progress |

### Refs

| Ref | Purpose |
| --- | --- |
| `timerRef` | Owns the one scheduled poll timeout |
| `activeRef` | Blocks duplicate submit calls without waiting for a render |
| `generationRef` | Invalidates late responses from an older lifecycle |
| `sessionRef` | Holds the current request ID, payload, and token |

### `api(url, options)`

- Sends JSON with same-origin credentials and CSRF token.
- Uses `cache: "no-store"`.
- Aborts after 20 seconds.
- Converts non-2xx or `{ok:false}` responses into JavaScript errors.

### `start(payload, previousRequestId)`

1. Rejects duplicate active calls.
2. Opens the modal immediately.
3. Creates or reuses a browser request UUID.
4. Saves a recovery record in `sessionStorage`.
5. Stores filters in the Laravel web session.
6. Calls `/start` and receives the server token.
7. Saves the token to the recovery record.
8. Calls `poll(token, generation)`.

### `poll(token, generation)`

1. Rejects stale generations.
2. Calls `/status`.
3. Normalizes terminal status.
4. Updates React state.
5. Stops when completed or stopped.
6. Calls `/run` only when `started_at` is absent.
7. Schedules the next non-overlapping poll after one second.

Recursive `setTimeout` is intentional. `setInterval` could overlap slow requests.

### Terminal fallback

`normalizeSearchStatus()` treats the search as completed when `total_steps` are present and every step has a terminal status, even if the aggregate flag is delayed. Failed steps also force `has_error=true`.

### `resume()`

- Reads the current in-memory record or `sessionStorage`.
- If no token exists, safely repeats `/start` with the same request ID.
- If a token exists, resumes status polling without creating another token.

### `stop()` / `close`

- Clears the timer.
- Invalidates outstanding responses.
- Calls `/stop` for unfinished tokens.
- Clears session recovery and closes the modal after confirmation.

Because `close` aliases `stop`, pressing Escape or X stops an active search.

### `viewResults()`

Requires successful completion. It builds `/companies` parameters from the immutable server status payload, adds `from=explore` and `search_token`, clears recovery storage, and navigates.

### Mount effect

The single `useEffect` checks `sessionStorage` after mount and calls `resume()` when an interrupted search exists. Cleanup cancels timers and invalidates pending responses. It does not create a new search when there is no saved record.

---

## 6. `SearchSplashModal.jsx`

### Responsibility

Small naming/compatibility adapter between forms and `SearchAnimatedModal`.

It owns no state, performs no fetching, and must forward every lifecycle prop unchanged. This makes both form variants use the same modal implementation.

---

## 7. `SearchAnimatedModal.jsx`

### Responsibility

Portal and animation shell for the live monitor.

### Behavior

- Renders into `document.body` with `createPortal`.
- Uses `AnimatePresence` for exit animation.
- Uses reduced-motion preferences.
- Escape and X call `onClose`.
- Provides `role="dialog"` and `aria-modal="true"`.
- Passes the lifecycle props into `SnakeSearchLoading`.

It performs no API calls and must not create another hook instance.

### Close semantics

The close button label changes according to completion:

- Active: “Stop search”
- Completed: “Close search dialog”

The callback remains the hook's `stop` function, which avoids calling the backend when already completed.

---

## 8. `SnakeSearchLoading.jsx`

### Responsibility

Presentation-only live monitor for eight status tiles, progress, grouping details, imagery, subscription access, and the final result/payment action.

### Important rule

This component must not poll `/status`, create tokens, or invoke `/run`. It renders the `status` snapshot supplied by the hook.

### Props

| Prop | Purpose |
| --- | --- |
| `token` | Adds search identity to result navigation |
| `open` | Controls subscription-access checking |
| `status` | Live aggregate/step status from the hook |
| `error` | Lifecycle error banner |
| `onResume` | Retry status after a recoverable polling failure |
| `onViewResults` | Navigate through the hook after successful completion |
| `onPayToView` | Optional payment override |

### Step rendering

`ORDER` fixes tile order. `EMPTY_STEP` is only a visual fallback before a status snapshot arrives. If tiles remain `idle` indefinitely, the parent failed to pass `status`; it is not evidence that Laravel jobs did not run.

### Active card

The first `running` step controls the large image. When none is running, keyword is used as the stable fallback.

### Progress

Progress comes directly from:

```js
statusData?.meta?.progress_percent
```

There is no artificial animation loop that advances it independently.

### Completion

Successful completion requires:

```js
statusData.meta.is_completed && !statusData.meta.has_error
```

The result/payment action stays disabled before successful completion.

### Subscription check

When opened, the component calls `/subscription/access`. This controls presentation of View Results versus Pay To View Results. It is not sufficient authorization by itself; the server must still enforce subscription access.

---

## Eight tiles and backend jobs

| Tile key | Backend job instance | Display component |
| --- | --- | --- |
| `keyword` | `RunSearchStep(token, keyword)` | Keyword match found |
| `region` | `RunSearchStep(token, region)` | Region |
| `country` | `RunSearchStep(token, country)` | Country |
| `state` | `RunSearchStep(token, state)` | State |
| `city` | `RunSearchStep(token, city)` | City |
| `sector` | `RunSearchStep(token, sector)` | Sector |
| `industry` | `RunSearchStep(token, industry)` | Industry |
| `verification` | `RunSearchStep(token, verification)` | Verification |

One `ShouldQueue` class instantiated eight times creates eight independent queue records. Eight separate PHP classes are unnecessary unless the steps eventually require materially different retry, timeout, middleware, or dependency behavior.

## Session ownership

Two different sessions are involved:

| Storage | Contents | Purpose |
| --- | --- | --- |
| Browser `sessionStorage` | request ID, payload, token | Refresh/interruption recovery per tab |
| Laravel web session | previous filters and result URL | Restore filters and navigate to companies |

The server cache separately stores token payload and job status. Do not confuse browser session, Laravel session, cache, and queue tables.

## Failure diagnostics

### Modal shows 0% and every tile is `idle`

`SnakeSearchLoading` received no `status`. Check the modal prop chain and confirm the active page imports `TopSearchPanel.jsx`.

### Jobs complete but the modal remains open

Expected. It remains available for review. It should say completed and enable the final action.

### Jobs complete but the modal still says running

1. Inspect the final `/status/{token}` response.
2. Confirm `data.meta.is_completed` or all eight terminal steps.
3. Compare the response token with `raymoch.search.active` in session storage.
4. Restart Vite and hard-refresh to eliminate a stale module.

### Search starts twice

Confirm there is only one hook owner and one mounted form. Keep `activeRef`, request UUID idempotency, and token-level backend locking.

### Refresh creates a new token

Confirm session storage contains the original `requestId` and that `resume()` receives it. Do not delete the recovery record before completion/stop/navigation.

## Maintenance rules

1. Use one canonical filename and exact import casing. Linux is case-sensitive.
2. Keep one hook owner per mounted search form.
3. Keep polling in the hook only.
4. Keep the monitor presentation-only.
5. Forward the complete modal prop contract, especially `status`.
6. Treat `skipped` as terminal.
7. Do not add `dd()`, alert loops, or independent status timers to UI components.
8. Restart Vite or rebuild after changing source files.
9. Protect API tokens and subscription access on the server.
10. Remove large commented legacy implementations after version-control confirmation; they make duplicate-component mistakes more likely.

## Acceptance checklist

- One click creates one token.
- Eight job records are dispatched.
- Modal opens immediately.
- Initial status changes from queued to running.
- Every tile receives its own status, time, count, and groups.
- Empty keyword becomes skipped.
- Completed search reaches 100% and stops polling.
- Failed search reaches a terminal error state.
- Refresh resumes the same token.
- X/Escape stops an unfinished search.
- View Results preserves filters and token.
- Windows and Linux builds resolve identical filename casing.

