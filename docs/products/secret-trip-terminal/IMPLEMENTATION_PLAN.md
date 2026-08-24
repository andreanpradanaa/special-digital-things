# Secret Trip Terminal — Implementation Plan

**Status:** Milestone 0 — planning only. Tidak ada route, component, reducer, style, visual, test, dependency, atau gallery entry yang dibuat pada milestone ini.

## Proposed file structure

```text
src/
  app/
    themeRegistry.ts                         # add metadata only in Milestone 4
    router.tsx                               # add /secret-trip-terminal in Milestone 1
  pages/
    secret-trip-terminal/
      SecretTripTerminalPage.tsx             # route scene and focus orchestration
      SecretTripTerminalPage.module.css      # route-scoped layout/tokens
      SecretTripTerminalVisuals.tsx          # original decorative terminal SVG/CSS visual groups
      secretTripTerminalContent.ts            # typed config and validation
      secretTripTerminalContent.test.ts       # config/validation tests
      secretTripTerminalReducer.ts            # deterministic state machine
      secretTripTerminalReducer.test.ts       # state transition tests
  pages/gallery/
    SecretTripTerminalPreview.tsx            # original non-spoiler preview, Milestone 4
    SecretTripTerminalPreview.module.css     # preview-only styles, Milestone 4
tests/e2e/
  secret-trip-terminal.spec.ts               # interaction, a11y, responsive regression
docs/products/secret-trip-terminal/
  PRODUCT_BRIEF.md
  IMPLEMENTATION_PLAN.md
```

No shared abstraction is proposed. This is the first terminal theme; its configuration, reducer, and visual groups remain route-local until a proven shared need exists.

## Content/config model

Milestone 1 should introduce one exported typed configuration and one validator. The exact source form may use a `travelDate` field (rather than both date names) to maintain one canonical API.

```ts
type SecretTripClue = {
  id: string
  label: string
  message: string
}

type SecretTripConfig = {
  giftId: string
  recipientName: string
  senderName: string
  travelDate: string
  originLabel: string
  destinationName: string
  destinationShortCode: string
  clues: readonly [SecretTripClue, SecretTripClue, SecretTripClue]
  revealHeadline: string
  personalMessage: string
  signature: string
  boardingPassNumber: string
  travelNote?: string
}
```

The validator should return structured field errors in development/test rather than silently normalizing an invalid present field. It must check trims, character limits, ID uniqueness, the exact clue count, and destination spoiler policy for clue text. It must produce a safe renderable fallback only for runtime resilience, while tests assert malformed authoring data fails validation.

Display mapping and confidentiality rules are defined in the product brief. At implementation time, destination data must not be included in any visible pre-reveal text, `aria-label`, visually hidden label, test-id, alt text, gallery preview, or debug UI. Keeping it in in-memory config is acceptable; render guards control user-facing output.

## State and event model

The route uses a pure typed reducer plus local effects only for DOM focus, live announcement, and animation completion. The state machine is deterministic: content and events determine the next state; no timer or random selection decides the destination.

```ts
type Phase =
  | 'arrival'
  | 'check-in'
  | 'clue-scanning'
  | 'board-ready'
  | 'destination-reveal'
  | 'boarding-pass'

type SecretTripState = {
  phase: Phase
  receivedClueIds: readonly string[]
  activeClueId: string | null
  announcement: string
}

type SecretTripEvent =
  | { type: 'START_CHECK_IN' }
  | { type: 'CHECK_IN_ACTIVATED' }
  | { type: 'OPEN_CLUE'; clueId: string }
  | { type: 'CLOSE_CLUE' }
  | { type: 'ACTIVATE_BOARD' }
  | { type: 'TAKE_BOARDING_PASS' }
  | { type: 'REPLAY' }
```

