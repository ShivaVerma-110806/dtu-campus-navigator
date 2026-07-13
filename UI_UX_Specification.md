# DTU Campus Navigator ("FindMyWay") — UI/UX Specification

A complete design + build specification for recreating the current project in another AI coding platform. No source code — this is a design document.

---

## 1. Overall Design Philosophy

**Inspiration**: Google Maps + Google Search. Utility-first, information-dense, calm. The interface should feel like a tool, not a marketing page.

**Principles (Material Design–adjacent)**:
- Clarity over decoration. Content is primary; chrome is quiet.
- One accent color; neutrals do the heavy lifting.
- Elevation via subtle shadows and hairline borders, never glassmorphism/neumorphism.
- Motion is functional (state changes, ~150ms), never decorative.
- Touch targets ≥ 40px; generous hit areas on mobile.
- Consistent radii and spacing rhythm.

**Do NOT use**: gradients, glassmorphism, neumorphism, heavy shadows, decorative illustrations, animated backgrounds, multi-color palettes, custom cursors, parallax.

**Color palette (light theme, primary)**:
- **Background**: pure white `#FFFFFF`
- **Foreground / text**: near-black slate `oklch(0.22 0.006 264)` (~`#2A2E33`) — used for high-contrast primary text
- **Muted surface**: `oklch(0.97 0.002 264)` (~`#F5F6F7`) — used for chips, hover fills, input backgrounds
- **Muted text**: `oklch(0.5 0.01 264)` (~`#77797D`)
- **Border**: `oklch(0.92 0.004 264)` (~`#E5E7EA`) — 1px hairlines
- **Primary (Google Blue)**: `#4285F4` — buttons, active pins, focus ring, active category
- **Success (Google Green)**: `#34A853` — "Navigate" affordance / positive status
- **Destructive**: standard red for errors only

**Dark theme**: supported via tokens (slate/neutral base). Same accent hues.

**Typography**:
- **Family**: `"Google Sans", "Roboto", system-ui, -apple-system, "Segoe UI", sans-serif`
- Antialiased, tight tracking on headings (`tracking-tight`)
- **Weights used**: 400 (body), 500 (medium, dominant for UI labels/headings), 600 (sparingly)
- **Sizes**: `12px` (uppercase eyebrows), `13–14px` (UI/body), `15px` (nav brand), `18–20px` (H1/H2 on cards)

**Spacing scale**: Tailwind default 4px base. Common values: 2, 3, 4, 5, 6, 8 (i.e. 8, 12, 16, 20, 24, 32 px). Card interior padding: 20 px. Panel padding: 20 px. Nav height: 56 px mobile / 64 px desktop.

**Border radius**:
- Base `--radius: 0.75rem` (12 px)
- `rounded-lg` (12 px) for cards, thumbnails
- `rounded-xl` (16 px) for content rows / category cards
- `rounded-2xl` (20 px) for panels, drawers, dropdowns
- `rounded-full` for pills, search bar, avatar, icon buttons, FABs

**Shadows**:
- `shadow-sm` — search bar resting
- `shadow-md` — search bar focus, floating mobile search
- `shadow-lg` — dropdowns, desktop drawer, bottom sheet
- `shadow-xl` — mobile bottom sheet
- No colored glows. No inner shadows.

**Hover / focus**:
- **Buttons**: fill shifts to `bg-muted` or `primary/90`
- **Inputs**: shadow lifts from `sm` → `md` via `focus-within`
- **Rows**: `hover:bg-muted`
- **Focus ring**: 2px `--ring` (primary color) with 2px offset

**Motion**: `transition-colors` and `transition-shadow` at default ~150ms. No transforms, no keyframes.

---

## 2. Complete Layout

The app is a single-page app (`/`). The layout is a persistent app shell with three regions:

