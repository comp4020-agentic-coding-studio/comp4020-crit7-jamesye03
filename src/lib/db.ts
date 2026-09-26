import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { SEED_COURSES } from "./seed";
import { type Course, type Enrolment, type Session, courses, enrolments, sessions } from "./schema";

// One SQLite file is the app's whole persistent state. In production
// fly.toml points DATABASE_PATH at the machine's volume (/data), which is
// how state survives a reload and a redeploy; locally it defaults to an
// untracked file in .data/.
const path = process.env.DATABASE_PATH ?? "./.data/app.db";
mkdirSync(dirname(path), { recursive: true });

const client = new Database(path);
client.pragma("journal_mode = WAL");

export const db = drizzle(client);

// Migrations run at boot, on whatever machine holds the volume — the
// recommended shape for SQLite on Fly, where there's no separate machine to
// run them from. The flow: edit src/lib/schema.ts, `pnpm db:generate`,
// commit the migration it writes to drizzle/.
migrate(db, { migrationsFolder: "./drizzle" });

// The catalog is fixed seed data, not something a visitor creates — this
// fills an empty database (a fresh volume, or the spec's throwaway one) once,
// idempotently, so both a first boot and a test run see the same courses.
function seedIfEmpty() {
  if (db.select().from(courses).limit(1).all().length > 0) return;
  for (const course of SEED_COURSES) {
    const { id: courseId } = db
      .insert(courses)
      .values({
        code: course.code,
        title: course.title,
        summary: course.summary,
        description: course.description,
        color: course.color,
      })
      .returning({ id: courses.id })
      .get();
    for (const session of course.sessions) {
      db.insert(sessions)
        .values({
          courseId,
          kind: session.kind,
          label: session.label,
          day: session.day,
          startMinutes: session.startMinutes,
          endMinutes: session.endMinutes,
          location: session.location,
        })
        .run();
    }
  }
}
seedIfEmpty();

export type { Course, Session, Enrolment };

export function listCourses(): Course[] {
  return db.select().from(courses).orderBy(courses.code).all();
}

export function getCourseByCode(code: string): Course | undefined {
  return listCourses().find((course) => course.code.toLowerCase() === code.toLowerCase());
}

export function listSessionsForCourse(courseId: number): Session[] {
  return db.select().from(sessions).where(eq(sessions.courseId, courseId)).all();
}

export interface EnrolledCourse {
  course: Course;
  lecture: Session;
  tutorials: Session[];
  chosenTutorialId: number | null;
}

// The full state the timetable page needs: every enrolled course alongside
// its fixed lecture, its tutorial options, and which one (if any) is chosen.
export function listEnrolledCourses(): EnrolledCourse[] {
  const rows = db.select().from(enrolments).all();
  return rows.map((row) => {
    const course = getCourseById(row.courseId);
    const courseSessions = listSessionsForCourse(row.courseId);
    const lecture = courseSessions.find((session) => session.kind === "lecture");
    if (!course || !lecture) {
      throw new Error(`enrolment ${row.id} points at course ${row.courseId}, which has no lecture`);
    }
    return {
      course,
      lecture,
      tutorials: courseSessions.filter((session) => session.kind === "tutorial"),
      chosenTutorialId: row.tutorialSessionId,
    };
  });
}

function getCourseById(id: number): Course | undefined {
  return db.select().from(courses).where(eq(courses.id, id)).get();
}

export function enrolledCourseIds(): Set<number> {
  return new Set(db.select().from(enrolments).all().map((row) => row.courseId));
}

// A real enrolment system caps how much you can take on at once; this
// mirrors that with a fixed number rather than modelling unit-load rules.
export const MAX_ENROLMENTS = 4;

export function canEnrol(courseId: number): boolean {
  const ids = enrolledCourseIds();
  return ids.has(courseId) || ids.size < MAX_ENROLMENTS;
}

export function enrol(courseId: number): void {
  db.insert(enrolments).values({ courseId }).onConflictDoNothing().run();
}

export function drop(courseId: number): void {
  db.delete(enrolments).where(eq(enrolments.courseId, courseId)).run();
}

export function chooseTutorial(courseId: number, sessionId: number): void {
  const session = db.select().from(sessions).where(eq(sessions.id, sessionId)).get();
  if (!session || session.courseId !== courseId || session.kind !== "tutorial") {
    throw new Error(`session ${sessionId} is not a tutorial belonging to course ${courseId}`);
  }
  const updated = db
    .update(enrolments)
    .set({ tutorialSessionId: sessionId })
    .where(eq(enrolments.courseId, courseId))
    .run();
  if (updated.changes === 0) {
    throw new Error(`course ${courseId} isn't enrolled`);
  }
}
