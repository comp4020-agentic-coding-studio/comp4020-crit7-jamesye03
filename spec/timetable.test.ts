import { describe, expect, inject, it } from "vitest";
import { findConflicts, overlaps } from "../src/lib/timetable";

// Two kinds of check: the conflict-detection arithmetic (pure, no server
// needed), and the spec's actual promise — "the core flow persists across a
// reload" — driven against the running built app, same pattern as the
// starter's own (now-retired) guestbook.test.ts.

describe("overlaps / findConflicts", () => {
  it("flags two sessions that share time on the same day", () => {
    const a = { id: 1, day: 0, startMinutes: 600, endMinutes: 660 };
    const b = { id: 2, day: 0, startMinutes: 630, endMinutes: 690 };
    expect(overlaps(a, b)).toBe(true);
    expect(findConflicts([a, b])).toEqual(new Set([1, 2]));
  });

  it("does not flag back-to-back sessions (touching, not overlapping)", () => {
    const a = { id: 1, day: 0, startMinutes: 600, endMinutes: 660 };
    const b = { id: 2, day: 0, startMinutes: 660, endMinutes: 720 };
    expect(overlaps(a, b)).toBe(false);
  });

  it("does not flag the same time on different days", () => {
    const a = { id: 1, day: 0, startMinutes: 600, endMinutes: 660 };
    const b = { id: 2, day: 1, startMinutes: 600, endMinutes: 660 };
    expect(overlaps(a, b)).toBe(false);
    expect(findConflicts([a, b])).toEqual(new Set());
  });

  it("leaves a session with no clash out of the conflict set", () => {
    const a = { id: 1, day: 0, startMinutes: 600, endMinutes: 660 };
    const b = { id: 2, day: 0, startMinutes: 630, endMinutes: 690 };
    const c = { id: 3, day: 2, startMinutes: 540, endMinutes: 600 };
    expect(findConflicts([a, b, c])).toEqual(new Set([1, 2]));
  });
});

describe("the core flow, against the running app", () => {
  const baseUrl = inject("baseUrl");

  // Astro checks form POSTs carry a same-origin Origin header (CSRF
  // protection); browsers send it automatically, a bare fetch doesn't.
  const post = (path: string, body: URLSearchParams) =>
    fetch(new URL(path, baseUrl), {
      method: "POST",
      headers: { origin: baseUrl },
      body,
      redirect: "manual",
    });

  it("the catalog lists the seeded courses, in full", async () => {
    const res = await fetch(new URL("/courses/", baseUrl));
    const html = await res.text();
    expect(html).toContain("COMP1100");
    expect(html).toContain("Introduction to Programming and Algorithms");
  });

  it("enrolling, choosing a tutorial, and reloading: the choice is still there", async () => {
    // COMP1100 is the first seeded course (see src/lib/seed.ts), but its
    // session ids aren't asserted here — read its first tutorial's id off
    // the rendered page rather than assuming how the seed numbers rows.
    await post("/api/enrol", new URLSearchParams({ courseId: "1" }));
    const before = await (await fetch(new URL("/timetable/", baseUrl))).text();
    const sessionId = before.match(/name="sessionId" value="(\d+)"/)?.[1];
    if (!sessionId) throw new Error("no tutorial option rendered for the enrolled course");

    await post("/api/choose-tutorial", new URLSearchParams({ courseId: "1", sessionId }));

    const res = await fetch(new URL("/timetable/", baseUrl));
    const html = await res.text();
    expect(html).toContain("COMP1100");
    expect(html).toContain("current");
  });

  it("dropping the course removes it from the timetable on reload", async () => {
    await post("/api/drop", new URLSearchParams({ courseId: "1" }));

    const res = await fetch(new URL("/timetable/", baseUrl));
    const html = await res.text();
    expect(html).not.toContain("COMP1100");
  });
});