```
┌───────────────────────────────────────────────────────┐
│  Navbar (sticky, full width, 56/64px)                 │
├─────────────┬─────────────────────────────────────────┤
│             │                                         │
│  Search     │         Map Container                   │
│  Panel      │         (fills remaining space)         │
│  380px      │                                         │
│  (desktop   │   Floating drawer (desktop) overlays    │
│   only)     │   left side of map when selection made  │
│             │                                         │
└─────────────┴─────────────────────────────────────────┘
```

- **Root container**: `h-screen`, `flex-col`, base bg/foreground tokens.
- **Main region**: `flex`, `min-h-0`, `flex-1`.
- **Desktop sidebar**: fixed 380 px, vertical scroll, hairline right border.
- **Map**: `flex-1`, `relative`, `min-h-0`; hosts overlays.
- **Max content width for navbar inner row**: 1600 px, centered, `px-4 sm:px-6`.

**Alignment / rhythm**: Left-aligned text throughout. 20 px panel padding, 24 px vertical gaps between panel sections, 12 px gap in category grid.

**Responsive behavior**:
- **Mobile (< 1024 px)**: No sidebar. Floating pill search on top of map. Full-screen search sheet. Bottom-sheet drawer.
- **Tablet (≥ 768 px, < 1024 px)**: Same as mobile shell, but navbar shows brand text and sign-in button.
- **Desktop (≥ 1024 px)**: Sidebar visible; drawer becomes a floating left-side panel over the map.

---

## 3. Homepage

### 3.1 Navbar
- Sticky top, hairline bottom border, background = surface white.
- **Left**: circular 32 px primary-filled badge with `MapPin` icon + wordmark "FindMyWay" in 15 px medium.
- **Center (mobile only)**: pill button "Search buildings, classrooms…" — opens Mobile Search Sheet.
- **Right**: "Sign in" ghost pill (desktop ≥ sm) + circular 36 px bordered avatar button with `User` icon.

### 3.2 Search Panel (desktop sidebar)
Vertical stack, 20 px padding, 24 px gaps:
1. **Header block** — H1 "Explore DTU Campus" (18 px medium) + muted subtitle.
2. **Search bar** — see 3.3.
3. **Categories** — uppercase 12 px eyebrow "CATEGORIES" + 2-column grid of Category Cards.
4. **Nearby places** — eyebrow + vertical list of 5 Location Rows (thumbnail 40 px, name, "Building · Category").

### 3.3 Search Bar
- 48 px pill, hairline border, `shadow-sm` → `shadow-md` on focus.
- `Search` icon (leading), text input, optional `X` clear button.
- **Placeholder**: "Search buildings, classrooms, hostels..."
- Live suggestions dropdown (see 3.7).

### 3.4 Category Cards
- 2-column grid, 8 px gap.
- Each card: rounded-xl, hairline border, 12 px padding, left-aligned:
  - 32 px circular icon chip (muted resting, primary filled when active)
  - Label in 14 px medium
- **Active state**: border switches to primary, background `primary/5`.
- **Behavior**: single-select toggle (clicking active clears).
- **UI Categories mapped to MongoDB Schema categories**:
  | UI Category | Backend Schema Mapping (`Locations.js` enum) | Lucide Icon |
  |---|---|---|
  | **Study** | `"Academic"`, `"Library"` | `BookOpen` |
  | **Hostels** | `"Hostel"` | `BedDouble` |
  | **Food** | `"Food"` | `UtensilsCrossed` |
  | **Sports** | `"Sports"` | `Dumbbell` |
  | **Medical** | `"Medical"` | `Stethoscope` |
  | **Transport**| `"Transport"` | `Bus` |
  | **Admin** | `"Administration"` | `Landmark` |

### 3.5 Map Container
- Occupies remaining viewport.
- Stylized map background (not real satellite): flat neutral canvas with subtle grid or Google-Maps-like pale road strokes; no photographic imagery.
- Renders markers for currently filtered locations.
- Zoom controls and "My location" button floating bottom-right.
- Optional attribution / scale in bottom-left (small, muted text).