| From phase | Valid event | To phase | Guard / result | Focus target |
| --- | --- | --- | --- | --- |
| `arrival` | `START_CHECK_IN` | `check-in` | starts terminal desk state | `check-in-heading` |
| `check-in` | `CHECK_IN_ACTIVATED` | `clue-scanning` | desk becomes active | `clue-heading` |
| `clue-scanning` | `OPEN_CLUE` | `clue-scanning` | ID exists and has not been received; append once, set active clue | opened clue heading/body; announce received count |
| `clue-scanning` | `CLOSE_CLUE` | `clue-scanning` | clears active clue only | originating clue button |
| `clue-scanning` | `OPEN_CLUE` (third unique clue) | `board-ready` | after recording final clue, retain its active readout and unlock board | opened clue heading/body; announce board unlocked |
| `board-ready` | `CLOSE_CLUE` | `board-ready` | clears the final active clue readout; board remains unlocked | originating clue button |
| `board-ready` | `ACTIVATE_BOARD` | `destination-reveal` | only if exactly the 3 configured unique IDs are received | `destination-heading` after visual transition/instant reduced path |
| `destination-reveal` | `TAKE_BOARDING_PASS` | `boarding-pass` | destination has been revealed | `boarding-pass-heading` |
| `boarding-pass` | `REPLAY` | `arrival` | clear clue IDs, active clue, and announcements to initial deterministic state | `arrival-heading` |

The product state transition that exposes destination is `ACTIVATE_BOARD` after the three-clue guard. In normal motion it begins a 300–500ms visual board sequence, then renders readable destination; this visual completion is view-local and cannot authorize a state change. In reduced motion, destination is rendered immediately with a short dissolve only.

### Invalid transitions and duplicate prevention

- Events not listed for the current phase return the identical state.
- `OPEN_CLUE` for unknown ID, while a clue panel is already active, or for an ID in `receivedClueIds` returns identical state; the UI may keep the completed tag readable but must not increment progress or repeat announcement.
- `ACTIVATE_BOARD` before three unique configured clues returns identical state; the button is disabled/absent in UI and reducer guard remains the source of truth.
- `TAKE_BOARDING_PASS` cannot succeed before `destination-reveal`.
- `REPLAY` is intentionally accepted only from boarding pass; reset produces a new initial state with no retained clue progress.

## Component boundaries

- `SecretTripTerminalPage`: obtains validated config, owns `useReducer`, phase transitions, focus effects, live region, skip target, replay/back links, and conditional scene composition.
- `TerminalArrival`: arrival sign, concise intro, check-in CTA.
- `CheckInDesk`: single activation control, textual desk status, indicator visual.
- `ClueScanner`: semantic clue list and progress text; owns no state beyond props/event callbacks.
- `LuggageTagButton`: one native button per clue, clear selected/completed labels.
- `ClueReadout`: inline/scene-local readout, not a generic modal; returns focus to its opening tag when closed.
- `DepartureBoard`: safe status and activation CTA; receives a boolean only, never decides unlock rules.
- `BoardingPassReveal`: destination reading view and explicit `Ambil boarding pass` button.
- `BoardingPass`: semantic final article with destination, date, message, signature, optional note, replay, and collection link.
- `SecretTripTerminalVisuals`: decorative canopy, conveyor, luggage body, lamp, board mechanism, and print slot. Decorative SVGs use `aria-hidden="true"`/no semantic role; copy remains HTML.

These are planned boundaries, not a component-library API. Small presentational parts may stay in the page until complexity demonstrates a separate boundary is helpful.

## Visual component plan

- **Arrival/check-in:** miniature facade and check-in counter create a strong first silhouette. A large labelled desk button is the main affordance.
- **Clue scanner:** three distinct geometric luggage silhouettes sit on a short conveyor but each has the same accessible button area and minimum touch target. Their tags carry the visible label; the clues are text in an adjacent readout.
- **Departure board:** a CSS/SVG flipboard grid shows neutral columns before unlocking; it never simulates a real airline schedule or uses a real carrier identifier.
- **Boarding-pass printer:** an abstract slot and perforation-like edge accompany the pass, but the pass is an HTML article so all text is selectable/readable.
- **Responsive composition:** vertically stack facade → controls → readout on 320/390px; use a shallow terminal panorama with board/printing as focal points at 768/1280px. Avoid persistent side panels and SaaS-card grids.

