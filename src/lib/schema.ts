import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// The schema is the ground truth for the database. To change it: edit here,
// run `pnpm db:generate` to turn the diff into a migration under drizzle/,
// and commit both — the migration applies automatically when the server
// boots (see src/lib/db.ts), locally and deployed. Never edit the database
// by hand: state on the deployed volume outlives every deploy, and the
// migration trail is what keeps old state and new code compatible.

// The catalog: a slice of ANU's course/session data, seeded at boot (see
// seed.ts) rather than entered by hand — this app's whole point is that you
// can browse it here instead of hunting it down elsewhere.
export const courses = sqliteTable("courses", {
  id: int().primaryKey({ autoIncrement: true }),
  code: text().notNull().unique(),
  title: text().notNull(),
  summary: text().notNull(),
  description: text().notNull(),
  units: int().notNull().default(6),
  color: text().notNull(),
  // Nullable so this lands as a plain additive migration against the
  // already-deployed volume: instructor/prerequisites are plain text,
  // objectives/assessments are JSON-stringified arrays (see seed.ts).
  instructor: text(),
  prerequisites: text(),
  objectives: text(),
  assessments: text(),
  assessmentFormat: text(),
});

// One row per timetabled block: a course's lecture (always exactly one) or
// one of its tutorial options (a student picks one). `day` is 0 (Monday) to
// 6 (Sunday); start/end are minutes since midnight, so the grid can lay them
// out with plain arithmetic.
export const sessions = sqliteTable("sessions", {
  id: int().primaryKey({ autoIncrement: true }),
  courseId: int()
    .notNull()
    .references(() => courses.id),
  kind: text({ enum: ["lecture", "tutorial"] }).notNull(),
  label: text().notNull(),
  day: int().notNull(),
  startMinutes: int().notNull(),
  endMinutes: int().notNull(),
  location: text().notNull(),
});

// The whole app has one shared timetable (no login), so a course is either
// enrolled or it isn't. `tutorialSessionId` is null until a tutorial is
// chosen on the timetable page — enrolling only commits the (fixed) lecture.
export const enrolments = sqliteTable("enrolments", {
  id: int().primaryKey({ autoIncrement: true }),
  courseId: int()
    .notNull()
    .unique()
    .references(() => courses.id),
  tutorialSessionId: int().references(() => sessions.id),
});

export type Course = typeof courses.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Enrolment = typeof enrolments.$inferSelect;
