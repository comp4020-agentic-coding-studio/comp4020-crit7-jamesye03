// Pure grid arithmetic, kept free of the database so it's cheap to unit test
// (see spec/timetable.test.ts) and reusable from the client-side hover script
// (its own copy — see the inline <script> in timetable/index.astro — mirrors
// `overlaps` exactly; keep the two in sync if this changes).

// Weekdays only — every seeded session falls Mon-Fri, and the grid drops
// Saturday/Sunday entirely rather than rendering empty columns for them.
export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export const GRID_START_MINUTES = 7 * 60;
export const GRID_END_MINUTES = 21 * 60;

export interface TimeSpan {
  day: number;
  startMinutes: number;
  endMinutes: number;
}

export function overlaps(a: TimeSpan, b: TimeSpan): boolean {
  return a.day === b.day && a.startMinutes < b.endMinutes && b.startMinutes < a.endMinutes;
}

// Every id in the input whose span overlaps at least one *other* span in the
// same list — used both to permanently flag clashes already on the committed
// timetable, and (client-side) to flag a hovered candidate against it.
export function findConflicts<T extends TimeSpan & { id: number }>(spans: T[]): Set<number> {
  const conflicts = new Set<number>();
  for (let i = 0; i < spans.length; i++) {
    for (let j = i + 1; j < spans.length; j++) {
      if (overlaps(spans[i], spans[j])) {
        conflicts.add(spans[i].id);
        conflicts.add(spans[j].id);
      }
    }
  }
  return conflicts;
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, "0")}${period}`;
}

// One pixel per minute, so a block's top/height are exact and the same
// numbers work for the CSS and the hover-preview overlay: pixels, not
// percentages, avoid re-deriving a parent height.
export function gridPosition(span: TimeSpan): { top: number; height: number } {
  return {
    top: span.startMinutes - GRID_START_MINUTES,
    height: span.endMinutes - span.startMinutes,
  };
}

export interface LaneSpan extends TimeSpan {
  id: number;
}

// Greedy interval-graph colouring (the classic "minimum meeting rooms"
// approach): spans that overlap in time get different lanes, spans that
// don't can share one. Call once per day — lanes aren't comparable across
// days since each day column is laid out independently.
export function layoutDay(spans: LaneSpan[]): Map<number, { lane: number; laneCount: number }> {
  const sorted = [...spans].sort((a, b) => a.startMinutes - b.startMinutes);
  const laneEnds: number[] = [];
  const laneOf = new Map<number, number>();
  for (const span of sorted) {
    const lane = laneEnds.findIndex((end) => end <= span.startMinutes);
    if (lane === -1) {
      laneOf.set(span.id, laneEnds.length);
      laneEnds.push(span.endMinutes);
    } else {
      laneOf.set(span.id, lane);
      laneEnds[lane] = span.endMinutes;
    }
  }
  const laneCount = Math.max(1, laneEnds.length);
  const result = new Map<number, { lane: number; laneCount: number }>();
  for (const span of sorted) {
    result.set(span.id, { lane: laneOf.get(span.id) ?? 0, laneCount });
  }
  return result;
}