## Motion plan

Motion is implemented with Motion and CSS transforms/opacity where possible; no audio is required or autoplayed.

| Moment | Standard motion | Reduced-motion policy |
| --- | --- | --- |
| Check-in activation | small lamp brighten, conveyor shifts a short distance | instant status change or 120ms opacity transition |
| Open clue | selected tag lifts 2–4px, horizontal scan line passes once | no travel; readout dissolves in quickly |
| Third clue | gate indicator lights and board activation appears | immediate text/status update |
| Board activation | brief 300–500ms character flip/stagger, then readable destination | short 120–160ms dissolve; no multi-character flip or decorative hold |
| Boarding pass | pass translates out 12–20px with fade | fade in immediately/shortly, no print delay |
| Ambient terminal | low-amplitude conveyor/indicator state only, paused if not meaningful | static visual state |

No state transition depends on completion of a long animation. Motion uses `MotionConfig reducedMotion="user"`, honors `prefers-reduced-motion`, and avoids opacity flicker, unbounded loops, and timing challenges. Animation quality must remain unclaimed until screenshots plus recording or Playwright trace have been reviewed.

## Accessibility plan

- Use one route-level `<main>` and skip link target; headings follow scene changes and receive programmatic focus only after user-initiated phase transitions. Direct navigation leaves initial focus untouched so Tab reaches skip link first.
- Each action is a semantic `<button>` or `<a>`; no clickable `div`, hover-only behavior, drag requirement, or hidden gesture.
- Use `aria-live="polite"` for concise events: clue received/count and board unlocked. Do not announce decorative lamp/scan-frame changes or every animation frame.
- Expose explicit text such as “2 dari 3 petunjuk diterima” and “Departure board siap”; pair colour with text/icon/state.
- Keep a visible focus ring against every scene surface, keyboard order matching visual/DOM order, and touch targets at least 44×44 CSS px where practical.
- Treat decorative SVG as hidden from the accessibility tree; visible terminal copy stays HTML. Destination is readable text at reveal without animation.
- The clue readout close control returns focus to the originating tag; scene headings are named focus targets. Replay moves focus to arrival heading.
- Validate 320px minimum viewport with no horizontal overflow, while testing 390, 768, and 1280px as specified.

## Test plan

### Unit

- Configuration accepts valid content and rejects empty/overlong fields, invalid `giftId`, invalid short code, non-three clues, duplicate clue IDs, and a clue that violates destination spoiler policy.
- Optional `travelNote` is accepted only within bounds and omitted safely when absent.
- Reducer transition table: valid events, ignored invalid events, exact unique clue tracking, arbitrary clue order, duplicate/unknown clue no-op, premature board activation no-op, and replay reset.
- Reducer tests remain pure; timing and DOM focus are not encoded in reducer state unless needed for product behavior.

### End-to-end / Chromium smoke

- Direct navigation opens arrival, has no console errors, and exposes main CTA without initial forced focus.
- Pointer happy path completes check-in → three clues → board → pass, with destination absent until final reveal.
- Keyboard-only path completes the same flow using Tab/Enter/Space; focus follows phase targets and clue-readout close returns correctly.
- Clues complete correctly in several orders; opening a completed/duplicate clue does not increase progress.
- Board cannot activate prematurely; replay fully resets state and can be completed again.
- Skip link works; decorative SVG has no accessible name/role; live announcements are concise and destination text is available after reveal.
- Emulate reduced motion and prove flow does not wait for a long flipboard sequence.
- Check visible focus, text contrast, no horizontal overflow, and usable controls at 320, 390, 768, and 1280px.
- Capture screenshots for key states and produce recording or Playwright trace covering board/pass motion before claiming motion quality.

