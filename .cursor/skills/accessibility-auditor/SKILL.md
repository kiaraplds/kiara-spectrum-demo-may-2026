---
name: accessibility-auditor
description: Audits React components and UI for WAI-ARIA compliance, validates aria usage and naming, and reports missing accessibility patterns. Use when adding or changing components, after implementing interactive UI, when the user asks for an a11y review, or when verifying banner/dialog/form patterns.
---

# Accessibility auditor

## When to run

Apply after implementing or materially changing a component, widget, or Storybook example that users perceive or operate (including marketing banners, alerts, dialogs, forms, lists, and custom controls).

## Audit steps

1. **Roles and landmarks** — Confirm `role` (explicit or implicit via native element) matches purpose. For region landmarks (`banner`, `main`, `navigation`, etc.), ensure the page won’t have duplicate conflicting landmarks without intent. Prefer native elements (`button`, `a`, `h1`–`h6`) where they carry the right semantics.
2. **Accessible name** — Every interactive control and every landmark that needs a name must have one via: visible label, `aria-label`, `aria-labelledby`, or (sparingly) `aria-describedby` for description only. Verify computed name would make sense out of context.
3. **Live regions** — Use `role="alert"` / `aria-live` only when content is urgent and should interrupt; avoid marketing or static promo content in live regions.
4. **Decorative vs informative icons** — If meaning is in adjacent text, prefer `aria-hidden` on the icon. If the icon alone conveys meaning, expose a concise `aria-label` (and localize if the app is i18n’d).
5. **Keyboard and focus** — Tab order logical; focus visible; no keyboard traps except intentional (e.g. modal with escape). Custom widgets need expected keys (Enter/Space on buttons, arrow keys where specified by APG patterns).
6. **State and properties** — Expand/collapse, disabled, busy, selected, checked: expose with ARIA or native attributes (`aria-expanded`, `aria-disabled`, `aria-busy`, etc.) consistent with actual behavior.
7. **Forms** — Inputs associated with labels (`htmlFor` / `id` or `aria-labelledby`); errors linked with `aria-describedby` or `aria-errormessage` where appropriate; required fields indicated accessibly.
8. **Color and motion** — Do not rely on color alone for status; respect `prefers-reduced-motion` if the codebase uses motion (note gaps if not implemented).

## Output format

Produce a short report:

```markdown
## Accessibility audit: [Component or feature name]

### Summary
[Pass | Pass with notes | Needs fixes]

### Checks
- Roles / landmarks: …
- Names / labels: …
- Keyboard / focus: …
- ARIA state: …
- Icons / images: …
- Forms (if applicable): …

### Issues (if any)
1. **[Severity: blocker | major | minor]** — [Issue]. **Fix:** [concrete recommendation].

### References
- Link to relevant [WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/) or MDN role docs when useful.
```

## Severity guide

- **Blocker**: Wrong role, missing name on controls, keyboard unusable, false alerts.
- **Major**: Misleading labels, focus loss, state not exposed.
- **Minor**: Redundant text, slightly verbose labels, documentation gaps.

Keep the audit proportional: a small presentational change gets a shorter report; a new composite widget gets full checklist coverage.