### 3.6 Floating Controls
- Bottom-right vertical stack, 12 px gap, 16 px from edges:
  - Zoom in `+` (36 px circular white, hairline border, `shadow-md`)
  - Zoom out `−`
  - Divider
  - `Locate` (crosshair icon) — "My location"
- On mobile, floating search pill lives top-inset-3, full width minus 24 px.

### 3.7 Search Suggestions
- Absolute dropdown 8 px below input, rounded-2xl, `shadow-lg`, hairline border.
- Up to 6 results; each row: 44 px thumbnail, title (14 px medium), subtitle "Building · Category" (12 px muted), trailing chevron.
- Divided by hairline rows; `hover:bg-muted`.
- Selecting a result closes suggestions, centers map on that marker, opens Location Drawer.

### 3.8 Marker Interactions
- **Default marker**: primary-filled teardrop pin, 24–28 px, subtle drop shadow.
- Category-tinted variants when a category filter is active.
- **Hover**: pin scales lightly via shadow lift (no transform).
- **Selected**: pin enlarges to ~34 px + white ring; the map re-centers; drawer opens.
- **Tap outside marker**: drawer stays; explicit close required.

---

## 4. Components

### 4.1 Navbar
Props: `onOpenSearch`. Sticky, 56/64 px, hairline bottom border, brand left, mobile search pill center, actions right.

### 4.2 Search Input (SearchBar)
Props: `value`, `onChange`, `locations`, `onSelect`, `autoFocus`. Emits filtered results via internal `useMemo` on name/building/category substring match, capped at 6.

### 4.3 Search Result Card
44 px thumbnail (rounded-lg), title + meta, trailing chevron. Full-width tap target inside dropdown or full-screen sheet.

### 4.4 Location Row (list item)
40 px thumbnail, two-line text. Rounded-xl hover fill. Used in "Nearby places".

### 4.5 Category Card
Icon chip + label; toggle behavior; active theming with primary border and tinted background.

### 4.6 Map Component (MapContainer)
Props: `locations`, `selectedId`, `onSelect`, `activeCategory`. Renders map surface, markers, floating controls. Emits selection on marker click.

### 4.7 Marker + Popup
Marker described in 3.8. Popup is implemented as the Location Drawer, not a bubble over the pin, to keep parity with Google Maps mobile UX.

### 4.8 Floating Action Buttons
36 px circular, white surface, hairline border, `shadow-md`. Icon-only, `aria-label` required. Grouped vertically bottom-right.

### 4.9 Bottom Sheet (mobile drawer variant)
Full-width, rounded-top-2xl, `shadow-xl`, `max-h-[85vh]`, scroll inside. Anchored to viewport bottom. Backdrop is not dimmed to preserve map context.

### 4.10 Drawer (desktop variant of LocationDrawer)
Floats over the map at `left-4 top-4 bottom-4`, 380 px wide, rounded-2xl, `shadow-lg`, scrollable. Contents:
- 192 px cover image with overlaid circular close button (top-right).
- Content padding 20 px: uppercase eyebrow (category label), 20 px medium title.
- Action row: primary filled pill "Navigate" (with `Navigation` icon) that flexes to fill; 40 px circular bordered "Share" secondary.
- Description paragraph (14 px, 24 px line height, muted).
- **Info list**: rounded-xl bordered container with divided rows:
  - **Hours** (`Clock`): `openingHours.open` - `openingHours.close`
  - **Building** (`Building2`): `building` name
  - **Floor** (`MapPin`): `floor` details
  - **Room** (`Hash`): `roomNumber`
  - Each row: 32 px muted icon chip, label (12 px muted) over value (14 px medium).

### 4.11 Mobile Navigation
No separate bottom nav bar in v1. Navigation surface = navbar's search pill + full-screen Mobile Search Sheet with Search Bar + Category grid. Close via `X` button.

---

## 5. Responsive Design

