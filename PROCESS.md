# Process overview

Written by you, for a reader: how you got from the brief to the harness and
agentic workflow behind this submission. Markers read this file and follow its
citations; they don't trawl the repo for evidence you didn't point at.

This file is the shape; the course site's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
is the requirement, and its
[word counts](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#word-counts)
cover every deliverable.

## What I built

A mock ANU course-enrolment site that puts a course's real description and its
enrol button on the same page, plus a single shared weekly timetable that
flags tutorial clashes without blocking them. `README.md` covers what it does
and what good looks like here.

## How I got here

The starter shipped a guestbook demo. The first pass replaced it outright with
the actual prototype — a browsable catalog, enrol/drop, one shared timetable
with a hover preview for tutorial choice, and a conflict flag that warns but
never blocks
([`cc5531b`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-jamesye03/commit/cc5531b)).
That commit is the whole slice working end to end: it's what made the rest of
the week a design conversation instead of a build-from-scratch one.

> Build the ANU system I wish existed: a course catalog with full
> descriptions, enrol/drop, a shared weekly timetable, tutorial choice with a
> live preview, and time clashes that are flagged but never block enrolment.

Once it was deployed and actually looked at on a real screen, the first round
of feedback was about it not using the space or the scope it had: the layout
was capped well short of the desktop width it had to fill, and nothing stopped
someone enrolling in every course on offer the way a real unit-load cap would.
That became a full-width layout pass, a 4-course enrolment cap with a banner
instead of a silent failure, and cutting an "About" nav link that wasn't
pulling weight
([`fabdd18`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-jamesye03/commit/fabdd18)).

> The layout doesn't fill the screen on a real desktop, and there's nothing
> stopping someone from enrolling in every course — cap it, and use the width
> you've got.

The largest single revision followed a much more detailed second look at the
catalog and timetable pages. The ask was to move Courses/My timetable from a
small corner link to a centred, prominent nav; turn the course list into one
long clickable rectangle per course (code, title, and an enrol button that
turns blue once you're in); make the whole card clickable through to a detail
page except for that button; expand the detail page into something that reads
like a real ANU course outline — objectives, assessment breakdown, credit
units, prerequisites, instructor; drop the timetable to Monday–Friday; and
widen the sidebar so a tutorial's full choose-button is visible without
scrolling
([`7ef65b6`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-jamesye03/commit/7ef65b6)).

> Move the nav to the top centre instead of a small corner. List courses one
> per row in a long rectangle — code top-left, title under it, summary in the
> middle, enrol button on the right, enrolled state in blue — and make the
> rest of the card open the detail page. Make the detail page much more
> thorough: objectives, assessment, format, credit units, prerequisites,
> instructor. Drop Saturday/Sunday from the timetable grid, and make the
> sidebar wide enough that a tutorial's choose-button doesn't need a scrollbar
> to see.

Implementing that meant a schema change (five new columns for
instructor/prerequisites/objectives/assessments/format) against a Fly volume
that already had live enrolments on it, so the seed step had to become an
upsert keyed on course code and session identity rather than a one-shot
"insert if empty" — otherwise a redeploy would either duplicate rows or break
the foreign keys an existing enrolment pointed at. I checked this held by
reading the live catalog HTML after deploying: courses that already had
enrolments kept their `enrolled` state and picked up the new
instructor/objectives content on the same row, rather than resetting.
Correctness on the rest — conflict arithmetic, the enrol → choose tutorial →
reload → still-there flow, and the accessibility floor on every route — is
what `spec/timetable.test.ts` and `spec/invariants.test.ts` hold on every
`pnpm check` run, which stayed green throughout.

## Before you ship

`pnpm check:evidence` verifies that this comment is gone, that your citations
resolve to real commits, that a crit week's reflection entry is in
`reflections/`, and that your `CLAUDE.md` is there. It checks that your account
is traceable, not that it is good: that is the marker's call.

Images aren't checked: unlike a citation whose SHA doesn't resolve, a broken
image is visible the moment this file is rendered on GitHub.
