# Chase Meeting Booking

A meeting booking page built for the ChaseLabs Design Engineer Assessment. Allows prospects to view availability and book 30-minute meetings.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tech Stack

- **Svelte 5** - Using runes (`$state`, `$derived`, `$effect`)
- **TypeScript**
- **Tailwind CSS v4**
- **SvelteKit** - With experimental remote functions (`query.batch`, `form`)

## Design Decisions

### Inline Booking Flow
Rather than a modal overlay, selecting a slot expands the day card to full width with the booking form inline. This keeps context visible (selected date/time) and feels more integrated.

### Batched API Requests
Used `query.batch` to solve the N+1 problem when fetching availability. Instead of 5 separate requests for 5 days, a single request fetches the full range and distributes results to each day component.

### Progressive Enhancement
The booking form uses SvelteKit's `form` remote function, which provides:
- Server-side validation
- Optimistic UI updates
- Automatic pending states
- Works without JavaScript (progressive enhancement)

### Navigation Constraints
Users cannot navigate to past dates - the back buttons disable when viewing today. This prevents confusion from seeing unavailable historical slots.

### Chase Brand Colors
Extracted the coral/red brand colors from Chase's website and configured them in Tailwind via `@theme` directive for consistent branding. Green is used for slot indicators to clearly convey availability (avoiding red which could imply "unavailable").

### Svelte 5 Showcase
This project deliberately demonstrates modern Svelte 5 patterns:

- **`.svelte.ts` modules** - The toaster uses a reactive module (`state.svelte.ts`) with runes outside of components
- **Runes in classes** - `Toaster` class uses `$state` for reactive queue management with proper encapsulation
- **`@attach` directive** - Button tooltips use the new attachment syntax for imperative DOM operations (Tippy.js)
- **`{@const}` for dynamic components** - Toaster renders different icons without deprecated `<svelte:component>`
- **`$props()` with TypeScript** - All components use typed props with the runes API
- **Snippets** - Day component uses `{#snippet}` for reusable slot item template

## Architecture

```
src/lib/
├── booking/
│   ├── booking.svelte      # Inline booking card with form
│   ├── booking.remote.ts   # POST /api/meetings
│   └── index.ts
├── calendar/
│   ├── calendar.svelte     # Main calendar with navigation
│   ├── day.svelte          # Day card with slot list
│   ├── calendar.remote.ts  # GET /api/availability (batched)
│   └── types.ts
├── components/
│   └── button/             # Reusable button with variants
└── toaster/                # Toast notifications
```

## Trade-offs

1. **Remote Functions (Experimental)** - Used SvelteKit's experimental `query`/`form` APIs for cleaner data fetching. Trade-off: API may change before stable release but this is unlikely.

2. **Single Attendee** - The booking form collects one attendee. The API supports multiple, but for a prospect booking their own meeting, one is sufficient.

3. **No Time Zone Handling** - Times display as-is from the API. In production, would need proper timezone conversion based on user's locale or to present the timezone.

## Improvements with More Time

- **Accessibility** - Add keyboard navigation for slot selection, ARIA live regions for loading states, respect reduced motion.
- **Animations** - Smoother transitions between calendar and booking views
- **Mobile Optimization** - Swipe gestures for day navigation
- **Error Recovery** - Retry logic for failed API requests
- **Testing** - Unit tests for remote functions, E2E tests for booking flow
- **Form State** - Better handling for form validation on cancel and reopen

## Assumptions

1. All meetings are 30 minutes (as specified)
2. Slots returned by the API are in a bookable state
3. Single timezone (no conversion needed for demo)
4. One attendee per booking (the prospect themselves)