Run the project quality gates at final implementation handoff: `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, plus Chromium smoke test.

## Gallery integration plan (Milestone 4 only)

- Add planned category metadata `surprise-reveals` only when the category model has a concrete consumer; do not introduce a filter in this work.
- After the prototype is complete and reviewed, place Secret Trip Terminal as the top featured item in the gallery while preserving existing prototype order below it.
- Create one original preview object: a sealed tangerine suitcase on a short sky-blue conveyor with a non-personal label such as `DEPARTURE PENDING`. Do not render any personalized destination, date, recipient, or sender data.
- Provide one accessible gallery link with title, summary, and action text; hover/focus may move the suitcase/conveyor subtly, while reduced motion leaves it static. Mobile stacks the preview without CSS order that conflicts with DOM order.

## Milestone breakdown

| Milestone | Scope | Separately verifiable exit criteria |
| --- | --- | --- |
| **0 — Product Definition and Implementation Plan** | This documentation only: product decision, data contract, state plan, tests, risks, milestones. | Documents reviewed; `git diff --check` clean; no implementation files changed. |
| **1 — Foundation** | Add route from registry, typed content + validator, reducer + unit tests, semantic page shell, focus/live-region foundation, and deliberately plain placeholder terminal visual. | Direct route works; config/reducer unit tests cover guards; each planned phase can be reached through basic buttons; lint/typecheck/unit/build and initial Chromium smoke pass. |
| **2 — Complete core terminal experience** | Complete five-phase recipient flow, three arbitrary-order clue controls, guarded board reveal, readable boarding pass, replay/collection navigation, keyboard/touch parity. | Pointer and keyboard happy paths pass; spoiler guard/duplicates/premature unlock/replay/focus tests pass at mobile and desktop. |
| **3 — Visual and motion refinement** | Build original terminal silhouettes, responsive composition, conveyor/scanner/indicator/board/pass motion, reduced-motion alternatives, contrast/focus polish, evidence capture. | Visual QA at 320/390/768/1280; reduced-motion path verified; screenshots plus motion recording/trace reviewed; no console/overflow/accessibility regressions. |
| **4 — Gallery integration and full review** | Add category metadata and non-spoiler preview/link, top featured placement after readiness, full regression/review. | Gallery semantics/hover-focus/mobile stacking pass; all project gates, route smoke tests, and product review complete. |

## Risk register

| Risk | Impact | Mitigation / validation |
| --- | --- | --- |
| Clue accidentally spoils destination | Surprise fails | Authoring validation plus manual content review; prohibit destination, short code, flags, and explicit landmarks in clues. |
| Flipboard becomes an accessibility or motion barrier | Recipient cannot access final information comfortably | Destination remains HTML, short/reduced alternate transition, no event waits on animation. |
| Miniature visuals crowd 320px | Controls or text overflow | Mobile-first vertical composition, fixed minimum targets, E2E viewport assertions/screenshots. |
| Terminal resembles real airline branding | Unwanted brand association | Use fictional geometry/copy, no carrier logos, codes, schedules, flags, or airport UI mimicry. |
| Focus is lost between transient scenes | Keyboard path breaks | Named phase headings, explicit focus effect after transitions, focus-return test for clue readout. |
| State and visual animation drift | Incorrect reveal timing | Reducer owns unlock rules; view animation never authorizes state. Test premature and stale actions. |
| Scope grows into travel utility | Delivery slows and promise blurs | Maintain explicit non-goals; one destination/one pass only; defer maps, itinerary, booking, share/download. |
| Gallery preview leaks personalized data | Surprise spoils before entry | Preview uses fixed generic object/copy only; test absence of config-specific destination fields. |

## Definition of done

Milestone 4 is done only when the approved MVP has one functioning surprise-trip flow with exactly three unique clues and one guarded destination reveal; all required content appears in the final boarding pass; replay and collection navigation work; pointer/touch/keyboard/reduced-motion behavior are verified; terminal visuals are original and non-spoiling; the gallery integration is accessible and non-personal; no existing prototype regresses; and lint, typecheck, unit tests, build, Chromium smoke, responsive screenshots, and motion evidence have been completed and reviewed.

For the current Milestone 0, done means only the two planning documents and the project-plan milestone note exist, with no implementation started.