- **Mobile (< 640 px)**: Nav height 56 px; brand + search pill + avatar. Map fills below. Floating search pill duplicates for map context. Bottom sheet drawer.
- **Small tablet (≥ 640 px, < 1024 px)**: Nav height 64 px; brand text + "Sign in" pill visible. Otherwise same as mobile.
- **Desktop (≥ 1024 px)**: Sidebar (380 px) appears; mobile floating search + full-screen sheet hidden. Drawer becomes floating left panel. Map takes remaining width.
- **Large desktop (≥ 1600 px)**: Navbar inner row caps at 1600 px, centered.

Never horizontally scroll. All text truncates with `truncate` in list rows.

---

## 6. User Experience

- **Hover**: rows and buttons shift to `bg-muted`; primary button to `primary/90`; search bar shadow lifts.
- **Focus**: visible 2 px primary ring with 2 px offset on all interactive elements; input relies on `focus-within` shadow lift.
- **Click**: Category toggles selection (single-select). Result/marker selects location and opens drawer. Close button dismisses drawer.
- **Search behavior**: case-insensitive substring match across name, building, and category. Debounce not required for current dataset; results update on every keystroke. Empty query hides dropdown.
- **Marker behavior**: clicking selects and centers; second click on same marker keeps it selected (idempotent).
- **Navigation flow**: land → browse categories or search → pick result → drawer opens → tap Navigate (later: Google Maps deeplink) → close returns to browse.
- **Keyboard**: Tab order = Navbar → Sidebar (search → categories → nearby) → Map controls → Drawer. `Esc` closes drawer / mobile sheet.

---

## 7. Design Tokens

Colors (light):
| Token | Value |
|---|---|
| background | `#FFFFFF` |
| foreground | slate `oklch(0.22 0.006 264)` |
| muted | `oklch(0.97 0.002 264)` |
| muted-foreground | `oklch(0.5 0.01 264)` |
| border / input | `oklch(0.92 0.004 264)` |
| primary | `#4285F4` (Google Blue) |
| primary-foreground | `#FFFFFF` |
| success | `#34A853` (Google Green) |
| destructive | standard red |
| ring | primary |

Font sizes: 12 / 13 / 14 / 15 / 18 / 20 px.
Font weights: 400, 500 (dominant), 600 sparingly.
Radius: 12 (base), 16, 20, full.
Shadows: sm / md / lg / xl (Tailwind defaults; no colored shadows).
Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48 px.
Container widths: 380 px sidebar, 380 px desktop drawer, 1600 px navbar cap, 100% otherwise.
Component sizes: icon button 36 px, avatar 36 px, action pill height 40 px, search bar height 48 px, nav 56/64 px.

---

## 8. Icons (lucide-react)

- `MapPin` — brand badge, Floor row.
- `User` — avatar button.
- `Search` — search bar leading, mobile floating pill.
- `X` — clear input, close drawer, close mobile sheet.
- `ChevronRight` — search result trailing indicator.
- `Navigation` — primary "Navigate" action in drawer.
- `Share2` — secondary share button in drawer.
- `Clock` — Hours row.
- `Building2` — Building row.
- `Hash` — Room row.
- **Category icons**:
  - `BookOpen` — Study (Academic / Library)
  - `BedDouble` — Hostels (Hostel)
  - `UtensilsCrossed` — Food
  - `Dumbbell` — Sports
  - `Stethoscope` — Medical
  - `Bus` — Transport
  - `Landmark` — Admin (Administration)
- **Map floating controls**: `Plus`, `Minus`, `LocateFixed`.

---

## 9. Project Structure

```
src/
  routes/
    __root.tsx        // app shell, <head> metadata, <Outlet/>
    index.tsx         // homepage: composes Navbar + SearchPanel + Map + Drawer + MobileSheet
  components/
    campus/
      Navbar.tsx
      SearchPanel.tsx
      SearchBar.tsx
      CategoryCards.tsx
      MapContainer.tsx
      LocationDrawer.tsx
      MobileSearchSheet.tsx
      types.ts        // CategoryId, Location interfaces
      data.ts         // static seed of categories + locations
    ui/               // shadcn primitives (button, input, sheet…)
  lib/
    utils.ts          // cn() helper
  hooks/
    use-mobile.tsx
  styles.css          // Tailwind v4 tokens (oklch), @theme mapping
```

