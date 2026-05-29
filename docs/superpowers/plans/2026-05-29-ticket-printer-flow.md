# Ticket Printer Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a post-call printer interaction before the final ticket detail page.

**Architecture:** Add `TicketPrinter` as the post-call embodied object. Keep `TicketCard` focused on the detailed exportable ticket, and keep `TicketReveal` focused on detail-page reveal motion.

**Tech Stack:** React, TypeScript, Framer Motion, Tailwind CSS, Zustand store, Vite.

---

### Task 1: Add Ticket Printer Component

**Files:**
- Create: `src/components/ticket/TicketPrinter.tsx`

- [x] Create a focused component with `ready`, `printing`, and `printed` local states.
- [x] Use motion layers for machine press, status light, paper ejection, and printed-ticket click affordance.
- [x] Respect app motion preferences.

### Task 2: Wire Printer Into Call Flow

**Files:**
- Modify: `src/pages/CallPage.tsx`

- [x] Replace the post-call “view ticket” action with `TicketPrinter`.
- [x] Keep `callDuration` in store until the user clicks the printed ticket.
- [x] Navigate to `/ticket` only from the printed ticket.

### Task 3: Refine Ticket Detail Page

**Files:**
- Modify: `src/components/ticket/TicketReveal.tsx`
- Modify: `src/components/TicketCard.tsx`
- Modify: `src/components/ticket/TicketActions.tsx`
- Modify: `src/pages/TicketPage.tsx`

- [x] Make the detail page feel like the opened final keepsake, not another printer screen.
- [x] Keep export capture scoped to the ticket body.
- [x] Keep save, print, and share actions after the refined ticket.

### Task 4: Verify

**Commands:**
- [ ] `npm run check`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Browser smoke test: entry -> call -> end -> print -> click ticket -> detail page.
