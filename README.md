# A course catalog that knows its own timetable

The real ANU workflow this fixes: you look up a course's content and class
code on one site, then carry that code over to a completely separate
enrolment system that shows you no course content at all — just a form
field. This prototype models that slice end to end: one place to read a
course's actual description, enrol in it, and immediately see how it sits in
your week.

Browse the catalog at `/courses/`, open a course to read its full
description and session times, and enrol. `/timetable/` then shows every
enrolled course's lecture (fixed) and tutorial options (yours to pick) on
the left, and a real 7am–9pm, seven-day grid on the right. Hovering a
tutorial option previews exactly where it would sit on the grid — no
network request, just the times already on the page — before you commit to
it with a click. Everything in the catalog (COMP1100 through MATH1115) is
fictional: invented courses, invented times, built only to give the
timetable real overlapping data to render.

## What good looks like here

The annoyance being fixed is specifically the *split between content and
enrolment*, not the whole ANU system — so the catalog page and the
enrolment action live on the same site, and a course's detail page is what
you enrol from, not a separate lookup. There's no login: the timetable is
one shared, public piece of state, the same choice the starter's own
guestbook demo made, and it keeps the prototype honest about what it's
modelling (the enrol → timetable flow) instead of building an auth system
nobody asked to see.

Time conflicts are flagged, never blocked. A real enrolment system has
rules an agent shouldn't invent (co-requisites, capacity, degree
requirements) — the honest scope here is to surface the clash clearly (a
red outline, and a "⚠ clash" label so it doesn't rely on color alone) and
leave the judgement to the person looking at their own week, the same way
the real ANU system would when the same slots genuinely intersect.

What's enforced: `spec/timetable.test.ts` checks the conflict-detection
arithmetic directly, plus the flow that matters most — enrol, choose a
tutorial, reload, and the choice is still there; drop, and it's gone. The
shipped `spec/invariants.test.ts` holds the accessibility and structural
floor on every route. What's left to judgement: whether the grid actually
reads well at a glance, and whether the hover preview feels responsive —
that's a visual call, not a mechanical one, and it's mine to make by
looking at the deployed app, not something a test can certify.

Images, if any get added, go in `public/` and are linked relatively —
`![alt](public/before.png)` — which renders on GitHub and at `/readme/`
alike.