---

## 10. Technology Stack

- React 19 + TypeScript (strict).
- TanStack Start with file-based routing (single route `/` for now). No React Router DOM.
- Vite 7 build.
- Tailwind CSS v4 using `@theme inline` tokens defined in `src/styles.css`; no `tailwind.config.js`.
- shadcn/ui ("new-york" style, slate base, CSS variables). Reused for primitives; product components live under `components/campus`.
- lucide-react icons.
- State management: local React state (`useState`, `useMemo`) — no Redux/Zustand. Selected location + query + activeCategory + mobileSearchOpen live in the route component.
- Google Maps integration (future): wrap `MapContainer` around `@vis.gl/react-google-maps` or `@react-google-maps/api`; marker component swaps stylized pins for `AdvancedMarker`s; center/zoom controlled by selected location's lat/lng. API key from env `VITE_GOOGLE_MAPS_API_KEY`. Current build uses a stylized placeholder canvas.
- Routing (future expansion): add `/location/$id` and `/category/$id` as TanStack routes for deep-linking.

---

## 11. Accessibility

- Semantic landmarks: `<header>`, `<main>`, `<aside>`, `<nav>`.
- All icon-only buttons carry `aria-label` (close, share, profile, clear search, zoom, locate).
- Visible focus ring on every interactive element; never `outline: none` without replacement.
- Color contrast: foreground/background ≥ 7:1; muted-foreground on background ≥ 4.5:1; primary-foreground on primary ≥ 4.5:1.
- Hit targets ≥ 40 px on mobile.
- Search input uses native `<input>` with placeholder; suggestions list should render as `role="listbox"` with `role="option"` rows and arrow-key navigation.
- Drawer is a modal region on mobile with `role="dialog"` + `aria-modal` and focus trap; `Esc` closes.
- Respect `prefers-reduced-motion` — all transitions are color/shadow only, safe by default.
- Images have descriptive `alt`; decorative thumbnails use `alt=""`.

---

## 12. Active Backend Integration (MERN APIs)

The existing Node.js / Express backend provides the following routes under `app.use("/api/location", LocationRouter)` and `app.use("/api/auth", AuthRouter)`:

### Authentication Endpoints (`/api/auth`)
- `POST /register` — Register a new user account.
- `POST /login` — Log in a user (returns JWT token and sets cookies).
- `POST /logout` — Log out the user.

### Location Endpoints (`/api/location`)
- `GET /all` — Retrieve all locations on the map.
- `GET /search?q=` — Server-side location search.
- `GET /slug/:slug` — Fetch location detail by its URL slug.
- `POST /create` — Create a new location (requires authorization).
- `PUT /update/:id` — Update location details by MongoDB object ID.
- `DELETE /delete/:id` — Remove a location.

---

## 13. Master Prompt (paste into another AI UI generator)

