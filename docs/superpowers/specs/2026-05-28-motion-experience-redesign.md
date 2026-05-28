# Motion Experience Redesign

## Context

Call from Afar is a React/Vite single-page app themed around a "time-space phone booth". The current prototype already has a star canvas, a phone booth illustration, page transitions, call timing, and ticket generation. The animation system is functional but shallow: effects are distributed across individual components, the phone booth does not yet feel like an interactive object, and the full flow does not yet feel like one coherent emotional sequence.

This redesign treats the work as growth plus structural work. A small patch would improve individual animations, but it would keep the same scattered structure and make future animation changes harder. The chosen scope is a larger, bounded experience refactor.

## Goals

- Make the phone booth feel like a tactile interactive object.
- Preserve the emotional tone: quiet, reflective, and ritual-like.
- Use cinematic star lines and glow only as emphasis during important moments.
- Create a coherent animation journey from entry to ticket generation.
- Centralize motion timing, easing, and user motion preferences.
- Keep the app usable when animation or transitions are disabled.

## Non-Goals

- Do not add a new animation library.
- Do not turn the app into a game.
- Do not introduce complex 3D.
- Do not change the core product flow: entry, call, ticket.
- Do not persist private call content.

## Chosen Direction

The selected direction is "tactile object" as the primary feel, with quiet ritual pacing and limited cinematic star effects.

The animation density should be medium interaction:

- Core objects respond clearly to user actions.
- The phone booth, buttons, call signal, and ticket have meaningful states.
- The experience remains calm during the actual call.
- Motion should support the user journey instead of competing with it.

## Experience State Flow

The animation flow is:

```text
intro -> entry -> dialing -> connected -> ending -> ticketReveal
```

Responsibilities by state:

- `intro`: homepage text appears, star field wakes up, primary action enters as a pressable object.
- `entry`: form stays calm; inputs gain soft focus glow; the submit button lights up when valid.
- `dialing`: the phone booth is pressed or awakened; the receiver settles; signal rings and star lines establish the connection.
- `connected`: the booth holds a stable breathing glow; the timer updates without distraction.
- `ending`: signal rings retract; booth glow softens; the end message appears after the connection visually closes.
- `ticketReveal`: light condenses into a ticket; ticket content appears in layers; action buttons enter last.

Routes remain:

- `/`
- `/entry`
- `/call`
- `/ticket`

Internal call state should evolve from the current `idle | connecting | connected` shape into a clearer stage model such as:

```ts
type CallStage = "idle" | "dialing" | "connected" | "ending";
```

The page should trigger state changes from user actions. Long unskippable automatic sequences are out of scope.

## Proposed Architecture

Add a motion layer:

```text
src/motion/
|-- tokens.ts
|-- variants.ts
`-- preferences.ts
```

`tokens.ts` centralizes durations, delays, easing curves, and spring values.

`variants.ts` defines shared Framer Motion variants for pages, modals, buttons, tickets, staged reveals, and reduced-motion fallbacks.

`preferences.ts` or an equivalent hook combines:

- `animationEnabled`
- `transitionEnabled`
- browser `prefers-reduced-motion`

The goal is to avoid duplicating timing logic across components.

Add scene-oriented components:

```text
src/components/scene/
|-- PhoneBoothStage.tsx
|-- SignalEffects.tsx
`-- SceneStars.tsx
```

`PhoneBoothStage` owns the phone booth object and receives a stage prop:

```ts
type PhoneBoothStageName = "idle" | "dialing" | "connected" | "ending";
```

`SignalEffects` consolidates the current star line, ripple, and active ring responsibilities. It should render different signal intensity by stage instead of each effect owning separate state checks.

`SceneStars` can wrap or evolve the current `StarBackground` when scene-level animation needs to respond to the current stage.

Add ticket-oriented components:

```text
src/components/ticket/
|-- TicketReveal.tsx
|-- TicketCard.tsx
`-- TicketActions.tsx
```

The existing ticket behavior should remain: render a ticket, save it with `html2canvas`, print it, and share it where supported. Ticket reveal animation must not break the screenshot area used by `html2canvas`.

## Component Behavior

### PhoneBoothStage

- In `idle`, the booth sits with subtle physical weight.
- In `dialing`, the booth receives a press or wake response, the receiver settles, and signal effects begin.
- In `connected`, the booth glow stabilizes into a low-frequency breathing loop.
- In `ending`, the glow dims and rings contract before the end message appears.

### TouchableButton

Introduce a shared button component or shared motion variant for buttons.

Expected states:

- `hover`: slight lift or glow.
- `tap`: small downward press and quick spring return.
- `disabled`: visually inert, no misleading hover motion.
- `focus`: accessible ring remains clear.

### SignalEffects

Replace scattered signal logic with stage-driven rendering:

- `dialing`: expanding rings and star lines.
- `connected`: low-intensity stable ring.
- `ending`: inward contraction and fade.

### TicketReveal

The ticket should appear like a physical keepsake:

- ticket shell appears first,
- illustration and title enter,
- duration and timestamp enter,
- message appears last,
- action buttons enter after the ticket is readable.

## Motion Preferences

Motion must respect both app-level toggles and system preference.

Rules:

- If `animationEnabled` is false, remove decorative loops and large motion.
- If `transitionEnabled` is false, page transitions should become instant or near-instant.
- If `prefers-reduced-motion` is active, reduce scale, rotation, parallax, long looping effects, and large movement.
- State changes must still be visible through opacity, color, or layout changes.

## Implementation Boundary

Allowed:

- Reorganize animation-related components.
- Move ticket components into a ticket-focused folder.
- Add shared motion tokens and variants.
- Refactor `CallPage` stage handling.
- Adjust existing animation CSS where needed.

Not allowed in this redesign:

- Replacing the app's routing model.
- Adding a backend.
- Adding persistent storage for call content.
- Introducing Three.js or another large visual system.
- Rewriting unrelated form, message, or license behavior.

## Verification Plan

Run:

```bash
npm run check
npm run lint
npm run build
```

Browser verification:

- Walk through `/` -> `/entry` -> `/call` -> `/ticket`.
- Test desktop and mobile viewport widths.
- Confirm booth press, dialing signal, connected breathing, ending contraction, and ticket reveal.
- Toggle animation off and confirm the app remains usable.
- Toggle transition off and confirm routes and modals do not get stuck.
- Confirm ticket save still captures the complete ticket.

## Risks

- A larger component restructure can break route flow if done all at once.
- `html2canvas` may capture intermediate animation states if the ticket reveal is not isolated from the export target.
- Too much interactive motion could undermine the reflective tone.
- `CallPage` can become complex if it owns too much animation detail.

Mitigation:

- Implement in vertical slices.
- Keep `CallPage` responsible for stage transitions, not rendering details.
- Keep exportable ticket content in a stable DOM subtree.
- Verify each page after its slice is changed.

## Open Decisions

No unresolved product decisions remain for the design stage. Implementation should use the chosen direction: tactile object first, quiet ritual pacing second, cinematic signal effects only at key moments.