> Build a responsive React + TypeScript web app called FindMyWay — DTU Campus Navigator, styled with Tailwind CSS v4 and shadcn/ui (new-york, slate base). The visual language must feel like Google Maps + Google Search: clean, minimal, information-dense, professional. No gradients, no glassmorphism, no neumorphism, no decorative animations. Motion is limited to 150 ms color/shadow transitions.
>
> Design tokens (light theme, oklch): background white; foreground near-black slate; muted `#F5F6F7`; border hairline `#E5E7EA`; primary Google Blue `#4285F4`; success Google Green `#34A853`; ring = primary. Radius base 12 px (also 16, 20, full). Shadows sm/md/lg/xl only, uncolored. Font stack `"Google Sans", "Roboto", system-ui, sans-serif`; weights 400/500; sizes 12/13/14/15/18/20 px. Spacing 4/8/12/16/20/24/32 px.
>
> Layout: app shell with a sticky Navbar (56 px mobile / 64 px desktop, hairline border, brand = circular primary `MapPin` + wordmark "FindMyWay", right side has ghost "Sign in" and circular avatar). Main region is a horizontal flex: on desktop (≥ 1024 px) a 380 px left Search Panel with a hairline right border, then a Map Container filling the rest. On mobile the sidebar is hidden; the map is full-bleed with a floating rounded-full search pill at top and a full-screen Mobile Search Sheet.
>
> Search Panel contains: H1 "Explore DTU Campus" + muted subtitle; a 48 px pill SearchBar (leading `Search` icon, clear `X`, `shadow-sm` → `shadow-md` on focus) with a live results dropdown (rounded-2xl, `shadow-lg`, up to 6 rows of thumbnail + title + "Building · Category" + `ChevronRight`); a 2-column CategoryCards grid for Study (Academic / Library), Hostels (Hostel), Food (Food), Sports (Sports), Medical (Medical), Transport (Transport), Admin (Administration) (each = rounded-xl bordered card with 32 px circular lucide icon chip, single-select toggle, active state uses primary border + `primary/5` fill + primary-filled icon chip); and a "Nearby places" list of 5 location rows.
>
> MapContainer renders a stylized flat map (neutral canvas, subtle grid, no satellite), primary-color teardrop markers for filtered locations, and a vertical stack of 36 px circular white floating controls bottom-right (Zoom in `Plus`, Zoom out `Minus`, `LocateFixed`). Clicking a marker or search result centers the map and opens the LocationDrawer: on desktop a floating 380 px panel at `left-4 top-4 bottom-4` over the map (rounded-2xl, `shadow-lg`); on mobile a bottom sheet (rounded-top-2xl, `shadow-xl`, `max-h-[85vh]`). Drawer contents: 192 px cover image with a circular close button, uppercase category eyebrow, 20 px medium title, action row with a green-tinted primary "Navigate" pill (`Navigation` icon, flex-1) plus a 40 px circular bordered "Share" (`Share2`) button, a muted description paragraph, and a bordered rounded-xl info list divided into rows for Hours (`Clock`), Building (`Building2`), Floor (`MapPin`), Room (`Hash`) — each row shows a 32 px muted icon chip, a 12 px muted label, and a 14 px medium value.
>
> Components (reusable, under `src/components/campus`): Navbar, SearchPanel, SearchBar, CategoryCards, MapContainer, LocationDrawer, MobileSearchSheet, plus `types.ts` (`CategoryId`, `Location`) and `data.ts` (seed locations with id, name, category, categoryLabel, building, floor, room, description, hours, image, thumbnail, x/y position). Use lucide-react icons only. State (query, activeCategory, selectedLocation, mobileSearchOpen) is local `useState` in the route; filtering via `useMemo` matches substring across name/building/categoryLabel and intersects with active category.
>
> Routing: TanStack Start file-based routing with a single `/` route in `src/routes/index.tsx` and `src/routes/__root.tsx` for the app shell and `<head>` metadata (title "FindMyWay — DTU Campus Navigator", matching description, og:title, og:description, twitter:card).
>
> Responsive: mobile-first; sidebar and desktop drawer appear at `lg:` (1024 px); navbar caps at 1600 px inner width; text truncates in list rows; no horizontal scroll.
>
> Accessibility: semantic landmarks, `aria-label` on all icon buttons, visible focus rings using the primary ring token, ≥ 40 px touch targets, dialog role + focus trap + Esc-to-close on the drawer/sheet, ≥ 4.5:1 contrast throughout.
>
> Do not generate a backend. Structure the code cleanly and idiomatically so that the seed `data.ts` can later be swapped for TanStack Query calls to the MERN APIs (e.g., `GET /api/location/all`, `GET /api/location/search`, `GET /api/location/slug/:slug`) without changing component props.
